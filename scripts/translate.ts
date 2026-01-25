#!/usr/bin/env npx ts-node

/**
 * ICEwhistle Translation Script
 * Balanced parallelism with retries
 */

import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });
dotenv.config({ path: path.join(process.cwd(), ".env") });

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";

const LOCALES_DIR = path.join(process.cwd(), "public", "locales");
const SOURCE_LANG = "en";

const TARGET_LANGUAGES: Record<string, string> = {
  es: "Spanish (Latin American)",
  pt: "Portuguese (Brazilian)",
  zh: "Chinese Simplified",
  "zh-TW": "Chinese Traditional",
  vi: "Vietnamese",
  tl: "Tagalog (Filipino)",
  ko: "Korean",
  th: "Thai",
  ja: "Japanese",
  ar: "Arabic (Modern Standard)",
  fa: "Farsi (Persian)",
  hi: "Hindi",
  pa: "Punjabi (Gurmukhi)",
  ur: "Urdu",
  bn: "Bengali",
  gu: "Gujarati",
  ne: "Nepali",
  fr: "French",
  ht: "Haitian Creole",
  ru: "Russian",
  uk: "Ukrainian",
  pl: "Polish",
  am: "Amharic",
  so: "Somali",
  de: "German",
  it: "Italian",
  my: "Burmese",
  lo: "Lao",
};

const client = new Anthropic();

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function translateSection(
  sectionContent: object,
  sectionName: string,
  langName: string,
  retries = 2
): Promise<object> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system: `Translate JSON values to ${langName}. Keep keys unchanged. Return only valid JSON, no markdown.`,
        messages: [{
          role: "user",
          content: `Translate to ${langName}:\n${JSON.stringify(sectionContent, null, 2)}`
        }],
      });

      const text = response.content[0].type === "text" ? response.content[0].text : "";
      let cleaned = text.trim();
      if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
      else if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
      if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);

      return JSON.parse(cleaned.trim());
    } catch (error) {
      if (attempt < retries) {
        await sleep(1000 * (attempt + 1)); // backoff
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}

async function translateLanguage(
  sourceContent: Record<string, object>,
  lang: string,
  langName: string,
  dryRun: boolean
): Promise<{ lang: string; success: number; total: number }> {
  const targetPath = path.join(LOCALES_DIR, `${lang}.json`);
  const sections = Object.entries(sourceContent);
  const translated: Record<string, object> = {};
  let success = 0;

  // Translate 5 sections at a time
  for (let i = 0; i < sections.length; i += 5) {
    const batch = sections.slice(i, i + 5);
    const results = await Promise.all(
      batch.map(async ([name, content]) => {
        try {
          const result = await translateSection(content, name, langName);
          return { name, result, ok: true };
        } catch {
          return { name, result: content, ok: false };
        }
      })
    );

    for (const { name, result, ok } of results) {
      translated[name] = result;
      if (ok) success++;
    }

    // Small delay between batches
    if (i + 5 < sections.length) await sleep(200);
  }

  if (!dryRun) {
    fs.writeFileSync(targetPath, JSON.stringify(translated, null, 2), "utf8");
  }

  const icon = success === sections.length ? "✅" : "⚠️";
  console.log(`${icon} ${langName} (${lang}): ${success}/${sections.length}`);

  return { lang, success, total: sections.length };
}

async function main() {
  const args = process.argv.slice(2);
  const forceAll = args.includes("--force");
  const dryRun = args.includes("--dry-run");
  const langArg = args.find((a) => a.startsWith("--lang="));
  const specificLangs = langArg ? langArg.split("=")[1].split(",") : null;

  console.log("🌐 ICEwhistle Translation");
  console.log("=========================");

  const sourcePath = path.join(LOCALES_DIR, `${SOURCE_LANG}.json`);
  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Source not found: ${sourcePath}`);
    process.exit(1);
  }

  const sourceContent = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  console.log(`📂 Source: ${Object.keys(sourceContent).length} sections`);

  let langsToTranslate = Object.entries(TARGET_LANGUAGES);

  if (specificLangs) {
    langsToTranslate = langsToTranslate.filter(([code]) => specificLangs.includes(code));
  }

  if (!forceAll && !specificLangs) {
    langsToTranslate = langsToTranslate.filter(
      ([code]) => !fs.existsSync(path.join(LOCALES_DIR, `${code}.json`))
    );
  }

  if (langsToTranslate.length === 0) {
    console.log("✨ All translations up to date!");
    return;
  }

  console.log(`🚀 Translating ${langsToTranslate.length} languages (2 parallel)\n`);

  const startTime = Date.now();

  // Process 2 languages at a time
  const results: { lang: string; success: number; total: number }[] = [];
  for (let i = 0; i < langsToTranslate.length; i += 2) {
    const batch = langsToTranslate.slice(i, i + 2);
    const batchResults = await Promise.all(
      batch.map(([code, name]) => translateLanguage(sourceContent, code, name, dryRun))
    );
    results.push(...batchResults);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const perfect = results.filter((r) => r.success === r.total).length;

  console.log("\n=========================");
  console.log(`✅ Complete: ${perfect}/${results.length} languages`);
  console.log(`⏱️  Time: ${elapsed}s`);
}

main().catch(console.error);
