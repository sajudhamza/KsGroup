const SpeechRecognitionCtor =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null

export const isSpeechRecognitionSupported = Boolean(SpeechRecognitionCtor)

export function createSpeechRecognition() {
  if (!SpeechRecognitionCtor) {
    return null
  }

  const recognition = new SpeechRecognitionCtor()
  recognition.lang = 'en-US'
  recognition.interimResults = false
  recognition.continuous = false
  recognition.maxAlternatives = 1
  return recognition
}

let voicesReady = false
let preferredVoice = null

function pickPreferredVoice() {
  const voices = window.speechSynthesis.getVoices()
  preferredVoice =
    voices.find((voice) => voice.name === 'Samantha' && voice.lang.startsWith('en')) ||
    voices.find((voice) => voice.name.includes('Google US English')) ||
    voices.find((voice) => voice.lang === 'en-US') ||
    voices.find((voice) => voice.lang.startsWith('en')) ||
    null
  voicesReady = true
}

export function ensureVoicesLoaded() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || voicesReady) {
    return Promise.resolve(preferredVoice)
  }

  return new Promise((resolve) => {
    const finish = () => {
      pickPreferredVoice()
      resolve(preferredVoice)
    }

    if (window.speechSynthesis.getVoices().length > 0) {
      finish()
      return
    }

    window.speechSynthesis.onvoiceschanged = () => {
      finish()
      window.speechSynthesis.onvoiceschanged = null
    }

    window.setTimeout(finish, 250)
  })
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

export function speak(text, { onStart, onEnd, onError } = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) {
    onEnd?.()
    return null
  }

  stopSpeaking()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.95
  utterance.pitch = 1
  if (preferredVoice) {
    utterance.voice = preferredVoice
  }

  utterance.onstart = () => onStart?.()
  utterance.onend = () => onEnd?.()
  utterance.onerror = (event) => onError?.(event)

  window.speechSynthesis.speak(utterance)
  return utterance
}
