/* ============ Static data for Emdad Portal ============ */

export type ViewName =
  | 'home'
  | 'news'
  | 'services'
  | 'about'
  | 'provinces'
  | 'multimedia'
  | 'help'
  | 'transparency'
  | 'faq'
  | 'contact'
  | 'admin';

/* ---------------- Navigation ---------------- */

export interface NavItem {
  key: string;
  label: string;
  view?: ViewName;
  children?: {
    label: string;
    labelKey?: string;
    view: ViewName;
    desc?: string;
    descKey?: string;
    params?: Record<string, string>;
  }[];
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: 'صفحه اصلی', view: 'home' },
  {
    key: 'about',
    label: 'معرفی',
    children: [
      { label: 'امداد در یک نگاه', labelKey: 'about.glance', view: 'about', desc: 'تاریخچه و معرفی کوتاه', descKey: 'about.glance.desc', params: { tab: 'glance' } },
      { label: 'هیأت امنا', labelKey: 'about.board', view: 'about', desc: 'اعضای هیأت امنا', descKey: 'about.board.desc', params: { tab: 'board' } },
      { label: 'اهداف و رویکرد', labelKey: 'about.goals', view: 'about', desc: 'چشم‌انداز و اهداف راهبردی', descKey: 'about.goals.desc', params: { tab: 'goals' } },
      { label: 'منشور اخلاقی', labelKey: 'about.charter', view: 'about', desc: 'ارزش‌ها و تعهدات ما', descKey: 'about.charter.desc', params: { tab: 'charter' } },
      { label: 'آمار و عملکرد', labelKey: 'about.stats', view: 'about', desc: 'گزارش عملکرد سالانه', descKey: 'about.stats.desc', params: { tab: 'stats' } },
      { label: 'ساختار سازمانی', labelKey: 'about.org', view: 'about', desc: 'معاونت‌ها و ادارات کل', descKey: 'about.org.desc', params: { tab: 'org' } },
      { label: 'اساسنامه و قوانین', labelKey: 'about.statute', view: 'about', desc: 'چارچوب قانونی کمیته امداد', descKey: 'about.statute.desc', params: { tab: 'statute' } },
    ],
  },
  { key: 'news', label: 'پایگاه اطلاع‌رسانی', view: 'news' },
  {
    key: 'services',
    label: 'میز خدمت',
    children: [
      { label: 'میز خدمات الکترونیک', labelKey: 'services.desk', view: 'services', desc: 'ثبت درخواست آنلاین خدمت', descKey: 'services.desk.desc' },
      { label: 'مشارکت الکترونیکی', labelKey: 'services.participation', view: 'help', desc: 'پذیرش حامی و پرداخت صدقه', descKey: 'services.participation.desc', params: { tab: 'donate' } },
      { label: 'پیشنهادات و ارتباط مردمی', labelKey: 'services.suggestions', view: 'contact', desc: 'ثبت پیشنهاد، انتقاد و درخواست', descKey: 'services.suggestions.desc' },
    ],
  },
  { key: 'help', label: 'می‌خواهم کمک کنم', view: 'help' },
  { key: 'multimedia', label: 'چندرسانه‌ای', view: 'multimedia' },
  { key: 'provinces', label: 'استان‌ها', view: 'provinces' },
  {
    key: 'more',
    label: 'بیشتر',
    children: [
      { label: 'سامانه شفافیت', labelKey: 'more.transparency', view: 'transparency', desc: 'گزارش شفاف هزینه‌کرد و بودجه', descKey: 'more.transparency.desc' },
      { label: 'سوالات متداول', labelKey: 'more.faq', view: 'faq', desc: 'پاسخ پرسش‌های رایج', descKey: 'more.faq.desc' },
      { label: 'ارتباط با ما', labelKey: 'more.contact', view: 'contact', desc: 'آدرس و راه‌های ارتباطی', descKey: 'more.contact.desc' },
      { label: 'مدیریت اخبار', labelKey: 'more.admin', view: 'admin', desc: 'ورود مدیران محتوا', descKey: 'more.admin.desc' },
    ],
  },
];

/* ---------------- Hero slides ---------------- */

