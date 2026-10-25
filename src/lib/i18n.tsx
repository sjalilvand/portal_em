'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

/* ---------------- Types ---------------- */

export type Lang = 'fa' | 'en' | 'ar';

export const LANGS: { key: Lang; label: string; flag: string; dir: 'rtl' | 'ltr' }[] = [
  { key: 'fa', label: 'فارسی', flag: '🇮🇷', dir: 'rtl' },
  { key: 'en', label: 'English', flag: '🌐', dir: 'ltr' },
  { key: 'ar', label: 'العربية', flag: '🕌', dir: 'rtl' },
];

const STORAGE_KEY = 'emdad-lang';

/* ---------------- Dictionary ----------------
 * t(key, faDefault) → DICT[lang][key] ?? faDefault
 * Only visible UI chrome is translated; deep Persian content
 * (news body, service specs...) gracefully falls back to fa.
 * -------------------------------------------- */

const DICT: Record<Lang, Record<string, string>> = {
  fa: {},
  en: {
    // Top bar
    'topbar.callcenter': 'Call center: 1498',
    'topbar.nationalWindow': 'National Window of Smart Government Services',
    'topbar.account': 'Account',
    'topbar.language': 'Language',
    // Header
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.news': 'News Center',
    'nav.services': 'Service Desk',
    'nav.help': 'I Want to Help',
    'nav.multimedia': 'Multimedia',
    'nav.provinces': 'Provinces',
    'nav.more': 'More',
    'nav.search': 'Search in portal...',
    'about.glance': 'Emdad at a glance',
    'about.glance.desc': 'History and short introduction',
    'about.board': 'Board of trustees',
    'about.board.desc': 'Members of the board',
    'about.goals': 'Goals & approach',
    'about.goals.desc': 'Vision and strategic goals',
    'about.charter': 'Ethical charter',
    'about.charter.desc': 'Our values and commitments',
    'about.stats': 'Statistics & performance',
    'about.stats.desc': 'Annual performance report',
    'about.org': 'Organizational structure',
    'about.org.desc': 'Deputy offices and departments',
    'about.statute': 'Statute & regulations',
    'about.statute.desc': 'Legal framework of the committee',
    'services.desk': 'Electronic services desk',
    'services.desk.desc': 'Online service requests',
    'services.participation': 'Electronic participation',
    'services.participation.desc': 'Sponsorship & donations',
    'services.suggestions': 'Suggestions & public relations',
    'services.suggestions.desc': 'Feedback and requests',
    'more.transparency': 'Transparency system',
    'more.transparency.desc': 'Transparent budget reporting',
    'more.faq': 'FAQ',
    'more.faq.desc': 'Answers to common questions',
    'more.contact': 'Contact us',
    'more.contact.desc': 'Address and communication channels',
    'more.admin': 'News management',
    'more.admin.desc': 'Content managers login',
    // Theme picker
    'theme.title': 'Portal color theme',
    'theme.emerald': 'Emdad Green',
    'theme.azure': 'Turquoise',
    'theme.royal': 'Royal Purple',
    'theme.sunset': 'Mehr Sunset',
    'theme.gold': 'Golden Charity',
    'theme.light': 'Day mode',
    'theme.dark': 'Night mode',
    // Accessibility panel
    'a11y.title': 'Accessibility Panel',
    'a11y.open': 'Accessibility & disability panel',
    'a11y.font': 'Choose font',
    'a11y.size': 'Text size',
    'a11y.read': 'Read page aloud',
    'a11y.stopRead': 'Stop reading',
    'a11y.dayMode': 'Day mode',
    'a11y.nightMode': 'Night mode',
    'a11y.reset': 'Reset',
    'a11y.admin': 'News management',
    'a11y.size.small': 'Small',
    'a11y.size.normal': 'Normal',
    'a11y.size.large': 'Large',
    'a11y.size.xl': 'X-Large',
    'a11y.size.xxl': 'XX-Large',
    'a11y.highContrast': 'High contrast',
    'a11y.highContrast.desc': 'Intense colors for low vision',
    'a11y.grayscale': 'Grayscale',
    'a11y.grayscale.desc': 'Remove colors for color blindness',
    'a11y.underline': 'Underline links',
    'a11y.underline.desc': 'Highlight hyperlinks',
    'a11y.bigCursor': 'Large cursor',
    'a11y.bigCursor.desc': 'Enlarge the mouse pointer',
    'a11y.spacing': 'Text spacing',
    'a11y.spacing.desc': 'Better readability for dyslexia',
    'a11y.motion': 'Animations',
    'a11y.motion.desc': 'Turn page animations on or off',
    'a11y.resetDone': 'Settings restored to default',
    'a11y.ttsUnsupported': 'Your browser does not support text-to-speech',
    'a11y.ttsError': 'Unable to read the page; try another browser',
    // Footer
    'footer.about':
      'Komite Emdad Imam Khomeini (Relief Foundation) is one of the first institutions founded after the 1979 Islamic Revolution, on 14 Esfand 1357, by the decree of Imam Khomeini to organize the livelihood of the deprived and needy.',
    'footer.quick': 'Quick access',
    'footer.links': 'Useful links',
    'footer.services': 'Emdad services',
    'footer.contact': 'Contact us',
    'footer.postal': 'Postal code',
    'footer.callcenter': 'Call center',
    'footer.disclaimer':
      'This is a redesigned demo portal; all brand rights belong to Komite Emdad Imam Khomeini (Relief Foundation).',
    'footer.rights': 'All rights belong to Komite Emdad Imam Khomeini (Relief Foundation)',
    'footer.rules': 'Rules & regulations',
    'footer.mailbox': "Director's mailbox",
    'footer.link.nationalWindow': 'National Smart Services Window',
    'footer.link.loanFund': 'Emdad Velayat Qarz al-Hasna Fund',
    'footer.link.transparency': 'Transparency system',
    'footer.link.sadogh': 'Electronic Sadaqah Fund',
    'footer.link.samad': 'SAMAD Public Relations System',
    // Visitor stats
    'stats.title': 'Visitor statistics',
    'stats.browser': 'Your browser',
    'stats.country': 'Country',
    'stats.iran': 'Iran',
    'stats.online': 'Online now',
    'stats.totalViews': 'Total visits',
    'stats.totalVisitors': 'Total visitors',
    'stats.todayViews': 'Visits today',
    'stats.todayVisitors': 'Visitors today',
    'stats.enamad': 'eNAMAD electronic trust seal',
    // Chat
    'chat.title': 'Online chat',
    'chat.subtitle': 'Emdad online support',
    'chat.open': 'Open online chat',
    'chat.placeholder': 'Write your message...',
    'chat.send': 'Send',
    'chat.welcome':
      'Hello and welcome! 🌹 I am the virtual assistant of Komite Emdad. How can I help you?',
    'chat.typing': 'The assistant is typing...',
    'chat.operatorNote': 'For talking to a live expert call 1498 (24/7)',
    // Misc
    'misc.social': 'Social media',
    'common.close': 'Close',
  },
  ar: {
    'topbar.callcenter': 'مركز الاتصال: ١٤٩٨',
    'topbar.nationalWindow': 'النافذة الوطنية لخدمات الحكومة الذكية',
    'topbar.account': 'الحساب',
    'topbar.language': 'اللغة',
    'nav.home': 'الصفحة الرئيسية',
    'nav.about': 'التعريف',
    'nav.news': 'المركز الإعلامي',
    'nav.services': 'مكتب الخدمات',
    'nav.help': 'أريد أن أساعد',
    'nav.multimedia': 'الوسائط المتعددة',
    'nav.provinces': 'المحافظات',
    'nav.more': 'المزيد',
    'nav.search': 'ابحث في البوابة...',
    'about.glance': 'الإمداد في لمحة',
    'about.glance.desc': 'التاريخ والتعريف المختصر',
    'about.board': 'مجلس الأمناء',
    'about.board.desc': 'أعضاء مجلس الأمناء',
    'about.goals': 'الأهداف والنهج',
    'about.goals.desc': 'الرؤية والأهداف الاستراتيجية',
    'about.charter': 'الميثاق الأخلاقي',
    'about.charter.desc': 'قيمنا والتزاماتنا',
    'about.stats': 'الإحصاءات والأداء',
    'about.stats.desc': 'تقرير الأداء السنوي',
    'about.org': 'الهيكل التنظيمي',
    'about.org.desc': 'الوكالات والمديريات العامة',
    'about.statute': 'النظام الأساسي واللوائح',
    'about.statute.desc': 'الإطار القانوني للجنة',
    'services.desk': 'مكتب الخدمات الإلكترونية',
    'services.desk.desc': 'طلبات الخدمات الإلكترونية',
    'services.participation': 'المشاركة الإلكترونية',
    'services.participation.desc': 'الرعاية والتبرعات',
    'services.suggestions': 'الاقتراحات والعلاقات العامة',
    'services.suggestions.desc': 'الملاحظات والطلبات',
    'more.transparency': 'نظام الشفافية',
    'more.transparency.desc': 'تقارير الموازنة الشفافة',
    'more.faq': 'الأسئلة الشائعة',
    'more.faq.desc': 'أجوبة على الأسئلة الشائعة',
    'more.contact': 'اتصل بنا',
    'more.contact.desc': 'العنوان وقنوات الاتصال',
    'more.admin': 'إدارة الأخبار',
    'more.admin.desc': 'دخول مدراء المحتوى',
    'theme.title': 'لون البوابة',
    'theme.emerald': 'الأخضر الإمدادي',
    'theme.azure': 'الفيروزي',
    'theme.royal': 'البنفسجي الملكي',
    'theme.sunset': 'غروب المهر',
    'theme.gold': 'الذهبي للإحسان',
    'theme.light': 'الوضع النهاري',
    'theme.dark': 'الوضع الليلي',
    'a11y.title': 'لوحة الوصول',
    'a11y.open': 'لوحة الوصول لذوي الإعاقة',
    'a11y.font': 'اختيار الخط',
    'a11y.size': 'حجم النص',
    'a11y.read': 'قراءة الصفحة بصوت عال',
    'a11y.stopRead': 'إيقاف القراءة',
    'a11y.dayMode': 'الوضع النهاري',
    'a11y.nightMode': 'الوضع الليلي',
    'a11y.reset': 'إعادة تعيين',
    'a11y.admin': 'إدارة الأخبار',
    'a11y.size.small': 'صغير',
    'a11y.size.normal': 'عادي',
    'a11y.size.large': 'كبير',
    'a11y.size.xl': 'أكبر',
    'a11y.size.xxl': 'ضخم',
    'a11y.highContrast': 'تباين عالي',
    'a11y.highContrast.desc': 'ألوان قوية لضعاف البصر',
    'a11y.grayscale': 'أبيض وأسود',
    'a11y.grayscale.desc': 'إزالة الألوان لعمى الألوان',
    'a11y.underline': 'تسطير الروابط',
    'a11y.underline.desc': 'تمييز الروابط',
    'a11y.bigCursor': 'مؤشر كبير',
    'a11y.bigCursor.desc': 'تكبير مؤشر الفأرة',
    'a11y.spacing': 'تباعد النص',
    'a11y.spacing.desc': 'قراءة أسهل لعسر القراءة',
    'a11y.motion': 'الحركات',
    'a11y.motion.desc': 'تشغيل أو إيقاف حركات الصفحة',
    'a11y.resetDone': 'تمت استعادة الإعدادات الافتراضية',
    'a11y.ttsUnsupported': 'متصفحك لا يدعم قراءة النص',
    'a11y.ttsError': 'تعذر قراءة الصفحة؛ جرب متصفحا آخر',
    'footer.about':
      'لجنة الإمام الخميني للإغاثة (كوميته إمداد) هي من أوائل المؤسسات التي تأسست بعد انتصار الثورة الإسلامية في ١٤ اسفند ١٣٥٧ بمرسوم الإمام الخميني بهدف تنظيم معيشة المحرومين والمحتاجين.',
    'footer.quick': 'وصول سريع',
    'footer.links': 'روابط مفيدة',
    'footer.services': 'خدمات الإمداد',
    'footer.contact': 'اتصل بنا',
    'footer.postal': 'الرمز البريدي',
    'footer.callcenter': 'مركز الاتصال',
    'footer.disclaimer':
      'هذه نسخة تجريبية معاد تصميمها؛ جميع حقوق العلامة تعود للجنة الإمام الخميني للإغاثة.',
    'footer.rights': 'جميع الحقوق تعود للجنة الإمام الخميني للإغاثة',
    'footer.rules': 'القوانين واللوائح',
    'footer.mailbox': 'صندوق بريد المدير',
    'footer.link.nationalWindow': 'النافذة الوطنية للخدمات الذكية',
    'footer.link.loanFund': 'صندوق القرض الحسنة ولاية الإمداد',
    'footer.link.transparency': 'نظام الشفافية',
    'footer.link.sadogh': 'صندوق الصدقة الإلكترونية',
    'footer.link.samad': 'نظام سامد للعلاقات العامة',
    'stats.title': 'إحصاءات الزوار',
    'stats.browser': 'متصفحك',
    'stats.country': 'البلد',
    'stats.iran': 'إيران',
    'stats.online': 'متصل الآن',
    'stats.totalViews': 'إجمالي الزيارات',
    'stats.totalVisitors': 'إجمالي الزوار',
    'stats.todayViews': 'زيارات اليوم',
    'stats.todayVisitors': 'زوار اليوم',
    'stats.enamad': 'شعار الثقة الإلكترونية إنماد',
    'chat.title': 'الدردشة المباشرة',
    'chat.subtitle': 'الدعم المباشر للإمداد',
    'chat.open': 'افتح الدردشة المباشرة',
    'chat.placeholder': 'اكتب رسالتك...',
    'chat.send': 'إرسال',
    'chat.welcome': 'مرحباً بك! 🌹 أنا المساعد الافتراضي للجنة الإمداد. كيف أستطيع مساعدتك؟',
    'chat.typing': 'المساعد يكتب...',
    'chat.operatorNote': 'للتحدث مع خبير اتصل بـ ١٤٩٨ (على مدار الساعة)',
    'misc.social': 'وسائل التواصل',
    'common.close': 'إغلاق',
  },
};

