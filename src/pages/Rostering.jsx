import { useEffect, useMemo, useState } from 'react'
import { TopNav, Kicker, Footer, ProductTabs } from '../components/Parts.jsx'
import { KS_DATA } from '../data.js'
import {
  DAYS, DAY_NAMES, DEFAULT_ROLES, DEFAULT_SERVICES, DEFAULT_MAX_SHIFTS, SAMPLE_GUESTS,
  buildRoster, expectedGuests, newEmployee, sampleTeam, roleFromText, serviceShares,
  formatTime, serviceHours, nextMonday, weekDates, rosterCsv, sortTeam,
} from '../lib/rostering.js'

// Smart Rostering — KS Intelligence: a manager enters the team and a week of
// guest numbers, and gets a roster staffed to the load of each service.

const VENUES = [
  ...KS_DATA.properties
    .filter(p => ['restaurants', 'lounges', 'rooftops'].includes(p.catSlug))
    .map(p => ({ id: p.id, name: p.name })),
  { id: 'other', name: 'Another restaurant' },
]

const STORAGE_PREFIX = 'ks-rostering:v1:'
const EMPTY_GUESTS = ['', '', '', '', '', '', '']

const freshPlan = () => ({
  team: [],
  guests: EMPTY_GUESTS,
  source: 'last-week',
  adjust: 0,
  roles: DEFAULT_ROLES.map(r => ({ ...r })),
  services: DEFAULT_SERVICES.map(s => ({ ...s })),
  allowDoubles: false,
})

// Saved rules are merged onto the defaults by id, so older saves keep working.
const mergeById = (defaults, saved) =>
  defaults.map(d => ({ ...d, ...(Array.isArray(saved) ? saved.find(x => x && x.id === d.id) : null), id: d.id, name: d.name }))

function loadPlan(venueId) {
  const base = freshPlan()
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + venueId)
    if (!raw) return base
    const saved = JSON.parse(raw)
    const roleIds = new Set(base.roles.map(r => r.id))
    return {
      ...base,
      team: Array.isArray(saved.team)
        ? saved.team
          .filter(e => e && typeof e.name === 'string' && roleIds.has(e.role))
          .map(e => ({
            id: String(e.id || Math.random()),
            name: e.name,
            role: e.role,
            maxShifts: Number(e.maxShifts) || DEFAULT_MAX_SHIFTS,
            available: DAYS.map((_, i) => (Array.isArray(e.available) ? e.available[i] !== false : true)),
          }))
        : base.team,
      guests: Array.isArray(saved.guests) && saved.guests.length === 7 ? saved.guests.map(g => (g === '' ? '' : String(g))) : base.guests,
      source: saved.source === 'expected' ? 'expected' : 'last-week',
      adjust: Number(saved.adjust) || 0,
      roles: mergeById(base.roles, saved.roles),
      services: mergeById(base.services, saved.services),
      allowDoubles: !!saved.allowDoubles,
    }
  } catch {
    return base
  }
}

function savePlan(venueId, plan) {
  try { window.localStorage.setItem(STORAGE_PREFIX + venueId, JSON.stringify(plan)) } catch { /* storage unavailable */ }
}

const clampInt = (v, lo, hi) => Math.min(hi, Math.max(lo, Math.round(Number(v) || 0)))
const num = (n) => Number(n).toLocaleString('en-US')
const plural = (n, word, many = `${word}s`) => `${num(n)} ${n === 1 ? word : many}`
const adjustLabel = (p) => (p === 0 ? 'Same as last week' : `${p > 0 ? '+' : '−'}${Math.abs(p)}% vs last week`)

const ToggleTag = ({ on, onClick, children, label }) => (
  <button type="button" className={`tag ${on ? 'tag-active' : ''}`} onClick={onClick} aria-pressed={on} aria-label={label}
    style={{ background: on ? undefined : 'transparent', cursor: 'pointer', fontFamily: 'var(--mono)' }}>
    {children}
  </button>
)

