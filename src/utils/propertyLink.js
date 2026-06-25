/** Internal microsites (same origin) open in-tab; external URLs open in a new tab. */
export function propertyLinkProps(url) {
  const internal = url.startsWith('/')
  return {
    href: url,
    ...(internal ? {} : { target: '_blank', rel: 'noopener noreferrer' }),
  }
}
