import { useEffect, useRef, useState } from 'react';
import { MapPin, CalendarDays, Clock3, Globe2, Sparkles, LoaderCircle, Search } from 'lucide-react';
import { offsetForLocalDateTime, timezoneForCoordinates } from '../lib/timezone.js';
import './BirthForm.css';

const initial = { name: '', birthDate: '1995-04-17', birthTime: '14:32', timezoneOffset: '12', location: 'Auckland, New Zealand', latitude: '-36.8485', longitude: '174.7633' };
const nominatimUrl = 'https://nominatim.openstreetmap.org/search';
const standardOffsets = [
  ...Array.from({ length: 53 }, (_, index) => -12 + index * 0.5),
  5.75,
  8.75,
  12.75,
];

function formatOffset(offset) {
  const minutes = Math.round(Math.abs(offset) * 60);
  const sign = offset < 0 ? '−' : '+';
  return `UTC${sign}${Math.floor(minutes / 60)}${minutes % 60 ? `:${String(minutes % 60).padStart(2, '0')}` : ''}`;
}

function Field({ label, icon: Icon, children, hint }) {
  return <label className="field"><span className="field-label">{Icon && <Icon size={14} />}{label}</span>{children}{hint && <span className="field-hint">{hint}</span>}</label>;
}

export default function BirthForm({ onSubmit, busy }) {
  const [latitude, setLatitude] = useState(initial.latitude);
  const [longitude, setLongitude] = useState(initial.longitude);
  const [birthDate, setBirthDate] = useState(initial.birthDate);
  const [birthTime, setBirthTime] = useState(initial.birthTime);
  const [birthTimeUnknown, setBirthTimeUnknown] = useState(false);
  const [timezoneId, setTimezoneId] = useState(() => timezoneForCoordinates(initial.latitude, initial.longitude));
  const [automaticOffset, setAutomaticOffset] = useState(() => offsetForLocalDateTime(
    timezoneForCoordinates(initial.latitude, initial.longitude),
    initial.birthDate,
    initial.birthTime,
  ));
  const [manualOffset, setManualOffset] = useState(null);
  const [timezoneError, setTimezoneError] = useState('');
  const [lookupBusy, setLookupBusy] = useState(false);
  const [lookupMessage, setLookupMessage] = useState('');
  const [lookupError, setLookupError] = useState('');
  const lastLookupAt = useRef(0);

  useEffect(() => {
    try {
      const zone = timezoneForCoordinates(latitude, longitude);
      setTimezoneId(zone);
      setManualOffset(null);
      setTimezoneError('');
    } catch (error) {
      setTimezoneError(error.message || 'Could not determine a time zone for these coordinates.');
    }
  }, [latitude, longitude]);

  useEffect(() => {
    try {
      setAutomaticOffset(offsetForLocalDateTime(timezoneId, birthDate, birthTimeUnknown ? '12:00' : birthTime));
      setTimezoneError('');
    } catch (error) {
      setAutomaticOffset(null);
      setTimezoneError(error.message || 'Could not determine the UTC offset for this birth time.');
    }
  }, [timezoneId, birthDate, birthTime, birthTimeUnknown]);

  function handleSubmit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    values.birthTimeUnknown = birthTimeUnknown;
    if (birthTimeUnknown) values.birthTime = '12:00';
    if (manualOffset === null) {
      try {
        const zone = timezoneForCoordinates(values.latitude, values.longitude);
        const offset = offsetForLocalDateTime(zone, values.birthDate, values.birthTime);
        values.timezoneOffset = String(offset);
        values.timezoneId = zone;
        setTimezoneId(zone);
        setAutomaticOffset(offset);
        setTimezoneError('');
      } catch (error) {
        setTimezoneError(error.message || 'Could not determine the UTC offset for this birth time.');
        return;
      }
    }
    onSubmit(values);
  }

  async function handleLocationLookup(event) {
    const form = event.currentTarget.form;
    const place = new FormData(form).get('location')?.toString().trim();
    setLookupMessage('');
    setLookupError('');

    if (!place) {
      setLookupError('Enter a birthplace before searching.');
      return;
    }

    setLookupBusy(true);
    try {
      const delay = Math.max(0, 1000 - (Date.now() - lastLookupAt.current));
      if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
      lastLookupAt.current = Date.now();

      const url = new URL(nominatimUrl);
      url.search = new URLSearchParams({ format: 'jsonv2', limit: '1', q: place }).toString();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      let response;
      try {
        response = await fetch(url, { signal: controller.signal });
      } finally {
        clearTimeout(timeout);
      }

      if (!response.ok) throw new Error(`Location search failed (${response.status}).`);
      const results = await response.json();
      if (!results.length) {
        setLookupError('No matching place found. Try adding a region or country.');
        return;
      }

      const result = results[0];
      const foundLatitude = Number(result.lat);
      const foundLongitude = Number(result.lon);
      if (!Number.isFinite(foundLatitude) || !Number.isFinite(foundLongitude)) {
        throw new Error('The location service returned invalid coordinates.');
      }

      setLatitude(String(foundLatitude));
      setLongitude(String(foundLongitude));
      setManualOffset(null);
      setLookupMessage(`Coordinates found for ${result.display_name}. Check that this is the right place.`);
    } catch (error) {
      setLookupError(error.name === 'AbortError'
        ? 'Location search timed out. Please try again.'
        : error.message || 'Location search failed. Check your connection and try again.');
    } finally {
      setLookupBusy(false);
    }
  }

  return <form className="birth-form" onSubmit={handleSubmit}>
    <div className="form-title"><span className="form-icon"><Sparkles size={18} /></span><div><h3>Your birth details</h3><p>Accuracy matters for your rising sign and houses.</p></div></div>
    <Field label="Name (optional)"><input name="name" placeholder="What should we call you?" /></Field>
    <Field label="Full birth name (optional)" hint="Used only for optional numerology name numbers; it is not sent to any service."><input name="birthName" autoComplete="off" placeholder="As it appeared at birth" /></Field>
    <div className="form-row">
      <Field label="Date of birth" icon={CalendarDays}><input name="birthDate" type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} required /></Field>
      <Field label="Time of birth" icon={Clock3}><input name="birthTime" type="time" value={birthTime} onChange={(event) => setBirthTime(event.target.value)} required={!birthTimeUnknown} disabled={birthTimeUnknown} /></Field>
    </div>
    <label className="unknown-time-option"><input type="checkbox" checked={birthTimeUnknown} onChange={(event) => setBirthTimeUnknown(event.target.checked)} />I don’t know my birth time</label>
    {birthTimeUnknown && <p className="location-message">We use local noon as an approximate snapshot and sample the day for sign changes. Rising sign, houses, and time-dependent readings are omitted. The Moon and boundary signs may be uncertain.</p>}
    <Field label="Birthplace" icon={MapPin}><input name="location" defaultValue={initial.location} placeholder="City, country" /></Field>
    <button className="location-lookup" type="button" onClick={handleLocationLookup} disabled={lookupBusy}>
      {lookupBusy ? <LoaderCircle size={14} className="spin" /> : <Search size={14} />}
      {lookupBusy ? 'Finding coordinates…' : 'Find coordinates'}
    </button>
    {lookupError && <p className="location-message location-error" role="alert">{lookupError}</p>}
    {lookupMessage && <p className="location-message" role="status">{lookupMessage}</p>}
    <div className="form-row coordinates-row">
      <Field label="Latitude"><input name="latitude" type="number" step="any" value={latitude} onChange={(event) => setLatitude(event.target.value)} placeholder="−90 to 90" required /></Field>
      <Field label="Longitude"><input name="longitude" type="number" step="any" value={longitude} onChange={(event) => setLongitude(event.target.value)} placeholder="−180 to 180" required /></Field>
    </div>
    <Field label="UTC offset at birth" icon={Globe2} hint={manualOffset !== null
      ? `Manual override. Detected location time zone: ${timezoneId || 'unavailable'}.`
      : timezoneId
        ? `Automatically calculated for ${timezoneId}, including daylight saving time. If the clock changed twice that day, the earlier occurrence is used. Change this field to override.`
        : 'Enter a UTC offset manually if the location time zone is unavailable.'}>
      <select name="timezoneOffset" value={manualOffset ?? automaticOffset ?? ''} onChange={(event) => setManualOffset(Number(event.target.value))} required>
        <option value="" disabled>Choose UTC offset</option>
        {automaticOffset !== null && !standardOffsets.includes(automaticOffset) && (
          <option value={automaticOffset}>{formatOffset(automaticOffset)} · detected</option>
        )}
        {Array.from({ length: 53 }, (_, index) => {
          const value = -12 + index * 0.5;
          return <option value={value} key={value}>{formatOffset(value)}</option>;
        })}
        {[5.75, 8.75, 12.75].map((value) => (
          <option value={value} key={value}>{formatOffset(value)}</option>
        ))}
      </select>
    </Field>
    {timezoneError && <p className="location-message location-error" role="alert">{timezoneError}</p>}
    <div className="chart-options">
      <Field label="Zodiac system"><select name="zodiacMode" defaultValue="tropical"><option value="tropical">Tropical</option><option value="sidereal">Sidereal (Lahiri)</option></select></Field>
      <Field label="House system"><select name="houseSystem" defaultValue="whole-sign" disabled={birthTimeUnknown}><option value="whole-sign">Whole Sign</option><option value="equal">Equal</option><option value="porphyry">Porphyry</option></select></Field>
    </div>
    <button className="submit-button" type="submit" disabled={busy}>{busy ? <><LoaderCircle size={17} className="spin" />Calculating your chart…</> : <>Reveal my chart <span>→</span></>}</button>
    <p className="privacy-note">Only your birthplace search is sent to OpenStreetMap Nominatim. Time-zone lookup is offline; your birth details and numerology name stay in this browser.</p>
    <p className="location-attribution">Location search by <a href="https://nominatim.openstreetmap.org/" target="_blank" rel="noreferrer">Nominatim</a> · © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a></p>
  </form>;
}
