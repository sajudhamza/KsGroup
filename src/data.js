// Real KS Hospitality content. Image paths follow the on-disk folder structure
// under public/img, Vite serves /img/<Category>/<Property>/<file>.
//
// Content synced to Summer 2026 corporate deck (Canva DAHQfxRFsIM).

export const KS_DATA = {
  brand: {
    name: 'KS Hospitality Group',
    sub: 'EST. 2024',
    tagline: 'Hospitality that reflects your standards.',
    headline: 'Exceptional hospitality. Iconic places. Lasting impact.',
    categoriesLine: 'Hotels · Rooftops · Restaurants · Experiences',
    season: 'SUMMER 2026',
  },

  contact: {
    email: 'info@kshospitalitygroup.com',
    careersEmail: 'careers@kshospitalitygroup.com',
    phone: '646-423-8278',
    instagram: 'https://www.instagram.com/kshospitalitygroup/',
    tiktok: 'https://www.tiktok.com/@kshospitalitygroup',
    linkedin: 'https://www.linkedin.com/company/ks-hospitality-group/',
  },

  about: [
    'From elevated dining to iconic rooftops, our venues are designed to impress and built to deliver with precision. KS Hospitality Group creates places with purpose, runs them with discipline, and builds them to last.',
  ],

  mission: [
    'KS Hospitality Group brings together everything a property needs under one roof: operations, marketing, events, and strategy. Our centralized team means faster decisions, tighter execution, and no gaps between departments.',
    'We combine deep hospitality expertise with in-house marketing, a robust events team, and national partnerships to create experiences that guests remember and owners celebrate. And because we stay ahead of trends, from emerging social platforms to evolving guest expectations, we don\'t just manage properties. We grow them.',
  ],
  missionShort:
    'KS Hospitality Group creates places with purpose, runs them with discipline, and builds them to last.',

  strengths: [
    {
      numeral: 'I.',
      label: 'Operations',
      line: 'Deep hospitality expertise under one roof: faster decisions, tighter execution, no gaps between departments.',
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
    { label: '60,000+ Subscribers', line: 'A highly engaged mailing list built over years of consistent, quality programming.' },
    { label: '2,500+ Member Community', line: 'An exclusive membership circle of repeat guests, tastemakers, and brand advocates.' },
    { label: '100k+ Social Following', line: 'A living audience across platforms that amplifies every opening, event, and partnership.' },
    { label: 'Corporate Client Network', line: 'Deep, long-standing relationships with top-tier corporate clients across industries.' },
    { label: 'Influencer & Tastemaker Roster', line: 'A curated network of high-impact creators and cultural voices that move trends.' },
    { label: 'Planners, Bookers & Promoters', line: 'A trusted pipeline of industry operators who consistently drive premium business.' },
  ],
  networkTagline: 'Audience is not an afterthought. It is part of the asset.',

  // Homepage grid + cinematic divider (Slide 2 framing)
  values: [
    {
      numeral: 'I.',
      label: 'Curated Spaces',
      line: 'Venues designed to impress and built to deliver with precision.',
    },
    {
      numeral: 'II.',
      label: 'Unforgettable Experiences',
      line: 'Hospitality remembered through ritual, energy, and detail.',
    },
    {
      numeral: 'III.',
      label: 'Meaningful Connections',
      line: 'Guests, partners, and communities that return and last.',
    },
  ],

  // The KS Standard, Summer 2026 deck (full set for About)
  ksStandard: [
    {
      numeral: '01',
      label: 'Purpose Before Concept',
      line: 'Every venue needs a clear reason to exist before it needs a logo, menu, or opening party.',
    },
    {
      numeral: '02',
      label: 'Hospitality Before Ego',
      line: 'The room is built to make guests feel seen, welcomed, and genuinely taken care of.',
    },
    {
      numeral: '03',
      label: 'Discipline Before Scale',
      line: 'Growth only works when the systems, standards, and people are strong enough to support it.',
    },
    {
      numeral: '04',
      label: 'Energy Before Decoration',
      line: 'A beautiful room means nothing if it does not have warmth, rhythm, and life.',
    },
    {
      numeral: '05',
      label: 'Details Are the Brand',
      line: 'Lighting, music, menu language, service, and goodbye all carry the story.',
    },
    {
      numeral: '06',
      label: 'People Make the Place',
      line: 'A venue becomes valuable when the team believes in it, protects it, and delivers it consistently.',
    },
    {
      numeral: '07',
      label: 'Slow Nights Need Strategy. Busy Nights Need Systems.',
      line: 'Build for both momentum and control.',
    },
    {
      numeral: '08',
      label: 'The Best Hospitality Feels Effortless',
      line: 'Because the hard work is invisible.',
    },
    {
      numeral: '09',
      label: 'Culture is Not Posted',
      line: 'It is programmed, partnered, and repeated.',
    },
    {
      numeral: '10',
      label: 'Build for the Return',
      line: 'The goal is not one great night, but lasting relevance and repeat business.',
    },
  ],

  quote: {
    text: 'A good hotel must maintain a high level of consistency. If a guest returns because he enjoyed his previous stay, we need to make sure that his subsequent stay is just as extraordinary. It really boils down to how you make people feel.',
    author: 'Kanvar Singh',
    role: 'Founder & CEO',
  },

  stats: [
    { k: 'Properties', v: '16' },
    { k: 'Regions', v: '4' },
    { k: 'Founded', v: '2024' },
  ],

  // Hero, Stone & Soil cover
  heroImage: '/img/Lounges/Stone and Soil/1.jpg',
  heroLabel: 'Stone & Soil',

  // Homepage "Our Mission" visual — stand-in until the final image is provided.
  missionImage: '/img/Rooftops/Rosehill Rooftop/1.jpg',

  // Properties, Summer 2026 deck logo order, then additional operated venues.
  // Homepage layout: index 0 = featured big card; 1-2 = stack to the right; 3-5 = row of three.
  properties: [
    {
      id: 'elsie-rooftop',
      name: 'Elsie Rooftop',
      cat: 'Rooftop',
      catSlug: 'rooftops',
      loc: 'Midtown, NY',
      url: 'https://www.elsierooftop.com',
      img: '/img/Rooftops/Elsie Rooftop/1.jpg',
      logo: '/img/Rooftops/Elsie Rooftop/logo.png',
      kind: 'photo',
      featured: true,
      blurb:
        'An all-season rooftop destination where New York comes to celebrate, connect, and escape.',
      description: [
        'Opened in 2018, Elsie Rooftop is a lavish twenty-fifth floor rooftop and event space that blends Gilded Age glamour with modern sophistication. With a 5,000+-square-foot layout featuring a wraparound terrace and retractable glass roof, Elsie offers breathtaking views of the New York City skyline in every season.',
        'A bold marketing and social media strategy has built a fiercely loyal following, a high-converting sales funnel, and a reputation as one of the city\'s most sought-after destinations for elevated nightlife and exclusive events.',
      ],
      press:
        '“Old New York class.” - Thrillist · “A villa on the rooftop.” - UrbanDaddy · Featured in The New York Times, Forbes, Page Six, Time Out New York, Eater NY, Travel + Leisure, and more.',
    },
    {
      id: 'elsie-penthouse',
      name: 'Elsie Penthouse',
      cat: 'Lounge',
      catSlug: 'lounges',
      loc: 'Midtown, NY',
      url: 'http://www.elsiepenthouse.com',
      img: '/img/Lounges/Elsie Penthouse/1.jpg',
      logo: '/img/Lounges/Elsie Penthouse/logo-white.png',
      kind: 'photo',
      blurb:
        'A private penthouse for cocktail receptions, celebrations, and brand events with warm light, signature cocktails, and skyline views.',
      description: [
        'Located within Elsie Rooftop in the heart of Midtown Manhattan, Elsie Penthouse is a 10,000-square-foot private event venue opened in 2025, available for cocktail receptions, celebrations, brand events, and exclusive buyouts.',
        'Intimate yet grand, the Penthouse features a multi-room layout, projection and multimedia capability, flexible floorplans, floor-to-ceiling windows, and sweeping views of the New York City skyline.',
        'With dedicated white-glove event coordination, custom menus, and complete privacy from the main venue, Elsie Penthouse delivers an experience that is entirely your own. Capacity 400+.',
      ],
      press: '“Wolfe’s Den Redefines.” - Chilled Magazine · “Craft unforgettable experiences.” - PartySlate',
    },
    {
      id: 'casa-cece',
      name: 'Casa CeCe',
      cat: 'Lounge',
      catSlug: 'lounges',
      loc: 'Midtown, NY',
      url: 'https://casacecenyc.com',
      img: '/img/Lounges/Casa CeCe/1.jpg',
      logo: '/img/Lounges/Casa CeCe/logo.png',
      kind: 'photo',
      blurb:
        'Midtown’s ultimate supper club experience where you can expect the unexpected.',
      description: [
        'Casa CeCe is a dynamic, multifunctional destination where sports, dining, events, and live immersive experiences come together under one roof. From major game-day moments and private celebrations to late nights, this Midtown Manhattan supper club delivers the unexpected.',
        'Sports bar energy, flexible event space, nightly performances and interactive experiences, contemporary cuisine in an immersive setting, and crafted cocktails with premium spirits. Dining · Entertainment · Cocktails · Private Events.',
        'KS Hospitality Group serves as both investor and management company for Casa CeCe, bringing the same operational excellence that defines every property in the portfolio.',
      ],
      press:
        'amNewYork · The Knockturnal: “Casa CeCe blends fine dining, cabaret, and nightlife into one transformative New York experience.”',
    },
    {
      id: 'rosehill-rooftop',
      name: 'Rosehill Rooftop',
      cat: 'Rooftop',
      catSlug: 'rooftops',
      loc: 'Rose Hill, NY',
      url: 'http://www.rosehillrooftop.com',
      img: '/img/Rooftops/Rosehill Rooftop/1.jpg',
      logo: '/img/Rooftops/Rosehill Rooftop/logo-white.png',
      kind: 'photo',
      blurb:
        'A multi-level NoMad rooftop with chef-driven cuisine, handcrafted cocktails, and panoramic skyline views.',
      description: [
        'Rosehill Rooftop is a multi-level NoMad rooftop restaurant, bar, and events destination with chef-driven cuisine, handcrafted cocktails, and panoramic views across 2,700 square feet.',
        'One of four KS Hospitality Group venues at the Park South Hotel (JDV by Hyatt). Stay · Dine · Gather · Explore. Rosehill has quickly become one of Rose Hill\'s most talked-about outdoor destinations. Capacity 150+; opened 2025.',
        'Ideal for corporate events, weddings, galas, and product launches.',
      ],
      press:
        'Featured in Time Out New York, Eater NY, The Infatuation, Cititour, and The Rooftop Guide among the top rooftop bars in NYC.',
    },
    {
      id: 'skewr',
      name: 'Skewr',
      cat: 'Restaurant',
      catSlug: 'restaurants',
      loc: 'NoMad, NY',
      url: 'https://www.skewr.nyc',
      img: '/img/Lounges/Skewr/1.jpg',
      logo: '/img/Lounges/Skewr/logo.svg',
      kind: 'photo',
      blurb:
        'Eastern Mediterranean dining built for sharing: signature skewers, bold mezze, and catering in NoMad.',
      description: [
        'Skewr brings fire back to the table. Tucked into NoMad at the Park South Hotel, this 3,000-square-foot Mediterranean restaurant and bar is built for sharing: signature skewers, shareable plates, ethically sourced ingredients, and catering.',
        'From flame-roasted dips and freshly baked pita to seasonal vegetables and impeccably sourced meats, every dish is an invitation to slow down, share, and stay a while. Capacity 150+; opened 2025.',
        'One of four KS Hospitality Group venues at the Park South Hotel (JDV by Hyatt).',
      ],
      press: 'Featured in Forbes, Time Out New York, and The Infatuation.',
    },
    {
      id: 'brewr',
      name: 'Brewr',
      cat: 'Lounge',
      catSlug: 'lounges',
      loc: 'NoMad, NY',
      url: 'https://www.brewr.us',
      img: '/img/Lounges/Brewr/1.jpg',
      logo: '/img/Lounges/Brewr/logo.png',
      kind: 'photo',
      blurb:
        'An all-day café that becomes an evening coffee lounge with handcrafted coffee, pastries, and espresso martinis.',
      description: [
        'By day, Brewr is a bright, unhurried café with handcrafted coffee, fresh pastries, and easy atmosphere. By night, the lights dim and Brewr becomes a warm coffee lounge where espresso martinis and coffee-inspired cocktails take center stage.',
        'Located within the Park South Hotel in NoMad, Brewr is a neighborhood gathering place that refuses to be just one thing. Capacity 50+; opened 2025. One of four KS venues at Park South (JDV by Hyatt).',
      ],
    },
    {
      id: 'stone-and-soil',
      name: 'Stone & Soil',
      cat: 'Lounge',
      catSlug: 'lounges',
      loc: 'Rose Hill, NY',
      url: 'https://stoneandsoil.nyc',
      img: '/img/Lounges/Stone and Soil/1.jpg',
      logo: '/img/Lounges/Stone and Soil/logo.png',
      kind: 'photo',
      blurb:
        'A refined Japanese cocktail bar and dining destination in NoMad: precision, craft, and design-forward hospitality.',
      description: [
        'Stone & Soil is a refined Japanese cocktail bar and modern dining destination tucked inside NoMad\'s Park South Hotel. Guided by omotenashi (wholehearted hospitality), the bar delivers an experience rooted in precision, restraint, and sustainability. Capacity 62; opened 2025.',
        'The intimate Japandi-designed space features recycled wood and leather, hand-applied finishes, and sculptural clay installations, with a tightly curated cocktail menu leaning on fermentation, infusion, and zero-waste technique, complemented by elevated Japanese cuisine and private events.',
      ],
      press:
        'Time Out: “The Best New Cocktail Bar in New York City” · Featured in Eater NY and The New York Times.',
    },
    {
      id: 'the-maine-grill',
      name: 'The Maine Grill',
      cat: 'Restaurant',
      catSlug: 'restaurants',
      loc: 'Lewiston, ME',
      url: '/maine-grill/',
      img: '/img/Lounges/Maine Grill/hero-dusk.png',
      logo: '/img/Lounges/Maine Grill/logo.png',
      kind: 'photo',
      blurb:
        'An elevated American grill destination: Made to Gather. Fresh seafood, prime steaks, craft cocktails, and private events.',
      description: [
        'The Maine Grill is Lewiston\'s premier dining destination, a multi-million-dollar transformation delivering modern American dining, handcrafted cocktails, patio dining, and private events under the Made to Gather ethos.',
        'Located at 490 Pleasant Street within the Clarion Hotel & Conference Center, the restaurant spans 4,500 square feet with capacity for 200+ guests. Ideal for dinners, celebrations, and gatherings.',
        'KS Hospitality Group serves as investor and management company for The Maine Grill and the Clarion property.',
      ],
    },
    {
      id: 'premiere-park-city',
      name: 'Premiere Park City',
      cat: 'Lounge',
      catSlug: 'lounges',
      loc: 'Park City, UT',
      url: 'http://www.premiereparkcity.com',
      img: '/img/Lounges/Premiere Park City/1.png',
      logo: '/img/Lounges/Premiere Park City/logo-white.png',
      kind: 'photo',
      blurb:
        'A luxury cocktail lounge and nightlife destination on Main Street with live entertainment and private events.',
      description: [
        'Premiere redefines nightlife in the heart of Park City with elevated cocktails, contemporary design, and immersive entertainment. Blending sophisticated hospitality with vibrant energy, the venue creates nights worth talking about.',
        'A luxury cocktail lounge and nightlife destination on Main Street: signature cocktails crafted with premium spirits, live entertainment, music and performances, and private events in sophisticated modern interiors. Capacity 400+; opened 2023.',
        'Created by Kanvar Singh and Lisa Barlow (entrepreneur and star of The Real Housewives of Salt Lake City). KS Hospitality Group has served as the management company since inception.',
      ],
      press:
        'TownLift, Park City · Fox 13 Salt Lake City: “Premiere Park City is one of the newest spots on Main and one of the coolest vibes.”',
    },
    {
      id: 'landmark',
      name: 'The Landmark Hamptons',
      cat: 'Real Estate',
      catSlug: 'real-estate',
      loc: 'Eastport, NY',
      url: 'http://www.thelandmarkhamptons.com',
      img: '/img/Real-Estate/The Landmark Hamptons/1.jpg',
      logo: '/img/Real-Estate/The Landmark Hamptons/logo-white.png',
      kind: 'photo',
      blurb:
        'Part of The Hamptons Private Estate Collection: luxury residences for buyouts, retreats, and extended stays.',
      description: [
        'The Landmark is one of three distinct luxury residences in The Hamptons Private Estate Collection in Eastport, New York: one exclusive hospitality experience across Watermark, Landmark, and Benchmark.',
        'Ideal for private buyouts, executive retreats, weddings, wellness escapes, and extended luxury stays. About 24 guest accommodations across the collection.',
      ],
    },
    {
      id: 'benchmark',
      name: 'The Benchmark Hamptons',
      cat: 'Real Estate',
      catSlug: 'real-estate',
      loc: 'Eastport, NY',
      url: 'http://www.thebenchmarkhamptons.com',
      img: '/img/Real-Estate/The Benchmark Hamptons/1.jpg',
      logo: '/img/Real-Estate/The Benchmark Hamptons/logo-white.png',
      kind: 'photo',
      blurb:
        'Part of The Hamptons Private Estate Collection: three distinct residences, one exclusive hospitality experience.',
      description: [
        'The Benchmark is one of three distinct luxury residences in The Hamptons Private Estate Collection in Eastport, New York.',
        'Together with Watermark and Landmark, the collection offers private buyouts, executive retreats, weddings, wellness escapes, and extended luxury stays.',
      ],
    },
    {
      id: 'watermark',
      name: 'The Watermark Hamptons',
      cat: 'Real Estate',
      catSlug: 'real-estate',
      loc: 'Eastport, NY',
      url: 'http://www.thewatermarkhamptons.com',
      img: '/img/Real-Estate/The Watermark Hamptons/1.png',
      logo: '/img/Real-Estate/The Watermark Hamptons/logo-white.png',
      kind: 'photo',
      blurb:
        'Part of The Hamptons Private Estate Collection: ~24 luxury suites across Watermark, Landmark, and Benchmark.',
      description: [
        'The Watermark is one of three distinct luxury residences in The Hamptons Private Estate Collection in Eastport, New York: three homes, one exclusive hospitality experience.',
        'Across Watermark, Landmark, and Benchmark, guests find roughly 24 luxury suites for private buyouts, executive retreats, weddings, wellness escapes, and extended stays.',
      ],
    },
    {
      id: 'ramada',
      name: 'Clarion Hotel Lewiston',
      cat: 'Hotel',
      catSlug: 'hotels',
      loc: 'Lewiston, ME',
      url: 'https://www.clarionhotellewiston.com',
      img: '/img/Hotels/Clarion Lewiston Maine/1.jpg',
      logo: '/img/Hotels/Clarion Lewiston Maine/logo.png',
      kind: 'photo',
      blurb:
        'Central Maine’s premier hospitality destination: 117 keys, restaurant & lounge, events, and conference facilities.',
      description: [
        'Following a multi-million-dollar renovation, Clarion Hotel Lewiston has emerged as Central Maine\'s premier hospitality destination with elevated accommodations, modern gatherings, and full-service hospitality under one roof.',
        'Amenities include luxury guest rooms (117 keys), The Maine Grill restaurant and lounge, event and wedding venues, conference facilities, and an indoor pool. Opened 2024.',
        'KS Hospitality Group serves as both investor and management company for the hotel and all food and beverage venues on property.',
      ],
    },
    // Additional operated venues (beyond Summer 2026 logo wall)
    {
      id: 'lic-manhattan-view',
      name: 'LIC Manhattan View Hotel',
      cat: 'Hotel',
      catSlug: 'hotels',
      loc: 'Long Island City, NY',
      url: 'https://licmanhattanviewhotel.com',
      img: '/img/Hotels/LIC Manhattan View Hotel/1.png',
      logo: '/img/Hotels/LIC Manhattan View Hotel/logo.png',
      logoRaw: true, // solid-background logo — don't white-ify in the card chip
      kind: 'photo',
      blurb: 'A strategically located LIC hotel, 15 minutes from Midtown by subway.',
      description: [
        'LIC Manhattan View Hotel is located in Long Island City, just a 15-minute subway ride from Midtown Manhattan, with easy access to Rockefeller Center and Central Park. LaGuardia Airport is a 10-minute drive away, and the 39th Ave Subway Station is one block from the hotel.',
        'Guest rooms feature a 32-inch flat-screen TV, complimentary Wi-Fi, a mini-fridge, and a hair dryer. An on-site restaurant and lounge are currently undergoing renovations.',
        'KS Hospitality Group will serve as both investor and management company for the LIC Manhattan View Hotel.',
      ],
    },
  ],

  // Alphabetical order (homepage "Pick your atmosphere" + portfolio filters).
  categories: [
    {
      name: 'Hotels',
      slug: 'hotels',
      img: '/img/Hotels/LIC Manhattan View Hotel/1.png',
      blurb: 'Boutique to flag. Operated, never franchised.',
    },
    {
      name: 'Lounges',
      slug: 'lounges',
      img: '/img/Lounges/Casa CeCe/1.jpg',
      blurb: 'Cocktail bars, coffee lounges, and supper clubs concepted, built and operated by KS.',
    },
    {
      name: 'Real Estate',
      slug: 'real-estate',
      img: '/img/Real-Estate/The Watermark Hamptons/1.png',
      blurb: 'The Hamptons Private Estate Collection: buyouts, retreats, and luxury stays.',
    },
    {
      name: 'Restaurants',
      slug: 'restaurants',
      img: '/img/Lounges/Maine Grill/hero-dusk.png',
      blurb: 'Chef-driven dining rooms and neighborhood destinations, from NoMad to Lewiston.',
    },
    {
      name: 'Rooftops',
      slug: 'rooftops',
      img: '/img/Rooftops/Elsie Rooftop/1.jpg',
      blurb: 'Open-air bars built for the long evening, from Midtown skylines to NoMad terraces.',
    },
  ],

  team: [
    {
      name: 'Kanvar Singh',
      role: 'Founder & CEO',
      img: '/img/Team/team-kanvar.png',
      tagline: null,
      bio: 'Kanvar Singh is the founder and CEO of KS Hospitality Group; a hospitality executive and investor with over 20 years of experience leading hotels, restaurants, and bars across the U.S. and internationally. As former Vice President of Operations at Dream Hotels and Hyatt Hotels, Kanvar built a career at the intersection of luxury hospitality, high-volume F&B, and real estate. He oversaw Tao at Dream Midtown, led Food & Beverage at Time NY, and has driven Elsie Rooftop to become one of New York City\'s most sought-after rooftop destinations for three consecutive years. Under KS Hospitality Group, Kanvar leads a growing portfolio of venues including Elsie Rooftop, Elsie Penthouse, Stone & Soil, Rosehill Rooftop, Skewr, Brewr, Premiere Park City, Casa CeCe, Clarion Hotel Lewiston, and more; each designed to deliver elevated experiences across dining, nightlife, and private events. Kanvar has been featured in Forbes, Leaders Magazine, the Huffington Post, and Hotels Magazine. Today, he is focused on strategic expansion; identifying underperforming venues and turning them into thriving destinations.',
    },
    {
      name: 'Bianca Lopez',
      role: 'Director of Marketing',
      img: '/img/Team/team-bianca.png',
      tagline: 'Content with purpose. Marketing that performs.',
      bio: 'Bianca Lopez is a digital marketer and content strategist with over nine years of experience in beauty and hospitality. After managing social media for Anastasia Beverly Hills and KS Hospitality Group\'s NYC venues, she launched No Reservations, a creative agency serving top clients including STARR Restaurant Group, Hawksmoor, and Bridgeton Development Group. Bianca specializes in turning a brand\'s identity into content that commands attention.',
    },
    {
      name: 'Sajud Hamza',
      role: 'Digital Strategist',
      img: '/img/Team/team-sajud.png',
      tagline: 'Search with strategy. Visibility with purpose. Growth that lasts.',
      bio: 'Sajud Hamza is a Google and SEO strategist who helps hospitality brands cut through the noise and own their digital space. With deep technical expertise in search optimization and audience targeting, he identifies the opportunities others miss. From local search dominance to content strategy and paid digital campaigns, Sajud turns online presence into a measurable competitive advantage for venues across New York and beyond.',
    },
    {
      name: 'Christian Morasco',
      role: 'VP of Operations',
      img: '/img/Team/team-christian.png',
      tagline: 'Turning ambitious hospitality into disciplined execution.',
      bio: 'Christian Morasco is a VP of Operations who thrives in the complex, high-stakes world of large-scale hospitality. With a sharp instinct for building teams and tightening operations, he has brought order and momentum to iconic New York venues including Highline Ballroom and Elsie Rooftop. Christian is the operational backbone of KS Hospitality Group, ensuring every property runs with precision, purpose, and the right people in place.',
    },
    {
      name: 'Steve Martinek',
      role: 'Creative Director',
      img: '/img/Team/team-steve.png',
      tagline: 'Building brands with a pulse, not just a logo.',
      bio: 'Steve Martinek is a marketing director and creative force with over 20 years in hospitality. He owns a social media agency specializing in luxury hotels, rooftops, and restaurants, building brands that stand out. Known for bold, trend-forward thinking, his teams consistently deliver campaigns that move the needle. Steve recently earned an Emmy for a short documentary and serves as creative director for the iconic Members Only brand, bringing the same distinctive vision to everything he touches.',
    },
    {
      name: 'Pankaj Chauhan',
      role: 'CFO',
      img: '/img/Team/team-pankaj.png',
      tagline: 'Financial clarity. Operational confidence. Sustainable growth.',
      bio: 'Pankaj Chauhan specializes in handling end-to-end financial operations for the restaurant industry, with over 15 years of experience. His work spans a wide range of concepts, from Michelin-starred restaurants to cozy cafés. He brings deep expertise in accounting, payroll, financial reporting, and operational controls, helping restaurant owners maintain clean books, improve cash flow, and stay compliant while focusing on growth.',
    },
    {
      name: 'Daksha Anand',
      role: 'Project Manager',
      img: '/img/Team/team-daksha.png',
      tagline: 'Operational excellence. Elevated service. Exceptional guest experiences.',
      bio: 'Daksha is a distinguished hospitality professional with over 20 years of experience in luxury hotel operations, with expertise spanning Hotel Operations, Food, and Beverage. She brings a refined approach to pre-opening strategy, operational excellence, and elevated guest experiences. Known for a structured, detail-oriented, and results-driven mindset, with a strong focus on building high-performing teams and upholding the highest standards of luxury hospitality.',
    },
    {
      name: 'Fatima Hanine',
      role: 'Director of Events',
      img: '/img/Team/team-fatima.png',
      tagline: 'Elegant events. Seamless execution. Unforgettable experiences.',
      bio: 'Fatima Hanine leads events across the KS Hospitality Group portfolio: elegant productions, seamless execution, and experiences guests remember. She partners with planners, brands, and private clients to deliver weddings, buyouts, corporate gatherings, and signature activations with precision and warmth.',
    },
    {
      name: 'Rebecca Morris',
      role: 'Director of Brand Experience',
      img: '/img/Team/team-rebecca.png',
      tagline: 'Activations, experiences, strategic partnerships, events.',
      bio: 'Rebecca Morris directs brand experience for KS Hospitality Group: activations, immersive experiences, strategic partnerships, and events that extend each venue\'s story beyond the room. She connects properties with the right partners and audiences to build lasting cultural relevance.',
    },
  ],
}
