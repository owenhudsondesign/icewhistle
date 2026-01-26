/**
 * Rapid Response Hotline Directory
 *
 * Coverage uses ZIP prefixes (3-digit) or state codes.
 * National hotlines have empty coverage array (apply everywhere).
 */

export interface Hotline {
  id: string
  name: string
  nameEs?: string
  phone: string
  description: string
  descriptionEs?: string
  languages: string[]
  hours: string // "24/7" or specific hours
  website?: string
  coverage: string[] // Empty = national, otherwise ZIP prefixes or state codes
  priority: number // Lower = higher priority (1-10)
  type: 'national' | 'state' | 'local'
}

export const HOTLINES: Hotline[] = [
  // === NATIONAL HOTLINES (always shown first) ===
  {
    id: 'united-we-dream',
    name: 'United We Dream',
    phone: '1-844-363-1423',
    description: 'Report ICE activity and get immediate support',
    descriptionEs: 'Reportar actividad de ICE y obtener apoyo inmediato',
    languages: ['en', 'es'],
    hours: '24/7',
    website: 'https://unitedwedream.org',
    coverage: [],
    priority: 1,
    type: 'national',
  },
  {
    id: 'ice-detainee-locator',
    name: 'ICE Detainee Locator',
    nameEs: 'Localizador de Detenidos de ICE',
    phone: '1-888-351-4024',
    description: 'Find someone in ICE custody',
    descriptionEs: 'Encontrar a alguien bajo custodia de ICE',
    languages: ['en', 'es'],
    hours: '24/7',
    website: 'https://locator.ice.gov',
    coverage: [],
    priority: 1,
    type: 'national',
  },
  {
    id: 'nilc',
    name: 'National Immigration Law Center',
    phone: '1-213-639-3900',
    description: 'Legal information and policy advocacy',
    descriptionEs: 'Información legal y defensa de políticas',
    languages: ['en', 'es'],
    hours: 'Mon-Fri 9am-5pm PT',
    website: 'https://nilc.org',
    coverage: [],
    priority: 2,
    type: 'national',
  },
  {
    id: 'raices',
    name: 'RAICES Texas',
    phone: '1-833-724-2371',
    description: 'Free legal services for immigrants',
    descriptionEs: 'Servicios legales gratuitos para inmigrantes',
    languages: ['en', 'es'],
    hours: 'Mon-Fri 9am-5pm CT',
    website: 'https://raicestexas.org',
    coverage: [],
    priority: 2,
    type: 'national',
  },
  {
    id: 'aclu-immigrants',
    name: 'ACLU Immigrant Rights',
    phone: '1-212-549-2500',
    description: 'Know your rights information',
    descriptionEs: 'Información sobre sus derechos',
    languages: ['en', 'es'],
    hours: 'Mon-Fri 9am-6pm ET',
    website: 'https://aclu.org/issues/immigrants-rights',
    coverage: [],
    priority: 3,
    type: 'national',
  },

  // === CALIFORNIA ===
  {
    id: 'ca-immigrant-rapid-response',
    name: 'California Immigrant Rapid Response',
    phone: '1-888-412-9983',
    description: 'Statewide rapid response network',
    descriptionEs: 'Red de respuesta rápida estatal',
    languages: ['en', 'es', 'zh', 'vi', 'tl', 'ko'],
    hours: '24/7',
    website: 'https://caimmigrant.org',
    coverage: ['CA', '900', '901', '902', '903', '904', '905', '906', '907', '908', '909', '910', '911', '912', '913', '914', '915', '916', '917', '918', '919', '920', '921', '922', '923', '924', '925', '926', '927', '928', '930', '931', '932', '933', '934', '935', '936', '937', '938', '939', '940', '941', '942', '943', '944', '945', '946', '947', '948', '949', '950', '951', '952', '953', '954', '955', '956', '957', '958', '959', '960', '961'],
    priority: 1,
    type: 'state',
  },
  {
    id: 'chirla-la',
    name: 'CHIRLA - Los Angeles',
    phone: '1-888-624-4752',
    description: 'Coalition for Humane Immigrant Rights',
    descriptionEs: 'Coalición por los Derechos Humanos de los Inmigrantes',
    languages: ['en', 'es'],
    hours: 'Mon-Fri 9am-5pm PT',
    website: 'https://chirla.org',
    coverage: ['900', '901', '902', '903', '904', '905', '906', '907', '908', '910', '911', '912', '913', '914', '915', '916', '917', '918'],
    priority: 2,
    type: 'local',
  },
  {
    id: 'sf-rapid-response',
    name: 'SF Rapid Response Network',
    phone: '1-415-200-1548',
    description: 'San Francisco Bay Area rapid response',
    descriptionEs: 'Respuesta rápida del Área de la Bahía de SF',
    languages: ['en', 'es', 'zh'],
    hours: '24/7',
    coverage: ['940', '941', '943', '944', '945', '946', '947', '948', '949', '950', '951'],
    priority: 2,
    type: 'local',
  },

  // === TEXAS ===
  {
    id: 'tx-raices-hotline',
    name: 'RAICES Texas Hotline',
    phone: '1-833-724-2371',
    description: 'Texas immigrant legal services',
    descriptionEs: 'Servicios legales para inmigrantes en Texas',
    languages: ['en', 'es'],
    hours: 'Mon-Fri 9am-5pm CT',
    website: 'https://raicestexas.org',
    coverage: ['TX', '750', '751', '752', '753', '754', '755', '756', '757', '758', '759', '760', '761', '762', '763', '764', '765', '766', '767', '768', '769', '770', '771', '772', '773', '774', '775', '776', '777', '778', '779', '780', '781', '782', '783', '784', '785', '786', '787', '788', '789', '790', '791', '792', '793', '794', '795', '796', '797', '798', '799'],
    priority: 1,
    type: 'state',
  },

  // === NEW YORK ===
  {
    id: 'ny-immigration-hotline',
    name: 'New York Immigration Hotline',
    phone: '1-800-354-0365',
    description: 'NYS Office for New Americans',
    descriptionEs: 'Oficina de Nuevos Americanos de NYS',
    languages: ['en', 'es', 'zh', 'ko', 'ru', 'ht', 'bn', 'ar'],
    hours: 'Mon-Fri 9am-8pm ET',
    website: 'https://dos.ny.gov/office-new-americans',
    coverage: ['NY', '100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148', '149'],
    priority: 1,
    type: 'state',
  },
  {
    id: 'make-the-road-ny',
    name: 'Make the Road New York',
    phone: '1-718-418-7690',
    description: 'Community organizing and legal services',
    descriptionEs: 'Organización comunitaria y servicios legales',
    languages: ['en', 'es'],
    hours: 'Mon-Fri 9am-6pm ET',
    website: 'https://maketheroadny.org',
    coverage: ['100', '101', '102', '103', '104', '110', '111', '112', '113', '114'],
    priority: 2,
    type: 'local',
  },

  // === ILLINOIS ===
  {
    id: 'icirr-illinois',
    name: 'ICIRR Illinois',
    phone: '1-855-435-7693',
    description: 'Illinois Coalition for Immigrant Rights',
    descriptionEs: 'Coalición de Illinois por los Derechos de los Inmigrantes',
    languages: ['en', 'es', 'pl'],
    hours: '24/7',
    website: 'https://icirr.org',
    coverage: ['IL', '600', '601', '602', '603', '604', '605', '606', '607', '608', '609', '610', '611', '612', '613', '614', '615', '616', '617', '618', '619', '620', '621', '622', '623', '624', '625', '626', '627', '628', '629'],
    priority: 1,
    type: 'state',
  },

  // === ARIZONA ===
  {
    id: 'az-puente',
    name: 'Puente Arizona',
    phone: '1-480-750-5765',
    description: 'Human rights organization in Phoenix',
    descriptionEs: 'Organización de derechos humanos en Phoenix',
    languages: ['en', 'es'],
    hours: '24/7 (text or call)',
    website: 'https://puenteaz.org',
    coverage: ['AZ', '850', '851', '852', '853', '855', '856', '857', '859', '860', '863', '864', '865'],
    priority: 1,
    type: 'state',
  },

  // === FLORIDA ===
  {
    id: 'fl-immigrant-coalition',
    name: 'Florida Immigrant Coalition',
    phone: '1-305-571-7254',
    description: 'Statewide immigrant advocacy',
    descriptionEs: 'Defensa de inmigrantes en todo el estado',
    languages: ['en', 'es', 'ht'],
    hours: 'Mon-Fri 9am-5pm ET',
    website: 'https://floridaimmigrant.org',
    coverage: ['FL', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330', '331', '332', '333', '334', '335', '336', '337', '338', '339', '340', '341', '342', '344', '346', '347', '349'],
    priority: 1,
    type: 'state',
  },

  // === MASSACHUSETTS ===
  {
    id: 'ma-luce',
    name: 'LUCE Immigrant Justice Hotline',
    nameEs: 'Línea de Justicia para Inmigrantes LUCE',
    phone: '1-617-370-5023',
    description: 'Statewide rapid response network - report ICE activity, get real-time support',
    descriptionEs: 'Red de respuesta rápida estatal - reportar actividad de ICE, obtener apoyo en tiempo real',
    languages: ['en', 'es', 'pt', 'fr', 'zh', 'ht'],
    hours: '6am-8pm daily',
    website: 'https://lucemass.org',
    coverage: ['MA', '010', '011', '012', '013', '014', '015', '016', '017', '018', '019', '020', '021', '022', '023', '024', '025', '026', '027'],
    priority: 1,
    type: 'state',
  },
  {
    id: 'ma-mira',
    name: 'MIRA Coalition',
    phone: '1-617-350-5480',
    description: 'Massachusetts Immigrant & Refugee Advocacy',
    descriptionEs: 'Defensa de Inmigrantes y Refugiados de Massachusetts',
    languages: ['en', 'es', 'pt', 'ht', 'zh'],
    hours: 'Mon-Fri 9am-5pm ET',
    website: 'https://miracoalition.org',
    coverage: ['MA', '010', '011', '012', '013', '014', '015', '016', '017', '018', '019', '020', '021', '022', '023', '024', '025', '026', '027'],
    priority: 2,
    type: 'state',
  },

  // === COLORADO ===
  {
    id: 'co-immigrant-rights',
    name: 'Colorado Immigrant Rights Coalition',
    phone: '1-720-669-9302',
    description: 'Statewide rapid response network',
    descriptionEs: 'Red de respuesta rápida en todo el estado',
    languages: ['en', 'es'],
    hours: '24/7 (text)',
    website: 'https://coloradoimmigrant.org',
    coverage: ['CO', '800', '801', '802', '803', '804', '805', '806', '807', '808', '809', '810', '811', '812', '813', '814', '815', '816'],
    priority: 1,
    type: 'state',
  },

  // === WASHINGTON ===
  {
    id: 'wa-oneamerica',
    name: 'OneAmerica',
    phone: '1-206-723-2203',
    description: 'Washington state immigrant advocacy',
    descriptionEs: 'Defensa de inmigrantes del estado de Washington',
    languages: ['en', 'es', 'zh', 'vi', 'so', 'am'],
    hours: 'Mon-Fri 9am-5pm PT',
    website: 'https://weareoneamerica.org',
    coverage: ['WA', '980', '981', '982', '983', '984', '985', '986', '988', '989', '990', '991', '992', '993', '994'],
    priority: 1,
    type: 'state',
  },

  // === GEORGIA ===
  {
    id: 'ga-glahr',
    name: 'GLAHR Georgia',
    phone: '1-404-456-5134',
    description: 'Georgia Latino Alliance for Human Rights',
    descriptionEs: 'Alianza Latina de Georgia por los Derechos Humanos',
    languages: ['en', 'es'],
    hours: '24/7 (text)',
    website: 'https://glahr.org',
    coverage: ['GA', '300', '301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319'],
    priority: 1,
    type: 'state',
  },

  // === NEW JERSEY ===
  {
    id: 'nj-aac',
    name: 'American Friends Service Committee NJ',
    phone: '1-973-643-1924',
    description: 'New Jersey immigrant support',
    descriptionEs: 'Apoyo a inmigrantes de Nueva Jersey',
    languages: ['en', 'es'],
    hours: 'Mon-Fri 9am-5pm ET',
    website: 'https://afsc.org/office/newark-nj',
    coverage: ['NJ', '070', '071', '072', '073', '074', '075', '076', '077', '078', '079', '080', '081', '082', '083', '084', '085', '086', '087', '088', '089'],
    priority: 1,
    type: 'state',
  },

  // === NORTH CAROLINA ===
  {
    id: 'nc-siembra',
    name: 'Siembra NC',
    phone: '1-919-615-0505',
    description: 'North Carolina immigrant support',
    descriptionEs: 'Apoyo a inmigrantes de Carolina del Norte',
    languages: ['en', 'es'],
    hours: 'Mon-Fri 9am-5pm ET',
    website: 'https://siembranc.org',
    coverage: ['NC', '270', '271', '272', '273', '274', '275', '276', '277', '278', '279', '280', '281', '282', '283', '284', '285', '286', '287', '288', '289'],
    priority: 1,
    type: 'state',
  },

  // === NEVADA ===
  {
    id: 'nv-plan',
    name: 'PLAN Action Nevada',
    phone: '1-702-483-8830',
    description: 'Nevada immigrant rights organization',
    descriptionEs: 'Organización de derechos de inmigrantes de Nevada',
    languages: ['en', 'es'],
    hours: 'Mon-Fri 9am-5pm PT',
    website: 'https://planevada.org',
    coverage: ['NV', '889', '890', '891', '893', '894', '895', '896', '897', '898'],
    priority: 1,
    type: 'state',
  },

  // === OREGON ===
  {
    id: 'or-causa',
    name: 'CAUSA Oregon',
    phone: '1-503-363-1895',
    description: 'Oregon immigrant rights coalition',
    descriptionEs: 'Coalición de derechos de inmigrantes de Oregón',
    languages: ['en', 'es', 'ru'],
    hours: 'Mon-Fri 9am-5pm PT',
    website: 'https://causaoregon.org',
    coverage: ['OR', '970', '971', '972', '973', '974', '975', '976', '977', '978', '979'],
    priority: 1,
    type: 'state',
  },

  // === TENNESSEE ===
  {
    id: 'tn-tirrc',
    name: 'TIRRC Resource Line',
    nameEs: 'Línea de Recursos TIRRC',
    phone: '1-615-414-1030',
    description: 'Tennessee Immigrant & Refugee Rights Coalition - legal info and rapid response',
    descriptionEs: 'Coalición de Derechos de Inmigrantes y Refugiados de Tennessee',
    languages: ['en', 'es'],
    hours: 'Mon-Fri 9am-5pm CT',
    website: 'https://www.tnimmigrant.org',
    coverage: ['TN', '370', '371', '372', '373', '374', '375', '376', '377', '378', '379', '380', '381', '382', '383', '384', '385'],
    priority: 1,
    type: 'state',
  },

  // === WISCONSIN ===
  {
    id: 'wi-voces',
    name: 'Voces de la Frontera',
    phone: '1-414-643-1620',
    description: 'Wisconsin immigrant rights - emergency hotline and rapid response',
    descriptionEs: 'Derechos de inmigrantes de Wisconsin - línea de emergencia y respuesta rápida',
    languages: ['en', 'es'],
    hours: 'Mon-Fri 9am-5pm CT, emergency response available',
    website: 'https://vdlf.org',
    coverage: ['WI', '530', '531', '532', '534', '535', '537', '538', '539', '540', '541', '542', '543', '544', '545', '546', '547', '548', '549'],
    priority: 1,
    type: 'state',
  },

  // === MICHIGAN ===
  {
    id: 'mi-mirc',
    name: 'Michigan Immigrant Rights Center',
    nameEs: 'Centro de Derechos de Inmigrantes de Michigan',
    phone: '1-734-239-6863',
    description: 'Statewide immigration legal services and information',
    descriptionEs: 'Servicios legales de inmigración para todo el estado',
    languages: ['en', 'es', 'ar'],
    hours: 'Mon-Thu 10am-4pm ET',
    website: 'https://michiganimmigrant.org',
    coverage: ['MI', '480', '481', '482', '483', '484', '485', '486', '487', '488', '489', '490', '491', '492', '493', '494', '495', '496', '497', '498', '499'],
    priority: 1,
    type: 'state',
  },

  // === CONNECTICUT ===
  {
    id: 'ct-legal',
    name: 'CT Legal Services Immigration Hotline',
    nameEs: 'Línea de Inmigración de Servicios Legales de CT',
    phone: '1-800-798-0671',
    description: 'Statewide immigration legal advice hotline',
    descriptionEs: 'Línea de asesoría legal de inmigración estatal',
    languages: ['en', 'es'],
    hours: 'Mon-Fri 9am-5pm ET',
    website: 'https://ctlegal.org',
    coverage: ['CT', '060', '061', '062', '063', '064', '065', '066', '067', '068', '069'],
    priority: 1,
    type: 'state',
  },

  // === MAINE ===
  {
    id: 'me-icewatch',
    name: 'Maine ICE Watch Hotline',
    nameEs: 'Línea de Vigilancia de ICE de Maine',
    phone: '1-207-544-9989',
    description: 'Report and verify ICE activity, connect with rapid response',
    descriptionEs: 'Reportar y verificar actividad de ICE, conectar con respuesta rápida',
    languages: ['en', 'es', 'fr', 'so', 'ar'],
    hours: 'Mon-Fri 6-9am & 5-9pm ET',
    website: 'https://maineimmigrantrights.org',
    coverage: ['ME', '039', '040', '041', '042', '043', '044', '045', '046', '047', '048', '049'],
    priority: 1,
    type: 'state',
  },

  // === NEW JERSEY - Statewide ===
  {
    id: 'nj-dire',
    name: 'DIRE - Deportation & Immigration Response Equipo',
    nameEs: 'DIRE - Equipo de Respuesta de Deportación e Inmigración',
    phone: '1-888-347-3767',
    description: 'Statewide rapid response hotline - report ICE activity',
    descriptionEs: 'Línea de respuesta rápida estatal - reportar actividad de ICE',
    languages: ['en', 'es'],
    hours: '24/7',
    website: 'https://www.njaij.org',
    coverage: ['NJ'],
    priority: 1,
    type: 'state',
  },

  // === LOUISIANA ===
  {
    id: 'la-nowcrj',
    name: 'Congress of Day Laborers / NOWCRJ',
    nameEs: 'Congreso de Jornaleros / NOWCRJ',
    phone: '1-504-309-5165',
    description: 'New Orleans immigrant worker support and organizing',
    descriptionEs: 'Apoyo y organización de trabajadores inmigrantes de Nueva Orleans',
    languages: ['en', 'es'],
    hours: 'Mon-Fri 9am-5pm CT',
    website: 'https://www.nowcrj.org',
    coverage: ['LA', '700', '701', '702', '703', '704', '705', '706', '707', '708'],
    priority: 1,
    type: 'state',
  },

  // === WASHINGTON DC ===
  {
    id: 'dc-msma',
    name: 'Migrant Solidarity Mutual Aid Hotline',
    nameEs: 'Línea de Ayuda Mutua de Solidaridad Migrante',
    phone: '1-202-335-1183',
    description: 'Report ICE activity in DC area',
    descriptionEs: 'Reportar actividad de ICE en el área de DC',
    languages: ['en', 'es'],
    hours: 'Active hours vary',
    website: 'https://migrantsolidarity.org',
    coverage: ['DC', '200', '201', '202', '203', '204', '205'],
    priority: 1,
    type: 'state',
  },

  // === RHODE ISLAND ===
  {
    id: 'ri-dorcas',
    name: 'Dorcas International Immigration Services',
    nameEs: 'Servicios de Inmigración de Dorcas International',
    phone: '1-401-784-8607',
    description: 'Low-cost immigration legal services',
    descriptionEs: 'Servicios legales de inmigración de bajo costo',
    languages: ['en', 'es', 'pt', 'fr'],
    hours: 'Mon-Fri 9am-5pm ET',
    website: 'https://www.diiri.org',
    coverage: ['RI', '028', '029'],
    priority: 1,
    type: 'state',
  },

  // === CALIFORNIA - Regional ===
  {
    id: 'ca-marin',
    name: 'Marin County Rapid Response',
    nameEs: 'Respuesta Rápida del Condado de Marin',
    phone: '1-415-991-4545',
    description: 'Canal Alliance rapid response for Marin County',
    descriptionEs: 'Respuesta rápida de Canal Alliance para el Condado de Marin',
    languages: ['en', 'es'],
    hours: '24/7',
    website: 'https://canalalliance.org',
    coverage: ['949'],
    priority: 2,
    type: 'local',
  },
  {
    id: 'ca-northbay',
    name: 'North Bay Rapid Response (Sonoma & Napa)',
    nameEs: 'Respuesta Rápida del North Bay',
    phone: '1-707-800-4544',
    description: 'Rapid response for Sonoma and Napa Counties',
    descriptionEs: 'Respuesta rápida para los Condados de Sonoma y Napa',
    languages: ['en', 'es'],
    hours: '24/7',
    coverage: ['945', '954', '959'],
    priority: 2,
    type: 'local',
  },
  {
    id: 'ca-monterey',
    name: 'Monterey County Rapid Response',
    nameEs: 'Respuesta Rápida del Condado de Monterey',
    phone: '1-831-643-5225',
    description: 'Report ICE activity in Monterey County',
    descriptionEs: 'Reportar actividad de ICE en el Condado de Monterey',
    languages: ['en', 'es'],
    hours: '24/7',
    coverage: ['939', '930', '931', '932', '933', '934', '935', '936', '937', '938'],
    priority: 2,
    type: 'local',
  },
  {
    id: 'ca-centralvalley',
    name: 'Central Valley Rapid Response',
    nameEs: 'Respuesta Rápida del Valle Central',
    phone: '1-559-206-0151',
    description: 'Fresno, San Joaquin, Merced & Kern Counties',
    descriptionEs: 'Condados de Fresno, San Joaquin, Merced y Kern',
    languages: ['en', 'es'],
    hours: '24/7',
    coverage: ['932', '933', '934', '935', '936', '937', '952', '953', '956', '957'],
    priority: 2,
    type: 'local',
  },

  // === NEW YORK - Regional ===
  {
    id: 'ny-longisland',
    name: 'Long Island Rapid Response',
    nameEs: 'Respuesta Rápida de Long Island',
    phone: '1-516-387-2043',
    description: 'Long Island Dream Act Coalition rapid response',
    descriptionEs: 'Respuesta rápida de la Coalición del Dream Act de Long Island',
    languages: ['en', 'es'],
    hours: '24/7',
    coverage: ['110', '111', '115', '117', '118', '119'],
    priority: 2,
    type: 'local',
  },

  // === NEW JERSEY - Regional ===
  {
    id: 'nj-hudson',
    name: 'Spirit of Liberation (Jersey City)',
    nameEs: 'Espíritu de Liberación (Jersey City)',
    phone: '1-201-616-2816',
    description: 'Jersey City / Bayonne rapid response - call or text',
    descriptionEs: 'Respuesta rápida de Jersey City / Bayonne - llame o envíe mensaje',
    languages: ['en', 'es'],
    hours: '24/7',
    coverage: ['070', '071', '073'],
    priority: 2,
    type: 'local',
  },
  {
    id: 'nj-atlantic',
    name: 'El Pueblo Unido',
    nameEs: 'El Pueblo Unido',
    phone: '1-609-200-1030',
    description: 'Atlantic County rapid response network - call or text',
    descriptionEs: 'Red de respuesta rápida del Condado de Atlantic - llame o envíe mensaje',
    languages: ['en', 'es'],
    hours: '24/7',
    coverage: ['082', '083'],
    priority: 2,
    type: 'local',
  },
  {
    id: 'nj-mercer',
    name: 'Resistencia en Accion',
    nameEs: 'Resistencia en Acción',
    phone: '1-640-466-2386',
    description: 'Mercer County rapid response - call or text',
    descriptionEs: 'Respuesta rápida del Condado de Mercer - llame o envíe mensaje',
    languages: ['en', 'es'],
    hours: '24/7',
    coverage: ['085', '086'],
    priority: 2,
    type: 'local',
  },

  // === MICHIGAN - Regional ===
  {
    id: 'mi-detained',
    name: 'MIRC Detained Immigrant Line',
    nameEs: 'Línea de MIRC para Inmigrantes Detenidos',
    phone: '1-734-794-9963',
    description: 'Information for families of detained immigrants in Michigan/Ohio',
    descriptionEs: 'Información para familias de inmigrantes detenidos en Michigan/Ohio',
    languages: ['en', 'es'],
    hours: 'Mon-Thu 10am-4pm ET',
    website: 'https://michiganimmigrant.org',
    coverage: ['MI', 'OH', '480', '481', '482', '483', '484', '485', '430', '431', '432', '433', '434', '435'],
    priority: 2,
    type: 'local',
  },

  // === MAINE - Regional ===
  {
    id: 'me-bondfund',
    name: 'Mainers for Humane Immigration',
    nameEs: 'Mainers por Inmigración Humana',
    phone: '1-207-747-1409',
    description: 'Bond fund, commissary, and release support for detained immigrants',
    descriptionEs: 'Fondo de fianza, comisariato y apoyo de liberación para inmigrantes detenidos',
    languages: ['en', 'es'],
    hours: 'Mon-Fri 9am-5pm ET',
    website: 'https://mainersforhumaneimmigration.org',
    coverage: ['ME', '039', '040', '041', '042', '043', '044', '045', '046', '047', '048', '049'],
    priority: 2,
    type: 'local',
  },

  // === CONNECTICUT - Regional ===
  {
    id: 'ct-ciri-hartford',
    name: 'CT Institute for Refugees & Immigrants - Hartford',
    nameEs: 'Instituto de CT para Refugiados e Inmigrantes - Hartford',
    phone: '1-860-692-3085',
    description: 'Immigration legal services for Hartford area',
    descriptionEs: 'Servicios legales de inmigración para el área de Hartford',
    languages: ['en', 'es', 'ar'],
    hours: 'Mon-Fri 9am-5pm ET',
    website: 'https://cirict.org',
    coverage: ['060', '061'],
    priority: 2,
    type: 'local',
  },
  {
    id: 'ct-ciri-bridgeport',
    name: 'CT Institute for Refugees & Immigrants - Bridgeport',
    nameEs: 'Instituto de CT para Refugiados e Inmigrantes - Bridgeport',
    phone: '1-203-336-0141',
    description: 'Immigration legal services for Bridgeport/Fairfield County',
    descriptionEs: 'Servicios legales de inmigración para Bridgeport/Condado de Fairfield',
    languages: ['en', 'es'],
    hours: 'Mon-Fri 9am-5pm ET',
    website: 'https://cirict.org',
    coverage: ['066', '068'],
    priority: 2,
    type: 'local',
  },
  {
    id: 'ct-ciri-stamford',
    name: 'CT Institute for Refugees & Immigrants - Stamford',
    nameEs: 'Instituto de CT para Refugiados e Inmigrantes - Stamford',
    phone: '1-203-965-1790',
    description: 'Immigration legal services for Stamford area',
    descriptionEs: 'Servicios legales de inmigración para el área de Stamford',
    languages: ['en', 'es'],
    hours: 'Mon-Fri 9am-5pm ET',
    website: 'https://cirict.org',
    coverage: ['069'],
    priority: 2,
    type: 'local',
  },

  // === CALIFORNIA - Additional Regional ===
  {
    id: 'ca-humboldt',
    name: 'Humboldt County Rapid Response',
    nameEs: 'Respuesta Rápida del Condado de Humboldt',
    phone: '1-707-282-5226',
    description: 'Report ICE activity in Humboldt County',
    descriptionEs: 'Reportar actividad de ICE en el Condado de Humboldt',
    languages: ['en', 'es'],
    hours: '24/7',
    coverage: ['955'],
    priority: 2,
    type: 'local',
  },
  {
    id: 'ca-contracosta',
    name: 'Contra Costa County Rapid Response',
    nameEs: 'Respuesta Rápida del Condado de Contra Costa',
    phone: '1-925-900-5151',
    description: 'Report ICE activity in Contra Costa County',
    descriptionEs: 'Reportar actividad de ICE en el Condado de Contra Costa',
    languages: ['en', 'es'],
    hours: '24/7',
    coverage: ['945', '946'],
    priority: 2,
    type: 'local',
  },

  // === NEW YORK - Additional Regional ===
  {
    id: 'ny-ulster',
    name: 'Ulster County Rapid Response',
    nameEs: 'Respuesta Rápida del Condado de Ulster',
    phone: '1-845-293-3423',
    description: 'Report ICE activity in Ulster County, NY',
    descriptionEs: 'Reportar actividad de ICE en el Condado de Ulster, NY',
    languages: ['en', 'es'],
    hours: '24/7',
    coverage: ['124'],
    priority: 2,
    type: 'local',
  },
]

/**
 * Get hotlines that match a user's ZIP code
 */
export function getHotlinesForZip(zip: string | null): Hotline[] {
  if (!zip || zip.length < 3) {
    // Return only national hotlines
    return HOTLINES.filter(h => h.type === 'national').sort((a, b) => a.priority - b.priority)
  }

  const zipPrefix = zip.substring(0, 3)

  // Get matching hotlines
  const matches = HOTLINES.filter(hotline => {
    // National hotlines always match
    if (hotline.coverage.length === 0) return true

    // Check ZIP prefix
    if (hotline.coverage.includes(zipPrefix)) return true

    // Check state code (we'll infer from ZIP)
    const state = getStateFromZipPrefix(zipPrefix)
    if (state && hotline.coverage.includes(state)) return true

    return false
  })

  // Sort by priority, then by type (national first, then state, then local)
  return matches.sort((a, b) => {
    if (a.type === 'national' && b.type !== 'national') return -1
    if (b.type === 'national' && a.type !== 'national') return 1
    return a.priority - b.priority
  })
}

/**
 * State names for display
 */
const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'Washington D.C.', FL: 'Florida',
  GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana',
  IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine',
  MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
  MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
  NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota',
  OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island',
  SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah',
  VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin',
  WY: 'Wyoming',
}

