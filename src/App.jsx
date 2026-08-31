import { useEffect, useState } from 'react'
import HiFiHome from './pages/Home.jsx'
import {
  HiFiPortfolio,
  HiFiAbout,
  HiFiTeam,
  HiFiProperty,
  HiFiContact,
  HiFiPress,
} from './pages/Pages.jsx'
import VoiceAssistant from './components/VoiceAssistant.jsx'

export default function App() {
  const [page, setPage] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const p = params.get('page')
    const allowed = ['portfolio', 'about', 'team', 'press', 'contact', 'property']
    return allowed.includes(p) ? p : 'home'
  })
  const [propertyId, setPropertyId] = useState(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [page, propertyId])

  const onNav = (p) => setPage(p)
  const openProperty = (id) => {
    setPropertyId(id)
    setPage('property')
  }

  let content
  switch (page) {
    case 'portfolio':
      content = <HiFiPortfolio onNav={onNav} openProperty={openProperty} />
      break
    case 'about':
      content = <HiFiAbout onNav={onNav} />
      break
    case 'team':
      content = <HiFiTeam onNav={onNav} />
      break
    case 'property':
      content = (
        <HiFiProperty
          onNav={onNav}
          propertyId={propertyId}
          openProperty={openProperty}
        />
      )
      break
    case 'press':
      content = <HiFiPress onNav={onNav} openProperty={openProperty} />
      break
    case 'contact':
      content = <HiFiContact onNav={onNav} />
      break
    default:
      content = <HiFiHome onNav={onNav} />
  }

  return (
    <>
      {content}
      <VoiceAssistant onNav={onNav} openProperty={openProperty} />
    </>
  )
}
