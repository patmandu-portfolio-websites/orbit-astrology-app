import * as Astronomy from 'astronomy-engine';
import { signs, planets } from '../data/astrology.js';

const wrap = (n) => ((n % 360) + 360) % 360;
const radians = (degrees) => degrees * Math.PI / 180;
const degrees = (radiansValue) => radiansValue * 180 / Math.PI;

export function zodiacPosition(longitude) {
  const angle = wrap(longitude);
  const index = Math.floor(angle / 30);
  return { longitude: angle, sign: signs[index], degree: angle % 30 };
}

function lahiriAyanamsa(date) {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const centuries = (jd - 2451545) / 36525;
  return 23.853055 + 1.3969713 * centuries + 0.0003086 * centuries * centuries;
}

function siderealAngles(date, latitude, longitude) {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const t = (jd - 2451545) / 36525;
  const gmst = wrap(280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * t * t - t * t * t / 38710000);
  const theta = radians(wrap(gmst + longitude));
  const obliquity = radians(23.439291 - 0.0130042 * t);
  const lat = radians(latitude);
  const asc = Math.atan2(-Math.cos(theta), Math.sin(obliquity) * Math.tan(lat) + Math.cos(obliquity) * Math.sin(theta));
  const mc = Math.atan2(Math.sin(theta), Math.cos(theta) * Math.cos(obliquity));
  return { ascendant: wrap(degrees(asc)), midheaven: wrap(degrees(mc)) };
}

function chironLongitude(date) {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const daysSinceEpoch = jd - 2461200.5;
  const semiMajorAxis = 13.6842676085;
  const eccentricity = 0.3797656311;
  const inclination = radians(6.9305744688);
  const ascendingNode = radians(209.2961258613);
  const perihelionArgument = radians(339.2878326590);
  const meanAnomaly = radians(wrap(216.7198966018 + 0.0194702593257484 * daysSinceEpoch));
  let eccentricAnomaly = meanAnomaly;
  for (let i = 0; i < 12; i += 1) {
    eccentricAnomaly -= (eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly)
      / (1 - eccentricity * Math.cos(eccentricAnomaly));
  }

  const orbitalX = semiMajorAxis * (Math.cos(eccentricAnomaly) - eccentricity);
  const orbitalY = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity) * Math.sin(eccentricAnomaly);
  const cosNode = Math.cos(ascendingNode), sinNode = Math.sin(ascendingNode);
  const cosPerihelion = Math.cos(perihelionArgument), sinPerihelion = Math.sin(perihelionArgument);
  const cosInclination = Math.cos(inclination), sinInclination = Math.sin(inclination);
  const chironX = (cosNode * cosPerihelion - sinNode * sinPerihelion * cosInclination) * orbitalX
    + (-cosNode * sinPerihelion - sinNode * cosPerihelion * cosInclination) * orbitalY;
  const chironY = (sinNode * cosPerihelion + cosNode * sinPerihelion * cosInclination) * orbitalX
    + (-sinNode * sinPerihelion + cosNode * cosPerihelion * cosInclination) * orbitalY;

  const earthEquatorial = Astronomy.HelioVector(Astronomy.Body.Earth, date);
  const obliquity = radians(23.439291);
  const earthX = earthEquatorial.x;
  const earthY = earthEquatorial.y * Math.cos(obliquity) + earthEquatorial.z * Math.sin(obliquity);
  return wrap(degrees(Math.atan2(chironY - earthY, chironX - earthX)));
}

export function getPlanetaryLongitudes(date) {
  const result = {};
  result.Sun = wrap(Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Sun, date, true)).elon);
  result.Moon = wrap(Astronomy.EclipticGeoMoon(date).lon);
  for (const planet of planets.slice(2)) {
    result[planet.name] = wrap(Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body[planet.name], date, true)).elon);
  }
  result.Chiron = chironLongitude(date);
  const centuries = (date.getTime() / 86400000 + 2440587.5 - 2451545) / 36525;
  result['North Node'] = wrap(125.04452 - 1934.136261 * centuries + 0.0020708 * centuries ** 2 + centuries ** 3 / 450000);
  result['South Node'] = wrap(result['North Node'] + 180);
  return result;
}

function houseCusps(ascendant, midheaven, houseSystem) {
  if (houseSystem === 'equal') {
    return Array.from({ length: 12 }, (_, i) => wrap(ascendant + i * 30));
  }
  if (houseSystem === 'porphyry') {
    const ic = wrap(midheaven + 180);
    const descendant = wrap(ascendant + 180);
    const quadrants = [[ascendant, ic], [ic, descendant], [descendant, midheaven], [midheaven, ascendant]];
    const cusps = new Array(12);
    quadrants.forEach(([start, end], quadrant) => {
      const arc = wrap(end - start);
      for (let third = 0; third < 3; third += 1) {
        cusps[quadrant * 3 + third] = wrap(start + arc * third / 3);
      }
    });
    return cusps;
  }
  const firstSign = Math.floor(ascendant / 30);
  return Array.from({ length: 12 }, (_, i) => wrap(firstSign * 30 + i * 30));
}