/**
 * Get state info from a ZIP code
 */
export function getStateFromZipCode(zip: string | null): { code: string; name: string } | null {
  if (!zip || zip.length < 3) return null
  const prefix = zip.substring(0, 3)
  const code = getStateFromZipPrefix(prefix)
  if (!code) return null
  return { code, name: STATE_NAMES[code] || code }
}

/**
 * Get location display string for a ZIP code
 */
export function getLocationDisplay(zip: string | null, language: string = 'en'): string {
  const state = getStateFromZipCode(zip)
  if (!state) return language === 'es' ? 'Nacional' : 'National'
  return state.name
}

/**
 * Check if user has local resources available
 */
export function hasLocalResources(zip: string | null): boolean {
  if (!zip || zip.length < 3) return false
  const hotlines = getHotlinesForZip(zip)
  return hotlines.some(h => h.type === 'local' || h.type === 'state')
}

/**
 * Get the primary local hotline for a ZIP code (the most relevant one)
 */
export function getPrimaryLocalHotline(zip: string | null): Hotline | null {
  const hotlines = getHotlinesForZip(zip)
  // Prefer local, then state, then first national
  return hotlines.find(h => h.type === 'local')
    || hotlines.find(h => h.type === 'state')
    || hotlines[0]
    || null
}