/* ---------------- Context ---------------- */

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  dir: 'rtl' | 'ltr';
  isRTL: boolean;
  t: (key: string, faDefault: string) => string;
  hydrated: boolean;
}

const LangContext = createContext<LangContextValue | null>(null);

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}

/* ---------------- Provider ---------------- */

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fa');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
        if (saved && ['fa', 'en', 'ar'].includes(saved)) setLangState(saved);
      } catch {
        /* ignore */
      }
      setHydrated(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === 'en' ? 'ltr' : 'rtl';
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang, hydrated]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const t = useCallback(
    (key: string, faDefault: string) => {
      if (lang === 'fa') return faDefault;
      return DICT[lang][key] ?? faDefault;
    },
    [lang]
  );

  const dir = lang === 'en' ? 'ltr' : 'rtl';

  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang, dir, isRTL: dir === 'rtl', t, hydrated }),
    [lang, setLang, dir, t, hydrated]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

/* ---------------- Helpers ---------------- */

/** Format numbers according to the active language */
export function localizedNumber(n: number | string, lang: Lang): string {
  const num = typeof n === 'string' ? n.replace(/,/g, '') : n;
  const locale = lang === 'fa' ? 'fa-IR' : lang === 'ar' ? 'ar-EG' : 'en-US';
  try {
    return new Intl.NumberFormat(locale).format(Number(num));
  } catch {
    return String(n);
  }
}
