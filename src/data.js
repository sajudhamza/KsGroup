// Real KS Hospitality content. Image paths follow the on-disk folder structure
// under public/img — Vite serves /img/<Category>/<Property>/<file>.
//
// Folders with spaces are fine: browsers percent-encode automatically.

export const KS_DATA = {
  brand: {
    name: 'KS Hospitality Group',
    sub: 'EST. 2024',
    tagline: "The team behind NYC's favorite venues.",
    headline: 'Unforgettable F&B and Hospitality Experiences',
  },

  contact: {
    email: 'info@kshospitalitygroup.com',
    careersEmail: 'careers@kshospitalitygroup.com',
    phone: '646-423-8278',
    instagram: 'https://www.instagram.com/kshospitalitygroup/',
  },

  about: [
    'KS Hospitality Group is the team behind some of NYC\'s favorite venues. A tight-knit group of hospitality veterans, we bring deep expertise across hotels, restaurants, and bars. We move fast, think ahead, and deliver the kind of results that keep clients coming back.',
  ],

  mission: [
    'KS Hospitality Group brings together everything a property needs under one roof — operations, marketing, events, and strategy. Our centralized team means faster decisions, tighter execution, and no gaps between departments.',
    'We combine deep hospitality expertise with in-house marketing, a robust events team, and national partnerships to create experiences that guests remember and owners celebrate. And because we stay ahead of trends — from emerging social platforms to evolving guest expectations — we don\'t just manage properties. We grow them.',
  ],
  missionShort:
    'Join us in turning every venue, every dish, and every moment into something extraordinary.',

  strengths: [
    {
      numeral: 'I.',
      label: 'Operations',
      line: 'Deep hospitality expertise under one roof — faster decisions, tighter execution, no gaps between departments.',
    },
    {
      numeral: 'II.',
      label: 'Marketing',
      line: 'In-house creative and digital teams that build brands, drive demand, and stay ahead of every platform.',
    },
    {
      numeral: 'III.',
      label: 'Events & Strategy',
      line: 'A robust events team and national partnerships that create experiences guests remember and owners celebrate.',
    },
  ],

  network: [
    { label: '60,000-Person Mailing List', line: 'A highly engaged subscriber base built over years of consistent, quality programming.' },
    { label: 'Corporate Client Network', line: 'Deep, long-standing relationships with top-tier corporate clients across industries.' },
    { label: 'Influencer & Tastemaker Roster', line: 'A curated network of high-impact creators and cultural voices that move trends.' },
    { label: 'Brand Partnerships', line: 'Active collaborations with industry-leading brands ready to activate.' },
    { label: 'Planners, Bookers & Promoters', line: 'A trusted pipeline of industry operators who consistently drive premium business.' },
  ],
  networkTagline: "We don't just open doors. We make introductions that last.",

  values: [
    { numeral: 'I.',  label: 'Food',        line: 'A great menu is more than a list of dishes — it\'s a statement of intent.' },
    { numeral: 'II.', label: 'Beverage',    line: 'Every beverage menu is tailored to the venue, the crowd, and what works behind the bar.' },
    { numeral: 'III.', label: 'Experience', line: 'Every menu we touch is designed to delight guests and deliver results for operators.' },
  ],

  quote: {
    text: 'A good hotel must maintain a high level of consistency. If a guest returns because he enjoyed his previous stay, we need to make sure that his subsequent stay is just as extraordinary. It really boils down to how you make people feel.',
    author: 'Kanvar Singh',
    role: 'Founder & CEO',
  },

  stats: [
    { k: 'Properties', v: '13' },
    { k: 'Regions',    v: '4'  },
    { k: 'Founded',    v: '2024' },
  ],

  // Hero — Stone & Soil cover
  heroImage: '/img/Lounges/Stone and Soil/1.jpg',
  heroLabel: 'Stone & Soil',

  // Properties — order matches the May 2026 deck (Our Venues).
  // Homepage layout: index 0 = featured big card; 1–2 = stack to the right; 3–5 = row of three.
  properties: [
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
        'A lavish twenty-fifth floor rooftop blending Gilded Age glamour with modern sophistication — and one of the city\'s most sought-after destinations for elevated nightlife.',
      description: [
        'Opened in Summer 2018, Elsie Rooftop is a lavish twenty-fifth floor rooftop and event space that blends Gilded Age glamour with modern sophistication. With a 5,500-square-foot layout featuring a 360-degree wraparound terrace and retractable roof, Elsie offers breathtaking views of the New York City skyline in every season.',
        'A bold marketing and social media strategy has built a fiercely loyal following, a high-converting sales funnel, and a reputation as one of the city\'s most sought-after destinations for elevated nightlife and exclusive events.',
      ],
      press: 'Featured in The New York Times, Forbes, Page Six, Time Out New York, Eater NY, Thrillist, Travel + Leisure, Gotham Magazine, Fox 5 NY, and the New York Post.',
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
      blurb:
        'Our most exclusive offering — a private event space for buyouts, designed for those who expect the extraordinary.',
      description: [
        'Located within Elsie Rooftop in the heart of Midtown Manhattan, Elsie Penthouse is our most exclusive offering — opened in Summer 2024, this private event space is available exclusively for buyouts and private events, designed for those who expect the extraordinary.',
        'Intimate yet grand, the Penthouse features floor-to-ceiling windows, sweeping views of the New York City skyline, and a refined aesthetic that blends Gilded Age elegance with modern luxury. Whether for a corporate dinner, a private celebration, or a full venue buyout, the space transforms effortlessly to match your vision.',
        'With dedicated white-glove event coordination, custom menus, and complete privacy from the main venue, Elsie Penthouse delivers an experience that is entirely your own. This is Midtown Manhattan at its most elevated — in every sense of the word.',
      ],
    },
    {
      id: 'stone-and-soil',
      name: 'Stone & Soil',
      cat: 'Lounge', catSlug: 'lounges',
      loc: 'Rose Hill, NY',
      url: '#',
      img: '/img/Lounges/Stone and Soil/1.jpg',
      kind: 'photo',
      blurb:
        'A refined Japanese cocktail bar guided by omotenashi — precision, restraint, and sustainability in every glass.',
      description: [
        'Stone & Soil is a refined Japanese cocktail bar tucked inside NoMad\'s Park South Hotel, from KS Hospitality Group\'s Kanvar Singh alongside Jimmy Rizvi and beverage directors Hirotomo Akutsu and Rio Azmee. Guided by omotenashi — the Japanese philosophy of wholehearted hospitality — the bar delivers an experience rooted in precision, restraint, and sustainability.',
        'The intimate Japandi-designed space features recycled wood and leather, hand-applied finishes, and sculptural clay installations, with hand-carved ice sourced daily to fit custom Japanese glassware. The tightly curated cocktail menu leans on fermentation, infusion, and zero-waste technique, with many drinks taking days to prepare — complemented by elevated small bites that match the same philosophy.',
      ],
      press: 'Featured in Eater NY, Time Out New York, and The New York Times.',
    },
    {
      id: 'rosehill-rooftop',
      name: 'Rosehill Rooftop',
      cat: 'Rooftop', catSlug: 'rooftops',
      loc: 'Rose Hill, NY',
      url: 'http://www.rosehillrooftop.com',
      img: '/img/Rooftops/Rosehill Rooftop/1.jpg',
      logo: '/img/Rooftops/Rosehill Rooftop/logo.avif',
      kind: 'photo',
      blurb:
        'Skyline views, cozy corners, and craft cocktails made for golden hour — your rooftop, whatever the occasion.',
      description: [
        'In mid-century New York, the real magic didn\'t happen in penthouses — it happened on the rooftops. Neighbors turned tar and brick into their own secret escape, catching their breath between the hustle of city life.',
        'Rosehill Rooftop was born from that spirit. Skyline views, cozy corners, craft cocktails made for golden hour, and a menu of upscale bites worth lingering over — this is your rooftop, whatever the occasion.',
        'One of four KS Hospitality Group venues at the Hyatt Hotel at Park South, Rosehill has quickly become one of Rose Hill\'s most talked-about outdoor destinations.',
      ],
      press: 'Featured in Time Out New York, Eater NY, The Infatuation, Cititour, and The Rooftop Guide among the top rooftop bars in NYC.',
    },
    {
      id: 'skewr',
      name: 'Skewr',
      cat: 'Lounge', catSlug: 'lounges',
      loc: 'Rose Hill, NY',
      url: '#',
      img: '/img/Lounges/Skewr/1.jpg',
      kind: 'photo',
      blurb:
        'A wood-fired Mediterranean table built for sharing — skewers kissed by open flame in NoMad.',
      description: [
        'Long before restaurants had mood lighting and reservation waitlists, there was fire. A flame, a skewer, and something worth gathering around. It\'s the oldest form of hospitality — and somehow, the most forgotten.',
        'Skewr brings it back. Tucked into NoMad at 127 East 27th Street, this wood-fired Mediterranean table is built for sharing — ethically sourced ingredients, bold mezze, and skewers kissed by open flame. The New York Times said it best: it conjures coastal Italy. We\'d say it conjures something even older than that.',
        'From flame-roasted dips and freshly baked pita to seasonal vegetables and impeccably sourced meats, every dish at Skewr is an invitation to slow down, share, and stay a while. One of four KS Hospitality Group venues at the Hyatt Hotel at Park South.',
      ],
      press: 'Featured in Forbes, Time Out New York, and The Infatuation since opening in February 2026.',
    },
    {
      id: 'brewr',
      name: 'Brewr',
      cat: 'Lounge', catSlug: 'lounges',
      loc: 'Rose Hill, NY',
      url: '#',
      img: '/img/Lounges/Brewr/1.jpg',
      kind: 'photo',
      blurb:
        'By day, a bright café. By night, a warm bar-lounge where espresso martinis take center stage.',
      description: [
        'Some places can\'t make up their mind. Brewr doesn\'t have to. By day, it\'s a bright, unhurried café — handcrafted coffee, fresh pastries, and the kind of easy atmosphere that makes an hour feel like five minutes. By night, the lights dim, the energy shifts, and Brewr becomes something else entirely: a warm, low-lit bar-lounge where espresso martinis and coffee-inspired cocktails take center stage.',
        'Located at 127 East 27th Street in NoMad, Brewr is a neighborhood gathering place that refuses to be just one thing — because the best spots in New York never are. One of four KS Hospitality Group venues at the Hyatt Hotel at Park South.',
      ],
    },
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
        'A 5,000-square-foot lounge born from the energy and glamour of the Sundance Film Festival.',
      description: [
        'Premiere Park City is a 5,000-square-foot lounge born from the energy and glamour of the Sundance Film Festival — a space where sophistication, great food, and unforgettable moments come together in the heart of Park City, Utah. Intimate yet expansive, it was designed for the kind of events that people talk about long after they end.',
        'Created by Kanvar Singh and Lisa Barlow — entrepreneur and star of The Real Housewives of Salt Lake City — Premiere Park City is a reflection of their shared vision: a venue where every detail is intentional, every guest feels like a VIP, and every occasion becomes a memory.',
        'KS Hospitality Group has served as the management company for Premiere Park City since inception, bringing the same operational excellence and hospitality-forward approach that defines every property in the portfolio.',
      ],
      press: 'Covered by Fox 13, TownLift, and the Park Record since opening in July 2024.',
    },
    {
      id: 'casa-cece',
      name: 'Casa CeCe',
      cat: 'Lounge', catSlug: 'lounges',
      loc: 'Midtown, NY',
      url: '#',
      img: '/img/Lounges/Casa CeCe/1.jpg',
      kind: 'photo',
      blurb:
        'Midtown\'s premier supper club — where fine dining, immersive performance, and late-night nightlife converge.',
      description: [
        'Casa CeCe is Midtown Manhattan\'s premier supper club experience, where fine dining, immersive performance, and late-night nightlife converge. The 4,500-square-foot, two-level space features a glowing curved bar, plush velvet banquettes, mirrored finishes, and aerial-ready ceilings — all designed to shift seamlessly from dinner to show to after-party.',
        'At the heart of the experience is Diamond Moon, an avant-garde cabaret production featuring live aerial artists and performance art. A curated cocktail program and shareable bites round out an evening that\'s equal parts restaurant, theater, and nightclub — open until 4 AM on weekends.',
        'KS Hospitality Group serves as both investor and management company for Casa CeCe, bringing the same operational excellence and hospitality-forward approach that defines every property in the portfolio.',
      ],
      press: 'Featured in amNewYork, Downtown Magazine, The Knockturnal, Spoiled NYC, and Cititour since opening in November 2025.',
    },
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
    {
      id: 'ramada',
      name: 'Clarion Lewiston Maine',
      cat: 'Hotel', catSlug: 'hotels',
      loc: 'Lewiston, ME',
      url: '#',
      img: '/img/Hotels/Clarion Lewiston Maine/1.jpg',
      kind: 'photo',
      blurb: 'A fully reimagined 117-room property with conference center — opening Summer 2026.',
      description: [
        'The Clarion Lewiston Hotel & Conference Center has undergone extensive renovations, emerging as a fully reimagined 117-room property with a full-service convention center in the heart of Lewiston, Maine.',
        'The Maine Grill is the flagship food and beverage venue within the property — currently in development and set to become the premier dining destination in the region.',
        'KS Hospitality Group serves as both investor and management company for the hotel and all food and beverage venues on property. The Clarion Lewiston is poised for its grand opening at the end of May 2026.',
      ],
    },
    {
      id: 'lic-manhattan-view',
      name: 'LIC Manhattan View Hotel',
      cat: 'Hotel', catSlug: 'hotels',
      loc: 'Long Island City, NY',
      url: '#',
      img: '/img/Hotels/LIC Manhattan View Hotel/1.png',
      kind: 'photo',
      blurb: 'A strategically located LIC hotel — 15 minutes from Midtown by subway.',
      description: [
        'LIC Manhattan View Hotel is located in Long Island City, just a 15-minute subway ride from Midtown Manhattan, with easy access to Rockefeller Center and Central Park. LaGuardia Airport is a 10-minute drive away, and the 39th Ave Subway Station is one block from the hotel.',
        'Guest rooms feature a 32-inch flat-screen TV, complimentary Wi-Fi, a mini-fridge, and a hair dryer. An on-site restaurant and lounge are currently undergoing renovations.',
        'KS Hospitality Group will serve as both investor and management company for the LIC Manhattan View Hotel, bringing its full operational and hospitality expertise to one of LIC\'s most strategically located properties.',
      ],
    },
  ],

  categories: [
    { name: 'Rooftops',    slug: 'rooftops',    img: '/img/Rooftops/Elsie Rooftop/1.jpg',           blurb: 'Open-air bars built for the long evening — from Midtown skylines to NoMad terraces.' },
    { name: 'Lounges',     slug: 'lounges',     img: '/img/Lounges/Stone and Soil/1.jpg',           blurb: 'Restaurants, cocktail bars, and supper clubs concepted, built and operated by KS.' },
    { name: 'Real Estate', slug: 'real-estate', img: '/img/Real-Estate/The Watermark Hamptons/1.png', blurb: 'Fully-staffed Hamptons residences on Airbnb & VRBO.' },
    { name: 'Hotels',      slug: 'hotels',      img: '/img/Hotels/Clarion Lewiston Maine/1.jpg',     blurb: 'Boutique to flag. Operated, never franchised.' },
  ],

  team: [
    {
      name: 'Kanvar Singh',
      role: 'Founder & CEO',
      img: '/img/Team/team-kanvar.png',
      bio: 'Kanvar Singh is the founder and CEO of KS Hospitality Group — a hospitality executive and investor with over 20 years of experience leading hotels, restaurants, and bars across the U.S. and Belgium. As former Vice President of Operations at Dream Hotels and Hyatt Hotels, Kanvar built a career at the intersection of luxury hospitality, high-volume F&B, and real estate. He oversaw Tao at Dream Midtown, led Food & Beverage at Time NY, and has driven Elsie Rooftop to become one of New York City\'s most sought-after rooftop destinations for three consecutive years. Under KS Hospitality Group, Kanvar leads a growing portfolio of venues including Elsie Rooftop, Elsie Penthouse, Stone & Soil, Rosehill Rooftop, Skewr, Brewr, Premiere Park City, Casa CeCe, and more. Kanvar has been featured in Forbes, Leaders Magazine, the Huffington Post, and Hotels Magazine.',
    },
    {
      name: 'Gabriel Solano',
      role: 'VP of F&B Operations',
      img: '/img/Team/team-gabriel.png',
      bio: 'With over two decades in luxury hospitality, Gabriel Solano has built his career on anticipatory service. From F&B operations at the Mercer and Mandarin Oriental to training under Michelin-starred chefs like Jean-Georges and Stephen Starr, his foundation is world-class. He has launched rooftop lounges in Washington D.C., transformed guest experiences at Casa Bacardí in Puerto Rico, and led high-volume venues with precision. Gabriel\'s driving passion: creating immersive moments that fuse design, culture, cuisine, and service.',
    },
    {
      name: 'Maggie Zwolak',
      role: 'Director of Events',
      img: '/img/Team/team-maggie.png',
      bio: 'Maggie Zwolak is the connective tissue of KS Hospitality Group — seamlessly bridging front and back-of-house, linking departments, and keeping everything moving. She oversees events, manages VIP client relations, and brings a deep network and calm precision to any situation, planned or not. Known for her exceptional client rapport and creative instincts, Maggie has a rare gift for bringing something memorable and unexpected to every space she touches.',
    },
    {
      name: 'Christian Morasco',
      role: 'VP of Operations',
      img: '/img/Team/team-christian.png',
      bio: 'Christian Morasco is a VP of Operations who thrives in the complex, high-stakes world of large-scale hospitality. With a sharp instinct for building teams and tightening operations, he has brought order and momentum to iconic New York venues including Highline Ballroom and Elsie Rooftop. Christian is the operational backbone of KS Hospitality Group — ensuring every property runs with precision, purpose, and the right people in place.',
    },
    {
      name: 'Steve Martinek',
      role: 'Creative Director',
      img: '/img/Team/team-steve.png',
      bio: 'Steve Martinek is a marketing director and creative force with over 20 years in hospitality. He owns a social media agency specializing in luxury hotels, rooftops, and restaurants — building brands that stand out. Known for bold, trend-forward thinking, his teams consistently deliver campaigns that move the needle. Steve recently earned an Emmy for a short documentary and serves as creative director for the iconic Members Only brand, bringing the same distinctive vision to everything he touches.',
    },
    {
      name: 'Bianca Lopez',
      role: 'Director of Marketing',
      img: '/img/Team/team-bianca.png',
      bio: 'Bianca Lopez is a digital marketer and content strategist with over nine years of experience in beauty and hospitality. After managing social media for Anastasia Beverly Hills and Tao Group Hospitality\'s NYC venues, she launched No Reservations — a creative agency serving top clients including STARR Restaurant Group, Hawksmoor, and Bridgeton Development Group. Bianca specializes in turning a brand\'s identity into content that commands attention.',
    },
    {
      name: 'Pankaj Chauhan',
      role: 'CFO',
      img: '/img/Team/team-pankaj.jpg',
      bio: 'Pankaj Chauhan specializes in handling end-to-end financial operations for the restaurant industry, with over 15 years of experience. His work spans a wide range of concepts, from Michelin-starred restaurants to cozy cafés. He brings deep expertise in accounting, payroll, financial reporting, and operational controls — helping restaurant owners maintain clean books, improve cash flow, and stay compliant while focusing on growth.',
    },
    {
      name: 'Sajud Hamza',
      role: 'Digital Strategist',
      img: '/img/Team/team-sajud.jpg',
      bio: 'Sajud Hamza is a Google and SEO strategist who helps hospitality brands cut through the noise and own their digital space. With deep technical expertise in search optimization and audience targeting, he identifies the opportunities others miss. From local search dominance to content strategy and paid digital campaigns, Sajud turns online presence into a measurable competitive advantage for venues across New York and beyond.',
    },
    {
      name: 'Daksha Anand',
      role: 'Project Manager',
      img: '/img/Team/team-daksha.png',
      bio: 'Daksha is a distinguished hospitality professional with over 20 years of experience in luxury hotel operations, with expertise spanning Hotel Operations, Food, and Beverage. She brings a refined approach to pre-opening strategy, operational excellence, and elevated guest experiences. Known for a structured, detail-oriented, and results-driven mindset, with a strong focus on building high-performing teams and upholding the highest standards of luxury hospitality.',
    },
  ],
}