export interface HeroSlide {
  id: number;
  title: string;
  highlight: string;
  subtitle: string;
  image: string;
  cta: { label: string; view: ViewName };
  badge: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: 'آینده‌ساز باشیم؛',
    highlight: 'با اکرام ایتام',
    subtitle:
      'با پذیرش حامی، مسیر زندگی یک کودک یا خانواده نیازمند را روشن کنید. ماهانه با مبلغی اندک، آینده‌ای بسازید.',
    image: '/images/hero-sponsorship.png',
    cta: { label: 'پذیرش حامی', view: 'help' },
    badge: 'طرح اکرام ایتام و محسنین',
  },
  {
    id: 2,
    title: 'تحصیل، حق همه کودکان است',
    highlight: 'کمک به ادامه تحصیل',
    subtitle:
      'بسته‌های آموزشی، کمک‌هزینه تحصیلی و مشاوره تحصیلی ویژه دانش‌آموزان نیازمند در سراسر کشور.',
    image: '/images/hero-education.png',
    cta: { label: 'حمایت از تحصیل', view: 'help' },
    badge: 'کمک به ادامه تحصیل',
  },
  {
    id: 3,
    title: 'دستان مهربان،',
    highlight: 'قلب‌های نیکوکار',
    subtitle:
      'بیش از ۹ میلیون نیکوکار در کنار کمیته امداد، امید را به خانه‌های نیازمندان می‌برند. شما هم بپیوندید.',
    image: '/images/hero-community.png',
    cta: { label: 'مشارکت مردمی', view: 'help' },
    badge: 'مشارکت‌های مردمی',
  },
  {
    id: 4,
    title: 'امید؛ از امروز تا',
    highlight: 'فردای روشن',
    subtitle:
      'خدمات معیشت، سلامت، مسکن، اشتغال و فرهنگی؛ بیش از ۱۷۰۰ قلم خدمت برای توانمندسازی خانواده‌ها.',
    image: '/images/hero-city.png',
    cta: { label: 'مشاهده خدمات', view: 'services' },
    badge: 'میز خدمت الکترونیک',
  },
];

/* ---------------- Stats ---------------- */

export interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  icon: string;
}

export const STATS: StatItem[] = [
  { label: 'نیکوکار فعال', value: 9200000, suffix: 'نفر', icon: 'HandHeart' },
  { label: 'مددجو تحت حمایت', value: 4700000, suffix: 'نفر', icon: 'Users' },
  { label: 'خانوار تحت پوشش', value: 1120000, suffix: 'خانوار', icon: 'Home' },
  { label: 'حامی طرح اکرام', value: 517000, suffix: 'نفر', icon: 'HeartHandshake' },
  { label: 'مرکز و پایگاه خدمت', value: 25000, suffix: 'مرکز', icon: 'Building2' },
  { label: 'قلم خدمت ارائه‌شده', value: 1700, suffix: 'قلم', icon: 'Sparkles' },
];

/* ---------------- Services (میز خدمت) ---------------- */

export interface ServiceSpec {
  key: string;
  label: string;
  value: string;
}

export interface PortalService {
  id: string;
  title: string;
  icon: string;
  color: string;
  short: string;
  desc: string;
  specs: ServiceSpec[];
  online: boolean;
}

