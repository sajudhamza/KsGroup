// Smart Rostering for hotels: the hotel defaults for the shared roster engine
// in rostering.js. The load is occupied rooms per night, and every shift that
// day is sized to it (no lunch/dinner style split).

import { DEFAULT_MAX_SHIFTS, newEmployee } from './rostering.js'

export const HOTEL_SHIFTS = [
  { id: 'am', name: 'Morning', short: 'AM', on: true, start: '07:00', end: '15:00' },
  { id: 'pm', name: 'Evening', short: 'PM', on: true, start: '15:00', end: '23:00' },
  { id: 'night', name: 'Overnight', short: 'Night', on: true, start: '23:00', end: '07:00' },
]

const rule = (perGuests, min) => ({ perGuests, min })
const OFF = rule(0, 0)

// One person per N occupied rooms on that shift (0 = fixed headcount), never
// below the minimum. A role with 0 / 0 on a shift doesn't work it.
export const HOTEL_ROLES = [
  { id: 'mod', name: 'Manager on Duty', rules: { am: rule(0, 1), pm: rule(0, 1), night: OFF } },
  { id: 'frontdesk', name: 'Front Desk Agent', rules: { am: rule(60, 1), pm: rule(50, 1), night: OFF } },
  { id: 'audit', name: 'Night Auditor', rules: { am: OFF, pm: OFF, night: rule(0, 1) } },
  { id: 'hksup', name: 'Housekeeping Supervisor', rules: { am: rule(100, 1), pm: OFF, night: OFF } },
  { id: 'attendant', name: 'Room Attendant', rules: { am: rule(15, 1), pm: OFF, night: OFF } },
  { id: 'houseperson', name: 'Houseperson / Laundry', rules: { am: rule(60, 1), pm: OFF, night: OFF } },
  { id: 'bell', name: 'Bell / Valet', rules: { am: rule(80, 0), pm: rule(60, 0), night: OFF } },
  { id: 'maintenance', name: 'Maintenance', rules: { am: rule(0, 1), pm: rule(100, 0), night: OFF } },
]

// Occupied rooms per night for a 117-key hotel, Monday first.
export const SAMPLE_OCCUPANCY = [70, 76, 82, 88, 105, 112, 64]
export const SAMPLE_ROOMS = 117

// Sized for the sample week, with housekeeping one room attendant short on
// the weekend so the shortfall notes have something to show.
const SAMPLE_TEAM = [
  ['Rachel Adams', 'mod'], ['Victor Hale', 'mod'], ['Nadia Farouk', 'mod', 4],
  ['Lauren Price', 'frontdesk'], ['Diego Ramos', 'frontdesk'], ['Megan Cole', 'frontdesk'], ['Tariq Aziz', 'frontdesk'],
  ['Hailey Brooks', 'frontdesk'], ['Jonah Fisher', 'frontdesk'], ['Elena Petrova', 'frontdesk', 4],
  ['Walter Grimes', 'audit', 4], ['Joy Mensah', 'audit', 4],
  ['Rosa Delgado', 'hksup'], ['Martin Kowalski', 'hksup', 4],
  ['Ana Pereira', 'attendant'], ['Lucia Gomez', 'attendant'], ['Mai Nguyen', 'attendant'], ['Fatou Diallo', 'attendant'],
  ['Irina Volkova', 'attendant'], ['Carmen Ortiz', 'attendant'], ['Grace Owusu', 'attendant'], ['Hye-jin Park', 'attendant'],
  ['Beatriz Lima', 'attendant', 2],
  ['Tyler Moss', 'houseperson'], ['Andre Baptiste', 'houseperson'], ['Kemal Arslan', 'houseperson', 4],
  ['Chris Dunn', 'bell'], ['Malik Johnson', 'bell'], ['Sean O’Brien', 'bell'], ['Paolo Ricci', 'bell'], ['Eddie Tran', 'bell'],
  ['Frank Miller', 'maintenance'], ['Ray Dubois', 'maintenance'], ['Gus Larsen', 'maintenance'], ['Omar Haddad', 'maintenance', 3],
]

export function sampleHotelTeam() {
  return SAMPLE_TEAM.map(([name, role, max], i) => {
    const e = newEmployee(name, role, max ?? DEFAULT_MAX_SHIFTS)
    // A few days off so availability shows up in the roster.
    if (i % 6 === 2) e.available[1] = false
    if (i % 9 === 4) e.available[3] = false
    return e
  })
}

/** Match a typed role ("front desk", "housekeeper", "engineer") to a hotel role id. */
export function hotelRoleFromText(text, roles = HOTEL_ROLES) {
  const t = text.trim().toLowerCase()
  if (!t) return null
  const hit = roles.find(r => r.id === t || r.name.toLowerCase() === t)
  if (hit) return hit.id
  if (/night|audit/.test(t)) return 'audit'
  if (/supervisor|executive housekeeper|inspector/.test(t)) return 'hksup'
  if (/attendant|housekeep|room ?clean|maid/.test(t)) return 'attendant'
  if (/house ?person|houseman|laundry|public area/.test(t)) return 'houseperson'
  if (/bell|valet|porter|door/.test(t)) return 'bell'
  if (/mainten|engineer|technician|handy/.test(t)) return 'maintenance'
  if (/front|desk|reception|agent|guest service/.test(t)) return 'frontdesk'
  if (/manager|mod|duty|gm/.test(t)) return 'mod'
  return null
}
