// Real KS Hospitality content. Image paths follow the on-disk folder structure
// under public/img — Vite serves /img/<Category>/<Property>/<file>.
//
// Folders with spaces are fine: browsers percent-encode automatically.

export const KS_DATA = {
  brand: {
    name: 'KS Hospitality Group',
    sub: 'EST. 2024',
    tagline: "We don't just build brands. We give them life.",
    headline: 'Unforgettable F&B and Hospitality Experiences',
  },

  contact: {
    email: 'info@kshospitalitygroup.com',
    careersEmail: 'careers@kshospitalitygroup.com',
    phone: '646-423-8278',
    instagram: 'https://www.instagram.com/kshospitalitygroup/',
  },

  mission: [
    'With decades of unmatched success in food, beverage and hospitality, KS Hospitality Group is more than a name. We are operators, builders and storytellers, dedicated to crafting unforgettable experiences.',
    'Our concepts blend authentic hospitality, quality driven product, and vibrant social spaces that redefine the neighborhoods they live in. We create restaurants, bars, hotels and event spaces that pulse with innovation.',
    'Menus are artistic creations. Cocktails are labors of love. Every interaction is meaningful.',
  ],
  missionShort:
    'Where passion meets profit, and dreams become destinations.',

  values: [
    { numeral: 'I.',  label: 'Menus',        line: 'Artistic creations, written by chefs.' },
    { numeral: 'II.', label: 'Cocktails',    line: 'Labors of love. Every glass, considered.' },
    { numeral: 'III.', label: 'Interactions', line: 'Every detail matters. Every guest, remembered.' },
  ],

  stats: [
    { k: 'Properties', v: '12' },
    { k: 'Regions',    v: '4'  },
    { k: 'Founded',    v: 'MMX' },
  ],

  // Hero — Stone & Soil cover
  heroImage: '/img/Lounges/Stone and Soil/1.jpg',
  heroLabel: 'Stone & Soil',

  // Properties — order here also drives the homepage layout
  // (index 0 = featured big card; 1–2 = stack to the right; 3–5 = row of three).
  properties: [
    // ROOFTOPS
    {
      id: 'elsie-rooftop',
      name: 'Elsie Rooftop',
      cat: 'Rooftop', catSlug: 'rooftops',
      loc: 'Midtown, NY',
      url: 'https://www.elsierooftop.com',
      img: '/img/Rooftops/Elsie Rooftop/1.jpg',
      logo: '/img/Rooftops/Elsie Rooftop/logo.png',
      kind: 'photo',
      featured: true,
      blurb:
        'Our flagship rooftop above Midtown. Candle-lit booths, a skyline that changes every twenty minutes.',
    },
    {
      id: 'rosehill-rooftop',
      name: 'Rosehill Rooftop',
      cat: 'Rooftop', catSlug: 'rooftops',
      loc: 'Flatiron, NY',
      url: 'http://www.rosehillrooftop.com',
      img: '/img/Rooftops/Rosehill Rooftop/1.jpg',
      logo: '/img/Rooftops/Rosehill Rooftop/logo.avif',
      kind: 'photo',
      blurb: 'Open-air lounge in the Flatiron District.',
    },

    // REAL ESTATE
    {
      id: 'watermark',
      name: 'The Watermark Hamptons',
      cat: 'Real Estate', catSlug: 'real-estate',
      loc: 'Southampton, NY',
      url: 'http://www.thewatermarkhamptons.com',
      img: '/img/Real-Estate/The Watermark Hamptons/1.png',
      logo: '/img/Real-Estate/The Watermark Hamptons/logo.png',
      kind: 'photo',
      blurb: 'Waterfront residence available on Airbnb & VRBO.',
    },
    {
      id: 'landmark',
      name: 'The Landmark Hamptons',
      cat: 'Real Estate', catSlug: 'real-estate',
      loc: 'East Hampton, NY',
      url: 'http://www.thelandmarkhamptons.com',
      img: '/img/Real-Estate/The Landmark Hamptons/1.jpg',
      logo: '/img/Real-Estate/The Landmark Hamptons/logo.png',
      kind: 'photo',
      blurb: 'Estate rental in East Hampton.',
    },
    {
      id: 'benchmark',
      name: 'The Benchmark Hamptons',
      cat: 'Real Estate', catSlug: 'real-estate',
      loc: 'Bridgehampton, NY',
      url: 'http://www.thebenchmarkhamptons.com',
      img: '/img/Real-Estate/The Benchmark Hamptons/1.jpg',
      logo: '/img/Real-Estate/The Benchmark Hamptons/logo.png',
      kind: 'photo',
      blurb: 'Bridgehampton residence.',
    },

    // LOUNGES
    {
      id: 'premiere-park-city',
      name: 'Premiere Park City',
      cat: 'Lounge', catSlug: 'lounges',
      loc: 'Park City, UT',
      url: 'http://www.premiereparkcity.com',
      img: '/img/Lounges/Premiere Park City/1.png',
      logo: '/img/Lounges/Premiere Park City/logo.png',
      kind: 'photo',
      blurb:
        'Vida Bar at our boutique mountain hotel. High-altitude cocktails after a day on the slopes.',
    },
    {
      id: 'elsie-penthouse',
      name: 'Elsie Penthouse',
      cat: 'Lounge', catSlug: 'lounges',
      loc: 'Midtown, NY',
      url: 'http://www.elsiepenthouse.com',
      img: '/img/Lounges/Elsie Penthouse/1.jpg',
      logo: '/img/Lounges/Elsie Penthouse/logo.png',
      kind: 'photo',
      blurb: 'Private penthouse for events and intimate gatherings.',
    },
    {
      id: 'brewr',
      name: 'Brewr',
      cat: 'Lounge', catSlug: 'lounges',
      loc: 'NY',
      url: '#',
      img: '/img/Lounges/Brewr/1.jpg',
      kind: 'photo',
      blurb: 'A KS Hospitality Group lounge concept.',
    },
    {
      id: 'skewr',
      name: 'Skewr',
      cat: 'Lounge', catSlug: 'lounges',
      loc: 'NY',
      url: '#',
      img: '/img/Lounges/Skewr/1.jpg',
      kind: 'photo',
      blurb: 'A KS Hospitality Group lounge concept.',
    },
    {
      id: 'stone-and-soil',
      name: 'Stone & Soil',
      cat: 'Lounge', catSlug: 'lounges',
      loc: 'NY',
      url: '#',
      img: '/img/Lounges/Stone and Soil/1.jpg',
      kind: 'photo',
      blurb: 'A KS Hospitality Group lounge concept.',
    },

    // HOTELS
    {
      id: 'lic-manhattan-view',
      name: 'LIC Manhattan View Hotel',
      cat: 'Hotel', catSlug: 'hotels',
      loc: 'Long Island City, NY',
      url: '#',
      img: '/img/Hotels/LIC Manhattan View Hotel/1.png',
      kind: 'photo',
      blurb: 'Long Island City hotel with skyline views across the East River.',
    },
    {
      id: 'ramada',
      name: 'Ramada by Wyndham',
      cat: 'Hotel', catSlug: 'hotels',
      loc: 'Lewiston, ME',
      url: '#',
      img: '/img/Hotels/Ramada Lewiston Maine/1.jpg',
      kind: 'photo',
      blurb: 'Wyndham flag in Lewiston, Maine.',
    },
  ],

  categories: [
    { name: 'Rooftops',    slug: 'rooftops',    img: '/img/Rooftops/Elsie Rooftop/1.jpg',           blurb: 'Open-air bars built for the long evening.' },
    { name: 'Lounges',     slug: 'lounges',     img: '/img/Lounges/Skewr/1.jpg',                    blurb: 'Restaurants and lounges concepted, built and operated by KS.' },
    { name: 'Real Estate', slug: 'real-estate', img: '/img/Real-Estate/The Watermark Hamptons/1.png', blurb: 'Fully-staffed Hamptons residences on Airbnb & VRBO.' },
    { name: 'Hotels',      slug: 'hotels',      img: '/img/Hotels/Ramada Lewiston Maine/1.jpg',     blurb: 'Boutique to flag. Operated, never franchised.' },
  ],

  team: [
    {
      name: 'Kanvar Singh',
      role: 'Founder & CEO',
      img: '/img/Team/team-kanvar.png',
      bio: 'Kanvar Singh is the founder and CEO of KS Hospitality Group, a hospitality executive and investor known for enhancing guest experiences and driving profitability. With extensive experience leading hotels across the U.S. and Belgium in F&B and hotel operations, Kanvar has established a remarkable track record.',
    },
    {
      name: 'Maggie Zwolak',
      role: 'Partner / Director of Events',
      img: '/img/Team/team-maggie.png',
      bio: "An accomplished operator and strategic coordinator, seamlessly bridging front and back-of-house operations. Maggie's deep expertise in hospitality, coupled with her extensive network, enables her to meet diverse needs with precision, whether planned or last-minute.",
    },
    {
      name: 'Gabriel Solano',
      role: 'VP of F&B Operations',
      img: '/img/Team/team-gabriel.png',
      bio: 'Two decades in luxury hospitality and bespoke anticipatory service. Gabriel began with F&B operations at boutique and five-star hotels including The Mercer and Mandarin Oriental in NY, learning from Michelin-starred chefs like Jean-Georges and restaurateurs like Stephen Starr.',
    },
    {
      name: 'Steve Martinek',
      role: 'Creative Director',
      img: '/img/Team/team-steve.png',
      bio: 'A high-energy creative powerhouse with over twenty years in hospitality. Owns a successful social media marketing agency that has developed standout concepts for luxury hotels, rooftops, and restaurants. Known for innovative, out-of-the-box thinking.',
    },
    {
      name: 'Pankaj Chauhan',
      role: 'CFO',
      img: '/img/Team/team-pankaj.jpg',
      bio: 'Specializes in end-to-end financial operations for the restaurant industry, with over fifteen years of experience spanning Michelin-starred restaurants to cozy cafés. Deep expertise in accounting, payroll, financial reporting, and operational controls.',
    },
    {
      name: 'Sajud Hamza',
      role: 'CTO · Digital Presence',
      img: '/img/Team/team-sajud.jpg',
      bio: 'An expert in Google and SEO strategy, Sajud identifies opportunities to maximize reach and audience engagement for hospitality venues. Deep technical expertise ensures businesses optimize their digital presence for maximum visibility.',
    },
  ],
}
