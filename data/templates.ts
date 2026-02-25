
import { Template, ProfileType } from '../types';

export const listTemplates: Record<ProfileType, Template[]> = {
  personal: [
    {
      title: 'شب یلدا 🍉',
      description: 'ایده‌های جذاب برای طولانی‌ترین شب سال.',
      icon: '🕯️',
      privacy: 'friends',
      themeColor: 'from-red-700 to-rose-900',
      coverImage: 'https://images.unsplash.com/photo-1576759752327-16447c293777?w=800&q=80',
      items: [
        { name: 'پک آجیل چهار مغز اعلاء', description: 'یک کیلوگرم، بسته‌بندی کادویی', link: '', isGroupGift: false, price: 1500000 },
        { name: 'دیوان حافظ نفیس', description: 'جلد چرمی با قاب کشویی', link: '', isGroupGift: false, price: 950000 },
        { name: 'باکس انار و گل نرگس', description: 'طراحی ویژه یلدا', link: '', isGroupGift: false, price: 700000 },
      ]
    },
    {
      title: 'عید نوروز (عیدی) 🌸',
      description: 'لیست آرزوها برای سال نو و بهار.',
      icon: '🐠',
      privacy: 'friends',
      themeColor: 'from-emerald-500 to-green-700',
      coverImage: 'https://images.unsplash.com/photo-1615967064372-b7e42994943f?w=800&q=80',
      items: [
        { name: 'ست ظروف هفت‌سین سفالی', description: 'دست‌ساز با لعاب فیروزه‌ای', link: '', isGroupGift: false, price: 1800000 },
        { name: 'سررسید و پلنر ۱۴۰۴', description: 'جلد چرمی، کاغذ کرم', link: '', isGroupGift: false, price: 450000 },
      ]
    }
  ],
  charity: [
    {
        title: 'تامین جهیزیه نوعروسان 💍',
        description: 'کمک به تشکیل زندگی زوج‌های جوان با تهیه کالاهای اساسی منزل.',
        icon: '🏠',
        privacy: 'public',
        themeColor: 'from-rose-500 to-pink-600',
        coverImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80',
        items: [
          { name: 'یخچال و فریزر ایرانی', description: 'برند معتبر داخلی با گارانتی', price: 18000000, link: '', isGroupGift: true, imageUrl: 'https://images.unsplash.com/photo-1571175439180-dd0415a77038?w=400' },
          { name: 'ماشین لباسشویی ۷ کیلویی', description: 'تمام اتوماتیک کادویی', price: 14500000, link: '', isGroupGift: true, imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400' },
          { name: 'اجاق گاز ۵ شعله طرح فر', description: 'استاندارد و ایمن', price: 6800000, link: '', isGroupGift: true, imageUrl: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=400' },
          { name: 'سرویس قابلمه ۱۰ پارچه', description: 'گرانیتی نچسب', price: 2500000, link: '', isGroupGift: true, imageUrl: 'https://images.unsplash.com/photo-1584990344319-33dd39c863b2?w=400' },
          { name: 'فرش ماشینی ۱۲ متری', description: '۷۰۰ شانه تراکم ۲۵۵۰', price: 8500000, link: '', isGroupGift: true, imageUrl: 'https://images.unsplash.com/photo-1534889156217-d3c8ed48ca44?w=400' }
        ]
    },
    {
        title: 'بسته ارزاق ماهانه (طرح اطعام) 🥫',
        description: 'تامین اقلام ضروری معیشتی برای خانواده‌های تحت پوشش.',
        icon: '📦',
        privacy: 'public',
        themeColor: 'from-amber-500 to-orange-600',
        coverImage: 'https://images.unsplash.com/photo-1594966124151-503b79bc91bc?w=1200&q=80',
        items: [
          { name: 'برنج هاشمی (۱۰ کیلوگرم)', description: 'درجه یک معطر', price: 1100000, link: '', isGroupGift: true, imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
          { name: 'گوشت گوسفندی (۲ کیلوگرم)', description: 'تازه و کشتار روز', price: 1300000, link: '', isGroupGift: true, imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400' },
          { name: 'روغن پخت و پز (۳ عدد)', description: '۱.۸ لیتری آفتابگردان', price: 360000, link: '', isGroupGift: true, imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400' },
          { name: 'حبوبات (ست کامل ۴ عددی)', description: 'عدس، لپه، نخود، لوبیا', price: 450000, link: '', isGroupGift: true, imageUrl: 'https://images.unsplash.com/photo-1515942400420-2b98fed1f515?w=400' }
        ]
    },
    {
        title: 'هزینه‌های درمان و دارو 💊',
        description: 'حمایت مالی از بیماران نیازمند جهت تهیه داروهای خاص و هزینه‌های جراحی.',
        icon: '🏥',
        privacy: 'public',
        themeColor: 'from-blue-500 to-cyan-600',
        coverImage: 'https://images.unsplash.com/photo-1505751172107-573225a91200?w=1200&q=80',
        items: [
          { name: 'هزینه نسخه داروهای خاص', description: 'کمک هزینه ماهانه دارو', price: 5000000, link: '', isGroupGift: true, imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400' },
          { name: 'ویزیت پزشک متخصص', description: 'تامین هزینه مراجعات دوره‌ای', price: 500000, link: '', isGroupGift: true, imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400' },
          { name: 'خدمات فیزیوتراپی (۱۰ جلسه)', description: 'برای توانبخشی معلولین', price: 4000000, link: '', isGroupGift: true, imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400' }
        ]
    },
    {
        title: 'آزادی زندانیان غیرعمد ⛓️',
        description: 'جمع‌آوری مبالغ دیه و جرایم مالی برای بازگشت پدران به آغوش خانواده.',
        icon: '🕊️',
        privacy: 'public',
        themeColor: 'from-slate-600 to-slate-800',
        coverImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80',
        items: [
          { name: 'کمک هزینه آزادسازی', description: 'سهم شما در آزادی یک انسان', price: 10000000, link: '', isGroupGift: true, imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400' }
        ]
    },
    {
        title: 'کیف مهربانی (مهر تحصیلی) 📚',
        description: 'تامین کوله‌پشتی و لوازم‌تحریر کامل برای دانش‌آموزان مناطق محروم.',
        icon: '🎒',
        privacy: 'public',
        themeColor: 'from-indigo-600 to-violet-700',
        coverImage: 'https://images.unsplash.com/photo-1459356979461-dae1b8dcb702?w=1200&q=80',
        items: [
          { name: 'کوله‌پشتی جادار', description: 'طرح‌های متنوع و باکیفیت', price: 650000, link: '', isGroupGift: true, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
          { name: 'پک کامل نوشت‌افزار', description: 'دفتر، مداد، خودکار، جامدادی', price: 450000, link: '', isGroupGift: true, imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400' },
          { name: 'کفش ورزشی مدرسه', description: 'سایزبندی متنوع', price: 800000, link: '', isGroupGift: true, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' }
        ]
    }
  ],
  organizational: [
      {
          title: 'پکیج نوروزی پرسنل 🌱',
          description: 'هدایای سازمانی برای عید نوروز.',
          icon: '🎁',
          privacy: 'private',
          themeColor: 'from-green-600 to-teal-700',
          coverImage: 'https://images.unsplash.com/photo-1516961642265-531546e84af2?w=800&q=80',
          items: [
              { name: 'آجیل خوری مس و پرداز', description: 'صنایع دستی نفیس اصفهان', link: '', isGroupGift: false, price: 2500000 },
          ]
      }
  ],
  'all-for-one': [],
  'group-trip': [],
  merchant: []
};
