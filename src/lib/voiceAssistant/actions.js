/**
 * Run navigation / open actions for the KS voice assistant.
 * KS uses page-state navigation rather than React Router.
 */
export async function runAssistantActions(actions, { onNav, openProperty }) {
  for (const action of actions) {
    if (action.type === 'navigate' && action.page) {
      onNav?.(action.page)
      continue
    }

    if (action.type === 'property' && action.propertyId) {
      openProperty?.(action.propertyId)
      continue
    }

    if (action.type === 'openUrl' && action.url) {
      if (action.url.startsWith('/')) {
        window.location.assign(action.url)
      } else if (action.url !== '#') {
        window.open(action.url, '_blank', 'noopener,noreferrer')
      }
    }
  }
}
