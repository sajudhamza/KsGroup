import { KS_DATA } from '../../data.js'

const normalize = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\s&]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const includesAny = (text, phrases) => phrases.some((phrase) => text.includes(phrase))

const { brand, contact, about, mission, team, properties, categories, strengths, stats } = KS_DATA

const venueMatchers = properties.map((property) => {
  const nameLower = property.name.toLowerCase()
  const phrases = [
    nameLower,
    property.id.replace(/-/g, ' '),
    ...(nameLower.includes('elsie rooftop') ? ['elsie', 'elsie roof'] : []),
    ...(nameLower.includes('elsie penthouse') ? ['penthouse'] : []),
    ...(nameLower.includes('stone') ? ['stone and soil', 'stone & soil', 'japanese cocktail'] : []),
    ...(nameLower.includes('rosehill') ? ['rose hill rooftop', 'rosehill'] : []),
    ...(nameLower.includes('skewr') ? ['skewer', 'mediterranean'] : []),
    ...(nameLower.includes('brewr') ? ['brew', 'espresso martini cafe'] : []),
    ...(nameLower.includes('premiere') ? ['premiere', 'sundance', 'park city'] : []),
    ...(nameLower.includes('casa') ? ['casa cece', 'supper club', 'diamond moon'] : []),
    ...(nameLower.includes('rickey') ? ['the rickey', 'rickey'] : []),
    ...(nameLower.includes('fishbowl') ? ['fish bowl', 'bowling'] : []),
    ...(nameLower.includes('maine grill') ? ['maine grill', 'main grill', 'maine grille'] : []),
    ...(nameLower.includes('clarion') ? ['clarion', 'lewiston hotel', 'lewiston maine'] : []),
    ...(nameLower.includes('lic') ? ['manhattan view', 'long island city hotel', 'lic hotel'] : []),
    ...(nameLower.includes('watermark') ? ['watermark'] : []),
    ...(nameLower.includes('landmark') ? ['landmark hamptons'] : []),
    ...(nameLower.includes('benchmark') ? ['benchmark'] : []),
  ]
  return { ...property, phrases }
})

function matchVenue(text) {
  let best = null
  let bestScore = 0

  for (const venue of venueMatchers) {
    let score = 0
    for (const phrase of venue.phrases) {
      if (text.includes(phrase)) {
        score += phrase.length
      }
    }
    if (score > bestScore) {
      bestScore = score
      best = venue
    }
  }

  return bestScore >= 4 ? best : null
}

function matchTeam(text) {
  for (const member of team) {
    const first = member.name.split(' ')[0].toLowerCase()
    const full = member.name.toLowerCase()
    if (text.includes(full) || text.includes(first)) {
      // Prefer full name when multiple could match vaguely
      if (text.includes(full) || text.includes(member.role.toLowerCase().split(' ')[0])) {
        return member
      }
      if (text.includes(first) && includesAny(text, ['who is', 'tell me about', 'team', 'ceo', 'founder'])) {
        return member
      }
    }
  }

  // Role-based
  if (includesAny(text, ['ceo', 'founder', 'kanvar'])) {
    return team.find((m) => m.name === 'Kanvar Singh')
  }
  if (includesAny(text, ['cfo', 'financial', 'pankaj'])) {
    return team.find((m) => m.name === 'Pankaj Chauhan')
  }
  if (includesAny(text, ['events director', 'fatima', 'director of events'])) {
    return team.find((m) => m.name === 'Fatima Hanine')
  }
  if (includesAny(text, ['brand experience', 'rebecca', 'activations'])) {
    return team.find((m) => m.name === 'Rebecca Morris')
  }
  if (includesAny(text, ['vp of operations', 'christian', 'operations'])) {
    if (includesAny(text, ['christian', 'vp of operations', 'large scale'])) {
      return team.find((m) => m.name === 'Christian Morasco')
    }
  }
  if (includesAny(text, ['creative director', 'steve', 'marketing director creative'])) {
    return team.find((m) => m.name === 'Steve Martinek')
  }
  if (includesAny(text, ['bianca', 'director of marketing', 'no reservations'])) {
    return team.find((m) => m.name === 'Bianca Lopez')
  }
  if (includesAny(text, ['sajud', 'seo', 'digital strategist'])) {
    return team.find((m) => m.name === 'Sajud Hamza')
  }
  if (includesAny(text, ['daksha', 'project manager'])) {
    return team.find((m) => m.name === 'Daksha Anand')
  }

  return null
}

function venueSummary(venue) {
  const detail = venue.description?.[0] || venue.blurb
  const siteNote =
    venue.url && venue.url !== '#'
      ? venue.url.startsWith('/')
        ? ` I can open its page on our site.`
        : ` Their website is available if you'd like to visit.`
      : ''
  return `${venue.name} is a ${venue.cat.toLowerCase()} in ${venue.loc}. ${detail}${siteNote}`
}

