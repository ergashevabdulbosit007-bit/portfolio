// ============================================================
//  ABDULBOSIT.EXE — SHAXSIY MA'LUMOTLAR (faqat shu faylni tahrirlang)
//  Bo'sh qoldirilgan havola ("") sayt'da avtomatik yashiriladi.
// ============================================================

export const config = {
  name: 'Abdulbosit',
  brand: 'ABDULBOSIT.EXE',
  status: 'DEVELOPER IN PROGRESS',
  available: { show: true, text: 'Yangi loyihalar uchun ochiqman' },
  headline: 'Building ideas into digital experiences.',
  tagline:
    "O'rganaman, quraman, tajriba qilaman va g'oyalarni amaliy dasturlarga aylantiraman.",
  preferences: { theme: 'dark', sound: false, intro: true },

  links: {
    email: '', // masalan: 'you@example.com'
    github: 'https://github.com/ergashevabdulbosit007-bit', // GitHub profilim
    telegram: '', // masalan: 'https://t.me/username'
    linkedin: 'https://www.linkedin.com/in/abdulbosit-ergashev-858196447/',
  },

  about: {
    who: "Men Abdulbosit — dasturchi va texnologiya ishqibozi.",
    learning: 'JavaScript, Node.js, Express va MongoDB bilan to‘liq stek ilovalar qurishni o‘rganyapman.',
    why: "Dasturlashni g'oyani ishlaydigan narsaga aylantira olgani uchun yaxshi ko'raman.",
    problems: "Ta'lim, til o'rganish va kundalik jarayonlarni avtomatlashtirish bilan bog'liq muammolar menga qiziq.",
    direction: "Hozirgi yo'nalishim: ishonchli backend va toza frontendni birlashtirish.",
    next: "Keyingi maqsad: ko'proq loyihani oxirigacha yetkazib, ochiq e'lon qilish.",
  },

  // Faqat o'zingiz tasdiqlagan yutuqlar. show:false bo'lsa sayt'da ko'rinmaydi.
  achievements: [
    {
      id: 'ielts',
      show: true,
      featured: true,
      title: 'IELTS',
      value: 8.5,
      max: 9,
      decimals: 1,
      label: 'Overall Band Score',
      description:
        "Ingliz tili bo'yicha xalqaro IELTS imtihonida 8.5 umumiy ball. Bu texnik hujjatlar, global jamoalar va ochiq manba bilan erkin ishlash imkonini beradi.",
      category: 'Til',
      year: '', // masalan: '2025'
    },
    {
      id: 'placeholder-1',
      show: false,
      title: 'Yutuq nomi',
      value: 0,
      label: 'Qisqa belgi',
      description: 'Haqiqiy yutuqni shu yerga yozing va show: true qiling.',
      category: 'Boshqa',
      year: '',
    },
    {
      id: 'placeholder-2',
      show: false,
      title: 'Yana bir yutuq',
      value: 0,
      label: 'Qisqa belgi',
      description: 'Sertifikat, olimpiada, grant yoki g‘alaba — faqat haqiqiylari.',
      category: 'Boshqa',
      year: '',
    },
  ],

  // level: 'learning' | 'comfortable' | 'used'
  skills: [
    {
      group: 'Tillar',
      items: [{ name: 'JavaScript', level: 'used' }],
    },
    {
      group: 'Backend',
      items: [
        { name: 'Node.js', level: 'used' },
        { name: 'Express', level: 'used' },
      ],
    },
    {
      group: 'Ma’lumotlar bazasi',
      items: [{ name: 'MongoDB', level: 'used' }],
    },
    {
      group: 'Qiziqishlar',
      items: [
        { name: 'AI mahsulotlari', level: 'learning' },
        { name: 'Dasturiy arxitektura', level: 'learning' },
      ],
    },
  ],
  skillLevels: {
    learning: 'Learning',
    comfortable: 'Comfortable',
    used: 'Used in projects',
  },

  // status: 'In Progress' | 'Prototype' | 'Learning Project' | 'Completed'
  projects: [
    {
      id: 'skillup-ai',
      title: 'SkillUp AI',
      featured: true,
      status: 'In Progress',
      description: "AI yordamida ingliz tili va IELTS tayyorgarligi uchun platforma g'oyasi.",
      details:
        "Maqsad: foydalanuvchiga shaxsiy mashqlar va fikr-mulohaza beradigan o'quv platformasi. Loyiha hali ishlab chiqilmoqda.",
      stack: ['JavaScript', 'Node.js', 'Express', 'MongoDB'],
      github: '',
      demo: '',
    },
    {
      id: 'library-api',
      title: 'Library API',
      status: 'Learning Project',
      description: "Kutubxona uchun REST API — Node.js, Express va MongoDB bilan o'quv loyiha.",
      details: "CRUD amallar, validatsiya va xatolarni qayta ishlashni mashq qilish uchun qurilgan.",
      stack: ['Node.js', 'Express', 'MongoDB'],
      github: '',
      demo: '',
    },
    {
      id: 'telegram-delivery',
      title: 'Telegram Delivery Bot',
      status: 'Prototype',
      description: "Yetkazib berishni Telegram orqali avtomatlashtirish bo'yicha eksperimental konsept.",
      details: "Bu hali tayyor mahsulot emas — g'oya va dastlabki prototip bosqichida.",
      stack: ['JavaScript', 'Node.js'],
      github: '',
      demo: '',
    },
    {
      id: 'alezoz-website',
      title: 'Alezoz.uz',
      featured: true,
      status: 'Completed',
      description: 'Alezoz.uz veb-sayti — tashrif buyurib, jonli loyihani ko‘ring.',
      details: 'Jonli veb-sayt. Saytni yangi oynada ochish uchun Live website havolasidan foydalaning.',
      stack: ['Website', 'Live Project'],
      github: '',
      demo: 'https://www.alezoz.uz',
    },
    {
      id: 'linkedin-profile',
      title: 'LinkedIn Profile',
      status: 'Completed',
      description: 'LinkedIn profilim — professional tarmoq va faoliyatim bilan tanishing.',
      details: 'Professional profilni ko‘rish uchun LinkedIn havolasini oching.',
      stack: ['LinkedIn', 'Professional Network'],
      github: '',
      demo: 'https://www.linkedin.com/in/abdulbosit-ergashev-858196447/',
    },
  ],

  // Sanalarni o'zingiz to'ldiring; bo'sh qolsa "Sana kiritilmagan" deb ko'rinmaydi.
  journey: [
    { period: '', title: 'JavaScript asoslari', status: 'In Progress', category: 'JavaScript', description: "O'zgaruvchilar, funksiyalar, DOM va asinxron kod bilan tanishuv." },
    { period: '', title: 'Node.js va Express', status: 'In Progress', category: 'Backend', description: 'Server, routing va middleware bilan ishlash.' },
    { period: '', title: 'MongoDB va API', status: 'In Progress', category: 'Database', description: "Ma'lumotlar bazasi bilan ishlaydigan REST API qurish." },
    { period: '', title: 'IELTS 8.5', status: 'Completed', category: 'English', description: "Ingliz tili bo'yicha yuqori natijaga erishish." },
    { period: '', title: 'SkillUp AI', status: 'In Progress', category: 'Project', description: 'AI asosidagi o‘quv platformasi ustida ishlash.' },
  ],

  goals: [
    'Dasturlash asoslarini mustahkamlash',
    "Ishonchli to'liq stek ilovalar qurish",
    'Dasturiy arxitektura bo‘yicha bilimni oshirish',
    'Amaliy AI mahsulotlarini yaratish',
    "Texnologiya sohasida ingliz tilini yanada rivojlantirish",
    "Ko'proq loyihani tugallab e'lon qilish",
  ],
};
