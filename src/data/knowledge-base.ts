/**
 * Knowledge Base for ICEwhistle
 * Contains verified legal information, resources, and guidance
 * All content is pre-vetted to prevent hallucination risks
 */

export interface KnowledgeEntry {
  id: string
  category: 'rights' | 'resources' | 'legal' | 'emergency' | 'vulnerable' | 'detention' | 'workplace'
  title: string
  content: string
  keywords: string[]
  languages?: string[]
  urls?: string[]
  phones?: string[]
  priority?: number // Higher = more important for search ranking
}

export const knowledgeBase: KnowledgeEntry[] = [
  // === KNOW YOUR RIGHTS ===
  {
    id: 'rights-silence',
    category: 'rights',
    title: 'Right to Remain Silent',
    content: 'You have the right to remain silent. You do not have to answer questions about where you were born, your immigration status, or how you entered the United States. Say "I am exercising my right to remain silent." This applies to encounters with ICE, police, and border patrol. You cannot be punished for refusing to answer questions.',
    keywords: ['silent', 'questions', 'answer', 'speak', 'talk', 'silence', 'fifth amendment'],
    priority: 10
  },
  {
    id: 'rights-lawyer',
    category: 'rights',
    title: 'Right to an Attorney',
    content: 'You have the right to speak with a lawyer before answering any questions. Say "I want to speak to a lawyer." If you are detained, you have the right to make phone calls to contact an attorney and notify your family. Keep an immigration attorney\'s number with you at all times. Note: In immigration proceedings, the government does not provide a free attorney, so contact legal aid organizations.',
    keywords: ['lawyer', 'attorney', 'legal', 'counsel', 'call', 'phone', 'represent'],
    priority: 10
  },
  {
    id: 'rights-warrant',
    category: 'rights',
    title: 'Understanding Warrants',
    content: 'There are two types of warrants: JUDICIAL warrants and ADMINISTRATIVE warrants. A JUDICIAL warrant is signed by a judge, has a court name and judge signature, and allows entry into your home. An ADMINISTRATIVE warrant (Forms I-200, I-205) is signed by an ICE officer, NOT a judge, and does NOT allow entry without your consent. You can ask to see the warrant through a window or slipped under the door. Do NOT open the door unless shown a valid judicial warrant signed by a judge.',
    keywords: ['warrant', 'judicial', 'administrative', 'judge', 'door', 'entry', 'home', 'I-200', 'I-205', 'signed'],
    priority: 10
  },
  {
    id: 'rights-ice-encounter',
    category: 'rights',
    title: 'What to Do if ICE Comes to Your Door',
    content: 'If ICE comes to your door: 1) Do NOT open the door. 2) Ask "Are you police or immigration?" and "Do you have a warrant signed by a judge?" 3) Ask them to slip the warrant under the door. 4) A judicial warrant will have a court name and a judge\'s signature. ICE administrative warrants (I-200, I-205) do not give them permission to enter. 5) Say "I do not consent to your entry." 6) Do not sign anything without a lawyer. 7) Stay calm and do not run.',
    keywords: ['ICE', 'door', 'home', 'visit', 'knock', 'enter', 'consent', 'open'],
    priority: 10
  },
  {
    id: 'rights-do-not-sign',
    category: 'rights',
    title: 'Do Not Sign Documents',
    content: 'Do NOT sign any documents without first speaking to a lawyer. Signing certain documents, especially "voluntary departure" forms, can waive your rights to a hearing before an immigration judge and result in immediate deportation. If pressured to sign, say "I do not want to sign anything until I speak with my attorney."',
    keywords: ['sign', 'documents', 'papers', 'voluntary departure', 'form', 'signature'],
    priority: 9
  },
  {
    id: 'rights-lie',
    category: 'rights',
    title: 'Do Not Lie or Show False Documents',
    content: 'Never provide false information or fake documents to immigration officials. This is a crime that can result in criminal charges, bars to future immigration relief, and deportation. It is better to remain silent than to lie. Say "I am exercising my right to remain silent" instead of making up answers.',
    keywords: ['lie', 'false', 'fake', 'documents', 'truth', 'fraud'],
    priority: 8
  },
  {
    id: 'rights-recording',
    category: 'rights',
    title: 'Right to Record',
    content: 'In most states, you have the right to record interactions with immigration officers in public spaces. Recording can help document what happens. However, do not interfere with officers or put yourself in danger. Tell someone you trust that you are recording and where the recording is stored.',
    keywords: ['record', 'video', 'film', 'camera', 'document', 'evidence'],
    priority: 6
  },

  // === VEHICLE ENCOUNTERS ===
  {
    id: 'vehicle-stop-overview',
    category: 'rights',
    title: 'ICE Traffic Stop - What to Do',
    content: 'If ICE stops your vehicle: 1) Pull over safely and turn off engine. 2) Keep hands visible on steering wheel. 3) Crack window only - do not fully open. 4) Ask "Are you from immigration or the police?" 5) Drivers must provide license, registration, and insurance. 6) You do NOT have to answer questions about immigration status or birthplace. 7) Say "I do not consent to a search." 8) Do not sign anything without a lawyer.',
    keywords: ['car', 'vehicle', 'traffic', 'stop', 'pulled over', 'driving', 'road', 'highway'],
    priority: 10
  },
  {
    id: 'vehicle-driver-rights',
    category: 'rights',
    title: 'Driver Rights at Traffic Stop',
    content: 'As a DRIVER, you must provide: driver\'s license, vehicle registration, and proof of insurance. However, you do NOT have to answer questions about your immigration status, where you were born, or where you are going. Do NOT provide a passport, consular ID, or any foreign documents - only your state driver\'s license. You can say "I am exercising my right to remain silent."',
    keywords: ['driver', 'license', 'registration', 'insurance', 'driving', 'car', 'vehicle'],
    priority: 9
  },
  {
    id: 'vehicle-passenger-rights',
    category: 'rights',
    title: 'Passenger Rights at Traffic Stop',
    content: 'As a PASSENGER, you have NO obligation to: show any identification, give your name, or answer any questions. Passengers can remain completely silent. Say "I am exercising my right to remain silent." You do not have to provide ID or documents of any kind.',
    keywords: ['passenger', 'rider', 'car', 'vehicle', 'traffic stop', 'identification', 'ID'],
    priority: 9
  },
  {
    id: 'vehicle-search-rights',
    category: 'rights',
    title: 'Vehicle Search Rights',
    content: 'ICE cannot search your vehicle without a judicial warrant, probable cause, or your consent. Clearly state: "I do not consent to a search." They may search anyway - do not physically resist, but continue to clearly state that you do not consent. This protects your legal rights later.',
    keywords: ['search', 'vehicle', 'car', 'trunk', 'consent', 'warrant', 'probable cause'],
    priority: 9
  },
  {
    id: 'vehicle-exit-order',
    category: 'rights',
    title: 'If Ordered to Exit Vehicle',
    content: 'If ordered to exit your vehicle, ask: "Am I required to get out?" If officers insist, comply slowly with your hands visible. Lock the car behind you. You may be arrested when you exit - before getting out, ask for the reason for the stop. Do not physically resist.',
    keywords: ['exit', 'get out', 'leave', 'car', 'vehicle', 'door', 'order'],
    priority: 8
  },
  {
    id: 'vehicle-unmarked-cars',
    category: 'rights',
    title: 'ICE Uses Unmarked Cars',
    content: 'ICE increasingly stops vehicles using unmarked cars and Automated License Plate Readers (ALPRs). They may say "police" instead of "immigration." Always ask: "Are you from immigration or the police?" and "What agency are you from?" Keep a rights card in your glove compartment.',
    keywords: ['unmarked', 'car', 'ALPR', 'license plate', 'reader', 'police', 'undercover'],
    priority: 8
  },
  {
    id: 'vehicle-what-to-say',
    category: 'rights',
    title: 'What to Say During Traffic Stop',
    content: 'Phrases to use: "Are you from immigration or the police?" (¿Es usted de inmigración o de la policía?), "I am exercising my right to remain silent" (Estoy ejerciendo mi derecho a permanecer en silencio), "I do not consent to a search" (No doy mi consentimiento para un registro), "Am I free to leave?" (¿Soy libre de irme?), "I want to speak to a lawyer" (Quiero hablar con un abogado).',
    keywords: ['say', 'phrase', 'words', 'speak', 'traffic stop', 'spanish', 'bilingual'],
    languages: ['en', 'es'],
    priority: 9
  },

  // === WARRANTS - DETAILED COMPARISON ===
  {
    id: 'warrant-judicial',
    category: 'rights',
    title: 'Judicial Warrant (Valid for Entry)',
    content: 'A JUDICIAL warrant is signed by a federal or state JUDGE. It will display: 1) A court name (e.g., "United States District Court"), 2) A judge\'s signature, 3) Your correct name and address. This warrant DOES authorize officers to enter your home. If presented with a valid judicial warrant, you should not physically resist, but you can still exercise your right to remain silent and request an attorney.',
    keywords: ['judicial', 'warrant', 'judge', 'court', 'valid', 'entry', 'home'],
    priority: 9
  },
  {
    id: 'warrant-administrative',
    category: 'rights',
    title: 'Administrative Warrant (ICE - NOT Valid for Entry)',
    content: 'An ADMINISTRATIVE warrant (Forms I-200 or I-205) is signed by an ICE officer, NOT a judge. It will say "Department of Homeland Security" at the top. This warrant does NOT give ICE permission to enter your home without your consent. You can say "I do not consent to your entry" and keep the door closed. ICE cannot force entry based only on an administrative warrant unless there are exigent circumstances.',
    keywords: ['administrative', 'warrant', 'ICE', 'I-200', 'I-205', 'DHS', 'invalid', 'consent'],
    priority: 9
  },

  // === DETENTION & AFTER ARREST ===
  {
    id: 'detention-steps',
    category: 'detention',
    title: 'Immediate Steps After Detention',
    content: 'If you or a loved one is detained: 1) Get the A-Number (Alien Registration Number) - a 9-digit number starting with "A". 2) Use the ICE Detainee Locator at locator.ice.gov or call 1-888-351-4024. 3) Contact an immigration attorney immediately. 4) Know that detained individuals have the right to make phone calls. 5) Contact your consulate - under the Vienna Convention, you have the right to consular notification. 6) Do not sign any documents, especially voluntary departure, without legal advice.',
    keywords: ['detained', 'arrest', 'custody', 'jail', 'A-number', 'locator', 'find', 'family'],
    phones: ['1-888-351-4024'],
    urls: ['https://locator.ice.gov'],
    priority: 10
  },
  {
    id: 'detention-bond',
    category: 'detention',
    title: 'Immigration Bond Process',
    content: 'A bond allows release from detention while your case proceeds. The average immigration bond is $8,176. Bond hearings typically occur within 2-3 weeks of request. To get a bond: 1) Request a bond hearing before an immigration judge. 2) Gather evidence of community ties, employment, family in the US. 3) Show you are not a flight risk or danger. Some people are subject to mandatory detention without bond eligibility. Bond funds can help if you cannot afford the bond amount.',
    keywords: ['bond', 'bail', 'release', 'detained', 'hearing', 'pay', 'fund', 'money'],
    priority: 9
  },
  {
    id: 'detention-locator',
    category: 'detention',
    title: 'Finding a Detained Person',
    content: 'To find someone in ICE custody: 1) Use the Online Detainee Locator System at locator.ice.gov. 2) You need the person\'s A-Number (Alien Registration Number) OR full legal name plus country of birth and date of birth. 3) Call the ICE Detainee Locator hotline: 1-888-351-4024. 4) It may take 24-72 hours for someone to appear in the system after arrest. 5) Check with local jails as well, as ICE sometimes holds people in county facilities.',
    keywords: ['find', 'locate', 'detained', 'missing', 'family', 'where', 'custody', 'search'],
    phones: ['1-888-351-4024'],
    urls: ['https://locator.ice.gov'],
    priority: 10
  },

  // === LEGAL RESOURCES ===
  {
    id: 'legal-nijc',
    category: 'legal',
    title: 'National Immigrant Justice Center (NIJC)',
    content: 'The National Immigrant Justice Center provides direct legal services, policy advocacy, and training. They offer free or low-cost legal consultations for immigrants. Services include asylum, deportation defense, detention visitation, family immigration, and more. Headquartered in Chicago with nationwide impact.',
    keywords: ['NIJC', 'legal aid', 'lawyer', 'attorney', 'free', 'help', 'chicago', 'national'],
    urls: ['https://immigrantjustice.org'],
    priority: 8
  },
  {
    id: 'legal-kind',
    category: 'legal',
    title: 'Kids in Need of Defense (KIND)',
    content: 'KIND provides free legal representation to unaccompanied immigrant and refugee children. They work through a network of pro bono attorneys. If you know an unaccompanied minor who needs legal help, contact KIND immediately. They have offices across the United States.',
    keywords: ['KIND', 'children', 'kids', 'minor', 'unaccompanied', 'youth', 'young', 'child'],
    urls: ['https://supportkind.org'],
    priority: 8
  },
  {
    id: 'legal-clinic',
    category: 'legal',
    title: 'Catholic Legal Immigration Network (CLINIC)',
    content: 'CLINIC is the largest network of nonprofit immigration legal services providers in the United States. They provide training, resources, and support to over 400 programs. Contact them to find immigration legal services near you through their affiliate network.',
    keywords: ['CLINIC', 'catholic', 'legal', 'network', 'nonprofit', 'services'],
    urls: ['https://cliniclegal.org'],
    priority: 7
  },
  {
    id: 'legal-ilrc',
    category: 'legal',
    title: 'Immigrant Legal Resource Center (ILRC)',
    content: 'The ILRC provides legal training, technical assistance, and publications on immigration law. They are the creators of the Red Cards (Tarjetas Rojas) - wallet cards explaining your rights in 39 languages. Download Red Cards for free from their website.',
    keywords: ['ILRC', 'red card', 'tarjeta', 'rights', 'resources', 'training'],
    urls: ['https://ilrc.org'],
    languages: ['39 languages available'],
    priority: 8
  },
  {
    id: 'legal-aila',
    category: 'legal',
    title: 'American Immigration Lawyers Association (AILA)',
    content: 'AILA is the national association of immigration lawyers. Use their lawyer search tool to find a qualified immigration attorney in your area. Always verify that any attorney you hire is licensed to practice law in your state.',
    keywords: ['AILA', 'lawyer', 'attorney', 'find', 'search', 'hire', 'licensed'],
    urls: ['https://aila.org'],
    priority: 7
  },

  // === EMERGENCY HOTLINES ===
  {
    id: 'hotline-ice',
    category: 'emergency',
    title: 'ICE Detainee Locator',
    content: 'Official ICE hotline to locate detained individuals. Available 24/7. You will need the person\'s A-Number or their full legal name, country of birth, and date of birth.',
    keywords: ['ICE', 'detainee', 'locator', 'find', 'detained', 'hotline', '24/7'],
    phones: ['1-888-351-4024'],
    urls: ['https://locator.ice.gov'],
    priority: 10
  },
  {
    id: 'hotline-united-we-dream',
    category: 'emergency',
    title: 'United We Dream MigraWatch Hotline',
    content: 'Hotline for reporting and getting help during immigration enforcement activities. United We Dream is the largest immigrant youth-led organization in the country.',
    keywords: ['united we dream', 'hotline', 'report', 'raid', 'enforcement', 'help', 'youth', 'dreamer'],
    phones: ['1-844-363-1423'],
    priority: 9
  },
  {
    id: 'hotline-nilc',
    category: 'emergency',
    title: 'National Immigration Law Center (NILC)',
    content: 'NILC defends and advances the rights of low-income immigrants. They provide legal expertise, policy analysis, and advocacy support.',
    keywords: ['NILC', 'national', 'law center', 'rights', 'policy', 'advocacy'],
    urls: ['https://nilc.org'],
    priority: 7
  },
  {
    id: 'hotline-trafficking',
    category: 'emergency',
    title: 'National Human Trafficking Hotline',
    content: 'If you or someone you know is being trafficked or forced to work against your will, call this hotline. Operators speak multiple languages and can connect you with local services. Trafficking victims may be eligible for T-visa protection.',
    keywords: ['trafficking', 'forced', 'labor', 'slavery', 'T-visa', 'help', 'victim'],
    phones: ['1-888-373-7888'],
    priority: 10
  },
  {
    id: 'hotline-domestic-violence',
    category: 'emergency',
    title: 'National Domestic Violence Hotline',
    content: 'Free, confidential support for domestic violence survivors. Available 24/7. Interpreters available in over 200 languages. Domestic violence survivors may be eligible for VAWA protections regardless of immigration status.',
    keywords: ['domestic violence', 'abuse', 'VAWA', 'survivor', 'help', 'confidential', 'women'],
    phones: ['1-800-799-7233'],
    languages: ['200+ languages'],
    priority: 10
  },
  {
    id: 'hotline-mental-health',
    category: 'emergency',
    title: '988 Suicide & Crisis Lifeline',
    content: 'Free, confidential mental health crisis support. Available 24/7. Call or text 988. Interpreters available in Spanish and other languages. If you are experiencing a mental health emergency, please reach out.',
    keywords: ['mental health', 'crisis', 'suicide', 'depression', 'anxiety', 'help', '988', 'lifeline'],
    phones: ['988'],
    priority: 10
  },
  {
    id: 'hotline-crisis-text',
    category: 'emergency',
    title: 'Crisis Text Line',
    content: 'Free, 24/7 crisis support via text message. Text HOME to 741741 to connect with a trained crisis counselor. Available in English and Spanish.',
    keywords: ['crisis', 'text', 'mental health', 'support', 'counselor', 'message'],
    phones: ['Text HOME to 741741'],
    priority: 9
  },
  {
    id: 'hotline-samhsa',
    category: 'emergency',
    title: 'SAMHSA National Helpline',
    content: 'Free, confidential, 24/7 helpline for substance abuse and mental health. Treatment referral service in English and Spanish. SAMHSA can help find local treatment facilities and support groups.',
    keywords: ['SAMHSA', 'substance', 'abuse', 'addiction', 'mental health', 'treatment', 'rehab'],
    phones: ['1-800-662-4357'],
    priority: 8
  },

  // === BOND FUNDS ===
  {
    id: 'bond-national',
    category: 'resources',
    title: 'National Bail Fund Network',
    content: 'Network of community bail and bond funds across the United States. These funds help pay immigration bonds for those who cannot afford them. Search for a local bond fund in your area.',
    keywords: ['bail', 'bond', 'fund', 'pay', 'money', 'help', 'release', 'detained'],
    urls: ['https://communitybailout.org'],
    priority: 8
  },
  {
    id: 'bond-black-immigrants',
    category: 'resources',
    title: 'Black Immigrants Bail Fund',
    content: 'Provides bond assistance specifically for Black immigrants in detention. Part of the movement for Black immigrant rights and liberation.',
    keywords: ['black', 'bail', 'bond', 'fund', 'immigrant', 'african'],
    urls: ['https://blackimmigrantsbailfund.org'],
    priority: 7
  },
  {
    id: 'bond-lgbtq',
    category: 'resources',
    title: 'LGBTQ Freedom Fund',
    content: 'Posts bail and immigration bonds for LGBTQ+ individuals. Provides support to LGBTQ+ immigrants in detention who face unique vulnerabilities.',
    keywords: ['LGBTQ', 'gay', 'lesbian', 'transgender', 'queer', 'bond', 'bail', 'fund'],
    urls: ['https://lgbtqfund.org'],
    priority: 7
  },

  // === VULNERABLE POPULATIONS ===
  {
    id: 'vulnerable-minors',
    category: 'vulnerable',
    title: 'Unaccompanied Minors',
    content: 'Unaccompanied immigrant children have special legal protections. Kids in Need of Defense (KIND) provides free legal services. The Young Center provides child advocates to represent children\'s best interests. Children should never be detained with adults and have rights to education and healthcare.',
    keywords: ['minor', 'child', 'children', 'unaccompanied', 'kid', 'youth', 'young', 'teenager'],
    urls: ['https://supportkind.org', 'https://theyoungcenter.org'],
    priority: 9
  },
  {
    id: 'vulnerable-pregnant',
    category: 'vulnerable',
    title: 'Pregnant Women',
    content: 'Pregnant women in immigration proceedings have special considerations. ICE has policies regarding detention of pregnant women. Pregnant women should inform officers of their pregnancy and request appropriate medical care. Prenatal care must be provided in detention.',
    keywords: ['pregnant', 'pregnancy', 'baby', 'mother', 'prenatal', 'maternity', 'women'],
    priority: 8
  },
  {
    id: 'vulnerable-lgbtq',
    category: 'vulnerable',
    title: 'LGBTQ+ Immigrants',
    content: 'LGBTQ+ immigrants face unique challenges in detention and may be eligible for asylum based on persecution. Immigration Equality provides legal services. Transgender Law Center advocates for transgender immigrants. LGBTQ+ individuals should be placed in appropriate housing in detention.',
    keywords: ['LGBTQ', 'gay', 'lesbian', 'transgender', 'queer', 'bisexual', 'asylum', 'persecution'],
    urls: ['https://immigrationequality.org', 'https://transgenderlawcenter.org'],
    priority: 8
  },
  {
    id: 'vulnerable-trafficking',
    category: 'vulnerable',
    title: 'Trafficking Victims (T-Visa)',
    content: 'Victims of human trafficking may be eligible for a T-visa, which provides immigration status, work authorization, and path to permanent residence. You do not need to cooperate with law enforcement if you are under 18 or have experienced trauma. Call the National Human Trafficking Hotline.',
    keywords: ['trafficking', 'T-visa', 'victim', 'forced', 'labor', 'exploitation', 'slavery'],
    phones: ['1-888-373-7888'],
    priority: 9
  },
  {
    id: 'vulnerable-crime-victims',
    category: 'vulnerable',
    title: 'Crime Victims (U-Visa)',
    content: 'Victims of certain crimes who assist law enforcement may qualify for a U-visa. Qualifying crimes include domestic violence, sexual assault, human trafficking, and other serious crimes. The U-visa provides immigration status and work authorization. Contact a legal aid organization for help applying.',
    keywords: ['U-visa', 'victim', 'crime', 'domestic violence', 'assault', 'abuse', 'certify'],
    priority: 9
  },
  {
    id: 'vulnerable-vawa',
    category: 'vulnerable',
    title: 'VAWA Self-Petition',
    content: 'The Violence Against Women Act (VAWA) allows survivors of domestic violence to self-petition for immigration status without their abuser knowing. This applies to spouses, children, and parents of abusive US citizens or permanent residents. Male survivors can also apply. Contact a legal aid organization confidentially.',
    keywords: ['VAWA', 'domestic violence', 'abuse', 'self-petition', 'survivor', 'spouse', 'confidential'],
    phones: ['1-800-799-7233'],
    priority: 9
  },

  // === WORKPLACE RIGHTS ===
  {
    id: 'workplace-rights',
    category: 'workplace',
    title: 'Workplace Rights for All Workers',
    content: 'All workers have rights regardless of immigration status, including: minimum wage, overtime pay, safe working conditions, workers\' compensation for injuries, and freedom from discrimination. Report workplace violations to the Department of Labor. Employers cannot retaliate against you for asserting your rights.',
    keywords: ['workplace', 'work', 'job', 'rights', 'wage', 'safety', 'employer', 'employee'],
    priority: 8
  },
  {
    id: 'workplace-raid',
    category: 'workplace',
    title: 'Workplace Raid Protocol',
    content: 'If immigration enforcement comes to your workplace: 1) Stay calm and do not run. 2) You have the right to remain silent - do not answer questions about your immigration status. 3) Do not show fake documents. 4) If you have valid work authorization, you may show it. 5) Try to contact a supervisor or union representative. 6) Note badge numbers and what happens. 7) Contact an attorney as soon as possible.',
    keywords: ['raid', 'workplace', 'ICE', 'work', 'enforcement', 'employer'],
    priority: 9
  },
  {
    id: 'workplace-retaliation',
    category: 'workplace',
    title: 'Protection from Employer Retaliation',
    content: 'It is illegal for employers to threaten to call immigration, report you to ICE, or use your immigration status against you because you complained about wages, safety, or discrimination. California (AB 450) and other states prohibit employers from allowing ICE access without a warrant. Report retaliation to the Department of Labor.',
    keywords: ['retaliation', 'threaten', 'employer', 'report', 'ICE', 'illegal', 'protection'],
    priority: 8
  },

  // === SANCTUARY & STATE POLICIES ===
  {
    id: 'sanctuary-california',
    category: 'resources',
    title: 'California Sanctuary State (SB 54)',
    content: 'California Senate Bill 54 (California Values Act) limits state and local law enforcement cooperation with federal immigration enforcement. Local police generally cannot ask about immigration status or hold people for ICE. AB 450 requires employers to refuse ICE access without a warrant.',
    keywords: ['california', 'sanctuary', 'SB 54', 'AB 450', 'state', 'law', 'police'],
    priority: 7
  },
  {
    id: 'sanctuary-illinois',
    category: 'resources',
    title: 'Illinois TRUST Act',
    content: 'The Illinois TRUST Act limits local law enforcement cooperation with federal immigration authorities. Law enforcement cannot detain someone solely based on immigration status or an ICE detainer.',
    keywords: ['illinois', 'TRUST', 'sanctuary', 'state', 'law', 'police', 'detainer'],
    priority: 7
  },

  // === DACA & TPS ===
  {
    id: 'daca-info',
    category: 'legal',
    title: 'DACA (Deferred Action for Childhood Arrivals)',
    content: 'DACA provides temporary protection from deportation and work authorization for eligible individuals who came to the US as children. DACA must be renewed every two years. Keep your information updated with USCIS. Consult an attorney before traveling outside the US. New applications may not be accepted depending on current court rulings - check current status.',
    keywords: ['DACA', 'dreamer', 'childhood', 'deferred action', 'renew', 'work permit'],
    priority: 8
  },
  {
    id: 'tps-info',
    category: 'legal',
    title: 'TPS (Temporary Protected Status)',
    content: 'TPS provides temporary protection for nationals of designated countries experiencing armed conflict, natural disasters, or other extraordinary conditions. TPS provides protection from deportation and work authorization. You must re-register during designated periods. Check which countries are currently designated and filing deadlines.',
    keywords: ['TPS', 'temporary protected status', 'country', 'protected', 'disaster', 'conflict'],
    priority: 8
  },

  // === FRAUD PREVENTION ===
  {
    id: 'fraud-notario',
    category: 'resources',
    title: 'Beware of Notario Fraud',
    content: 'WARNING: In the US, "notarios" are NOT attorneys and cannot give legal advice. In Latin America, "notario" means lawyer, but NOT in the US. Only hire licensed attorneys for immigration help. Verify any attorney at your state bar association website. Report fraud to your state attorney general or the FTC.',
    keywords: ['notario', 'fraud', 'scam', 'fake', 'lawyer', 'attorney', 'warning', 'unauthorized'],
    priority: 9
  },

  // === CONSULAR RIGHTS ===
  {
    id: 'consular-rights',
    category: 'rights',
    title: 'Right to Contact Your Consulate',
    content: 'Under the Vienna Convention, if you are detained, you have the right to contact your country\'s consulate. The consulate can: visit you in detention, help you find a lawyer, contact your family, ensure you are treated properly. Tell immigration officers "I want to contact my consulate." Some countries have made agreements to be notified automatically.',
    keywords: ['consulate', 'embassy', 'Vienna', 'country', 'government', 'notify', 'contact'],
    priority: 8
  },

  // === KNOW YOUR RIGHTS MATERIALS ===
  {
    id: 'kyr-red-cards',
    category: 'resources',
    title: 'Red Cards / Tarjetas Rojas',
    content: 'Red Cards are wallet-sized cards that explain your constitutional rights. You can show them to immigration officers through a window or slip them under a door. Available in 39 languages from the Immigrant Legal Resource Center (ILRC). Print and carry one with you at all times.',
    keywords: ['red card', 'tarjeta', 'wallet', 'card', 'ILRC', 'rights', 'print'],
    urls: ['https://ilrc.org/red-cards'],
    languages: ['39 languages'],
    priority: 8
  },
  {
    id: 'kyr-videos',
    category: 'resources',
    title: 'We Have Rights Videos',
    content: 'The "We Have Rights" video series explains your constitutional rights during immigration enforcement encounters. Available in 8 languages: English, Spanish, Chinese, Vietnamese, Korean, Tagalog, Arabic, and Haitian Creole. Share these videos with your community.',
    keywords: ['video', 'watch', 'rights', 'learn', 'education', 'community'],
    languages: ['en', 'es', 'zh', 'vi', 'ko', 'tl', 'ar', 'ht'],
    priority: 7
  },

  // === EMERGENCY PLANNING ===
  {
    id: 'planning-family',
    category: 'emergency',
    title: 'Family Emergency Plan',
    content: 'Create an emergency plan with your family: 1) Designate a trusted person to care for your children if you are detained. 2) Keep important documents in a safe place (birth certificates, passports, medical records). 3) Memorize important phone numbers. 4) Know your A-number if you have one. 5) Have an attorney\'s number ready. 6) Create a power of attorney for finances and childcare.',
    keywords: ['plan', 'family', 'children', 'emergency', 'prepare', 'documents', 'custody'],
    priority: 9
  },
  {
    id: 'planning-documents',
    category: 'emergency',
    title: 'Important Documents to Keep Safe',
    content: 'Keep copies of these documents in a safe, accessible place: birth certificates, passports, immigration documents, marriage certificates, children\'s school records, medical records, lease/mortgage documents, vehicle registration, power of attorney forms, employment records, tax returns. Give copies to a trusted person.',
    keywords: ['documents', 'records', 'papers', 'safe', 'copy', 'store', 'important'],
    priority: 8
  },

  // === NEW: ASYLUM & PROTECTION ===
  {
    id: 'asylum-basics',
    category: 'legal',
    title: 'Asylum Basics',
    content: 'Asylum is protection for people who have fled persecution based on race, religion, nationality, political opinion, or membership in a particular social group. You must apply within 1 year of arrival in the US (with some exceptions). There are two types: affirmative asylum (apply before deportation proceedings) and defensive asylum (in immigration court). You have the right to an attorney, but the government does not provide one. Contact legal aid organizations like NIJC or CLINIC for help.',
    keywords: ['asylum', 'persecution', 'protection', 'refugee', 'fear', 'country', 'apply'],
    priority: 9
  },
  {
    id: 'credible-fear',
    category: 'detention',
    title: 'Credible Fear Interviews',
    content: 'If you are detained and express fear of returning to your country, you may receive a credible fear interview. This is your chance to explain why you fear persecution. You have the right to: a translator, review of a negative decision by an immigration judge, contact an attorney before the interview. Prepare by: writing down what happened to you, remembering dates and details, explaining who harmed you and why. Contact Freedom for Immigrants or NIJC for guidance.',
    keywords: ['credible fear', 'interview', 'asylum', 'persecution', 'detained', 'fear'],
    phones: ['1-888-351-4024'],
    priority: 9
  },
  {
    id: 'expedited-removal',
    category: 'legal',
    title: 'Expedited Removal',
    content: 'Expedited removal allows rapid deportation without a hearing before a judge for people who: entered without inspection, have been in the US less than 2 years, or are at or near the border. If you fear persecution, tell the officer immediately - you may be entitled to a credible fear interview. Do NOT sign voluntary departure forms. You have limited rights but can still request asylum protection.',
    keywords: ['expedited', 'removal', 'deportation', 'border', 'quick', 'fast'],
    priority: 8
  },

  // === NEW: LGBTQ+ SPECIFIC ===
  {
    id: 'lgbtq-immigration',
    category: 'vulnerable',
    title: 'LGBTQ+ Immigration Rights',
    content: 'LGBTQ+ individuals may have unique immigration options: asylum based on persecution for sexual orientation or gender identity, same-sex spouse petitions, and transgender-specific considerations. Immigration Equality provides free legal services specifically for LGBTQ+ immigrants. If detained, you have the right to be housed according to your gender identity and to receive necessary medical care.',
    keywords: ['LGBTQ', 'gay', 'lesbian', 'transgender', 'bisexual', 'queer', 'sexual orientation', 'gender identity'],
    phones: ['917-654-9696'],
    urls: ['https://immigrationequality.org'],
    priority: 9
  },
  {
    id: 'lgbtq-detention',
    category: 'detention',
    title: 'LGBTQ+ Rights in Detention',
    content: 'If you are LGBTQ+ and detained: You have the right to be housed according to your gender identity. You can request protective custody if you face harassment. You have the right to necessary medical care including hormone therapy. Contact Immigration Equality for legal help specifically for LGBTQ+ detainees: (917) 654-9696, available Mon/Wed 9:30am-5:30pm ET, Tue 11am-5:30pm ET.',
    keywords: ['LGBTQ', 'detention', 'transgender', 'housing', 'protection', 'medical'],
    phones: ['917-654-9696'],
    priority: 9
  },

  // === NEW: RAPID RESPONSE ===
  {
    id: 'rapid-response-networks',
    category: 'emergency',
    title: 'Rapid Response Networks',
    content: 'Rapid response networks are community organizations that respond to immigration enforcement in real-time. They can: send legal observers to document enforcement, connect families with legal help, provide accompaniment and support. Contact Immigrant Defense Project for information about local rapid response networks. Report enforcement activity to United We Dream MigraWatch: 1-844-363-1423.',
    keywords: ['rapid response', 'network', 'community', 'help', 'enforcement', 'observers'],
    phones: ['1-844-363-1423'],
    urls: ['https://immigrantdefenseproject.org'],
    priority: 9
  },
  {
    id: 'icewatch-raids-map',
    category: 'emergency',
    title: 'ICEWatch Raids Tracking',
    content: 'ICEWatch by Immigrant Defense Project tracks reported immigration enforcement activities across the US. Community members can report and view enforcement sightings in their area. Check the ICEWatch map to stay informed about activity near you. Report enforcement to help your community stay safe.',
    keywords: ['ICEWatch', 'raids', 'map', 'tracking', 'enforcement', 'sightings', 'report'],
    urls: ['https://immigrantdefenseproject.org/icewatch'],
    priority: 8
  },

  // === NEW: STATE POLICIES ===
  {
    id: 'sanctuary-new-york',
    category: 'resources',
    title: 'New York Immigrant Protections',
    content: 'New York has multiple immigrant protections: NYC is a sanctuary city limiting cooperation with ICE. The New York State TRUST Act limits state and local cooperation with ICE detainers. New York courts are designated as sensitive locations. Contact Immigrant Defense Project (NYC-based) for New York-specific legal help.',
    keywords: ['new york', 'NYC', 'sanctuary', 'TRUST', 'state', 'city', 'protection'],
    urls: ['https://immigrantdefenseproject.org'],
    priority: 7
  },
  {
    id: 'sanctuary-texas-info',
    category: 'resources',
    title: 'Texas Immigration Enforcement',
    content: 'Texas has stricter enforcement policies including SB4 which requires local law enforcement to cooperate with ICE. Know your rights carefully in Texas. RAICES (Refugee and Immigrant Center for Education and Legal Services) is based in Texas and provides legal services across 5 Texas cities. Contact RAICES at 1-833-RAICES (1-833-372-4237).',
    keywords: ['texas', 'SB4', 'enforcement', 'RAICES', 'legal help'],
    phones: ['1-833-372-4237'],
    urls: ['https://raicestexas.org'],
    priority: 7
  },

  // === NEW: DETENTION RESOURCES ===
  {
    id: 'detention-facilities-map',
    category: 'detention',
    title: 'Detention Facilities Map',
    content: 'Freedom for Immigrants maintains an interactive map of 200+ immigration detention facilities across the US. The map shows ICE contracts, average bond amounts, and facility information. Use it to understand the detention landscape and find where someone may be held. If you cannot find someone, use the ICE Detainee Locator: 1-888-351-4024.',
    keywords: ['detention', 'facilities', 'map', 'jail', 'ICE', 'where', 'held', 'prison'],
    phones: ['1-888-351-4024'],
    urls: ['https://freedomforimmigrants.org/map'],
    priority: 8
  },
  {
    id: 'detention-hotline',
    category: 'detention',
    title: 'National Immigration Detention Hotline',
    content: 'Freedom for Immigrants operates the largest national hotline for detained immigrants. They provide: emotional support, information about your rights in detention, help connecting with legal services, and visitation programs. If you or someone you know is in detention, contact Freedom for Immigrants for support.',
    keywords: ['detention', 'hotline', 'jail', 'help', 'support', 'detainee'],
    urls: ['https://freedomforimmigrants.org'],
    priority: 9
  },

  // === NEW: LEGAL RESOURCES ===
  {
    id: 'find-legal-help',
    category: 'legal',
    title: 'Find Free Immigration Legal Help',
    content: 'Several organizations help you find free or low-cost immigration legal services: Informed Immigrant has a "Find Legal Help" directory searchable by location. CLINIC (Catholic Legal Immigration Network) has 400+ nonprofit programs nationwide. AILA (American Immigration Lawyers Association) has an attorney finder. Never pay for legal advice from "notarios" - only licensed attorneys can represent you.',
    keywords: ['lawyer', 'attorney', 'legal', 'help', 'free', 'find', 'directory', 'search'],
    urls: ['https://informedimmigrant.com', 'https://cliniclegal.org', 'https://aila.org'],
    priority: 10
  },
  {
    id: 'bond-fund-finder',
    category: 'detention',
    title: 'Find Bond Funds Near You',
    content: 'Immigration bonds average $8,176 and can be difficult for families to pay. Community bond funds help pay bonds for detained immigrants. The National Bail Fund Network helps you find local bond funds in your area. Other funds include: Black Immigrants Bail Fund, LGBTQ Freedom Fund, and Freedom for Immigrants Bond Fund.',
    keywords: ['bond', 'bail', 'fund', 'money', 'pay', 'help', 'detained', 'release'],
    urls: ['https://communitybailout.org', 'https://blackimmigrantsbailfund.org', 'https://lgbtqfund.org'],
    priority: 9
  },

  // === NEW: KNOW YOUR RIGHTS TRAININGS ===
  {
    id: 'kyr-trainings',
    category: 'resources',
    title: 'Know Your Rights Community Trainings',
    content: 'Several organizations offer Know Your Rights trainings for communities: Immigrant Legal Resource Center (ILRC) offers train-the-trainer programs. United We Dream has community education resources. Immigrant Defense Project provides rapid response training. Informed Immigrant has downloadable guides and toolkits. Share these resources with your community to help everyone stay prepared.',
    keywords: ['training', 'workshop', 'community', 'education', 'learn', 'teach', 'prepare'],
    urls: ['https://ilrc.org', 'https://unitedwedream.org', 'https://informedimmigrant.com'],
    priority: 7
  },
]

// Categories for filtering
export const categories = [
  { id: 'rights', name: 'Know Your Rights', icon: 'Shield' },
  { id: 'emergency', name: 'Emergency Help', icon: 'AlertTriangle' },
  { id: 'legal', name: 'Legal Resources', icon: 'Scale' },
  { id: 'detention', name: 'Detention Help', icon: 'Building' },
  { id: 'resources', name: 'Resources', icon: 'BookOpen' },
  { id: 'vulnerable', name: 'Special Situations', icon: 'Heart' },
  { id: 'workplace', name: 'Workplace Rights', icon: 'Briefcase' },
] as const

export type CategoryId = (typeof categories)[number]['id']
