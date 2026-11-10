// Smart Rostering — turns a week of guest numbers into a staff roster.
//
// How it works:
// 1. Each open day's guests are split across the services (lunch / dinner).
// 2. Each role needs one person per N guests in a service, with a minimum.
// 3. Services are filled busiest first, so the peaks are covered before the
//    quiet ones. Within a role, the person with the fewest hours so far gets
//    the shift, so the work is spread fairly.
// 4. Nobody works a day they're unavailable, goes over their max shifts, or
//    (unless doubles are allowed) works two services on the same day.

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// perGuests: one person for every N guests in a service (0 = fixed headcount).
// min: the fewest people of this role on any open service.
export const DEFAULT_ROLES = [
  { id: 'manager', name: 'Manager', perGuests: 0, min: 1 },
  { id: 'host', name: 'Host', perGuests: 150, min: 1 },
  { id: 'server', name: 'Server', perGuests: 30, min: 1 },
  { id: 'bartender', name: 'Bartender', perGuests: 70, min: 1 },
  { id: 'runner', name: 'Runner / Busser', perGuests: 50, min: 0 },
  { id: 'cook', name: 'Line Cook', perGuests: 40, min: 1 },
  { id: 'dish', name: 'Dishwasher', perGuests: 120, min: 1 },
]

export const DEFAULT_SERVICES = [
  { id: 'lunch', name: 'Lunch', on: true, start: '11:30', end: '15:30', share: 35 },
  { id: 'dinner', name: 'Dinner', on: true, start: '17:00', end: '23:00' },
]

export const DEFAULT_MAX_SHIFTS = 5

export const SAMPLE_GUESTS = [80, 90, 110, 140, 220, 260, 170]

// Sized for the sample week, with the kitchen one cook short on Saturday so
// the shortfall notes have something to show.
const SAMPLE_TEAM = [
  ['Maria Lopez', 'manager'], ['James Carter', 'manager'], ['Aisha Khan', 'manager'], ['Ben Foster', 'manager', 3],
  ['Olivia Reed', 'host'], ['Noah Kim', 'host'], ['Emma Brooks', 'host', 4], ['Jade Moreau', 'host', 3],
  ['Liam Patel', 'server'], ['Sofia Rossi', 'server'], ['Ethan Wright', 'server'], ['Mia Chen', 'server'],
  ['Lucas Silva', 'server'], ['Ava Thompson', 'server'], ['Mateo Garcia', 'server'], ['Chloe Martin', 'server'],
  ['Isaac Bell', 'server', 4], ['Layla Haddad', 'server', 4],
  ['Daniel Osei', 'bartender'], ['Grace Murphy', 'bartender'], ['Leo Novak', 'bartender'],
  ['Priya Nair', 'bartender', 4], ['Felix Grant', 'bartender', 4],
  ['Zara Ahmed', 'runner'], ['Owen Price', 'runner'], ['Ruby Hayes', 'runner'], ['Dev Sharma', 'runner'],
  ['Lena Vogel', 'runner', 4], ['Marcus Hill', 'runner', 4],
  ['Carlos Mendes', 'cook', 6], ['Hannah Weiss', 'cook'], ['Samuel Adeyemi', 'cook'], ['Ivy Larsen', 'cook'],
  ['Marco Bianchi', 'cook'], ['Yuki Tanaka', 'cook'], ['Andre Costa', 'cook', 4],
  ['Tomás Ruiz', 'dish'], ['Kevin Doyle', 'dish'], ['Nina Popescu', 'dish', 4], ['Sam Okafor', 'dish', 3],
]

let idSeq = 0
export const newId = () => `e${Date.now().toString(36)}${(idSeq++).toString(36)}${Math.random().toString(36).slice(2, 6)}`

export const newEmployee = (name, role, maxShifts = DEFAULT_MAX_SHIFTS) => ({
  id: newId(),
  name: name.trim(),
  role,
  maxShifts,
  available: [true, true, true, true, true, true, true],
})

export function sampleTeam() {
  return SAMPLE_TEAM.map(([name, role, max], i) => {
    const e = newEmployee(name, role, max ?? DEFAULT_MAX_SHIFTS)
    // A few days off so availability shows up in the roster.
    if (i % 5 === 1) e.available[0] = false
    if (i % 7 === 3) e.available[2] = false
    return e
  })
}