export const SERVICES: PortalService[] = [
  {
    id: 'ekram',
    title: 'پذیرش حامی (طرح اکرام)',
    icon: 'Heart',
    color: 'rose',
    short: 'حامی یک کودک، خانواده یا سالمند نیازمند شوید.',
    desc: 'طرح اکرام ایتام و محسنین، جامع‌ترین طرح حمایتی کمیته امداد است که در آن نیکوکاران به صورت ماهانه هزینه زندگی، تحصیل و پرورش ایتام و کودکان بی‌سرپرست یا خانواده‌های نیازمند را بر عهده می‌گیرند و تا استقلال کامل حامی‌پذیر همراهی می‌شوند.',
    specs: [
      { key: 'mablagh', label: 'مبلغ ماهانه حمایتی', value: 'از ۱۵۰ هزار تومان (متغیر بر اساس نوع حامی‌پذیری)' },
      { key: 'sharat', label: 'شرایط حامی', value: 'اشخاص حقیقی و حقوقی، بدون محدودیت سکنی' },
      { key: 'madarek', label: 'مدارک لازم', value: 'کد ملی و موبایل حامی؛ کپی شناسنامه/کد ملی حامی‌پذیر (در صورت داشتن)' },
      { key: 'marhale', label: 'مراحل دریافت خدمت', value: 'ثبت درخواست آنلاین ← انتخاب نوع حامی‌پذیری ← معرفی حامی‌پذیر ← شروع پرداخت ماهانه ← دریافت گزارش عملکرد' },
      { key: 'zaman', label: 'زمان پاسخگویی', value: 'حداکثر ۲ روز کاری پس از ثبت درخواست' },
      { key: 'kanal', label: 'کانال دریافت خدمت', value: 'میز خدمات الکترونیک / دفاتر کمیته امداد سراسر کشور' },
    ],
    online: true,
  },
  {
    id: 'moeshat',
    title: 'کمک معیشت و اقلام اساسی',
    icon: 'ShoppingBasket',
    color: 'amber',
    short: 'توزیع بسته‌های معیشتی و اقلام ضروری زندگی.',
    desc: 'کمک معیشت شامل توزیع بسته‌های غذایی، اقلام ضروری زندگی، تجهیزات خانگی و پشتیبانی فصلی برای خانواده‌های تحت حمایت است. این خدمات با اولویت خانواده‌های دارای بیمار خاص، سالمند و کودکان ارائه می‌شود.',
    specs: [
      { key: 'mablagh', label: 'میزان کمک', value: 'بسته‌های معیشتی فصلی و اقلام ضروری بر اساس نیازسنجی مددکار' },
      { key: 'sharat', label: 'شرایط دریافت', value: 'مددجویان تحت حمایت و شناسایی‌شدگان مرکز پایش فقر' },
      { key: 'madarek', label: 'مدارک لازم', value: 'کد ملی سرپرست خانوار؛ اعتبارسنجی واحد حمایت' },
      { key: 'marhale', label: 'مراحل دریافت خدمت', value: 'ثبت نیاز ← کارشناسی مددکار ← تایید واحد حمایت ← توزیع اقلام' },
      { key: 'zaman', label: 'زمان پاسخگویی', value: 'بر اساس اولویت‌بندی؛ معمولاً در ایام فصلی و مناسبت‌ها' },
      { key: 'kanal', label: 'کانال دریافت خدمت', value: 'دفاتر کمیته امداد / مراکز نیکوکاری' },
    ],
    online: false,
  },
  {
    id: 'jahizieh',
    title: 'جهیزیه و ازدواج جوانان',
    icon: 'Gift',
    color: 'pink',
    short: 'سری جهیزیه و کمک‌هزینه ازدواج برای جوانان مددجو.',
    desc: 'طرح جهیزیه و ازدواج جوانان با مشارکت خیرین اجرا می‌شود و شامل اهدای سری جهیزیه کامل، کمک‌هزینه ازدواج و وام قرض‌الحسنه ازدواج است تا زمینه ازدواج آسان جوانان کم‌برخوردار فراهم شود.',
    specs: [
      { key: 'mablagh', label: 'میزان کمک', value: 'سری جهیزیه کامل + کمک‌هزینه نقدی ازدواج' },
      { key: 'sharat', label: 'شرایط دریافت', value: 'زوج‌های مددجو یا فرزندان مددجویان در آستانه ازدواج' },
      { key: 'madarek', label: 'مدارک لازم', value: 'کد ملی زوجین، صفحه عقدنامه یا اجازه ازدواج از واحد حمایت' },
      { key: 'marhale', label: 'مراحل دریافت خدمت', value: 'ثبت درخواست ← بررسی کارشناس ← تهیه اقلام ← اهدای جهیزیه' },
      { key: 'zaman', label: 'زمان پاسخگویی', value: '۳ تا ۴۵ روز کاری بر اساس موجودی و صف' },
      { key: 'kanal', label: 'کانال دریافت خدمت', value: 'میز خدمات الکترونیک / دفاتر کمیته امداد' },
    ],
    online: true,
  },
  {
    id: 'loan',
    title: 'وام قرض‌الحسنه ازدواج و ضروری',
    icon: 'Landmark',
    color: 'emerald',
    short: 'وام بدون سود از صندوق امداد ولایت.',
    desc: 'صندوق قرض‌الحسنه امداد ولایت وام‌های قرض‌الحسنه ازدواج، تعمیر مسکن و ضروری را با نرخ صفر درصد و بدون ضامن رسمی (ضمانت محلی) به مددجویان و خانواده‌های تحت حمایت پرداخت می‌کند.',
    specs: [
      { key: 'mablagh', label: 'سقف وام', value: 'ازدواج تا ۲۰۰ میلیون ریال؛ ضروری تا ۱۰۰ میلیون ریال' },
      { key: 'sharat', label: 'شرایط دریافت', value: 'مددجویان تحت حمایت با توان بازپرداخت مورد تایید' },
      { key: 'madarek', label: 'مدارک لازم', value: 'درخواست کتبی، مدارک هویتی، ضامن محلی یا چک' },
      { key: 'marhale', label: 'مراحل دریافت خدمت', value: 'ثبت درخواست ← اعتبارسنجی ← تایید کمیته وام ← پرداخت' },
      { key: 'zaman', label: 'زمان پاسخگویی', value: '۲ تا ۳ هفته کاری' },
      { key: 'kanal', label: 'کانال دریافت خدمت', value: 'شعب صندوق امداد ولایت / میز خدمات الکترونیک' },
    ],
    online: true,
  },
  {
    id: 'education',
    title: 'کمک به ادامه تحصیل',
    icon: 'GraduationCap',
    color: 'sky',
    short: 'کمک‌هزینه تحصیلی و بسته‌های آموزشی دانش‌آموزان.',
    desc: 'این خدمت شامل کمک‌هزینه تحصیلی دانش‌آموزان و دانشجویان مددجو، بسته‌های لوازم‌التحریر، اردوهای زیارتی و آموزشی، مشاوره تحصیلی و طرح فرزندخواندگی (حامی تحصیلی) است تا هیچ دانش‌آموزی به دلیل فقر از تحصیل باز نماند.',
    specs: [
      { key: 'mablagh', label: 'میزان کمک', value: 'کمک‌هزینه ماهانه تحصیلی + بسته‌های آموزشی سالانه' },
      { key: 'sharat', label: 'شرایط دریافت', value: 'دانش‌آموزان و دانشجویان مددجو با اعتبارسنجی تحصیلی' },
      { key: 'madarek', label: 'مدارک لازم', value: 'کد ملی دانش‌آموز، گواهی اشتغال به تحصیل' },
      { key: 'marhale', label: 'مراحل دریافت خدمت', value: 'ثبت درخواست ← بررسی وضعیت تحصیلی ← تایید ← پرداخت کمک‌هزینه' },
      { key: 'zaman', label: 'زمان پاسخگویی', value: 'آغاز سال تحصیلی و طول سال تحصیلی' },
      { key: 'kanal', label: 'کانال دریافت خدمت', value: 'میز خدمات الکترونیک / دفاتر کمیته امداد' },
    ],
    online: true,
  },
  {
    id: 'health',
    title: 'خدمات سلامت و درمان',
    icon: 'Stethoscope',
    color: 'teal',
    short: 'ویزیت تخصصی، دندانپزشکی و توانبخشی رایگان.',
    desc: 'در طرح‌های سلامت‌محور، خدمات پزشکی شامل ویزیت تخصصی، دندانپزشکی، آزمایش‌های تشخیصی، فیزیوتراپی و اردوهای درمانی جهادی با همکاری پزشکان داوطلب به مددجویان ارائه می‌شود.',
    specs: [
      { key: 'mablagh', label: 'میزان خدمت', value: 'بیش از ۱۱ هزار خدمت پزشکی در سال (استانی)' },
      { key: 'sharat', label: 'شرایط دریافت', value: 'مددجویان و اعضای خانوار تحت حمایت' },
      { key: 'madarek', label: 'مدارک لازم', value: 'کد ملی، پرونده پزشکی (در صورت وجود)' },
      { key: 'marhale', label: 'مراحل دریافت خدمت', value: 'ثبت درخواست ← هماهنگی نوبت ← ارائه خدمت در مرکز درمانی' },
      { key: 'zaman', label: 'زمان پاسخگویی', value: 'بر اساس تقویم اردوهای درمانی و ظرفیت مراکز' },
      { key: 'kanal', label: 'کانال دریافت خدمت', value: 'مراکز درمانی کمیته امداد / اردوهای جهادی' },
    ],
    online: false,
  },
  {
    id: 'housing',
    title: 'نهضت تهیه و تعمیر مسکن',
    icon: 'Building',
    color: 'orange',
    short: 'احداث، تکمیل و تعمیر مسکن مددجویان فاقد مسکن.',
    desc: 'در قالب نهضت تهیه مسکن، خدمات احداث بنا، تکمیل بنای نیمه‌تمام، تعمیر بنا و احداث فضای جانبی (آشپزخانه، حمام، سرویس بهداشتی، اتاق و حصارکشی) برای مددجویان فاقد مسکن یا دارای مسکن غیرقابل استفاده ارائه می‌شود.',
    specs: [
      { key: 'mablagh', label: 'میزان کمک', value: 'اعتبارات ساخت و ساز بر اساس مصوبه و بهای منطقی' },
      { key: 'sharat', label: 'شرایط دریافت', value: 'مددجوی فاقد مسکن یا دارای مسکن غیرقابل استفاده، تایید واحد حمایت' },
      { key: 'madarek', label: 'مدارک لازم', value: 'اسناد مالکیت یا وقف‌نامه زمین، کد ملی، مجوز ساخت' },
      { key: 'marhale', label: 'مراحل دریافت خدمت', value: 'ثبت درخواست ← کارشناسی فنی ← مصوبه ← اجرا و نظارت' },
      { key: 'zaman', label: 'زمان پاسخگویی', value: 'بر اساس بودجه و صف احداث' },
      { key: 'kanal', label: 'کانال دریافت خدمت', value: 'اداره کل تامین مسکن / دفاتر کمیته امداد' },
    ],
    online: false,
  },
  {
    id: 'employment',
    title: 'کارآفرینی و تسهیلات اشتغال',
    icon: 'Briefcase',
    color: 'lime',
    short: 'وام و آموزش برای راه‌اندازی کسب‌وکار.',
    desc: 'تسهیلات اشتغال در قالب طرح‌های خوداشتغالی، صنایع دستی، دامپروری و کشاورزی با دوره‌های مهارت‌افزایی پیش از پرداخت ارائه می‌شود تا خانواده‌ها از کمک معیشت به توانمندسازی پایدار برسند.',
    specs: [
      { key: 'mablagh', label: 'سقف تسهیلات', value: 'تا ۵۰۰ میلیون ریال بر اساس طرح کارشناسی‌شده' },
      { key: 'sharat', label: 'شرایط دریافت', value: 'مددجوی واجد شرایط با طرح اشتغالی مصوب' },
      { key: 'madarek', label: 'مدارک لازم', value: 'طرح توجیهی ساده، مدارک هویتی، ضامن یا وثیقه محلی' },
      { key: 'marhale', label: 'مراحل دریافت خدمت', value: 'ثبت درخواست ← آموزش مهارت ← مصوبه کمیته اشتغال ← پرداخت تسهیلات' },
      { key: 'zaman', label: 'زمان پاسخگویی', value: '۴ تا ۸ هفته کاری' },
      { key: 'kanal', label: 'کانال دریافت خدمت', value: 'میز خدمات الکترونیک / معاونت توانمندسازی استان‌ها' },
    ],
    online: true,
  },
  {
    id: 'sadagheh',
    title: 'صدقه و نذر آنلاین',
    icon: 'HandCoins',
    color: 'green',
    short: 'پرداخت آنی صدقه با کد QR و گزارش شفاف.',
    desc: 'سامانه پرداخت الکترونیکی صدقات امکان پرداخت آنی صدقه در قالب‌های مختلف (عام، رفع موانع ازدواج، درمان، تحصیل، آزادی زندانیان) را با کد QR فراهم می‌کند و گزارش عملکرد به صورت شفاف در دسترس است.',
    specs: [
      { key: 'mablagh', label: 'مبلغ پرداخت', value: 'اختیاری؛ از هر مبلغی شروع می‌شود' },
      { key: 'sharat', label: 'شرایط', value: 'بدون نیاز به ثبت‌نام؛ پرداخت آنی' },
      { key: 'madarek', label: 'مدارک لازم', value: 'فقط درگاه پرداخت اینترنتی یا اسکن کد QR' },
      { key: 'marhale', label: 'مراحل', value: 'انتخاب نوع صدقه ← تعیین مبلغ ← پرداخت آنلاین ← دریافت رسید' },
      { key: 'zaman', label: 'زمان', value: 'آنی؛ کد رهگیری بلافاصله صادر می‌شود' },
      { key: 'kanal', label: 'کانال', value: 'مشارکت الکترونیکی / کد QR / پیامکی' },
    ],
    online: true,
  },
  {
    id: 'zakat',
    title: 'زکات و کفاره',
    icon: 'Scale',
    color: 'yellow',
    short: 'پرداخت زکات مال و فطره به صورت الکترونیکی.',
    desc: 'نیکوکاران می‌توانند زکات مال، زکات فطره، کفارات و فدیه خود را به صورت آنلاین پرداخت کنند. زکات پرداختی صرف نیازمندان و مددجویان واجد شرایط در همان منطقه پرداخت‌کننده می‌شود.',
    specs: [
      { key: 'mablagh', label: 'نرخ امسال', value: 'بر اساس مصوبه کمیته امداد و جامعه مدرسین قم' },
      { key: 'sharat', label: 'شرایط', value: 'بدون نیاز به ثبت‌نام؛ محاسبه‌گر آنلاین' },
      { key: 'madarek', label: 'مدارک لازم', value: 'درگاه پرداخت اینترنتی' },
      { key: 'marhale', label: 'مراحل', value: 'محاسبه با محاسبه‌گر ← انتخاب نوع زکات ← پرداخت ← رسید' },
      { key: 'zaman', label: 'زمان', value: 'آنی' },
      { key: 'kanal', label: 'کانال', value: 'مشارکت الکترونیکی' },
    ],
    online: true,
  },
  {
    id: 'suggestion',
    title: 'پیشنهادات و ارتباط مردمی',
    icon: 'MessageSquareHeart',
    color: 'violet',
    short: 'ثبت پیشنهاد، شکایت و درخواست کمک مستقیم.',
    desc: 'سامانه ارتباط مردمی امکان ثبت پیشنهاد، انتقاد، شکایت و درخواست کمک را برای همه شهروندان فراهم می‌کند. درخواست‌ها در سامانه سامد ثبت و در کمیته پاسخگویی مدیران رسیدگی می‌شود.',
    specs: [
      { key: 'mablagh', label: 'هزینه', value: 'رایگان' },
      { key: 'sharat', label: 'شرایط', value: 'همه شهروندان؛ بدون نیاز به مددجو بودن' },
      { key: 'madarek', label: 'مدارک لازم', value: 'کد ملی و شماره موبایل برای پیگیری' },
      { key: 'marhale', label: 'مراحل', value: 'ثبت درخواست ← دریافت کد رهگیری ← رسیدگی کارشناس ← پاسخ' },
      { key: 'zaman', label: 'زمان پاسخگویی', value: 'حداکثر ۷ روز کاری' },
      { key: 'kanal', label: 'کانال', value: 'میز خدمت الکترونیک / سامانه سامد / تماس ۱۴۹۸' },
    ],
    online: true,
  },
];

