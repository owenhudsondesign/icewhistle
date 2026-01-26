#!/usr/bin/env node

/**
 * Script to add ZIP/local resource translations to all locale files
 */

const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');

// New translations to add
const newTranslations = {
  en: {
    local: {
      yourLocalHotline: "Your Local Hotline",
      local: "LOCAL",
      personalized: "PERSONALIZED",
      enterZipForLocal: "Enter ZIP for local hotlines",
      storedOnDevice: "Stored only on this device",
      yourArea: "YOUR AREA",
      viewAllHotlines: "View all hotlines",
      yourLocalResources: "Your Local Resources",
      enterZipCode: "Enter your ZIP code",
      enterZipPrompt: "We'll show you local hotlines and organizations in your area.",
      noLocalResources: "No specific local resources found for your area. National resources are available below.",
      find: "Find",
      zipCode: "ZIP code",
      callForHelp: "Call for Help",
      emergencyContacts: "Emergency Contacts",
      change: "change",
      update: "Update",
      national: "National",
      state: "State",
      zipStoredLocally: "Your ZIP code is stored only on your device. It is never sent to any server.",
      enterZipToSeeLocal: "Enter your ZIP code for local resources"
    }
  },
  es: {
    local: {
      yourLocalHotline: "Tu Línea Local",
      local: "LOCAL",
      personalized: "PERSONALIZADO",
      enterZipForLocal: "Ingresa código postal para líneas locales",
      storedOnDevice: "Solo se guarda en este dispositivo",
      yourArea: "TU ÁREA",
      viewAllHotlines: "Ver todas las líneas",
      yourLocalResources: "Tus Recursos Locales",
      enterZipCode: "Ingresa tu código postal",
      enterZipPrompt: "Te mostraremos líneas de ayuda y organizaciones locales de tu área.",
      noLocalResources: "No hay recursos locales específicos para tu área. Los recursos nacionales están disponibles abajo.",
      find: "Buscar",
      zipCode: "Código postal",
      callForHelp: "Llama para Ayuda",
      emergencyContacts: "Contactos de Emergencia",
      change: "cambiar",
      update: "Actualizar",
      national: "Nacional",
      state: "Estatal",
      zipStoredLocally: "Tu código postal se guarda solo en tu dispositivo. Nunca se envía a ningún servidor.",
      enterZipToSeeLocal: "Ingresa tu código postal para ver recursos locales"
    }
  },
  pt: {
    local: {
      yourLocalHotline: "Sua Linha Local",
      local: "LOCAL",
      personalized: "PERSONALIZADO",
      enterZipForLocal: "Digite o CEP para linhas locais",
      storedOnDevice: "Armazenado apenas neste dispositivo",
      yourArea: "SUA ÁREA",
      viewAllHotlines: "Ver todas as linhas",
      yourLocalResources: "Seus Recursos Locais",
      enterZipCode: "Digite seu CEP",
      enterZipPrompt: "Mostraremos linhas de ajuda e organizações locais da sua área.",
      noLocalResources: "Nenhum recurso local específico encontrado para sua área. Recursos nacionais disponíveis abaixo.",
      find: "Buscar",
      zipCode: "CEP",
      callForHelp: "Ligue para Ajuda",
      emergencyContacts: "Contatos de Emergência",
      change: "alterar",
      update: "Atualizar",
      national: "Nacional",
      state: "Estadual",
      zipStoredLocally: "Seu CEP é armazenado apenas no seu dispositivo. Nunca é enviado a nenhum servidor.",
      enterZipToSeeLocal: "Digite seu CEP para ver recursos locais"
    }
  },
  fr: {
    local: {
      yourLocalHotline: "Votre Ligne Locale",
      local: "LOCAL",
      personalized: "PERSONNALISÉ",
      enterZipForLocal: "Entrez le code postal pour les lignes locales",
      storedOnDevice: "Stocké uniquement sur cet appareil",
      yourArea: "VOTRE ZONE",
      viewAllHotlines: "Voir toutes les lignes",
      yourLocalResources: "Vos Ressources Locales",
      enterZipCode: "Entrez votre code postal",
      enterZipPrompt: "Nous vous montrerons les lignes d'aide et organisations locales de votre région.",
      noLocalResources: "Aucune ressource locale spécifique trouvée pour votre région. Les ressources nationales sont disponibles ci-dessous.",
      find: "Chercher",
      zipCode: "Code postal",
      callForHelp: "Appelez à l'Aide",
      emergencyContacts: "Contacts d'Urgence",
      change: "modifier",
      update: "Mettre à jour",
      national: "National",
      state: "Régional",
      zipStoredLocally: "Votre code postal est stocké uniquement sur votre appareil. Il n'est jamais envoyé à aucun serveur.",
      enterZipToSeeLocal: "Entrez votre code postal pour voir les ressources locales"
    }
  },
  zh: {
    local: {
      yourLocalHotline: "您的本地热线",
      local: "本地",
      personalized: "个性化",
      enterZipForLocal: "输入邮编以获取本地热线",
      storedOnDevice: "仅存储在此设备上",
      yourArea: "您的地区",
      viewAllHotlines: "查看所有热线",
      yourLocalResources: "您的本地资源",
      enterZipCode: "输入您的邮编",
      enterZipPrompt: "我们将为您展示您所在地区的本地热线和组织。",
      noLocalResources: "未找到您所在地区的特定本地资源。全国资源如下。",
      find: "查找",
      zipCode: "邮编",
      callForHelp: "寻求帮助",
      emergencyContacts: "紧急联系人",
      change: "更改",
      update: "更新",
      national: "全国",
      state: "州级",
      zipStoredLocally: "您的邮编仅存储在您的设备上。永远不会发送到任何服务器。",
      enterZipToSeeLocal: "输入您的邮编以查看本地资源"
    }
  },
  "zh-TW": {
    local: {
      yourLocalHotline: "您的本地熱線",
      local: "本地",
      personalized: "個人化",
      enterZipForLocal: "輸入郵遞區號以獲取本地熱線",
      storedOnDevice: "僅儲存在此裝置上",
      yourArea: "您的地區",
      viewAllHotlines: "查看所有熱線",
      yourLocalResources: "您的本地資源",
      enterZipCode: "輸入您的郵遞區號",
      enterZipPrompt: "我們將為您展示您所在地區的本地熱線和組織。",
      noLocalResources: "未找到您所在地區的特定本地資源。全國資源如下。",
      find: "查找",
      zipCode: "郵遞區號",
      callForHelp: "尋求幫助",
      emergencyContacts: "緊急聯絡人",
      change: "更改",
      update: "更新",
      national: "全國",
      state: "州級",
      zipStoredLocally: "您的郵遞區號僅儲存在您的裝置上。永遠不會傳送到任何伺服器。",
      enterZipToSeeLocal: "輸入您的郵遞區號以查看本地資源"
    }
  },
  ar: {
    local: {
      yourLocalHotline: "خطك المحلي",
      local: "محلي",
      personalized: "مخصص",
      enterZipForLocal: "أدخل الرمز البريدي للخطوط المحلية",
      storedOnDevice: "مخزن فقط على هذا الجهاز",
      yourArea: "منطقتك",
      viewAllHotlines: "عرض جميع الخطوط",
      yourLocalResources: "مواردك المحلية",
      enterZipCode: "أدخل الرمز البريدي",
      enterZipPrompt: "سنعرض لك خطوط المساعدة والمنظمات المحلية في منطقتك.",
      noLocalResources: "لم يتم العثور على موارد محلية محددة لمنطقتك. الموارد الوطنية متاحة أدناه.",
      find: "بحث",
      zipCode: "الرمز البريدي",
      callForHelp: "اتصل للمساعدة",
      emergencyContacts: "جهات اتصال الطوارئ",
      change: "تغيير",
      update: "تحديث",
      national: "وطني",
      state: "ولاية",
      zipStoredLocally: "يتم تخزين الرمز البريدي الخاص بك فقط على جهازك. لا يتم إرساله أبدًا إلى أي خادم.",
      enterZipToSeeLocal: "أدخل الرمز البريدي لعرض الموارد المحلية"
    }
  },
  vi: {
    local: {
      yourLocalHotline: "Đường Dây Địa Phương",
      local: "ĐỊA PHƯƠNG",
      personalized: "CÁ NHÂN HÓA",
      enterZipForLocal: "Nhập mã ZIP để xem đường dây địa phương",
      storedOnDevice: "Chỉ lưu trữ trên thiết bị này",
      yourArea: "KHU VỰC CỦA BẠN",
      viewAllHotlines: "Xem tất cả đường dây",
      yourLocalResources: "Tài Nguyên Địa Phương",
      enterZipCode: "Nhập mã ZIP",
      enterZipPrompt: "Chúng tôi sẽ hiển thị đường dây nóng và tổ chức địa phương trong khu vực của bạn.",
      noLocalResources: "Không tìm thấy tài nguyên địa phương cụ thể cho khu vực của bạn. Tài nguyên quốc gia có sẵn bên dưới.",
      find: "Tìm",
      zipCode: "Mã ZIP",
      callForHelp: "Gọi Trợ Giúp",
      emergencyContacts: "Liên Hệ Khẩn Cấp",
      change: "thay đổi",
      update: "Cập nhật",
      national: "Quốc gia",
      state: "Tiểu bang",
      zipStoredLocally: "Mã ZIP của bạn chỉ được lưu trữ trên thiết bị. Không bao giờ được gửi đến bất kỳ máy chủ nào.",
      enterZipToSeeLocal: "Nhập mã ZIP để xem tài nguyên địa phương"
    }
  },
  ko: {
    local: {
      yourLocalHotline: "지역 핫라인",
      local: "지역",
      personalized: "맞춤",
      enterZipForLocal: "지역 핫라인을 위해 우편번호 입력",
      storedOnDevice: "이 기기에만 저장됨",
      yourArea: "귀하의 지역",
      viewAllHotlines: "모든 핫라인 보기",
      yourLocalResources: "지역 자원",
      enterZipCode: "우편번호 입력",
      enterZipPrompt: "귀하 지역의 핫라인과 조직을 보여드립니다.",
      noLocalResources: "귀하 지역에 대한 특정 지역 자원을 찾을 수 없습니다. 전국 자원은 아래에 있습니다.",
      find: "찾기",
      zipCode: "우편번호",
      callForHelp: "도움 요청",
      emergencyContacts: "긴급 연락처",
      change: "변경",
      update: "업데이트",
      national: "전국",
      state: "주",
      zipStoredLocally: "우편번호는 귀하의 기기에만 저장됩니다. 어떤 서버로도 전송되지 않습니다.",
      enterZipToSeeLocal: "지역 자원을 보려면 우편번호를 입력하세요"
    }
  },
  ja: {
    local: {
      yourLocalHotline: "お住まいの地域のホットライン",
      local: "地域",
      personalized: "カスタマイズ",
      enterZipForLocal: "地域のホットラインを見るには郵便番号を入力",
      storedOnDevice: "このデバイスにのみ保存",
      yourArea: "お住まいの地域",
      viewAllHotlines: "すべてのホットラインを見る",
      yourLocalResources: "地域のリソース",
      enterZipCode: "郵便番号を入力",
      enterZipPrompt: "お住まいの地域のホットラインと組織を表示します。",
      noLocalResources: "お住まいの地域に特定のローカルリソースが見つかりませんでした。全国リソースは以下にあります。",
      find: "検索",
      zipCode: "郵便番号",
      callForHelp: "助けを求める",
      emergencyContacts: "緊急連絡先",
      change: "変更",
      update: "更新",
      national: "全国",
      state: "州",
      zipStoredLocally: "郵便番号はお使いのデバイスにのみ保存されます。サーバーに送信されることはありません。",
      enterZipToSeeLocal: "地域のリソースを見るには郵便番号を入力してください"
    }
  },
  hi: {
    local: {
      yourLocalHotline: "आपकी स्थानीय हेल्पलाइन",
      local: "स्थानीय",
      personalized: "व्यक्तिगत",
      enterZipForLocal: "स्थानीय हेल्पलाइन के लिए पिन कोड दर्ज करें",
      storedOnDevice: "केवल इस डिवाइस पर संग्रहीत",
      yourArea: "आपका क्षेत्र",
      viewAllHotlines: "सभी हेल्पलाइन देखें",
      yourLocalResources: "आपके स्थानीय संसाधन",
      enterZipCode: "अपना पिन कोड दर्ज करें",
      enterZipPrompt: "हम आपके क्षेत्र की हेल्पलाइन और संगठन दिखाएंगे।",
      noLocalResources: "आपके क्षेत्र के लिए कोई विशिष्ट स्थानीय संसाधन नहीं मिला। राष्ट्रीय संसाधन नीचे उपलब्ध हैं।",
      find: "खोजें",
      zipCode: "पिन कोड",
      callForHelp: "मदद के लिए कॉल करें",
      emergencyContacts: "आपातकालीन संपर्क",
      change: "बदलें",
      update: "अपडेट करें",
      national: "राष्ट्रीय",
      state: "राज्य",
      zipStoredLocally: "आपका पिन कोड केवल आपके डिवाइस पर संग्रहीत है। यह कभी भी किसी सर्वर पर नहीं भेजा जाता।",
      enterZipToSeeLocal: "स्थानीय संसाधन देखने के लिए अपना पिन कोड दर्ज करें"
    }
  },
  ru: {
    local: {
      yourLocalHotline: "Ваша Местная Линия",
      local: "МЕСТНЫЙ",
      personalized: "ПЕРСОНАЛИЗИРОВАНО",
      enterZipForLocal: "Введите индекс для местных линий",
      storedOnDevice: "Хранится только на этом устройстве",
      yourArea: "ВАШ РАЙОН",
      viewAllHotlines: "Все линии помощи",
      yourLocalResources: "Ваши Местные Ресурсы",
      enterZipCode: "Введите ваш индекс",
      enterZipPrompt: "Мы покажем вам местные линии помощи и организации в вашем районе.",
      noLocalResources: "Местные ресурсы для вашего района не найдены. Национальные ресурсы доступны ниже.",
      find: "Найти",
      zipCode: "Индекс",
      callForHelp: "Позвоните за Помощью",
      emergencyContacts: "Экстренные Контакты",
      change: "изменить",
      update: "Обновить",
      national: "Национальный",
      state: "Региональный",
      zipStoredLocally: "Ваш индекс хранится только на вашем устройстве. Он никогда не отправляется на сервер.",
      enterZipToSeeLocal: "Введите индекс для просмотра местных ресурсов"
    }
  },
  tl: {
    local: {
      yourLocalHotline: "Iyong Lokal na Hotline",
      local: "LOKAL",
      personalized: "PERSONALISADO",
      enterZipForLocal: "Ilagay ang ZIP para sa lokal na hotline",
      storedOnDevice: "Naka-imbak lang sa device na ito",
      yourArea: "IYONG LUGAR",
      viewAllHotlines: "Tingnan lahat ng hotline",
      yourLocalResources: "Iyong Mga Lokal na Mapagkukunan",
      enterZipCode: "Ilagay ang iyong ZIP code",
      enterZipPrompt: "Ipapakita namin ang mga lokal na hotline at organisasyon sa iyong lugar.",
      noLocalResources: "Walang nakitang partikular na lokal na mapagkukunan para sa iyong lugar. Ang mga pambansang mapagkukunan ay makikita sa ibaba.",
      find: "Hanapin",
      zipCode: "ZIP code",
      callForHelp: "Tumawag para sa Tulong",
      emergencyContacts: "Mga Emergency Contact",
      change: "baguhin",
      update: "I-update",
      national: "Pambansa",
      state: "Estado",
      zipStoredLocally: "Ang iyong ZIP code ay naka-imbak lang sa iyong device. Hindi ito ipinapadala sa anumang server.",
      enterZipToSeeLocal: "Ilagay ang iyong ZIP code para makita ang mga lokal na mapagkukunan"
    }
  },
  de: {
    local: {
      yourLocalHotline: "Ihre Lokale Hotline",
      local: "LOKAL",
      personalized: "PERSONALISIERT",
      enterZipForLocal: "PLZ für lokale Hotlines eingeben",
      storedOnDevice: "Nur auf diesem Gerät gespeichert",
      yourArea: "IHRE REGION",
      viewAllHotlines: "Alle Hotlines anzeigen",
      yourLocalResources: "Ihre Lokalen Ressourcen",
      enterZipCode: "Geben Sie Ihre PLZ ein",
      enterZipPrompt: "Wir zeigen Ihnen lokale Hotlines und Organisationen in Ihrer Region.",
      noLocalResources: "Keine spezifischen lokalen Ressourcen für Ihre Region gefunden. Nationale Ressourcen sind unten verfügbar.",
      find: "Suchen",
      zipCode: "PLZ",
      callForHelp: "Hilfe Anrufen",
      emergencyContacts: "Notfallkontakte",
      change: "ändern",
      update: "Aktualisieren",
      national: "National",
      state: "Bundesland",
      zipStoredLocally: "Ihre PLZ wird nur auf Ihrem Gerät gespeichert. Sie wird niemals an einen Server gesendet.",
      enterZipToSeeLocal: "Geben Sie Ihre PLZ ein, um lokale Ressourcen zu sehen"
    }
  },
  it: {
    local: {
      yourLocalHotline: "La Tua Linea Locale",
      local: "LOCALE",
      personalized: "PERSONALIZZATO",
      enterZipForLocal: "Inserisci il CAP per le linee locali",
      storedOnDevice: "Memorizzato solo su questo dispositivo",
      yourArea: "LA TUA ZONA",
      viewAllHotlines: "Vedi tutte le linee",
      yourLocalResources: "Le Tue Risorse Locali",
      enterZipCode: "Inserisci il tuo CAP",
      enterZipPrompt: "Ti mostreremo le linee di aiuto e le organizzazioni locali nella tua zona.",
      noLocalResources: "Nessuna risorsa locale specifica trovata per la tua zona. Le risorse nazionali sono disponibili sotto.",
      find: "Cerca",
      zipCode: "CAP",
      callForHelp: "Chiama per Aiuto",
      emergencyContacts: "Contatti di Emergenza",
      change: "cambia",
      update: "Aggiorna",
      national: "Nazionale",
      state: "Regionale",
      zipStoredLocally: "Il tuo CAP è memorizzato solo sul tuo dispositivo. Non viene mai inviato a nessun server.",
      enterZipToSeeLocal: "Inserisci il tuo CAP per vedere le risorse locali"
    }
  },
  pl: {
    local: {
      yourLocalHotline: "Twoja Lokalna Linia",
      local: "LOKALNY",
      personalized: "SPERSONALIZOWANE",
      enterZipForLocal: "Wpisz kod pocztowy dla lokalnych linii",
      storedOnDevice: "Przechowywane tylko na tym urządzeniu",
      yourArea: "TWÓJ REGION",
      viewAllHotlines: "Zobacz wszystkie linie",
      yourLocalResources: "Twoje Lokalne Zasoby",
      enterZipCode: "Wpisz swój kod pocztowy",
      enterZipPrompt: "Pokażemy Ci lokalne linie pomocy i organizacje w Twoim regionie.",
      noLocalResources: "Nie znaleziono konkretnych lokalnych zasobów dla Twojego regionu. Zasoby krajowe są dostępne poniżej.",
      find: "Szukaj",
      zipCode: "Kod pocztowy",
      callForHelp: "Zadzwoń po Pomoc",
      emergencyContacts: "Kontakty Alarmowe",
      change: "zmień",
      update: "Aktualizuj",
      national: "Krajowy",
      state: "Stanowy",
      zipStoredLocally: "Twój kod pocztowy jest przechowywany tylko na Twoim urządzeniu. Nigdy nie jest wysyłany na żaden serwer.",
      enterZipToSeeLocal: "Wpisz swój kod pocztowy, aby zobaczyć lokalne zasoby"
    }
  },
  uk: {
    local: {
      yourLocalHotline: "Ваша Місцева Лінія",
      local: "МІСЦЕВИЙ",
      personalized: "ПЕРСОНАЛІЗОВАНО",
      enterZipForLocal: "Введіть індекс для місцевих ліній",
      storedOnDevice: "Зберігається лише на цьому пристрої",
      yourArea: "ВАШ РАЙОН",
      viewAllHotlines: "Переглянути всі лінії",
      yourLocalResources: "Ваші Місцеві Ресурси",
      enterZipCode: "Введіть ваш індекс",
      enterZipPrompt: "Ми покажемо вам місцеві лінії допомоги та організації у вашому районі.",
      noLocalResources: "Місцеві ресурси для вашого району не знайдено. Національні ресурси доступні нижче.",
      find: "Знайти",
      zipCode: "Індекс",
      callForHelp: "Зателефонуйте за Допомогою",
      emergencyContacts: "Екстрені Контакти",
      change: "змінити",
      update: "Оновити",
      national: "Національний",
      state: "Регіональний",
      zipStoredLocally: "Ваш індекс зберігається лише на вашому пристрої. Він ніколи не надсилається на сервер.",
      enterZipToSeeLocal: "Введіть індекс для перегляду місцевих ресурсів"
    }
  },
  ht: {
    local: {
      yourLocalHotline: "Liy Lokal Ou",
      local: "LOKAL",
      personalized: "PÈSONALIZE",
      enterZipForLocal: "Antre kòd postal pou liy lokal yo",
      storedOnDevice: "Estoke sèlman sou aparèy sa a",
      yourArea: "ZÒN OU",
      viewAllHotlines: "Wè tout liy yo",
      yourLocalResources: "Resous Lokal Ou yo",
      enterZipCode: "Antre kòd postal ou",
      enterZipPrompt: "N ap montre ou liy èd ak òganizasyon lokal nan zòn ou.",
      noLocalResources: "Pa gen resous lokal espesifik pou zòn ou. Resous nasyonal yo disponib anba a.",
      find: "Chèche",
      zipCode: "Kòd postal",
      callForHelp: "Rele pou Èd",
      emergencyContacts: "Kontak Ijans",
      change: "chanje",
      update: "Mete ajou",
      national: "Nasyonal",
      state: "Eta",
      zipStoredLocally: "Kòd postal ou estoke sèlman sou aparèy ou. Li pa janm voye nan okenn sèvè.",
      enterZipToSeeLocal: "Antre kòd postal ou pou wè resous lokal yo"
    }
  },
  fa: {
    local: {
      yourLocalHotline: "خط محلی شما",
      local: "محلی",
      personalized: "شخصی‌سازی شده",
      enterZipForLocal: "کد پستی را برای خطوط محلی وارد کنید",
      storedOnDevice: "فقط در این دستگاه ذخیره می‌شود",
      yourArea: "منطقه شما",
      viewAllHotlines: "مشاهده همه خطوط",
      yourLocalResources: "منابع محلی شما",
      enterZipCode: "کد پستی خود را وارد کنید",
      enterZipPrompt: "خطوط کمک و سازمان‌های محلی در منطقه شما را نشان خواهیم داد.",
      noLocalResources: "منابع محلی خاصی برای منطقه شما یافت نشد. منابع ملی در زیر موجود است.",
      find: "جستجو",
      zipCode: "کد پستی",
      callForHelp: "برای کمک تماس بگیرید",
      emergencyContacts: "تماس‌های اضطراری",
      change: "تغییر",
      update: "به‌روزرسانی",
      national: "ملی",
      state: "ایالتی",
      zipStoredLocally: "کد پستی شما فقط در دستگاه شما ذخیره می‌شود. هرگز به هیچ سروری ارسال نمی‌شود.",
      enterZipToSeeLocal: "کد پستی خود را برای مشاهده منابع محلی وارد کنید"
    }
  },
  bn: {
    local: {
      yourLocalHotline: "আপনার স্থানীয় হটলাইন",
      local: "স্থানীয়",
      personalized: "ব্যক্তিগতকৃত",
      enterZipForLocal: "স্থানীয় হটলাইনের জন্য জিপ কোড দিন",
      storedOnDevice: "শুধুমাত্র এই ডিভাইসে সংরক্ষিত",
      yourArea: "আপনার এলাকা",
      viewAllHotlines: "সব হটলাইন দেখুন",
      yourLocalResources: "আপনার স্থানীয় সম্পদ",
      enterZipCode: "আপনার জিপ কোড দিন",
      enterZipPrompt: "আমরা আপনার এলাকার স্থানীয় হটলাইন এবং সংস্থা দেখাব।",
      noLocalResources: "আপনার এলাকার জন্য কোনো নির্দিষ্ট স্থানীয় সম্পদ পাওয়া যায়নি। জাতীয় সম্পদ নীচে উপলব্ধ।",
      find: "খুঁজুন",
      zipCode: "জিপ কোড",
      callForHelp: "সাহায্যের জন্য কল করুন",
      emergencyContacts: "জরুরি যোগাযোগ",
      change: "পরিবর্তন",
      update: "আপডেট",
      national: "জাতীয়",
      state: "রাজ্য",
      zipStoredLocally: "আপনার জিপ কোড শুধুমাত্র আপনার ডিভাইসে সংরক্ষিত। এটি কখনো কোনো সার্ভারে পাঠানো হয় না।",
      enterZipToSeeLocal: "স্থানীয় সম্পদ দেখতে আপনার জিপ কোড দিন"
    }
  },
  sw: {
    local: {
      yourLocalHotline: "Simu Yako ya Dharura ya Eneo",
      local: "ENEO",
      personalized: "IMEBINAFSISHWA",
      enterZipForLocal: "Weka nambari ya posta kwa simu za eneo",
      storedOnDevice: "Imehifadhiwa tu kwenye kifaa hiki",
      yourArea: "ENEO LAKO",
      viewAllHotlines: "Tazama simu zote",
      yourLocalResources: "Rasilimali Zako za Eneo",
      enterZipCode: "Weka nambari yako ya posta",
      enterZipPrompt: "Tutakuonyesha simu za dharura na mashirika ya eneo lako.",
      noLocalResources: "Hakuna rasilimali maalum za eneo zilizopatikana kwa eneo lako. Rasilimali za kitaifa zinapatikana hapa chini.",
      find: "Tafuta",
      zipCode: "Nambari ya posta",
      callForHelp: "Piga Simu kwa Msaada",
      emergencyContacts: "Mawasiliano ya Dharura",
      change: "badilisha",
      update: "Sasisha",
      national: "Kitaifa",
      state: "Jimbo",
      zipStoredLocally: "Nambari yako ya posta imehifadhiwa tu kwenye kifaa chako. Haitumwi kamwe kwa seva yoyote.",
      enterZipToSeeLocal: "Weka nambari yako ya posta kuona rasilimali za eneo"
    }
  },
  so: {
    local: {
      yourLocalHotline: "Khadkaaga Degdegga ee Deegaanka",
      local: "DEEGAANKA",
      personalized: "LA HABEEYEY",
      enterZipForLocal: "Geli lambarka boostada khadadka deegaanka",
      storedOnDevice: "Waxaa lagu kaydiyay qalab-kan oo keliya",
      yourArea: "DEGMADAADA",
      viewAllHotlines: "Arag dhammaan khadadka",
      yourLocalResources: "Ilahaaaga Deegaanka",
      enterZipCode: "Geli lambarkaaga boostada",
      enterZipPrompt: "Waxaan ku tusi doonaa khadad iyo ururado deegaanka.",
      noLocalResources: "Ma jiraan ilo deegaan oo gaar ah oo lagaa helay deegaankaaga. Ilaha qaranka ayaa hoos ka heli kara.",
      find: "Raadi",
      zipCode: "Lambarka boostada",
      callForHelp: "Wac si aad Caawimaad u hesho",
      emergencyContacts: "Xiriirka Degdegga",
      change: "badal",
      update: "Cusboonaysii",
      national: "Qaranka",
      state: "Gobolka",
      zipStoredLocally: "Lambarkaaga boostada waxaa lagu kaydiyay qalabkaaga oo keliya. Waligeed ma loo diro server kasta.",
      enterZipToSeeLocal: "Geli lambarkaaga boostada si aad u aragto ilaha deegaanka"
    }
  },
  am: {
    local: {
      yourLocalHotline: "የእርስዎ የአካባቢ መስመር",
      local: "አካባቢያዊ",
      personalized: "ግላዊ",
      enterZipForLocal: "ለአካባቢ መስመሮች ዚፕ ኮድ ያስገቡ",
      storedOnDevice: "በዚህ መሳሪያ ላይ ብቻ ተቀምጧል",
      yourArea: "የእርስዎ አካባቢ",
      viewAllHotlines: "ሁሉንም መስመሮች ይመልከቱ",
      yourLocalResources: "የእርስዎ የአካባቢ ሀብቶች",
      enterZipCode: "ዚፕ ኮድዎን ያስገቡ",
      enterZipPrompt: "በአካባቢዎ ያሉ የእርዳታ መስመሮችን እና ድርጅቶችን እናሳይዎታለን።",
      noLocalResources: "ለአካባቢዎ ልዩ የአካባቢ ሀብቶች አልተገኙም። ብሔራዊ ሀብቶች ከታች ይገኛሉ።",
      find: "ፈልግ",
      zipCode: "ዚፕ ኮድ",
      callForHelp: "ለእርዳታ ይደውሉ",
      emergencyContacts: "የአደጋ ጊዜ ግንኙነቶች",
      change: "ቀይር",
      update: "አዘምን",
      national: "ብሔራዊ",
      state: "ክልል",
      zipStoredLocally: "ዚፕ ኮድዎ በመሳሪያዎ ላይ ብቻ ተቀምጧል። ወደ ማንኛውም አገልጋይ በፍፁም አይላክም።",
      enterZipToSeeLocal: "የአካባቢ ሀብቶችን ለማየት ዚፕ ኮድዎን ያስገቡ"
    }
  },
  ne: {
    local: {
      yourLocalHotline: "तपाईंको स्थानीय हटलाइन",
      local: "स्थानीय",
      personalized: "व्यक्तिगत",
      enterZipForLocal: "स्थानीय हटलाइनको लागि जिप कोड हाल्नुहोस्",
      storedOnDevice: "यस उपकरणमा मात्र भण्डारण गरिएको",
      yourArea: "तपाईंको क्षेत्र",
      viewAllHotlines: "सबै हटलाइन हेर्नुहोस्",
      yourLocalResources: "तपाईंको स्थानीय स्रोतहरू",
      enterZipCode: "तपाईंको जिप कोड हाल्नुहोस्",
      enterZipPrompt: "हामी तपाईंको क्षेत्रका स्थानीय हटलाइन र संस्थाहरू देखाउनेछौं।",
      noLocalResources: "तपाईंको क्षेत्रको लागि कुनै विशिष्ट स्थानीय स्रोतहरू फेला परेनन्। राष्ट्रिय स्रोतहरू तल उपलब्ध छन्।",
      find: "खोज्नुहोस्",
      zipCode: "जिप कोड",
      callForHelp: "मद्दतको लागि कल गर्नुहोस्",
      emergencyContacts: "आपतकालीन सम्पर्कहरू",
      change: "परिवर्तन",
      update: "अपडेट",
      national: "राष्ट्रिय",
      state: "राज्य",
      zipStoredLocally: "तपाईंको जिप कोड तपाईंको उपकरणमा मात्र भण्डारण गरिएको छ। यो कहिल्यै कुनै सर्भरमा पठाइँदैन।",
      enterZipToSeeLocal: "स्थानीय स्रोतहरू हेर्न तपाईंको जिप कोड हाल्नुहोस्"
    }
  },
  gu: {
    local: {
      yourLocalHotline: "તમારી સ્થાનિક હોટલાઈન",
      local: "સ્થાનિક",
      personalized: "વ્યક્તિગત",
      enterZipForLocal: "સ્થાનિક હોટલાઈન માટે ઝિપ કોડ દાખલ કરો",
      storedOnDevice: "માત્ર આ ઉપકરણ પર સંગ્રહિત",
      yourArea: "તમારો વિસ્તાર",
      viewAllHotlines: "બધી હોટલાઈન જુઓ",
      yourLocalResources: "તમારા સ્થાનિક સંસાધનો",
      enterZipCode: "તમારો ઝિપ કોડ દાખલ કરો",
      enterZipPrompt: "અમે તમારા વિસ્તારની સ્થાનિક હોટલાઈન અને સંસ્થાઓ બતાવીશું.",
      noLocalResources: "તમારા વિસ્તાર માટે કોઈ ચોક્કસ સ્થાનિક સંસાધનો મળ્યા નથી. રાષ્ટ્રીય સંસાધનો નીચે ઉપલબ્ધ છે.",
      find: "શોધો",
      zipCode: "ઝિપ કોડ",
      callForHelp: "મદદ માટે કૉલ કરો",
      emergencyContacts: "ઇમરજન્સી સંપર્કો",
      change: "બદલો",
      update: "અપડેટ",
      national: "રાષ્ટ્રીય",
      state: "રાજ્ય",
      zipStoredLocally: "તમારો ઝિપ કોડ માત્ર તમારા ઉપકરણ પર સંગ્રહિત છે. તે ક્યારેય કોઈ સર્વર પર મોકલવામાં આવતો નથી.",
      enterZipToSeeLocal: "સ્થાનિક સંસાધનો જોવા માટે તમારો ઝિપ કોડ દાખલ કરો"
    }
  },
  pa: {
    local: {
      yourLocalHotline: "ਤੁਹਾਡੀ ਸਥਾਨਕ ਹੌਟਲਾਈਨ",
      local: "ਸਥਾਨਕ",
      personalized: "ਨਿੱਜੀ",
      enterZipForLocal: "ਸਥਾਨਕ ਹੌਟਲਾਈਨਾਂ ਲਈ ਜ਼ਿਪ ਕੋਡ ਦਾਖਲ ਕਰੋ",
      storedOnDevice: "ਸਿਰਫ਼ ਇਸ ਡਿਵਾਈਸ 'ਤੇ ਸਟੋਰ ਕੀਤਾ ਗਿਆ",
      yourArea: "ਤੁਹਾਡਾ ਖੇਤਰ",
      viewAllHotlines: "ਸਾਰੀਆਂ ਹੌਟਲਾਈਨਾਂ ਦੇਖੋ",
      yourLocalResources: "ਤੁਹਾਡੇ ਸਥਾਨਕ ਸਰੋਤ",
      enterZipCode: "ਆਪਣਾ ਜ਼ਿਪ ਕੋਡ ਦਾਖਲ ਕਰੋ",
      enterZipPrompt: "ਅਸੀਂ ਤੁਹਾਡੇ ਖੇਤਰ ਦੀਆਂ ਸਥਾਨਕ ਹੌਟਲਾਈਨਾਂ ਅਤੇ ਸੰਸਥਾਵਾਂ ਦਿਖਾਵਾਂਗੇ।",
      noLocalResources: "ਤੁਹਾਡੇ ਖੇਤਰ ਲਈ ਕੋਈ ਖਾਸ ਸਥਾਨਕ ਸਰੋਤ ਨਹੀਂ ਮਿਲੇ। ਰਾਸ਼ਟਰੀ ਸਰੋਤ ਹੇਠਾਂ ਉਪਲਬਧ ਹਨ।",
      find: "ਲੱਭੋ",
      zipCode: "ਜ਼ਿਪ ਕੋਡ",
      callForHelp: "ਮਦਦ ਲਈ ਕਾਲ ਕਰੋ",
      emergencyContacts: "ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ",
      change: "ਬਦਲੋ",
      update: "ਅੱਪਡੇਟ",
      national: "ਰਾਸ਼ਟਰੀ",
      state: "ਰਾਜ",
      zipStoredLocally: "ਤੁਹਾਡਾ ਜ਼ਿਪ ਕੋਡ ਸਿਰਫ਼ ਤੁਹਾਡੀ ਡਿਵਾਈਸ 'ਤੇ ਸਟੋਰ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਇਹ ਕਦੇ ਵੀ ਕਿਸੇ ਸਰਵਰ ਨੂੰ ਨਹੀਂ ਭੇਜਿਆ ਜਾਂਦਾ।",
      enterZipToSeeLocal: "ਸਥਾਨਕ ਸਰੋਤ ਦੇਖਣ ਲਈ ਆਪਣਾ ਜ਼ਿਪ ਕੋਡ ਦਾਖਲ ਕਰੋ"
    }
  },
  ur: {
    local: {
      yourLocalHotline: "آپ کی مقامی ہاٹ لائن",
      local: "مقامی",
      personalized: "ذاتی",
      enterZipForLocal: "مقامی ہاٹ لائنز کے لیے زپ کوڈ درج کریں",
      storedOnDevice: "صرف اس ڈیوائس پر محفوظ",
      yourArea: "آپ کا علاقہ",
      viewAllHotlines: "تمام ہاٹ لائنز دیکھیں",
      yourLocalResources: "آپ کے مقامی وسائل",
      enterZipCode: "اپنا زپ کوڈ درج کریں",
      enterZipPrompt: "ہم آپ کے علاقے کی مقامی ہاٹ لائنز اور تنظیمیں دکھائیں گے۔",
      noLocalResources: "آپ کے علاقے کے لیے کوئی مخصوص مقامی وسائل نہیں ملے۔ قومی وسائل نیچے دستیاب ہیں۔",
      find: "تلاش کریں",
      zipCode: "زپ کوڈ",
      callForHelp: "مدد کے لیے کال کریں",
      emergencyContacts: "ایمرجنسی رابطے",
      change: "تبدیل کریں",
      update: "اپ ڈیٹ",
      national: "قومی",
      state: "ریاست",
      zipStoredLocally: "آپ کا زپ کوڈ صرف آپ کے ڈیوائس پر محفوظ ہے۔ یہ کبھی کسی سرور کو نہیں بھیجا جاتا۔",
      enterZipToSeeLocal: "مقامی وسائل دیکھنے کے لیے اپنا زپ کوڈ درج کریں"
    }
  },
  th: {
    local: {
      yourLocalHotline: "สายด่วนท้องถิ่นของคุณ",
      local: "ท้องถิ่น",
      personalized: "ส่วนบุคคล",
      enterZipForLocal: "กรอกรหัสไปรษณีย์สำหรับสายด่วนท้องถิ่น",
      storedOnDevice: "จัดเก็บเฉพาะในอุปกรณ์นี้",
      yourArea: "พื้นที่ของคุณ",
      viewAllHotlines: "ดูสายด่วนทั้งหมด",
      yourLocalResources: "ทรัพยากรท้องถิ่นของคุณ",
      enterZipCode: "กรอกรหัสไปรษณีย์ของคุณ",
      enterZipPrompt: "เราจะแสดงสายด่วนและองค์กรท้องถิ่นในพื้นที่ของคุณ",
      noLocalResources: "ไม่พบทรัพยากรท้องถิ่นเฉพาะสำหรับพื้นที่ของคุณ ทรัพยากรระดับชาติอยู่ด้านล่าง",
      find: "ค้นหา",
      zipCode: "รหัสไปรษณีย์",
      callForHelp: "โทรขอความช่วยเหลือ",
      emergencyContacts: "ผู้ติดต่อฉุกเฉิน",
      change: "เปลี่ยน",
      update: "อัปเดต",
      national: "ระดับชาติ",
      state: "รัฐ",
      zipStoredLocally: "รหัสไปรษณีย์ของคุณจัดเก็บเฉพาะในอุปกรณ์ของคุณ ไม่เคยส่งไปยังเซิร์ฟเวอร์ใดๆ",
      enterZipToSeeLocal: "กรอกรหัสไปรษณีย์เพื่อดูทรัพยากรท้องถิ่น"
    }
  },
  lo: {
    local: {
      yourLocalHotline: "ສາຍດ່ວນທ້ອງຖິ່ນຂອງທ່ານ",
      local: "ທ້ອງຖິ່ນ",
      personalized: "ສ່ວນບຸກຄົນ",
      enterZipForLocal: "ໃສ່ລະຫັດໄປສະນີສຳລັບສາຍດ່ວນທ້ອງຖິ່ນ",
      storedOnDevice: "ບັນທຶກໄວ້ໃນອຸປະກອນນີ້ເທົ່ານັ້ນ",
      yourArea: "ພື້ນທີ່ຂອງທ່ານ",
      viewAllHotlines: "ເບິ່ງສາຍດ່ວນທັງໝົດ",
      yourLocalResources: "ຊັບພະຍາກອນທ້ອງຖິ່ນຂອງທ່ານ",
      enterZipCode: "ໃສ່ລະຫັດໄປສະນີຂອງທ່ານ",
      enterZipPrompt: "ພວກເຮົາຈະສະແດງສາຍດ່ວນແລະອົງການທ້ອງຖິ່ນໃນພື້ນທີ່ຂອງທ່ານ",
      noLocalResources: "ບໍ່ພົບຊັບພະຍາກອນທ້ອງຖິ່ນສະເພາະສຳລັບພື້ນທີ່ຂອງທ່ານ. ຊັບພະຍາກອນລະດັບຊາດມີຢູ່ຂ້າງລຸ່ມ.",
      find: "ຊອກຫາ",
      zipCode: "ລະຫັດໄປສະນີ",
      callForHelp: "ໂທຂໍຄວາມຊ່ວຍເຫຼືອ",
      emergencyContacts: "ຕິດຕໍ່ສຸກເສີນ",
      change: "ປ່ຽນ",
      update: "ອັບເດດ",
      national: "ລະດັບຊາດ",
      state: "ລັດ",
      zipStoredLocally: "ລະຫັດໄປສະນີຂອງທ່ານບັນທຶກໄວ້ໃນອຸປະກອນຂອງທ່ານເທົ່ານັ້ນ. ບໍ່ເຄີຍສົ່ງໄປຫາເຊີບເວີໃດໆ.",
      enterZipToSeeLocal: "ໃສ່ລະຫັດໄປສະນີເພື່ອເບິ່ງຊັບພະຍາກອນທ້ອງຖິ່ນ"
    }
  },
  my: {
    local: {
      yourLocalHotline: "သင့်ဒေသဆိုင်ရာ ဖုန်းလိုင်း",
      local: "ဒေသ",
      personalized: "ကိုယ်ပိုင်",
      enterZipForLocal: "ဒေသဆိုင်ရာ ဖုန်းလိုင်းများအတွက် စာတိုက်သင်္ကေတ ထည့်ပါ",
      storedOnDevice: "ဤစက်ပစ္စည်းတွင်သာ သိမ်းဆည်းထားသည်",
      yourArea: "သင့်ဒေသ",
      viewAllHotlines: "ဖုန်းလိုင်းအားလုံးကြည့်ရန်",
      yourLocalResources: "သင့်ဒေသဆိုင်ရာ အရင်းအမြစ်များ",
      enterZipCode: "သင့်စာတိုက်သင်္ကေတ ထည့်ပါ",
      enterZipPrompt: "သင့်ဒေသရှိ ဖုန်းလိုင်းများနှင့် အဖွဲ့အစည်းများကို ပြသပါမည်။",
      noLocalResources: "သင့်ဒေသအတွက် တိကျသော ဒေသဆိုင်ရာ အရင်းအမြစ်များ မတွေ့ပါ။ အမျိုးသားအဆင့် အရင်းအမြစ်များ အောက်တွင် ရရှိနိုင်သည်။",
      find: "ရှာဖွေ",
      zipCode: "စာတိုက်သင်္ကေတ",
      callForHelp: "အကူအညီအတွက် ဖုန်းခေါ်ပါ",
      emergencyContacts: "အရေးပေါ် ဆက်သွယ်ရန်",
      change: "ပြောင်းလဲ",
      update: "အပ်ဒိတ်",
      national: "အမျိုးသား",
      state: "ပြည်နယ်",
      zipStoredLocally: "သင့်စာတိုက်သင်္ကေတကို သင့်စက်ပစ္စည်းတွင်သာ သိမ်းဆည်းထားသည်။ မည်သည့်ဆာဗာသို့မျှ မပို့ပါ။",
      enterZipToSeeLocal: "ဒေသဆိုင်ရာ အရင်းအမြစ်များကြည့်ရန် သင့်စာတိုက်သင်္ကေတ ထည့်ပါ"
    }
  }
};

// Process each locale file
const localeFiles = fs.readdirSync(localesDir).filter(f => f.endsWith('.json') && !f.includes('common'));

localeFiles.forEach(file => {
  const filePath = path.join(localesDir, file);
  const langCode = file.replace('.json', '');

  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Get translations for this language, fall back to English
    const translations = newTranslations[langCode] || newTranslations.en;

    // Add the local section
    content.local = translations.local;

    // Write back
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
    console.log(`Updated ${file}`);
  } catch (err) {
    console.error(`Error processing ${file}:`, err.message);
  }
});

console.log('Done!');
