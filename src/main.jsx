import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

requestAnimationFrame(() => {
  setTimeout(() => {
    const s = document.getElementById('ks-splash')
    if (s) {
      s.classList.add('gone')
      setTimeout(() => s.remove(), 700)
    }
  }, 200)
})