/**
 * Infer state from ZIP prefix
 */
function getStateFromZipPrefix(zipPrefix: string): string | null {
  const prefix = parseInt(zipPrefix, 10)

  // This is a simplified mapping - covers major ranges
  if (prefix >= 10 && prefix <= 27) return 'MA'
  if (prefix >= 28 && prefix <= 29) return 'RI'
  if (prefix >= 30 && prefix <= 31) return 'NH'
  if (prefix >= 32 && prefix <= 39) return 'ME'
  if (prefix >= 40 && prefix <= 49) return 'VT'
  if (prefix >= 50 && prefix <= 54) return 'CT'
  if (prefix >= 55 && prefix <= 69) return 'NJ'
  if (prefix >= 70 && prefix <= 89) return 'NJ'
  if (prefix >= 100 && prefix <= 149) return 'NY'
  if (prefix >= 150 && prefix <= 196) return 'PA'
  if (prefix >= 197 && prefix <= 199) return 'DE'
  if (prefix >= 200 && prefix <= 205) return 'DC'
  if (prefix >= 206 && prefix <= 219) return 'MD'
  if (prefix >= 220 && prefix <= 246) return 'VA'
  if (prefix >= 247 && prefix <= 268) return 'WV'
  if (prefix >= 270 && prefix <= 289) return 'NC'
  if (prefix >= 290 && prefix <= 299) return 'SC'
  if (prefix >= 300 && prefix <= 319) return 'GA'
  if (prefix >= 320 && prefix <= 349) return 'FL'
  if (prefix >= 350 && prefix <= 369) return 'AL'
  if (prefix >= 370 && prefix <= 385) return 'TN'
  if (prefix >= 386 && prefix <= 397) return 'MS'
  if (prefix >= 400 && prefix <= 427) return 'KY'
  if (prefix >= 430 && prefix <= 459) return 'OH'
  if (prefix >= 460 && prefix <= 479) return 'IN'
  if (prefix >= 480 && prefix <= 499) return 'MI'
  if (prefix >= 500 && prefix <= 528) return 'IA'
  if (prefix >= 530 && prefix <= 549) return 'WI'
  if (prefix >= 550 && prefix <= 567) return 'MN'
  if (prefix >= 570 && prefix <= 577) return 'SD'
  if (prefix >= 580 && prefix <= 588) return 'ND'
  if (prefix >= 590 && prefix <= 599) return 'MT'
  if (prefix >= 600 && prefix <= 629) return 'IL'
  if (prefix >= 630 && prefix <= 658) return 'MO'
  if (prefix >= 660 && prefix <= 679) return 'KS'
  if (prefix >= 680 && prefix <= 693) return 'NE'
  if (prefix >= 700 && prefix <= 714) return 'LA'
  if (prefix >= 716 && prefix <= 729) return 'AR'
  if (prefix >= 730 && prefix <= 749) return 'OK'
  if (prefix >= 750 && prefix <= 799) return 'TX'
  if (prefix >= 800 && prefix <= 816) return 'CO'
  if (prefix >= 820 && prefix <= 831) return 'WY'
  if (prefix >= 832 && prefix <= 838) return 'ID'
  if (prefix >= 840 && prefix <= 847) return 'UT'
  if (prefix >= 850 && prefix <= 865) return 'AZ'
  if (prefix >= 870 && prefix <= 884) return 'NM'
  if (prefix >= 889 && prefix <= 898) return 'NV'
  if (prefix >= 900 && prefix <= 961) return 'CA'
  if (prefix >= 967 && prefix <= 968) return 'HI'
  if (prefix >= 970 && prefix <= 979) return 'OR'
  if (prefix >= 980 && prefix <= 994) return 'WA'
  if (prefix >= 995 && prefix <= 999) return 'AK'

  return null
}