export const HiFiRostering = ({ onNav }) => {
  const [venueId, setVenueId] = useState(VENUES[0].id)
  const [plan, setPlan] = useState(() => loadPlan(VENUES[0].id))
  const [weekStart, setWeekStart] = useState(() => nextMonday())
  const [name, setName] = useState('')
  const [role, setRole] = useState('server')
  const [maxShifts, setMaxShifts] = useState(DEFAULT_MAX_SHIFTS)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [bulkText, setBulkText] = useState('')

  useEffect(() => { savePlan(venueId, plan) }, [venueId, plan])

  const update = (patch) => setPlan(p => ({ ...p, ...(typeof patch === 'function' ? patch(p) : patch) }))
  const venue = VENUES.find(v => v.id === venueId)
  const dates = useMemo(() => weekDates(weekStart), [weekStart])
  const roleName = Object.fromEntries(plan.roles.map(r => [r.id, r.name]))

  const switchVenue = (id) => { setVenueId(id); setPlan(loadPlan(id)) }

  // ----- team -----
  const addOne = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    update(p => ({ team: [...p.team, newEmployee(name, role, clampInt(maxShifts, 1, 14))] }))
    setName('')
  }

  const bulkLines = bulkText.split('\n').map(l => l.trim()).filter(Boolean)
  const addBulk = () => {
    const people = bulkLines.map(line => {
      const [n, ...rest] = line.split(/[,\t;]| - /)
      return newEmployee(n || line, roleFromText(rest.join(' ')) || role, clampInt(maxShifts, 1, 14))
    }).filter(p => p.name)
    if (!people.length) return
    update(p => ({ team: [...p.team, ...people] }))
    setBulkText('')
    setBulkOpen(false)
  }

  const editPerson = (id, patch) => update(p => ({ team: p.team.map(e => (e.id === id ? { ...e, ...patch } : e)) }))
  const removePerson = (id) => update(p => ({ team: p.team.filter(e => e.id !== id) }))
  const toggleDay = (person, day) => editPerson(person.id, { available: person.available.map((a, i) => (i === day ? !a : a)) })

  const clearTeam = () => {
    if (window.confirm(`Remove all ${plan.team.length} people from the ${venue.name} team?`)) update({ team: [] })
  }
  const loadSample = () => update({ team: sampleTeam(), guests: SAMPLE_GUESTS.map(String), source: 'last-week', adjust: 0 })

  // ----- rules -----
  const setRule = (id, patch) => update(p => ({ roles: p.roles.map(r => (r.id === id ? { ...r, ...patch } : r)) }))
  const setService = (id, patch) => update(p => ({ services: p.services.map(s => (s.id === id ? { ...s, ...patch } : s)) }))
  const resetRules = () => update({ roles: DEFAULT_ROLES.map(r => ({ ...r })), services: DEFAULT_SERVICES.map(s => ({ ...s })), allowDoubles: false })

  // ----- roster -----
  const guests = useMemo(() => expectedGuests(plan.guests, plan.source, plan.adjust), [plan.guests, plan.source, plan.adjust])
  const weekGuests = guests.reduce((a, b) => a + b, 0)
  const busiestDay = weekGuests ? guests.indexOf(Math.max(...guests)) : -1
  const openServices = plan.services.filter(s => s.on)
  const shares = serviceShares(plan.services)
  const bothServices = openServices.length === 2

  const roster = useMemo(
    () => buildRoster({ team: plan.team, guests, roles: plan.roles, services: plan.services, allowDoubles: plan.allowDoubles }),
    [plan.team, guests, plan.roles, plan.services, plan.allowDoubles],
  )

  const ready = plan.team.length > 0 && roster.slots.length > 0
  const waiting = !plan.team.length && !weekGuests ? 'Add your team and the week’s guests to build the roster.'
    : !plan.team.length ? 'Add your team to build the roster.'
      : !openServices.length ? 'Turn on at least one service under the staffing rules.'
        : !weekGuests ? 'Enter guest numbers for the week to build the roster.' : null

  const sortedTeam = useMemo(() => sortTeam(plan.team, plan.roles), [plan.team, plan.roles])
  const teamByRole = plan.roles
    .map(r => ({ role: r, people: sortedTeam.filter(e => e.role === r.id) }))
    .filter(g => g.people.length)
  const slotsByDay = DAYS.map((_, day) => roster.slots.filter(s => s.day === day))
  const peakDayGuests = Math.max(1, ...guests)
  const busiestSlot = roster.slots.reduce((best, x) => (!best || x.covers > best.covers ? x : best), null)

  const downloadCsv = () => {
    const csv = rosterCsv({ team: plan.team, roles: plan.roles, roster, dates, venueName: venue.name })
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `roster-${venue.id}-${weekStart}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div className="ks">
      <TopNav active="Technology" onNav={onNav}/>

      <section className="roster-hero" style={{ padding: '100px 56px 40px' }}>
        <div className="container">
          <Kicker>KS Intelligence</Kicker>
          <ProductTabs active="rostering" onNav={onNav}/>
          <h1 className="display-l" style={{ marginTop: 40, maxWidth: 1000 }}>
            Smart Rostering. <span className="ital">Staff to the load.</span>
          </h1>
          <p className="body-l" style={{ marginTop: 28, maxWidth: 700 }}>
            Add your team and how many guests you had last week, or expect this week. Smart Rostering works out
            how many hosts, servers, bartenders and cooks each service needs, then builds a fair roster around
            everyone&apos;s availability.
          </p>
        </div>
      </section>

      <div className="roster-inputs">
        {/* 01 — VENUE & WEEK */}
        <section style={{ padding: '32px 56px' }}>
          <div className="container">
            <div className="mono accent">01 / Restaurant &amp; week</div>
            <div className="roster-row" style={{ marginTop: 20 }}>
              <label className="roster-field">
                <span className="mono">Restaurant</span>
                <select className="ks-input ks-select" value={venueId} onChange={e => switchVenue(e.target.value)}>
                  {VENUES.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </label>
              <label className="roster-field">
                <span className="mono">Week starting</span>
                <input type="date" className="ks-input" value={weekStart} onChange={e => e.target.value && setWeekStart(e.target.value)}/>
              </label>
            </div>
            <div className="mono" style={{ marginTop: 14 }}>
              Each restaurant keeps its own team, guests and rules, saved in this browser only.
            </div>
          </div>
        </section>

        {/* 02 — TEAM */}
        <section style={{ padding: '32px 56px' }}>
          <div className="container">
            <div className="mono accent">02 / Your team</div>

            <form className="roster-row roster-add" style={{ marginTop: 20 }} onSubmit={addOne}>
              <label className="roster-field roster-field-grow">
                <span className="mono">Name</span>
                <input className="ks-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Maria Lopez" autoComplete="off"/>
              </label>
              <label className="roster-field">
                <span className="mono">Role</span>
                <select className="ks-input ks-select" value={role} onChange={e => setRole(e.target.value)}>
                  {plan.roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </label>
              <label className="roster-field roster-field-num">
                <span className="mono">Max shifts / wk</span>
                <input type="number" className="ks-input" min={1} max={14} value={maxShifts}
                  onChange={e => setMaxShifts(e.target.value)} onBlur={() => setMaxShifts(clampInt(maxShifts, 1, 14))}/>
              </label>
              <button type="submit" className="btn btn-fill" disabled={!name.trim()} style={{ opacity: name.trim() ? 1 : 0.5 }}>Add →</button>
            </form>

            <div style={{ marginTop: 18, display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center' }}>
              <button type="button" className="roster-link mono" onClick={() => setBulkOpen(o => !o)} aria-expanded={bulkOpen}>
                {bulkOpen ? '− Close' : '+ Add several at once'}
              </button>
              {!plan.team.length && (
                <button type="button" className="roster-link mono" onClick={loadSample}>Try it with a sample team &amp; week</button>
              )}
            </div>

            {bulkOpen && (
              <div className="roster-bulk">
                <label className="roster-field">
                  <span className="mono">One person per line · Name, Role</span>
                  <textarea className="ks-input roster-textarea" rows={6} value={bulkText} onChange={e => setBulkText(e.target.value)}
                    placeholder={'Maria Lopez, Manager\nLiam Patel, Server\nDaniel Osei, Bartender\nCarlos Mendes, Line Cook'}/>
                </label>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginTop: 14 }}>
                  <button type="button" className="btn" onClick={addBulk} disabled={!bulkLines.length} style={{ opacity: bulkLines.length ? 1 : 0.5 }}>
                    Add {bulkLines.length ? plural(bulkLines.length, 'person', 'people') : 'people'} →
                  </button>
                  <span className="mono">Lines without a role are added as {roleName[role]}, max {clampInt(maxShifts, 1, 14)} shifts.</span>
                </div>
              </div>
            )}

            {plan.team.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
                  <span className="mono mono-on">
                    {plural(plan.team.length, 'person', 'people')} · tap a day to mark someone unavailable
                  </span>
                  <button type="button" className="roster-link mono" onClick={clearTeam}>Clear team</button>
                </div>
                {teamByRole.map(({ role: r, people }) => (
                  <div key={r.id} className="roster-group">
                    <div className="mono">{r.name} · {people.length}</div>
                    {people.map(person => {
                      const rec = roster.byEmployee[person.id]
                      return (
                        <div key={person.id} className="roster-person">
                          <input className="ks-input roster-person-name" value={person.name} aria-label="Name"
                            onChange={e => editPerson(person.id, { name: e.target.value })}/>
                          <select className="ks-input ks-select roster-person-role" value={person.role} aria-label={`${person.name}'s role`}
                            onChange={e => editPerson(person.id, { role: e.target.value })}>
                            {plan.roles.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
                          </select>
                          <label className="roster-person-max mono">
                            Max
                            <input type="number" className="ks-input" min={1} max={14} value={person.maxShifts} aria-label={`${person.name}'s max shifts`}
                              onChange={e => editPerson(person.id, { maxShifts: e.target.value === '' ? '' : clampInt(e.target.value, 1, 14) })}
                              onBlur={() => editPerson(person.id, { maxShifts: clampInt(person.maxShifts, 1, 14) })}/>
                          </label>
                          <div className="roster-days" role="group" aria-label={`${person.name}'s availability`}>
                            {DAYS.map((d, i) => (
                              <button key={d} type="button" className={`roster-day ${person.available[i] ? 'is-on' : ''}`}
                                aria-pressed={person.available[i]} title={`${DAY_NAMES[i]}: ${person.available[i] ? 'available' : 'unavailable'}`}
                                onClick={() => toggleDay(person, i)}>
                                {d[0]}<span className="sr-only">{d.slice(1)}</span>
                              </button>
                            ))}
                          </div>
                          <span className="mono roster-person-load">
                            {ready && rec ? `${rec.shifts.length}/${person.maxShifts || 0} shifts` : ''}
                          </span>
                          <button type="button" className="roster-remove" aria-label={`Remove ${person.name}`} onClick={() => removePerson(person.id)}>✕</button>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 03 — GUESTS */}
        <section style={{ padding: '32px 56px' }}>
          <div className="container">
            <div className="mono accent">03 / Guests</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
              <ToggleTag on={plan.source === 'last-week'} onClick={() => update({ source: 'last-week' })}>Last week&apos;s guests</ToggleTag>
              <ToggleTag on={plan.source === 'expected'} onClick={() => update({ source: 'expected' })}>Expected guests</ToggleTag>
            </div>
            <div className="roster-guests" style={{ marginTop: 24 }}>
              {DAYS.map((d, i) => (
                <label key={d} className="roster-field">
                  <span className="mono">{d} · {dates[i]}</span>
                  <input type="number" inputMode="numeric" min={0} className="ks-input" placeholder="0"
                    value={plan.guests[i]}
                    onChange={e => update(p => ({ guests: p.guests.map((g, j) => (j === i ? e.target.value : g)) }))}/>
                  {plan.source === 'last-week' && plan.adjust !== 0 && Number(plan.guests[i]) > 0 && (
                    <span className="mono roster-expected">→ {num(guests[i])} expected</span>
                  )}
                </label>
              ))}
            </div>
            {plan.source === 'last-week' && (
              <label style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28, maxWidth: 460 }}>
                <span className="mono">This week · {adjustLabel(plan.adjust)}</span>
                <input type="range" min={-50} max={100} step={5} value={plan.adjust}
                  onChange={e => update({ adjust: Number(e.target.value) })}/>
              </label>
            )}
            <div className="mono" style={{ marginTop: 18 }}>
              {weekGuests
                ? `${plural(weekGuests, 'guest')} ${plan.source === 'last-week' && plan.adjust ? 'expected ' : ''}this week · busiest day ${DAY_NAMES[busiestDay]} · enter 0 for days you're closed`
                : 'Enter the number of guests for each day. Leave a day at 0 if you are closed.'}
            </div>
          </div>
        </section>

        {/* 04 — RULES */}
        <section style={{ padding: '32px 56px 56px' }}>
          <div className="container">
            <div className="mono accent">04 / Services &amp; staffing rules</div>
            <details className="roster-rules">
              <summary className="mono mono-on">
                {openServices.map(s => `${s.name} ${formatTime(s.start)}–${formatTime(s.end)}`).join(' · ') || 'No services on'}
                {' '}· adjust staffing rules
              </summary>

              <div className="roster-services">
                {plan.services.map(s => (
                  <div key={s.id} className="roster-service">
                    <label className="roster-check">
                      <input type="checkbox" checked={s.on} onChange={e => setService(s.id, { on: e.target.checked })}/>
                      <span className="serif" style={{ fontSize: 20 }}>{s.name}</span>
                    </label>
                    <label className="roster-field">
                      <span className="mono">Starts</span>
                      <input type="time" className="ks-input" value={s.start} disabled={!s.on} onChange={e => e.target.value && setService(s.id, { start: e.target.value })}/>
                    </label>
                    <label className="roster-field">
                      <span className="mono">Ends</span>
                      <input type="time" className="ks-input" value={s.end} disabled={!s.on} onChange={e => e.target.value && setService(s.id, { end: e.target.value })}/>
                    </label>
                    <span className="mono">{s.on ? `${serviceHours(s)} h shift · ${Math.round((shares[s.id] || 0) * 100)}% of guests` : 'Off'}</span>
                  </div>
                ))}
              </div>

              {bothServices && (
                <label style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24, maxWidth: 460 }}>
                  <span className="mono">Lunch takes {Math.round(shares.lunch * 100)}% of the day&apos;s guests, dinner {Math.round(shares.dinner * 100)}%</span>
                  <input type="range" min={10} max={90} step={5} value={plan.services.find(s => s.id === 'lunch').share}
                    onChange={e => setService('lunch', { share: Number(e.target.value) })}/>
                </label>
              )}

              <div className="rateiq-table-wrap" style={{ marginTop: 28 }}>
                <table className="rateiq-table roster-rules-table">
                  <thead>
                    <tr>
                      <th scope="col">Role</th>
                      <th scope="col">One per … guests</th>
                      <th scope="col">Minimum per service</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.roles.map(r => (
                      <tr key={r.id}>
                        <th scope="row">{r.name}</th>
                        <td>
                          <input type="number" className="ks-input roster-cell-input" min={0} value={r.perGuests} aria-label={`${r.name}: guests per person`}
                            onChange={e => setRule(r.id, { perGuests: clampInt(e.target.value, 0, 1000) })}/>
                        </td>
                        <td>
                          <input type="number" className="ks-input roster-cell-input" min={0} value={r.min} aria-label={`${r.name}: minimum per service`}
                            onChange={e => setRule(r.id, { min: clampInt(e.target.value, 0, 50) })}/>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mono" style={{ marginTop: 14, lineHeight: 1.7, maxWidth: 640 }}>
                Example: servers at one per 30 guests means a 145-guest dinner gets 5 servers. A 0 means a fixed
                headcount, so that role gets exactly its minimum on every service.
              </p>

              <label className="roster-check" style={{ marginTop: 20 }}>
                <input type="checkbox" checked={plan.allowDoubles} onChange={e => update({ allowDoubles: e.target.checked })}/>
                <span className="body">Allow double shifts: the same person can work lunch and dinner on one day</span>
              </label>
              <button type="button" className="roster-link mono" style={{ marginTop: 20 }} onClick={resetRules}>Reset rules to defaults</button>
            </details>
            {waiting && <div className="mono" style={{ marginTop: 28 }}>{waiting}</div>}
          </div>
        </section>
      </div>

      {/* RESULTS */}
      {ready && (
        <section className="roster-results" style={{ padding: '64px 56px 100px', borderTop: '1px solid var(--line)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
              <div>
                <Kicker>Your roster</Kicker>
                <h2 className="display-m" style={{ marginTop: 14 }}>
                  {venue.name} <span className="ital">· week of {dates[0]}</span>
                </h2>
              </div>
              <div className="roster-actions" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button type="button" className="btn" onClick={downloadCsv}>Download CSV</button>
                <button type="button" className="btn btn-ghost" onClick={() => window.print()}>Print</button>
              </div>
            </div>

            <div className="roster-stats" style={{ marginTop: 36 }}>
              <div>
                <div className="mono">Coverage</div>
                <div className="serif rateiq-big">{roster.totals.coverage}%</div>
              </div>
              <div>
                <div className="mono">Shifts filled</div>
                <div className="serif roster-stat">{num(roster.totals.filled)} <span>of {num(roster.totals.required)}</span></div>
              </div>
              <div>
                <div className="mono">Labour hours</div>
                <div className="serif roster-stat">{num(roster.totals.hours)}</div>
              </div>
              <div>
                <div className="mono">Guests</div>
                <div className="serif roster-stat">{num(roster.totals.covers)}</div>
              </div>
            </div>

            <div className="roster-notes" style={{ marginTop: 32 }}>
              {roster.gaps.length === 0 ? (
                <p className="body-l">Every service is fully staffed for the load you expect.</p>
              ) : roster.gaps.map(g => {
                const where = g.slots.map(s => `${DAYS[s.day]} ${s.service.name.toLowerCase()}`).join(', ')
                const roleLower = g.role.name.toLowerCase()
                return (
                  <p key={g.role.id} className="body roster-gap">
                    <span className="mono accent">{g.role.name} · {plural(g.shifts, 'shift')} short</span>
                    {g.teamCount === 0
                      ? <>There is no {roleLower} on the team yet. Add {g.hiresNeeded > 1 ? `about ${g.hiresNeeded}` : 'one'} to cover {where}.</>
                      : <>Not enough people for {where}. Add {g.hiresNeeded > 1 ? `about ${g.hiresNeeded} more` : 'another'} {roleLower}, free up someone&apos;s availability, or raise a max shift count{plan.allowDoubles ? '' : ' or allow doubles'}.</>}
                  </p>
                )
              })}
              {roster.idle.length > 0 && (
                <p className="body" style={{ marginTop: 12 }}>
                  <span className="mono">Not needed this week</span> {roster.idle.map(e => e.name).join(', ')}: the expected load is covered without them.
                </p>
              )}
            </div>

            {/* Load across the week */}
            <div className="mono" style={{ margin: '48px 0 16px' }}>Load across the week</div>
            <div className="roster-load">
              {DAYS.map((d, day) => (
                <div key={d} className={`roster-load-day ${day === busiestDay ? 'is-peak' : ''}`}>
                  <div className="roster-load-bars" aria-hidden="true">
                    {slotsByDay[day].map(s => (
                      <div key={s.key} className={`roster-load-bar is-${s.service.id}`} style={{ height: `${(s.covers / peakDayGuests) * 100}%` }}/>
                    ))}
                  </div>
                  <div className="mono mono-on">{d}</div>
                  <div className="serif" style={{ fontSize: 18 }}>{guests[day] ? num(guests[day]) : '—'}</div>
                  {slotsByDay[day].length
                    ? slotsByDay[day].map(s => (
                      <div key={s.key} className="mono roster-load-label">{s.service.name[0]} · {s.load}</div>
                    ))
                    : <div className="mono roster-load-label">Closed</div>}
                </div>
              ))}
            </div>
            <div className="mono roster-legend" style={{ marginTop: 12 }}>
              {bothServices && <><span><i className="is-lunch"/> Lunch</span><span><i className="is-dinner"/> Dinner</span></>}
              {busiestSlot && (
                <span>Busiest service · {DAY_NAMES[busiestSlot.day]} {busiestSlot.service.name.toLowerCase()}, {plural(busiestSlot.covers, 'guest')}</span>
              )}
            </div>

            {/* Roster */}
            <div className="mono" style={{ margin: '48px 0 12px' }}>Roster</div>
            <div className="rateiq-table-wrap">
              <table className="rateiq-table roster-table">
                <thead>
                  <tr>
                    <th scope="col">Team member</th>
                    {DAYS.map((d, i) => <th scope="col" key={d}>{d}<br/>{dates[i]}</th>)}
                    <th scope="col">Shifts · hrs</th>
                  </tr>
                </thead>
                <tbody>
                  {teamByRole.map(({ role: r, people }) => (
                    <RoleRows key={r.id} role={r} people={people} roster={roster}/>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Coverage by service */}
            <div className="mono" style={{ margin: '48px 0 12px' }}>Staff on each service · scheduled / needed</div>
            <div className="rateiq-table-wrap">
              <table className="rateiq-table roster-table roster-cover-table">
                <thead>
                  <tr>
                    <th scope="col">Role</th>
                    {DAYS.map(d => <th scope="col" key={d}>{d}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {plan.roles.filter(r => roster.slots.some(s => s.need[r.id])).map(r => (
                    <tr key={r.id}>
                      <th scope="row">{r.name}</th>
                      {DAYS.map((d, day) => (
                        <td key={d}>
                          {slotsByDay[day].length === 0 ? <span className="roster-off">—</span>
                            : slotsByDay[day].map(s => {
                              const need = s.need[r.id]
                              const got = s.assigned[r.id]?.length || 0
                              return (
                                <div key={s.key} className={`roster-cover ${got < need ? 'is-short' : ''}`}>
                                  {bothServices ? `${s.service.name[0]} ` : ''}{got}/{need}
                                </div>
                              )
                            })}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mono" style={{ marginTop: 18, fontSize: 9, maxWidth: 680, lineHeight: 1.7 }}>
              Each day&apos;s guests are split across lunch and dinner, and each role is staffed at one person per the
              number of guests in its rule, never below its minimum. The busiest services are filled first, and shifts
              go to whoever has the fewest hours so far, so the week is shared fairly. Nobody is scheduled on a day
              they&apos;re unavailable or past their max shifts.
            </p>
          </div>
        </section>
      )}

      <Footer onNav={onNav}/>
    </div>
  )
}

const RoleRows = ({ role, people, roster }) => (
  <>
    <tr className="roster-role-row">
      <th scope="rowgroup" colSpan={DAYS.length + 2}>{role.name}</th>
    </tr>
    {people.map(person => {
      const rec = roster.byEmployee[person.id]
      return (
        <tr key={person.id}>
          <th scope="row" className="roster-name">{person.name}</th>
          {DAYS.map((d, day) => {
            const shifts = rec.shifts.filter(x => x.day === day)
            return (
              <td key={d}>
                {!person.available[day] ? <span className="roster-off is-na">Unavailable</span>
                  : shifts.length
                    ? shifts.map(x => (
                      <span key={x.key} className={`roster-shift is-${x.service.id}`}>
                        {x.service.name}<small>{formatTime(x.service.start)}–{formatTime(x.service.end)}</small>
                      </span>
                    ))
                    : <span className="roster-off">Off</span>}
              </td>
            )
          })}
          <td className="roster-total">{rec.shifts.length} · {rec.hours}</td>
        </tr>
      )
    })}
  </>
)
