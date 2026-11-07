import { useEffect, useRef, useState } from 'react';
import BirthForm from './BirthForm.jsx';
import SectionHeading from './SectionHeading.jsx';
import { calculateChart, calculateDateOnlyChart } from '../lib/chart.js';
import { compareCharts, compareNumerology } from '../lib/compatibility.js';
import './CompatibilityScreen.css';

export default function CompatibilityScreen({ chart, person, details, onBack }) {
  const [comparison, setComparison] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const titleRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
    titleRef.current?.scrollIntoView({ block: 'start' });
  }, []);

  function handleSubmit(values) {
    setBusy(true);
    setError('');
    try {
      const input = { ...values, zodiacMode: chart.zodiacMode };
      const otherChart = input.birthTimeUnknown ? calculateDateOnlyChart(input) : calculateChart(input);
      const astrology = compareCharts(chart, otherChart);
      const numerology = compareNumerology(details, input);
      setComparison({ astrology, numerology, name: values.name.trim() || 'Person 2' });
      requestAnimationFrame(() => {
        resultsRef.current?.focus();
        resultsRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      });
    } catch (err) {
      setError(err.message || 'We could not compare these charts. Check the details and try again.');
    } finally {
      setBusy(false);
    }
  }

  const firstName = person.trim() || 'Your chart';
  return <main className="compatibility-screen">
    <button type="button" className="comparison-back" onClick={onBack}>← Back to your chart</button>
    <h1 ref={titleRef} tabIndex={-1}>Two skies, one conversation</h1>
    <p>Compare {firstName} with a partner, friend, or collaborator. Synastry means looking at relationships between two birth charts; it is a symbolic reflection tool, not a test of whether a relationship will succeed.</p>
    <div className="comparison-form-layout">
      <div>
        <SectionHeading eyebrow="A second perspective" title="Their birth details" description="Enter details they are comfortable sharing. No public birth-chart lookup is required; calculations stay in this browser. Only a requested birthplace search goes to the location service." />
        <p>Both charts use {chart.zodiacMode === 'sidereal' ? 'Sidereal · Lahiri' : 'Tropical'} for a consistent comparison. Optional name numbers appear only when both people provide a usable full birth name.</p>
      </div>
      <div>
        <BirthForm onSubmit={handleSubmit} busy={busy} zodiacMode={chart.zodiacMode} />
        {error && <p className="form-error" role="alert">{error}</p>}
      </div>
    </div>
    {comparison && <section className="comparison-results" ref={resultsRef} tabIndex={-1} aria-label="Comparison results">
      <SectionHeading eyebrow="Relationship reflections" title={`${firstName} & ${comparison.name}`} description="No compatibility score or good/bad verdict: explore possible common ground, different needs, and questions you can discuss together." />
      {comparison.astrology.timeUnknown && <p className="sun-boundary-note">At least one birth time is unknown. Sign descriptions use date-only samples where needed and remain tentative. Cross-chart aspects, Rising signs, and house comparisons are not shown.</p>}
      <div className="comparison-grid">
        {comparison.astrology.readings.map((area) => <article className="comparison-card" key={area.name}>
          <h3>{area.title}</h3>
          <p><strong>{firstName}: {area.name} in {area.firstSigns}</strong>{area.firstDescription && ` — ${area.firstDescription}.`}</p>
          <p><strong>{comparison.name}: {area.name} in {area.secondSigns}</strong>{area.secondDescription && ` — ${area.secondDescription}.`}</p>
          <p>{area.reflection}</p>
          <p><strong>How you might relate:</strong> {area.relating}</p>
          <p><strong>Try together:</strong> {area.everyday}</p>
          <p className="comparison-prompt"><strong>Talk about it:</strong> {area.prompt}</p>
        </article>)}
      </div>
      {!comparison.astrology.timeUnknown && <section className="comparison-aspects">
        <h2>Connections between your charts</h2>
        <p>These angles connect one person’s Sun, Moon, Mercury, Venus, or Mars with the other’s. The orb measures distance from an exact angle. These use the same 6° allowance (8° for Sun or Moon) as the natal chart; a close angle is not a measure of relationship quality. Houses and Rising signs are not part of this comparison.</p>
        {comparison.astrology.aspects.length ? <div className="comparison-grid">
          {comparison.astrology.aspects.map((aspect) => <article className="comparison-card" key={`${aspect.a.name}-${aspect.name}-${aspect.b.name}`}>
            <h3>{aspect.symbol} {aspect.name}</h3>
            <p>{firstName}’s {aspect.a.name} in {aspect.a.sign.name} · {comparison.name}’s {aspect.b.name} in {aspect.b.sign.name}</p>
            <p>This {aspect.name.toLowerCase()} {aspect.meaning} Consider the two themes: {aspect.a.theme.toLowerCase()} and {aspect.b.theme.toLowerCase()}.</p>
            <p className="comparison-prompt"><strong>In your interactions:</strong> {aspect.relating}</p>
            <small>{aspect.orb.toFixed(1)}° orb</small>
          </article>)}
        </div> : <p>No major cross-chart aspects fell within these allowances. That is not a sign of incompatibility.</p>}
      </section>}
      <section className="comparison-numerology">
        <h2>Your numbers side by side</h2>
        <p>Numerology offers a separate lens, not evidence for the astrology comparison. A shared number is not automatically a match, and different numbers are not a mismatch.</p>
        <div className="comparison-grid">
          {comparison.numerology.map((number) => <article className="comparison-card" key={number.label}>
            <h3>{number.label}</h3>
            <p><strong>{firstName}: {number.firstNumber}</strong> — {number.firstMeaning}</p>
            <p><strong>{comparison.name}: {number.secondNumber}</strong> — {number.secondMeaning}</p>
            <p><strong>An everyday idea for {firstName}:</strong> {number.firstEveryday}</p>
            <p><strong>An everyday idea for {comparison.name}:</strong> {number.secondEveryday}</p>
            <p>Discuss whether either idea fits your lives before trying it. You can support different preferences without assigning each other a number-based role.</p>
            <p>Which of these themes feels familiar, and how could you make space for both perspectives?</p>
          </article>)}
        </div>
      </section>
      <p>Use these readings only as conversation starters. Respect, communication, consent, shared circumstances, and lived experience matter more than any chart or number. Neither system is a scientific relationship assessment.</p>
    </section>}
  </main>;
}
