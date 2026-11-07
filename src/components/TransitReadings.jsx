import { useEffect, useMemo, useState } from 'react';
import { dailyReading, weeklyReading } from '../lib/transits.js';
import SectionHeading from './SectionHeading.jsx';

function formatDate(date, options) {
  return date.toLocaleDateString(undefined, options);
}

function FocusCard({ focus, weekly }) {
  return <article className="transit-focus-card">
    <div className="transit-focus-top">
      <span className="transit-house-number">{String(focus.number).padStart(2, '0')}</span>
      {weekly && <span className="transit-days">{focus.sampleCount} of 7 days</span>}
    </div>
    <h4>{focus.title}</h4>
    <p>{focus.description}</p>
    <p>{focus.explanation}</p>
    <div className="transit-focus-guidance">
      <strong>In everyday life</strong>
      <p>{focus.everyday}</p>
      <strong>A gentle check-in</strong>
      <p>{focus.prompt}</p>
    </div>
    <div className="transit-focus-themes">
      <strong>Why it appears here</strong>
      <p>{weekly
        ? `At least one planet was in this house in ${focus.sampleCount} of the 7 daily samples. The planets below were present at some point in those samples, not necessarily all together.`
        : 'These planets are currently passing through this area of your birth chart. Their traditional themes offer different angles to reflect on:'}</p>
      <ul>{focus.planetaryThemes.map((theme) => <li key={theme}>{theme}</li>)}</ul>
    </div>
  </article>;
}

function ContactCard({ contact, weekly }) {
  return <article className="transit-contact">
    <span className="transit-contact-symbol">{contact.symbol}</span>
    <div className="transit-contact-copy">
      <strong>{contact.transitName} {contact.aspectName} natal {contact.natalName}</strong>
      {weekly && <small>{formatDate(contact.date, { weekday: 'short', month: 'short', day: 'numeric' })} · {contact.orb.toFixed(1)}° orb</small>}
      {!weekly && <small>{contact.orb.toFixed(1)}° orb · {contact.aspectName}</small>}
      <p>{contact.text}</p>
    </div>
  </article>;
}

export default function TransitReadings({ chart }) {
  const [period, setPeriod] = useState('day');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const day = useMemo(() => dailyReading(chart, now), [chart, now]);
  const week = useMemo(() => weeklyReading(chart, now), [chart, now]);
  const weekly = period === 'week';
  const focus = weekly ? week.focus : day.focus;
  const contacts = weekly ? week.contacts : day.contacts;
  const dateLabel = weekly
    ? `${formatDate(week.startDate, { month: 'long', day: 'numeric' })} – ${formatDate(week.endDate, { month: 'long', day: 'numeric', year: 'numeric' })}`
    : formatDate(day.date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return <section className="transit-section" aria-labelledby="transit-title">
    <SectionHeading
      eyebrow="Your current sky"
      title="Daily & weekly reflections"
      description="Current planetary positions are compared with your birth chart to explore which life areas may feel more in focus."
    />
    <div className="transit-controls">
      <div className="transit-tabs" role="group" aria-label="Choose reading period">
        <button type="button" className={!weekly ? 'active' : ''} aria-pressed={!weekly} onClick={() => setPeriod('day')}>Today</button>
        <button type="button" className={weekly ? 'active' : ''} aria-pressed={weekly} onClick={() => setPeriod('week')}>Next 7 days</button>
      </div>
      <span className="transit-date">{dateLabel}</span>
    </div>
    <div className="transit-intro">
      <span className="transit-spark">✳</span>
      <p>{weekly
        ? 'A broad look at the coming week. Planetary positions are sampled once per day; these are themes to reflect on, not events that are certain to happen.'
        : 'A snapshot of the sky right now. Use these themes as prompts for reflection, not as instructions or predictions.'}</p>
    </div>
    <div className="transit-subheading"><span className="eyebrow">Life areas in focus</span><span>{weekly ? 'Most emphasized over the week' : 'Based on today’s transits through your houses'}</span></div>
    <p className="transit-focus-intro">Think of a house as a life topic, and a transit as a planet’s current position passing through that topic in your birth chart. These are up to three areas highlighted by the calculation—not a ranking of what matters most in your life. More planets, or more sampled days, does not mean something important must happen. Use the examples as optional reflection ideas.</p>
    {focus.length
      ? <div className="transit-focus-grid">{focus.map((item) => <FocusCard key={item.number} focus={item} weekly={weekly} />)}</div>
      : <p className="transit-empty">No distinct house emphasis stood out in this reading.</p>}
    <div className="transit-subheading transit-contact-heading"><span className="eyebrow">Planet-to-chart connections</span><span>{weekly ? 'Closest connections sampled this week' : 'Closest active connections now'}</span></div>
    {contacts.length
      ? <div className="transit-contact-list">{contacts.map((contact) => <ContactCard key={`${contact.key}-${weekly ? contact.date.toISOString().slice(0, 10) : 'today'}`} contact={contact} weekly={weekly} />)}</div>
      : <p className="transit-empty">No close major planetary contacts at this moment. House themes above still offer a general lens for today.</p>}
    <p className="transit-disclaimer">Astrological transits are interpretive symbolism, not scientifically validated forecasts or advice about health, money, relationships, or other important decisions.</p>
  </section>;
}