/* ---------------- Provinces ---------------- */

export const PROVINCES = [
  'آذربایجان شرقی', 'آذربایجان غربی', 'اردبیل', 'اصفهان', 'البرز', 'ایلام',
  'بوشهر', 'تهران', 'چهارمحال و بختیاری', 'خراسان جنوبی', 'خراسان رضوی',
  'خراسان شمالی', 'خوزستان', 'زنجان', 'سمنان', 'سیستان و بلوچستان', 'فارس',
  'قزوین', 'قم', 'کردستان', 'کرمان', 'کرمانشاه', 'کهگیلویه و بویراحمد',
  'گلستان', 'گیلان', 'لرستان', 'مازندران', 'مرکزی', 'هرمزگان', 'همدان', 'یزد',
];

/* ---------------- Multimedia ---------------- */

export interface MediaCategory {
  key: string;
  label: string;
  icon: string;
  items: { title: string; date: string; gradient: string }[];
}

export const MEDIA_CATEGORIES: MediaCategory[] = [
  {
    key: 'photo',
    label: 'گزارش تصویری',
    icon: 'Camera',
    items: [
      { title: 'دیدار رئیس کمیته امداد با نمایندگان مجلس شورای اسلامی', date: '۱۴۰۳/۱۰/۰۵', gradient: 'from-emerald-500/80 to-teal-700/80' },
      { title: 'افتتاح نمایشگاه دستاوردهای کمیته امداد در بهارستان', date: '۱۴۰۳/۰۹/۱۱', gradient: 'from-amber-500/80 to-orange-700/80' },
      { title: 'برگزاری یادمان شهدای کمیته امداد استان کرمان', date: '۱۴۰۳/۰۹/۱۰', gradient: 'from-rose-500/80 to-red-700/80' },
      { title: 'اردوی جهادی درمانی و فرهنگی بجنورد', date: '۱۴۰۳/۰۹/۰۲', gradient: 'from-sky-500/80 to-blue-700/80' },
    ],
  },
  {
    key: 'tv',
    label: 'رسانه ملی',
    icon: 'Tv',
    items: [
      { title: 'جشن فرشته‌ها - شبکه پویا', date: '۱۴۰۳/۰۸/۲۰', gradient: 'from-fuchsia-500/80 to-purple-700/80' },
      { title: 'تجربه لذت خرید برای دانش‌آموزان ایتام فاروجی', date: '۱۴۰۳/۰۸/۲۶', gradient: 'from-emerald-500/80 to-green-700/80' },
      { title: 'روایت کارآفرینی بانوی شیروانی از دریافت تسهیلات تا راه‌اندازی کارگاه قارچ', date: '۱۴۰۳/۰۸/۲۵', gradient: 'from-cyan-500/80 to-teal-700/80' },
    ],
  },
  {
    key: 'infographic',
    label: 'اینفوگرافی',
    icon: 'BarChart3',
    items: [
      { title: 'اینفوگرافیک آمار مددجویان', date: '۱۴۰۳/۰۹/۰۱', gradient: 'from-indigo-500/80 to-violet-700/80' },
      { title: 'عملکرد طرح صدقات', date: '۱۴۰۳/۰۸/۰۱', gradient: 'from-emerald-500/80 to-teal-700/80' },
      { title: 'گزارش عملکرد کمک معیشت', date: '۱۴۰۳/۰۷/۰۱', gradient: 'from-amber-500/80 to-yellow-700/80' },
      { title: 'طرح اکرام ایتام', date: '۱۴۰۳/۰۶/۰۱', gradient: 'from-rose-500/80 to-pink-700/80' },
    ],
  },
  {
    key: 'teaser',
    label: 'تیزر',
    icon: 'Clapperboard',
    items: [
      { title: 'لبنان تنها نیست', date: '۱۴۰۳/۰۸/۱۶', gradient: 'from-red-500/80 to-rose-800/80' },
      { title: 'پرداخت صدقه از طریق کد QR', date: '۱۴۰۳/۰۸/۰۱', gradient: 'from-emerald-500/80 to-emerald-800/80' },
      { title: 'زنگ عاطفه‌ها با شعار آینده‌ساز باشیم', date: '۱۴۰۳/۰۷/۰۱', gradient: 'from-sky-500/80 to-indigo-700/80' },
    ],
  },
  {
    key: 'doc',
    label: 'مستند',
    icon: 'Film',
    items: [
      { title: 'خانه گل', date: '۱۴۰۳/۰۵/۰۱', gradient: 'from-pink-500/80 to-rose-700/80' },
      { title: 'کوک به کوک برای زندگی', date: '۱۴۰۳/۰۴/۰۱', gradient: 'from-violet-500/80 to-purple-700/80' },
      { title: 'آفرینش دست‌ها', date: '۱۴۰۳/۰۳/۰۱', gradient: 'from-amber-500/80 to-orange-700/80' },
    ],
  },
  {
    key: 'motion',
    label: 'موشن گرافی',
    icon: 'Sparkles',
    items: [
      { title: 'دو نیمه (جشن عاطفه‌ها)', date: '۱۴۰۳/۰۲/۰۱', gradient: 'from-teal-500/80 to-cyan-700/80' },
      { title: 'حامیان ایتام', date: '۱۴۰۳/۰۱/۰۱', gradient: 'from-emerald-500/80 to-green-700/80' },
      { title: 'نذر و نیاز', date: '۱۴۰۲/۱۲/۰۱', gradient: 'from-lime-500/80 to-green-700/80' },
    ],
  },
  {
    key: 'podcast',
    label: 'پادکست',
    icon: 'Mic',
    items: [
      { title: 'داستان‌نویسندگان مناطق کم‌برخوردار', date: '۱۴۰۳/۰۸/۲۶', gradient: 'from-slate-500/80 to-slate-700/80' },
      { title: 'شیرخوارگان حسینی (ع)', date: '۱۴۰۳/۰۳/۰۱', gradient: 'from-red-500/80 to-rose-800/80' },
    ],
  },
];

