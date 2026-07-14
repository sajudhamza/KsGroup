/* KS microsite voice assistant — Fishbowl & The Rickey (venue-specific answers) */
(function () {
  'use strict'

  const VENUES = {
    fishbowl: {
      id: 'fishbowl',
      name: 'Fishbowl',
      short: 'Fishbowl Guide',
      subtitle: 'Games · cocktails · events',
      launcher: 'Ask Fishbowl',
      welcome:
        "Welcome to Fishbowl at Dream Midtown. I'm your guide — ask about bowling, cocktails, private events, or say \"contact us.\"",
      prompts: ['What is Fishbowl?', 'Private events', 'Gallery', 'Contact', 'Happy hour'],
      knowledge: {
        about:
          'Fishbowl is where Midtown Manhattan meets an upscale game room. Located at Dream Midtown, this bar lounge and game room pairs craft cocktails with bowling lanes, arcade games, and private event spaces overlooking the city.',
        location: 'Dream Midtown, New York City.',
        highlights: [
          'Bowling lanes',
          'Arcade games',
          'Craft cocktails',
          'Private event spaces',
          'City views',
        ],
        events:
          'Fishbowl is available for special events, corporate gatherings, and nights out with friends. Visit Contact or Special Events to get in touch with our team.',
        contact:
          'Reach KS Hospitality at info@kshospitalitygroup.com or 646-423-8278. You can also use the Contact form on this site.',
      },
      routes: {
        home: '/fishbowl/',
        gallery: '/fishbowl/gallery/',
        contact: '/fishbowl/contact/',
        events: '/fishbowl/special-events/',
        privateEvents: '/fishbowl/private-events-fishbowl-new-york/',
        tour: '/fishbowl/360-tour/',
      },
    },
    rickey: {
      id: 'rickey',
      name: 'The Rickey',
      short: 'Rickey Guide',
      subtitle: 'Cocktails · happy hour · menu',
      launcher: 'Ask The Rickey',
      welcome:
        "Welcome to The Rickey cocktail lounge at Dream Midtown. Ask about drinks, happy hour, the menu, or say \"contact us.\"",
      prompts: ['What is The Rickey?', 'Happy hour', 'Menu', 'Gallery', 'Contact'],
      knowledge: {
        about:
          'The Rickey is a cocktail lounge at Dream Midtown in New York City, offering craft cocktails, a curated menu, and happy hour in an elevated lounge setting high above Manhattan.',
        location: 'Dream Midtown, New York City.',
        highlights: ['Craft cocktails', 'Happy hour', 'Curated menu', 'Skyline lounge setting'],
        events:
          'From intimate evenings to group gatherings, The Rickey hosts special events. Contact our team through the Contact page.',
        contact:
          'Reach KS Hospitality at info@kshospitalitygroup.com or 646-423-8278, or use the Contact form on this site.',
      },
      routes: {
        home: '/rickey/',
        gallery: '/rickey/gallery/',
        contact: '/rickey/contact/',
        menu: '/rickey/menu/',
        happyHour: '/rickey/happy-hour/',
        events: '/rickey/special-events/',
      },
    },
  }

  function detectVenue() {
    const path = window.location.pathname || ''
    if (path.includes('/fishbowl')) return VENUES.fishbowl
    if (path.includes('/rickey')) return VENUES.rickey
    return null
  }

  const venue = detectVenue()
  if (!venue) return

  const normalize = (text) =>
    text
      .toLowerCase()
      .replace(/[^\w\s&]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

  const includesAny = (text, phrases) => phrases.some((p) => text.includes(p))

  function resolveIntent(raw) {
    const text = normalize(raw)
    if (!text) {
      return { message: `Ask about ${venue.name}, events, or contact.`, path: null }
    }

    if (includesAny(text, ['hello', 'hi ', 'hey', 'good evening'])) {
      return { message: venue.welcome, path: null }
    }

    if (includesAny(text, ['help', 'what can you do'])) {
      return {
        message: `I can tell you about ${venue.name}, point you to the gallery, menu pages, special events, or contact.`,
        path: null,
      }
    }

    if (includesAny(text, ['contact', 'email', 'phone', 'call', 'reach'])) {
      return { message: venue.knowledge.contact + ' Opening Contact.', path: venue.routes.contact }
    }

    if (includesAny(text, ['gallery', 'photo', 'picture', 'images'])) {
      return { message: `I'll open the ${venue.name} gallery.`, path: venue.routes.gallery }
    }

    if (includesAny(text, ['event', 'private', 'corporate', 'party', 'special event'])) {
      const path = venue.routes.events || venue.routes.privateEvents || venue.routes.contact
      return { message: venue.knowledge.events + ' Opening events.', path }
    }

    if (venue.id === 'rickey' && includesAny(text, ['happy hour', 'happyhour'])) {
      return {
        message: 'The Rickey offers happy hour in an elevated lounge setting. Opening Happy Hour.',
        path: venue.routes.happyHour,
      }
    }

    if (venue.id === 'rickey' && includesAny(text, ['menu', 'food', 'drink', 'cocktail'])) {
      return {
        message: 'Opening The Rickey menu — craft cocktails and a curated selection.',
        path: venue.routes.menu,
      }
    }

    if (venue.id === 'fishbowl' && includesAny(text, ['bowl', 'arcade', 'game', 'games'])) {
      return {
        message:
          'Fishbowl features bowling lanes and arcade games alongside craft cocktails — an upscale game room lounge at Dream Midtown.',
        path: venue.routes.home,
      }
    }

    if (venue.id === 'fishbowl' && includesAny(text, ['360', 'tour', 'virtual'])) {
      return { message: "I'll open the 360° tour.", path: venue.routes.tour }
    }

    if (includesAny(text, ['where', 'location', 'address', 'dream midtown'])) {
      return {
        message: `${venue.name} is at ${venue.knowledge.location}`,
        path: venue.routes.home,
      }
    }

    if (
      includesAny(text, [
        'what is',
        'about',
        'tell me',
        venue.name.toLowerCase(),
        'venue',
        'lounge',
        'bar',
      ])
    ) {
      const highlights = venue.knowledge.highlights.join(', ')
      return {
        message: `${venue.knowledge.about} Highlights include ${highlights}.`,
        path: venue.routes.home,
      }
    }

    if (includesAny(text, ['home', 'homepage'])) {
      return { message: 'Taking you to the homepage.', path: venue.routes.home }
    }

    if (includesAny(text, ['ks hospitality', 'portfolio', 'other venues'])) {
      return {
        message: 'KS Hospitality Group manages rooftops, lounges, hotels, and more. Opening the main KS site.',
        path: '/',
      }
    }

    return {
      message: `I'm not sure about that. Try asking about ${venue.name}, events, gallery, or contact.`,
      path: null,
    }
  }

  function speak(text, onEnd) {
    if (!window.speechSynthesis) {
      onEnd && onEnd()
      return
    }
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.95
    u.onend = () => onEnd && onEnd()
    u.onerror = () => onEnd && onEnd()
    window.speechSynthesis.speak(u)
  }

  function stopSpeak() {
    if (window.speechSynthesis) window.speechSynthesis.cancel()
  }

  const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition
  const voiceSupported = Boolean(SpeechRecognitionCtor)

  function mount() {
    const root = document.createElement('div')
    root.id = 'ks-voice-root'
    root.className = 'ks-voice-root'
    root.innerHTML = `
      <button type="button" class="ks-voice-launcher" aria-label="Open ${venue.short}">
        <span class="ks-voice-launcher__icon" aria-hidden="true">◎</span>
        <span class="ks-voice-launcher__label">${venue.launcher}</span>
      </button>
      <div class="ks-voice-panel" hidden role="dialog" aria-label="${venue.short}">
        <div class="ks-voice-header">
          <div>
            <p class="ks-voice-title">${venue.short}</p>
            <p class="ks-voice-sub">${venue.subtitle}</p>
          </div>
          <button type="button" class="ks-voice-close" aria-label="Close">×</button>
        </div>
        <div class="ks-voice-messages"></div>
        ${
          voiceSupported
            ? ''
            : '<p class="ks-voice-warn">Voice works best in Chrome or Edge. Typing still works.</p>'
        }
        <div class="ks-voice-footer">
          <div class="ks-voice-prompts"></div>
          <form class="ks-voice-form">
            <input type="text" class="ks-voice-input" placeholder="Or type your question…" />
            <button type="submit" class="ks-voice-send">Send</button>
          </form>
          <div class="ks-voice-status-row">
            <p class="ks-voice-status">Tap the mic to speak</p>
            <button type="button" class="ks-voice-mic" aria-label="Start listening">🎙</button>
          </div>
        </div>
      </div>
    `
    document.body.appendChild(root)

    const launcher = root.querySelector('.ks-voice-launcher')
    const panel = root.querySelector('.ks-voice-panel')
    const closeBtn = root.querySelector('.ks-voice-close')
    const messagesEl = root.querySelector('.ks-voice-messages')
    const promptsEl = root.querySelector('.ks-voice-prompts')
    const form = root.querySelector('.ks-voice-form')
    const input = root.querySelector('.ks-voice-input')
    const statusEl = root.querySelector('.ks-voice-status')
    const micBtn = root.querySelector('.ks-voice-mic')

    venue.prompts.forEach((prompt) => {
      const chip = document.createElement('button')
      chip.type = 'button'
      chip.className = 'ks-voice-chip'
      chip.textContent = prompt
      chip.addEventListener('click', () => handleInput(prompt))
      promptsEl.appendChild(chip)
    })

    let welcomed = false
    let busy = false
    let recognition = null

    function addMessage(role, text) {
      const row = document.createElement('div')
      row.className = 'ks-voice-row ks-voice-row--' + role
      const bubble = document.createElement('div')
      bubble.className = 'ks-voice-bubble ks-voice-bubble--' + role
      bubble.textContent = text
      row.appendChild(bubble)
      messagesEl.appendChild(row)
      messagesEl.scrollTop = messagesEl.scrollHeight
    }

    function setStatus(label) {
      statusEl.textContent = label
    }

    function handleInput(raw) {
      if (busy) return
      const text = String(raw || '').trim()
      if (!text) return
      busy = true
      setStatus('Thinking…')
      addMessage('user', text)

      const { message, path } = resolveIntent(text)
      if (path) {
        window.setTimeout(() => {
          window.location.assign(path)
        }, 900)
      }

      addMessage('assistant', message)
      setStatus('Speaking…')
      speak(message, () => {
        setStatus(voiceSupported ? 'Tap the mic to speak' : 'Type your question below')
        busy = false
      })
    }

    function openPanel() {
      panel.hidden = false
      launcher.hidden = true
      if (!welcomed) {
        welcomed = true
        addMessage('assistant', venue.welcome)
        setStatus('Speaking…')
        speak(venue.welcome, () => setStatus(voiceSupported ? 'Tap the mic to speak' : 'Type your question below'))
      }
    }

    function closePanel() {
      stopSpeak()
      if (recognition) {
        try {
          recognition.stop()
        } catch (_) {}
        recognition = null
      }
      panel.hidden = true
      launcher.hidden = false
      micBtn.classList.remove('ks-voice-mic--live')
      setStatus(voiceSupported ? 'Tap the mic to speak' : 'Type your question below')
      busy = false
    }

    launcher.addEventListener('click', openPanel)
    closeBtn.addEventListener('click', closePanel)

    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const v = input.value.trim()
      if (!v) return
      input.value = ''
      handleInput(v)
    })

    micBtn.addEventListener('click', () => {
      if (!voiceSupported) {
        addMessage('assistant', 'Voice input is not supported in this browser. Please type your question.')
        return
      }
      if (micBtn.classList.contains('ks-voice-mic--live')) {
        try {
          recognition && recognition.stop()
        } catch (_) {}
        micBtn.classList.remove('ks-voice-mic--live')
        setStatus('Tap the mic to speak')
        return
      }

      stopSpeak()
      recognition = new SpeechRecognitionCtor()
      recognition.lang = 'en-US'
      recognition.interimResults = false
      recognition.onstart = () => {
        micBtn.classList.add('ks-voice-mic--live')
        setStatus('Listening…')
      }
      recognition.onresult = (event) => {
        micBtn.classList.remove('ks-voice-mic--live')
        const transcript = event.results[0] && event.results[0][0] && event.results[0][0].transcript
        if (transcript) handleInput(transcript)
        else setStatus('Tap the mic to speak')
      }
      recognition.onerror = () => {
        micBtn.classList.remove('ks-voice-mic--live')
        setStatus('Tap the mic to speak')
      }
      recognition.onend = () => {
        micBtn.classList.remove('ks-voice-mic--live')
      }
      try {
        recognition.start()
      } catch (_) {
        setStatus('Tap the mic to speak')
      }
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount)
  } else {
    mount()
  }
})()