/**
 * @returns {{ message: string, actions: Array<{ type: string, page?: string, propertyId?: string, url?: string }> }}
 */
export function resolveIntent(rawInput) {
  const text = normalize(rawInput)

  if (!text) {
    return {
      message: "I didn't catch that. Ask me about our venues, team, or say \"show me the portfolio.\"",
      actions: [],
    }
  }

  if (includesAny(text, ['hello', 'hi there', 'hey', 'good morning', 'good afternoon', 'good evening'])) {
    return {
      message: `Hello! I'm the voice guide for ${brand.name}. I can tell you about our restaurants, rooftops, hotels, and team, or take you to the right page. What would you like to explore?`,
      actions: [],
    }
  }

  if (includesAny(text, ['help', 'what can you do', 'what do you do', 'how can you help'])) {
    return {
      message:
        'I can answer questions about KS venues like Elsie Rooftop, Stone & Soil, Fishbowl, The Maine Grill, Clarion Lewiston, and more. I can also open Portfolio, About, Team, or Contact, and send you to a venue\'s detail page. Try "Tell me about Elsie Rooftop" or "Show me lounges."',
      actions: [],
    }
  }

  // Contact
  if (includesAny(text, ['email', 'e mail', 'contact email'])) {
    if (includesAny(text, ['career', 'job', 'hiring'])) {
      return {
        message: `For careers, email ${contact.careersEmail}. General inquiries go to ${contact.email}. I'm opening Contact.`,
        actions: [{ type: 'navigate', page: 'contact' }],
      }
    }
    return {
      message: `You can reach us at ${contact.email}, or call ${contact.phone}. I'm opening our Contact page.`,
      actions: [{ type: 'navigate', page: 'contact' }],
    }
  }

  if (includesAny(text, ['phone', 'call', 'telephone', 'number'])) {
    return {
      message: `Our phone number is ${contact.phone}. You can also email ${contact.email}.`,
      actions: [{ type: 'navigate', page: 'contact' }],
    }
  }

  if (includesAny(text, ['contact', 'get in touch', 'reach out', 'inquire', 'enquiry'])) {
    return {
      message: `Let's connect. Email ${contact.email} or call ${contact.phone}. I'm taking you to Contact.`,
      actions: [{ type: 'navigate', page: 'contact' }],
    }
  }

  if (includesAny(text, ['instagram', 'social', 'social media'])) {
    return {
      message: `Follow us on Instagram at @kshospitalitygroup. I'll open the profile.`,
      actions: [{ type: 'openUrl', url: contact.instagram }],
    }
  }

  if (includesAny(text, ['career', 'job', 'hiring', 'work with you', 'join the team'])) {
    return {
      message: `For careers, reach out to ${contact.careersEmail}. I'm opening Contact so you have our details.`,
      actions: [{ type: 'navigate', page: 'contact' }],
    }
  }

  // Pages
  if (includesAny(text, ['about', 'who are you', 'what is ks', 'company', 'mission', 'about the group'])) {
    return {
      message: `${about[0]} ${mission[0]} I'm opening the About page.`,
      actions: [{ type: 'navigate', page: 'about' }],
    }
  }

  if (includesAny(text, ['team', 'leadership', 'who works', 'staff', 'people'])) {
    const names = team.map((m) => `${m.name}, ${m.role}`).slice(0, 5).join('; ')
    return {
      message: `Our leadership includes ${names}, and more. I'm opening the Team page.`,
      actions: [{ type: 'navigate', page: 'team' }],
    }
  }

  if (includesAny(text, ['portfolio', 'all venues', 'show venues', 'properties', 'our venues', 'list venues'])) {
    return {
      message: `We manage ${stats.find((s) => s.k === 'Properties')?.v || '15'} properties across rooftops, lounges, hotels, and Hamptons real estate. I'm opening the Portfolio.`,
      actions: [{ type: 'navigate', page: 'portfolio' }],
    }
  }

  if (includesAny(text, ['home', 'homepage', 'main page', 'go back'])) {
    return {
      message: "I'll take you back to the homepage.",
      actions: [{ type: 'navigate', page: 'home' }],
    }
  }

  // Team member
  const member = matchTeam(text)
  if (
    member &&
    includesAny(text, [
      'who',
      'about',
      'tell',
      'team',
      'ceo',
      'founder',
      'director',
      'vp',
      'cfo',
      'strategist',
      'manager',
      member.name.toLowerCase(),
      ...member.name.toLowerCase().split(' '),
    ])
  ) {
    return {
      message: `${member.name} is our ${member.role}. ${member.bio.split('.').slice(0, 2).join('.')}. I'm opening the Team page.`,
      actions: [{ type: 'navigate', page: 'team' }],
    }
  }

  // Specific venue (before broader lounge/hotel lists)
  const venue = matchVenue(text)
  if (venue) {
    const actions = [{ type: 'property', propertyId: venue.id }]
    const wantsSite = includesAny(text, ['website', 'site', 'open', 'visit', 'go to', 'take me'])

    if (wantsSite && venue.url && venue.url !== '#') {
      actions.push({ type: 'openUrl', url: venue.url })
    }

    let message = venueSummary(venue)
    if (venue.press) {
      message += ` ${venue.press}`
    }
    if (wantsSite && venue.url && venue.url !== '#') {
      message += venue.url.startsWith('/')
        ? ` Opening ${venue.name} now.`
        : ` Opening the ${venue.name} website.`
    } else {
      message += ` I'm opening its portfolio detail.`
    }

    return { message, actions }
  }

  // Category lists
  if (includesAny(text, ['lounge', 'lounges', 'restaurant', 'restaurants', 'bar', 'bars', 'dining'])) {
    const list = properties
      .filter((p) => p.catSlug === 'lounges')
      .map((p) => p.name)
      .join(', ')
    return {
      message: `Our lounges and restaurants include ${list}. I'm opening Portfolio.`,
      actions: [{ type: 'navigate', page: 'portfolio' }],
    }
  }

  if (includesAny(text, ['hotel', 'hotels'])) {
    const list = properties.filter((p) => p.catSlug === 'hotels').map((p) => p.name).join(', ')
    return {
      message: `Our hotels include ${list}. I'm opening the Portfolio.`,
      actions: [{ type: 'navigate', page: 'portfolio' }],
    }
  }

  if (includesAny(text, ['rooftop', 'rooftops'])) {
    const list = properties.filter((p) => p.catSlug === 'rooftops').map((p) => p.name).join(', ')
    return {
      message: `Our rooftops include ${list}. I'm opening the Portfolio so you can explore them.`,
      actions: [{ type: 'navigate', page: 'portfolio' }],
    }
  }

  if (includesAny(text, ['hamptons', 'real estate', 'airbnb', 'vrbo', 'rental'])) {
    const list = properties.filter((p) => p.catSlug === 'real-estate').map((p) => p.name).join(', ')
    return {
      message: `Our Hamptons real estate includes ${list}. I'm opening Portfolio.`,
      actions: [{ type: 'navigate', page: 'portfolio' }],
    }
  }

  if (includesAny(text, ['operations', 'marketing', 'events', 'strategy', 'what do you offer', 'services', 'strength'])) {
    const lines = strengths.map((s) => `${s.label}: ${s.line}`).join(' ')
    return {
      message: `We bring ${lines} I'm opening About for more.`,
      actions: [{ type: 'navigate', page: 'about' }],
    }
  }

  // Regions
  if (includesAny(text, ['new york', 'nyc', 'midtown', 'nomad', 'rose hill'])) {
    const nyc = properties.filter((p) => /ny/i.test(p.loc)).map((p) => p.name).join(', ')
    return {
      message: `In New York we operate venues including ${nyc}. I'm opening Portfolio.`,
      actions: [{ type: 'navigate', page: 'portfolio' }],
    }
  }

  if (includesAny(text, ['maine', 'lewiston'])) {
    return {
      message:
        'In Maine we have Clarion Lewiston and The Maine Grill: fresh seafood, prime steaks, and craft cocktails at 490 Pleasant Street. I can open either venue\'s detail page. Try "Tell me about The Maine Grill."',
      actions: [{ type: 'navigate', page: 'portfolio' }],
    }
  }

  if (includesAny(text, ['utah', 'park city', 'sundance'])) {
    return {
      message: venueSummary(properties.find((p) => p.id === 'premiere-park-city')),
      actions: [{ type: 'property', propertyId: 'premiere-park-city' }],
    }
  }

  // Fallback list of categories
  if (includesAny(text, ['category', 'categories', 'types of venues'])) {
    const list = categories.map((c) => c.name).join(', ')
    return {
      message: `Our portfolio spans ${list}. Which would you like to explore?`,
      actions: [{ type: 'navigate', page: 'portfolio' }],
    }
  }

  return {
    message: `I'm not sure about that one. Ask about a venue like Elsie Rooftop or Fishbowl, our team, or say "show portfolio." You can also email ${contact.email}.`,
    actions: [],
  }
}

export const quickPrompts = [
  'Show portfolio',
  'Elsie Rooftop',
  'Stone & Soil',
  'The Maine Grill',
  'Who is the CEO?',
  'Contact us',
]

export const WELCOME_MESSAGE = `Welcome to ${brand.name}. I'm your voice guide. Ask about our restaurants, rooftops, hotels, team, or say "show portfolio" to explore.`