/* ---------------- Org structure ---------------- */

export const ORG_UNITS = [
  { title: 'معاونت توسعه مشارکت‌های مردمی', icon: 'HandHeart', desc: 'جذب و مدیریت مشارکت نیکوکاران و مراکز نیکوکاری' },
  { title: 'معاونت حمایت و سلامت خانواده', icon: 'HeartPulse', desc: 'حمایت‌های معیشتی، سلامت و خدمات خانواده' },
  { title: 'معاونت امور فرهنگی', icon: 'BookOpen', desc: 'خدمات فرهنگی، اجتماعی و ترویج سنت‌های حسنه' },
  { title: 'معاونت برنامه‌ریزی و بودجه', icon: 'ClipboardList', desc: 'برنامه‌ریزی، بودجه‌ریزی و پایش عملکرد' },
  { title: 'معاونت اداری و مالی', icon: 'Wallet', desc: 'اداره منابع انسانی و مالی سازمان' },
  { title: 'معاونت حقوقی و مجلس', icon: 'Scale', desc: 'حمایت‌های حقوقی رایگان و امور قضایی' },
  { title: 'مرکز پایش فقر و شناسایی نیازمندان', icon: 'Radar', desc: 'کشف هدفمند نیازمندان با داده‌کاوی و هوش مصنوعی' },
  { title: 'مرکز توسعه فناوری اطلاعات و هوشمندسازی', icon: 'Cpu', desc: 'دیجیتال‌سازی خدمات و امنیت فضای تبادل اطلاعات' },
  { title: 'اداره کل تامین مسکن و امور مهندسی', icon: 'Building', desc: 'نهضت تهیه، احداث و تعمیر مسکن مددجویان' },
  { title: 'اداره کل هماهنگی امور بین‌الملل', icon: 'Globe2', desc: 'کمک‌های بشردوستانه بین‌المللی' },
  { title: 'صندوق قرض‌الحسنه امداد ولایت', icon: 'Landmark', desc: 'وام‌های قرض‌الحسنه ازدواج و ضروری' },
];

