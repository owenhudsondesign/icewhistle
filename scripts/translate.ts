#!/usr/bin/env npx ts-node

/**
 * ICEwhistle Translation Script
 *
 * Translates en.json (source of truth) to all supported languages.
 * Run with: npx ts-node scripts/translate.ts
 * Or add to package.json: "translate": "ts-node scripts/translate.ts"
 *
 * Options:
 *   --lang=es,pt    Only translate specific languages
 *   --force         Re-translate even if target exists
 *   --dry-run       Preview without writing files
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

// ============================================
// CONFIGURATION - Edit these as needed
// ============================================

const LOCALES_DIR = path.join(process.cwd(), "public", "locales");
const SOURCE_LANG = "en";

// Languages to translate to (exclude source)
const TARGET_LANGUAGES: Record<string, string> = {
  // Primary
  es: "Spanish (Latin American)",
  pt: "Portuguese (Brazilian)",
  // Chinese
  zh: "Chinese Simplified",
  "zh-TW": "Chinese Traditional",
  // Southeast Asian
  vi: "Vietnamese",
  tl: "Tagalog (Filipino)",
  ko: "Korean",
  th: "Thai",
  km: "Khmer (Cambodian)",
  my: "Burmese (Myanmar)",
  lo: "Lao",
  ja: "Japanese",
  // Middle Eastern
  ar: "Arabic (Modern Standard)",
  fa: "Farsi (Persian)",
  // South Asian
  hi: "Hindi",
  pa: "Punjabi (Gurmukhi)",
  ur: "Urdu",
  bn: "Bengali",
  gu: "Gujarati",
  ne: "Nepali",
  // French & Creole
  fr: "French",
  ht: "Haitian Creole",
  // Eastern European
  ru: "Russian",
  uk: "Ukrainian",
  pl: "Polish",
  // East African
  am: "Amharic",
  so: "Somali",
  // Western European (consider removing - see notes)
  de: "German",
  it: "Italian",
};

// ============================================
// TRANSLATION LOGIC
// ============================================

const client = new Anthropic();

interface TranslationResult {
  lang: string;
  success: boolean;
  error?: string;
}

async function translateContent(
  sourceContent: object,
  targetLang: string,
  langName: string
): Promise<object> {
  const systemPrompt = `You are a professional translator specializing in legal and immigration terminology.
You are translating content for ICEwhistle, an app that helps immigrants understand their rights during ICE encounters.

CRITICAL REQUIREMENTS:
1. Accuracy on legal terminology is paramount - mistranslations could harm people
2. Use the appropriate formality level for legal/rights content in ${langName}
3. Preserve ALL JSON keys exactly as-is (only translate values)
4. Return ONLY valid JSON - no markdown, no explanation, no code blocks
5. For rights-related content, use established legal terminology in the target language
6. Maintain any placeholders like {count} or {{name}} exactly as-is
7. Keep URLs, email addresses, and phone numbers unchanged
8. For emergency instructions, prioritize clarity over literal translation`;

  const userPrompt = `Translate the following JSON content from English to ${langName} (${targetLang}).

Return ONLY the translated JSON object, nothing else.

${JSON.stringify(sourceContent, null, 2)}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 16000,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
    system: systemPrompt,
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Clean up response - remove any markdown code blocks if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  return JSON.parse(cleaned);
}

async function translateLanguage(
  sourceContent: object,
  lang: string,
  langName: string,
  dryRun: boolean
): Promise<TranslationResult> {
  const targetPath = path.join(LOCALES_DIR, `${lang}.json`);

  console.log(`\n📝 Translating to ${langName} (${lang})...`);

  try {
    const translated = await translateContent(sourceContent, lang, langName);

    if (dryRun) {
      console.log(`   [DRY RUN] Would write to ${targetPath}`);
      console.log(
        `   Preview (first 200 chars): ${JSON.stringify(translated).slice(0, 200)}...`
      );
    } else {
      fs.writeFileSync(targetPath, JSON.stringify(translated, null, 2), "utf8");
      console.log(`   ✅ Written to ${targetPath}`);
    }

    return { lang, success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`   ❌ Failed: ${errorMsg}`);
    return { lang, success: false, error: errorMsg };
  }
}

async function main() {
  // Parse CLI arguments
  const args = process.argv.slice(2);
  const forceAll = args.includes("--force");
  const dryRun = args.includes("--dry-run");
  const langArg = args.find((a) => a.startsWith("--lang="));
  const specificLangs = langArg ? langArg.split("=")[1].split(",") : null;

  console.log("🌐 ICEwhistle Translation Script");
  console.log("================================");

  if (dryRun) console.log("🔍 DRY RUN MODE - No files will be written\n");

  // Load source (English)
  const sourcePath = path.join(LOCALES_DIR, `${SOURCE_LANG}.json`);

  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Source file not found: ${sourcePath}`);
    console.error(
      `   Make sure ${SOURCE_LANG}.json exists in ${LOCALES_DIR}`
    );
    process.exit(1);
  }

  const sourceContent = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  console.log(`📂 Loaded source: ${sourcePath}`);
  console.log(
    `   Keys: ${Object.keys(sourceContent).join(", ")}`
  );

  // Determine which languages to translate
  let langsToTranslate = Object.entries(TARGET_LANGUAGES);

  if (specificLangs) {
    langsToTranslate = langsToTranslate.filter(([code]) =>
      specificLangs.includes(code)
    );
    console.log(`\n🎯 Targeting specific languages: ${specificLangs.join(", ")}`);
  }

  if (!forceAll) {
    // Skip languages that already have translations (unless --force)
    const existingLangs = langsToTranslate.filter(([code]) =>
      fs.existsSync(path.join(LOCALES_DIR, `${code}.json`))
    );
    if (existingLangs.length > 0 && !specificLangs) {
      console.log(
        `\n⏭️  Skipping existing translations (use --force to re-translate):`
      );
      console.log(`   ${existingLangs.map(([code]) => code).join(", ")}`);
      langsToTranslate = langsToTranslate.filter(
        ([code]) => !fs.existsSync(path.join(LOCALES_DIR, `${code}.json`))
      );
    }
  }

  if (langsToTranslate.length === 0) {
    console.log("\n✨ All translations up to date!");
    return;
  }

  console.log(`\n🚀 Translating ${langsToTranslate.length} languages...`);

  // Translate sequentially to avoid rate limits
  const results: TranslationResult[] = [];

  for (const [code, name] of langsToTranslate) {
    const result = await translateLanguage(sourceContent, code, name, dryRun);
    results.push(result);

    // Small delay between requests to be nice to the API
    if (langsToTranslate.indexOf([code, name] as [string, string]) < langsToTranslate.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  // Summary
  console.log("\n================================");
  console.log("📊 Translation Summary");
  console.log("================================");

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`✅ Successful: ${successful.length}`);
  if (failed.length > 0) {
    console.log(`❌ Failed: ${failed.length}`);
    failed.forEach((r) => console.log(`   - ${r.lang}: ${r.error}`));
  }

  if (failed.length > 0) {
    console.log("\n💡 To retry failed languages:");
    console.log(`   npx ts-node scripts/translate.ts --lang=${failed.map((r) => r.lang).join(",")}`);
  }

  console.log("\n✨ Done!");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
