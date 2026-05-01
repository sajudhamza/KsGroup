import { useEffect, useState } from 'react'
import HiFiHome from './pages/Home.jsx'
import {
  HiFiPortfolio,
  HiFiAbout,
  HiFiTeam,
  HiFiProperty,
  HiFiContact,
} from './pages/Pages.jsx'

export default function App() {
  const [page, setPage] = useState('home')
  const [propertyId, setPropertyId] = useState(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [page, propertyId])

  const onNav = (p) => setPage(p)
  const openProperty = (id) => {
    setPropertyId(id)
    setPage('property')
  }

  switch (page) {
    case 'portfolio':
      return <HiFiPortfolio onNav={onNav} openProperty={openProperty} />
    case 'about':
      return <HiFiAbout onNav={onNav} />
    case 'team':
      return <HiFiTeam onNav={onNav} />
    case 'property':
      return (
        <HiFiProperty
          onNav={onNav}
          propertyId={propertyId}
          openProperty={openProperty}
        />
      )
    case 'contact':
      return <HiFiContact onNav={onNav} />
    default:
      return <HiFiHome onNav={onNav} />
  }
}