/** Match a typed role ("server", "Bartender", "cook") to a role id. */
export function roleFromText(text, roles = DEFAULT_ROLES) {
  const t = text.trim().toLowerCase()
  if (!t) return null
  const hit = roles.find(r => r.id === t || r.name.toLowerCase() === t)
    || roles.find(r => r.name.toLowerCase().split(/[\s/]+/).some(w => w && t.startsWith(w)))
    || roles.find(r => r.name.toLowerCase().includes(t))
  if (hit) return hit.id
  if (/chef|kitchen|prep/.test(t)) return 'cook'
  if (/bus|back ?waiter|food ?run/.test(t)) return 'runner'
  if (/wait|front/.test(t)) return 'server'
  if (/bar/.test(t)) return 'bartender'
  if (/porter|steward|dish/.test(t)) return 'dish'
  if (/gm|supervisor|lead/.test(t)) return 'manager'
  return null
}

const toMinutes = (hhmm) => {
  const [h, m] = (hhmm || '0:0').split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

/** Length of a service in hours; an end time before the start runs past midnight. */
export function serviceHours(service) {
  let mins = toMinutes(service.end) - toMinutes(service.start)
  if (mins <= 0) mins += 24 * 60
  return Math.round((mins / 60) * 100) / 100
}

export function formatTime(hhmm) {
  const [h, m] = (hhmm || '0:0').split(':').map(Number)
  const suffix = h >= 12 && h < 24 ? 'p' : 'a'
  const h12 = ((h + 11) % 12) + 1
  return m ? `${h12}:${String(m).padStart(2, '0')}${suffix}` : `${h12}${suffix}`
}

/** The share of a day's guests each open service gets, summing to 1. */
export function serviceShares(services) {
  const open = services.filter(s => s.on)
  if (!open.length) return {}
  if (open.length === 1) return { [open[0].id]: 1 }
  const lunch = Math.min(90, Math.max(10, Number(services.find(s => s.id === 'lunch')?.share) || 0)) / 100
  return { lunch, dinner: 1 - lunch }
}

/** Guests per day after applying the "expected change vs last week" adjustment. */
export function expectedGuests(guests, source, adjustPct) {
  return guests.map(g => {
    const n = Math.max(0, Math.round(Number(g) || 0))
    return source === 'last-week' ? Math.round(n * (1 + adjustPct / 100)) : n
  })
}

export function staffNeeded(role, covers) {
  if (covers <= 0) return 0
  const scaled = role.perGuests > 0 ? Math.ceil(covers / role.perGuests) : 0
  return Math.max(Number(role.min) || 0, scaled)
}

export function loadLevel(covers, peak) {
  if (!covers) return 'Closed'
  const r = peak ? covers / peak : 0
  return r >= 0.85 ? 'Peak' : r >= 0.6 ? 'Busy' : r >= 0.35 ? 'Steady' : 'Quiet'
}

/**
 * Build the week's roster.
 * @returns {{
 *   slots: Array, byEmployee: Object, totals: Object, gaps: Array, idle: Array, peakCovers: number
 * }}
 */
export function buildRoster({ team, guests, roles, services, allowDoubles = false }) {
  const shares = serviceShares(services)
  const open = services.filter(s => s.on)

  const slots = []
  guests.forEach((dayGuests, day) => {
    let left = dayGuests
    for (const [i, s] of open.entries()) {
      // The last service takes what's left, so the services add up to the day.
      const covers = i === open.length - 1 ? left : Math.round(dayGuests * (shares[s.id] || 0))
      left -= covers
      if (covers <= 0) continue
      const hours = serviceHours(s)
      const need = Object.fromEntries(roles.map(r => [r.id, staffNeeded(r, covers)]))
      slots.push({ key: `${day}-${s.id}`, day, service: s, hours, covers, need, assigned: {}, short: {} })
    }
  })
  const peakCovers = Math.max(0, ...slots.map(s => s.covers))
  slots.forEach(s => { s.load = loadLevel(s.covers, peakCovers) })

  const byEmployee = Object.fromEntries(team.map(e => [e.id, { shifts: [], hours: 0, days: new Set() }]))
  const order = team.map((e, i) => [e.id, i])
  const position = Object.fromEntries(order)

  // Busiest services first; ties go in calendar order.
  const fillOrder = [...slots].sort((a, b) => b.covers - a.covers || a.day - b.day || a.service.start.localeCompare(b.service.start))

  for (const slot of fillOrder) {
    for (const role of roles) {
      const want = slot.need[role.id]
      if (!want) continue
      const pool = team.filter(e => {
        if (e.role !== role.id || !e.available[slot.day]) return false
        const rec = byEmployee[e.id]
        if (rec.shifts.length >= (Number(e.maxShifts) || 0)) return false
        if (rec.shifts.some(x => x.key === slot.key)) return false
        if (!allowDoubles && rec.days.has(slot.day)) return false
        return true
      })
      pool.sort((a, b) => {
        const ra = byEmployee[a.id]
        const rb = byEmployee[b.id]
        const da = ra.days.has(slot.day) ? 1 : 0
        const db = rb.days.has(slot.day) ? 1 : 0
        return da - db || ra.hours - rb.hours || ra.shifts.length - rb.shifts.length || position[a.id] - position[b.id]
      })
      const picked = pool.slice(0, want)
      for (const e of picked) {
        const rec = byEmployee[e.id]
        rec.shifts.push({ key: slot.key, day: slot.day, service: slot.service, hours: slot.hours })
        rec.hours += slot.hours
        rec.days.add(slot.day)
      }
      slot.assigned[role.id] = picked.map(e => e.id)
      if (picked.length < want) slot.short[role.id] = want - picked.length
    }
  }

  let required = 0
  let filled = 0
  let hours = 0
  const shortByRole = {}
  for (const slot of slots) {
    for (const role of roles) {
      required += slot.need[role.id]
      const got = slot.assigned[role.id]?.length || 0
      filled += got
      hours += got * slot.hours
      if (slot.short[role.id]) {
        const g = (shortByRole[role.id] ||= { role, shifts: 0, slots: [] })
        g.shifts += slot.short[role.id]
        g.slots.push(slot)
      }
    }
  }

  const gaps = roles
    .filter(r => shortByRole[r.id])
    .map(r => {
      const g = shortByRole[r.id]
      const teamCount = team.filter(e => e.role === r.id).length
      return { ...g, teamCount, hiresNeeded: Math.ceil(g.shifts / DEFAULT_MAX_SHIFTS) }
    })

  const idle = team.filter(e => !byEmployee[e.id].shifts.length)

  for (const rec of Object.values(byEmployee)) {
    rec.hours = Math.round(rec.hours * 100) / 100
    rec.shifts.sort((a, b) => a.day - b.day || a.service.start.localeCompare(b.service.start))
  }

  return {
    slots,
    byEmployee,
    peakCovers,
    gaps,
    idle,
    totals: {
      covers: slots.reduce((n, s) => n + s.covers, 0),
      required,
      filled,
      hours: Math.round(hours * 10) / 10,
      coverage: required ? Math.round((filled / required) * 100) : 100,
      services: slots.length,
    },
  }
}

/** Monday on or after the given date (ISO yyyy-mm-dd). */
export function nextMonday(from = new Date()) {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const add = (8 - d.getDay()) % 7
  d.setDate(d.getDate() + add)
  return isoDate(d)
}

export const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/** The seven dates of the week, starting from weekStart, as short labels. */
export function weekDates(weekStart) {
  const [y, m, d] = (weekStart || nextMonday()).split('-').map(Number)
  return DAYS.map((_, i) => {
    const date = new Date(y, m - 1, d + i)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })
}

/** The weekday index (Mon = 0) of an ISO date. */
export function weekdayIndex(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return (new Date(y, m - 1, d).getDay() + 6) % 7
}

export function shiftLabel(service) {
  return `${service.name} ${formatTime(service.start)}–${formatTime(service.end)}`
}

const csvCell = (v) => {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function rosterCsv({ team, roles, roster, dates, venueName }) {
  const roleName = Object.fromEntries(roles.map(r => [r.id, r.name]))
  const header = ['Employee', 'Role', ...DAYS.map((d, i) => `${d} ${dates[i]}`), 'Shifts', 'Hours']
  const rows = sortTeam(team, roles).map(e => {
    const rec = roster.byEmployee[e.id]
    const cells = DAYS.map((_, day) => {
      if (!e.available[day]) return 'Unavailable'
      const s = rec.shifts.filter(x => x.day === day)
      return s.length ? s.map(x => shiftLabel(x.service)).join(' + ') : 'Off'
    })
    return [e.name, roleName[e.role] || e.role, ...cells, rec.shifts.length, rec.hours]
  })
  return [[`Roster — ${venueName} — week of ${dates[0]}`], header, ...rows].map(r => r.map(csvCell).join(',')).join('\n')
}

export function sortTeam(team, roles) {
  const rank = Object.fromEntries(roles.map((r, i) => [r.id, i]))
  return team
    .map((e, i) => [e, i])
    .sort(([a, ia], [b, ib]) => (rank[a.role] ?? 99) - (rank[b.role] ?? 99) || ia - ib)
    .map(([e]) => e)
}
