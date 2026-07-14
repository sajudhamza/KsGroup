import { useCallback, useEffect, useRef, useState } from 'react'
import { Mic, MicOff, X, MessageCircle, Volume2 } from 'lucide-react'
import { quickPrompts, resolveIntent, WELCOME_MESSAGE } from '../lib/voiceAssistant/intents'
import { runAssistantActions } from '../lib/voiceAssistant/actions'
import {
  createSpeechRecognition,
  ensureVoicesLoaded,
  isSpeechRecognitionSupported,
  speak,
  stopSpeaking,
} from '../lib/voiceAssistant/speech'

export default function VoiceAssistant({ onNav, openProperty }) {
  const recognitionRef = useRef(null)
  const messagesEndRef = useRef(null)
  const isProcessingRef = useRef(false)
  const isListeningRef = useRef(false)

  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState('idle')
  const [messages, setMessages] = useState([])
  const [hasWelcomed, setHasWelcomed] = useState(false)
  const [inputText, setInputText] = useState('')

  const voiceInputSupported = isSpeechRecognitionSupported

  const appendMessage = useCallback((role, text) => {
    setMessages((prev) => [...prev, { id: `${Date.now()}-${role}`, role, text }])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    ensureVoicesLoaded()
  }, [])

  const handleUserInput = useCallback(
    async (rawInput) => {
      const text = rawInput.trim()
      if (!text || isProcessingRef.current) {
        return
      }

      isProcessingRef.current = true
      setStatus('thinking')
      appendMessage('user', text)

      const { message, actions } = resolveIntent(text)

      await runAssistantActions(actions, { onNav, openProperty })

      appendMessage('assistant', message)
      setStatus('speaking')

      speak(message, {
        onEnd: () => {
          setStatus('idle')
          isProcessingRef.current = false
        },
        onError: () => {
          setStatus('idle')
          isProcessingRef.current = false
        },
      })
    },
    [appendMessage, onNav, openProperty],
  )

  const startListening = useCallback(() => {
    if (isProcessingRef.current || status === 'listening') {
      return
    }

    if (!voiceInputSupported) {
      appendMessage(
        'assistant',
        'Voice input works best in Chrome or Edge. You can still type your question below.',
      )
      return
    }

    stopSpeaking()

    const recognition = createSpeechRecognition()
    if (!recognition) {
      return
    }

    recognitionRef.current = recognition
    isListeningRef.current = true
    setStatus('listening')

    recognition.onresult = (event) => {
      isListeningRef.current = false
      const transcript = event.results[0]?.[0]?.transcript
      if (transcript) {
        handleUserInput(transcript)
      } else {
        setStatus('idle')
        isProcessingRef.current = false
      }
    }

    recognition.onerror = () => {
      isListeningRef.current = false
      setStatus('idle')
      isProcessingRef.current = false
    }

    recognition.onend = () => {
      if (isListeningRef.current) {
        isListeningRef.current = false
        setStatus('idle')
      }
    }

    try {
      recognition.start()
    } catch {
      setStatus('idle')
    }
  }, [appendMessage, handleUserInput, status, voiceInputSupported])

  const stopListening = useCallback(() => {
    isListeningRef.current = false
    recognitionRef.current?.stop()
    recognitionRef.current = null
    setStatus('idle')
  }, [])

  const openAssistant = useCallback(() => {
    setIsOpen(true)

    if (!hasWelcomed) {
      setHasWelcomed(true)
      appendMessage('assistant', WELCOME_MESSAGE)
      setStatus('speaking')

      speak(WELCOME_MESSAGE, {
        onEnd: () => setStatus('idle'),
        onError: () => setStatus('idle'),
      })
    }
  }, [appendMessage, hasWelcomed])

  const closeAssistant = useCallback(() => {
    stopListening()
    stopSpeaking()
    setIsOpen(false)
    setStatus('idle')
    isProcessingRef.current = false
  }, [stopListening])

  const handleTextSubmit = (event) => {
    event.preventDefault()
    const value = inputText.trim()
    if (!value) {
      return
    }
    setInputText('')
    handleUserInput(value)
  }

  const statusLabel = {
    idle: voiceInputSupported ? 'Tap the mic to speak' : 'Type your question below',
    listening: 'Listening…',
    thinking: 'Thinking…',
    speaking: 'Speaking…',
  }[status]

  return (
    <div className="ks-voice">
      {isOpen && (
        <div className="ks-voice__panel" role="dialog" aria-label="KS Hospitality voice assistant">
          <div className="ks-voice__header">
            <div className="ks-voice__header-text">
              <p className="ks-voice__title">KS Guide</p>
              <p className="ks-voice__subtitle">Portfolio · venues · team</p>
            </div>
            <button type="button" className="ks-voice__icon-btn" onClick={closeAssistant} aria-label="Close assistant">
              <X size={18} />
            </button>
          </div>

          <div className="ks-voice__messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`ks-voice__row ${message.role === 'user' ? 'ks-voice__row--user' : 'ks-voice__row--assistant'}`}
              >
                <div className={`ks-voice__bubble ks-voice__bubble--${message.role}`}>{message.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {!voiceInputSupported && (
            <p className="ks-voice__warn">Voice input works best in Chrome or Edge. Typing still works.</p>
          )}

          <div className="ks-voice__footer">
            <div className="ks-voice__prompts">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="ks-voice__chip"
                  onClick={() => handleUserInput(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form className="ks-voice__form" onSubmit={handleTextSubmit}>
              <input
                type="text"
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
                placeholder="Or type your question…"
                className="ks-voice__input"
              />
              <button type="submit" className="ks-voice__send" disabled={!inputText.trim()}>
                Send
              </button>
            </form>

            <div className="ks-voice__status-row">
              <p className="ks-voice__status">
                {status === 'speaking' ? <Volume2 size={14} /> : null}
                <span>{statusLabel}</span>
              </p>

              <button
                type="button"
                onClick={status === 'listening' ? stopListening : startListening}
                className={`ks-voice__mic ${status === 'listening' ? 'ks-voice__mic--live' : ''} ${
                  !voiceInputSupported ? 'ks-voice__mic--muted' : ''
                }`}
                title={voiceInputSupported ? 'Speak your question' : 'Voice not supported'}
                aria-label={status === 'listening' ? 'Stop listening' : 'Start listening'}
              >
                {status === 'listening' ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <button type="button" className="ks-voice__launcher" onClick={openAssistant} aria-label="Open KS voice assistant">
          <MessageCircle size={18} />
          <span className="ks-voice__launcher-label">Ask KS Guide</span>
        </button>
      )}
    </div>
  )
}