export function houseForLongitude(longitude, cusps) {
  for (let i = 0; i < cusps.length; i += 1) {
    const next = cusps[(i + 1) % cusps.length];
    if (wrap(longitude - cusps[i]) < wrap(next - cusps[i])) return i + 1;
  }
  return 12;
}

export function calculateChart({
  birthDate,
  birthTime,
  timezoneOffset,
  latitude,
  longitude,
  zodiacMode = 'tropical',
  houseSystem = 'whole-sign',
}) {
  if (!birthDate || !birthTime) throw new Error('Enter a birth date and time to calculate your chart.');
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hour, minute] = birthTime.split(':').map(Number);
  const offset = Number(timezoneOffset);
  if (!Number.isFinite(offset) || offset < -12 || offset > 14) throw new Error('Enter a time-zone offset from UTC between −12 and +14.');
  const localDate = new Date(0);
  localDate.setUTCFullYear(year, month - 1, day);
  localDate.setUTCHours(hour, minute, 0, 0);
  if (
    localDate.getUTCFullYear() !== year
    || localDate.getUTCMonth() + 1 !== month
    || localDate.getUTCDate() !== day
    || hour < 0 || hour > 23
    || minute < 0 || minute > 59
  ) {
    throw new Error('Please enter a valid date and time.');
  }
  if (!['tropical', 'sidereal'].includes(zodiacMode)) throw new Error('Choose a supported zodiac system.');
  if (!['whole-sign', 'equal', 'porphyry'].includes(houseSystem)) throw new Error('Choose a supported house system.');
  const utcMs = localDate.getTime() - offset * 3600000;
  const date = new Date(utcMs);
  if (Number.isNaN(date.getTime())) throw new Error('Please enter a valid date and time.');
  const lat = Number(latitude), lon = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    throw new Error('Enter valid coordinates: latitude −90 to 90 and longitude −180 to 180.');
  }
  const positions = getPlanetaryLongitudes(date);
  const tropicalAngles = siderealAngles(date, lat, lon);
  const ayanamsa = zodiacMode === 'sidereal' ? lahiriAyanamsa(date) : 0;
  const adjusted = (longitude) => wrap(longitude - ayanamsa);
  const ascendantLongitude = adjusted(tropicalAngles.ascendant);
  const midheavenLongitude = adjusted(tropicalAngles.midheaven);
  const cusps = houseCusps(ascendantLongitude, midheavenLongitude, houseSystem);
  const placements = [...planets, {
    name: 'North Node', symbol: '☊', theme: 'Growth & direction',
    text: 'The North Node is an astrological point associated with qualities and experiences you may be learning to develop.',
  }, {
    name: 'South Node', symbol: '☋', theme: 'Familiar patterns',
    text: 'The South Node is opposite the North Node and is associated with familiar strengths, habits, and patterns.',
  }, {
    name: 'Chiron', symbol: '⚷', theme: 'Vulnerability & growth',
    text: 'Chiron is a minor body used in astrology as a symbol for vulnerability, care, and personal growth.',
  }].map((body) => {
    const position = zodiacPosition(adjusted(positions[body.name]));
    return { ...body, ...position, house: houseForLongitude(position.longitude, cusps) };
  });
  return {
    date,
    zodiacMode,
    houseSystem,
    ayanamsa,
    ascendant: { name: 'Ascendant', symbol: 'ASC', ...zodiacPosition(ascendantLongitude), house: 1 },
    midheaven: { name: 'Midheaven', symbol: 'MC', ...zodiacPosition(midheavenLongitude) },
    placements,
    aspects: calculateAspects(placements),
    houseCusps: cusps,
  };
}

const aspects = [
  { name: 'Conjunction', symbol: '☌', angle: 0, meaning: 'blends the two planetary themes, making them feel closely linked.' },
  { name: 'Sextile', symbol: '⚹', angle: 60, meaning: 'offers a supportive opening that can grow through conscious effort.' },
  { name: 'Square', symbol: '□', angle: 90, meaning: 'can create friction that invites adjustment, action, and growth.' },
  { name: 'Trine', symbol: '△', angle: 120, meaning: 'suggests an easy flow between the two planetary themes.' },
  { name: 'Opposition', symbol: '☍', angle: 180, meaning: 'highlights a polarity that may benefit from balance and perspective.' },
];

export function calculateAspects(placements) {
  const found = [];
  for (let first = 0; first < placements.length; first += 1) {
    for (let second = first + 1; second < placements.length; second += 1) {
      const a = placements[first];
      const b = placements[second];
      const separation = Math.abs(((a.longitude - b.longitude + 540) % 360) - 180);
      const luminary = ['Sun', 'Moon'].includes(a.name) || ['Sun', 'Moon'].includes(b.name);
      const maxOrb = luminary ? 8 : 6;
      const match = aspects
        .map((aspect) => ({ ...aspect, orb: Math.abs(separation - aspect.angle) }))
        .filter((aspect) => aspect.orb <= maxOrb)
        .sort((left, right) => left.orb - right.orb)[0];
      if (match) found.push({ ...match, a, b });
    }
  }
  return found.sort((left, right) => left.orb - right.orb);
}