/* ---------------- FAQ ---------------- */

export const FAQ_ITEMS = [
  {
    q: 'خدمت خرید مسکن به چه کسانی داده می‌شود؟',
    a: 'مددجویان فاقد مسکن که استحقاق و اولویت آن‌ها مورد تایید واحد حمایت قرار گرفته باشد، پس از ثبت درخواست در سیستم و تایید واحد حمایت، از طریق واحد مسکن و با توجه به بودجه کمیته امداد بررسی و در دستور کار قرار می‌گیرند.',
  },
  {
    q: 'آیا به افراد مستاجر خدمت تعمیر یا احداث فضای جانبی داده می‌شود؟',
    a: 'خدمات مسکن کمیته امداد ویژه مددجویان مالک است. برای بررسی شرایط خود می‌توانید به صورت حضوری به نزدیک‌ترین دفتر کمیته امداد مراجعه کرده و توسط مددکار مربوطه اقدام کنید.',
  },
  {
    q: 'احداث آشپزخانه، حمام و سرویس بهداشتی جزو کدام خدمات است؟',
    a: 'موارد ذکرشده جزء خدمات احداث فضای جانبی است که زیرمجموعه کمک به احداث و تکمیل مسکن محسوب می‌شود.',
  },
  {
    q: 'چگونه می‌توانم حامی یک کودک یتیم شوم؟',
    a: 'از طریق «میز خدمت الکترونیک» یا سامانه مشارکت الکترونیک، طرح اکرام را انتخاب و نوع حامی‌پذیری (کودک، خانواده یا سالمند) و استان را مشخص کنید. پس از معرفی حامی‌پذیر، مبلغ ماهانه از طریق درگاه پرداخت و گزارش عملکرد برایتان ارسال می‌شود.',
  },
  {
    q: 'آیا ترویج فرهنگ خیر و احسان جزء اساسنامه کمیته امداد است؟',
    a: 'بله، کمیته امداد امام خمینی (ره) در چارچوب ظرفیت‌های اساسنامه و سایر اسناد راهبردی، نسبت به تدوین و اجرای برنامه‌های معطوف به ترویج سنت‌های حسنه اسلامی اقدام می‌کند.',
  },
  {
    q: 'صدقه پرداختی من کجا هزینه می‌شود؟',
    a: 'صدقات بر اساس انتخاب شما در قالب‌های مختلف (عام، ازدواج، درمان، تحصیل، آزادی زندانیان) هزینه می‌شود و گزارش عملکرد در سامانه مشارکت الکترونیکی قابل مشاهده است.',
  },
  {
    q: 'مرکز تماس کمیته امداد چه شماره‌ای است؟',
    a: 'مرکز تماس جامع کمیته امداد امام خمینی (ره) شماره ۱۴۹۸ است که به صورت شبانه‌روزی پاسخگوی هموطنان عزیز می‌باشد.',
  },
  {
    q: 'چطور از دریافت خدمات الکترونیک مطمئن شوم و پیگیری کنم؟',
    a: 'پس از ثبت هر درخواست در میز خدمت، کد رهگیری دریافت می‌کنید که با آن می‌توانید وضعیت درخواست را در همان سامانه پیگیری کنید.',
  },
];

/* ---------------- Transparency data ---------------- */

export const TRANSPARENCY_BARS = [
  { label: 'حمایت و سلامت خانواده', value: 42, color: 'primary' },
  { label: 'توانمندسازی و اشتغال', value: 21, color: 'accent' },
  { label: 'مسکن و مهندسی', value: 14, color: 'chart3' },
  { label: 'امور فرهنگی و اجتماعی', value: 10, color: 'chart4' },
  { label: 'امور بین‌الملل و امداد', value: 8, color: 'chart2' },
  { label: 'اداری و اجرایی', value: 5, color: 'chart5' },
];

export const CONTACT_INFO = {
  address: 'تهران، میدان آزادی، ابتدای بزرگراه شهید لشگری، دفتر مرکزی کمیته امداد امام خمینی (ره)',
  postalCode: '۱۳۹۱۷۱۵۱۱۷',
  phone: '۱۴۹۸',
  email: 'info@emdad.ir',
};
