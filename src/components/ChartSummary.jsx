import { useState } from 'react';
import { Compass, Moon, Sparkles } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';
import ChartWheel from './ChartWheel.jsx';
import { interpretChart } from '../lib/interpretation.js';
import './ChartSummary.css';
import TransitReadings from './TransitReadings.jsx';
import PersonalityProfile from './PersonalityProfile.jsx';
import './TransitReadings.css';
import InfoTip from './InfoTip.jsx';
import ModalityText from './ModalityText.jsx';
import { modalities } from '../data/modalities.js';
import { planets, signs, houses } from '../data/astrology.js';

function ordinal(number) {
  const suffix = number % 100 >= 11 && number % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[number % 10] || 'th');
  return `${number}${suffix}`;
}

export function ChartSummary({ chart, personName }) {
  const [selectedName, setSelectedName] = useState('Sun');
  const [selectedAspect, setSelectedAspect] = useState(null);
  const core = [chart.placements[0], chart.placements[1], { ...chart.ascendant, theme: 'First impressions', text: 'The energy people meet first, and the lens through which you approach new beginnings.' }];
  const firstName = personName?.trim() ? personName.trim().split(' ')[0] : 'you';
  const selectedPlacement = selectedName === 'Ascendant'
    ? chart.ascendant
    : chart.placements.find((placement) => placement.name === selectedName);
  const selectedPlanetAspects = chart.aspects.filter((aspect) => aspect.a.name === selectedName || aspect.b.name === selectedName);
  const selectedAspectKey = (aspect) => `${aspect.a.name}-${aspect.b.name}-${aspect.name}`;
  const aspect = chart.aspects.find((item) => selectedAspect === selectedAspectKey(item)) || chart.aspects[0];
  const interpretation = interpretChart(chart);
  const zodiacLabel = chart.zodiacMode === 'sidereal' ? 'Sidereal · Lahiri' : 'Tropical';
  const houseLabel = { 'whole-sign': 'Whole Sign', equal: 'Equal', porphyry: 'Porphyry' }[chart.houseSystem];
  const planetMeanings = Object.fromEntries(planets.map((planet) => [planet.name, planet.text]));
  const signMeanings = Object.fromEntries(signs.map((sign) => [sign.name, `${sign.name} is a ${sign.mode.toLowerCase()} ${sign.element.toLowerCase()} sign, associated with ${sign.ruler}. ${sign.mode}: ${modalities[sign.mode].short} Its calendar dates are only an approximate tropical Sun-sign guide; placements use the calculated position at birth.`]));
  const sun = chart.placements.find((placement) => placement.name === 'Sun');
  const sunNearBoundary = sun && (sun.degree < 1 || sun.degree >= 29);

  return <section className="chart-section" id="chart">
    <SectionHeading eyebrow="Your personal sky" title={`A map of ${firstName}’s sky`} description="A snapshot of the planets at the moment and place you were born." action={{ href: '#placements', label: 'See all placements' }} />
    <div className="chart-layout">
      <div className="wheel-card">
        <div className="wheel-topline"><span>THE NATAL CHART</span><span className="chart-badge"><span /> {zodiacLabel} · {houseLabel}</span></div>
        <ChartWheel chart={chart} selectedName={selectedName} onSelect={setSelectedName} />
        <div className="selected-placement" aria-live="polite">
          <span className="selected-placement-symbol">{selectedPlacement?.symbol}</span>
          <div>
            <strong>{selectedPlacement?.name} in {selectedPlacement?.sign.name}</strong>
            <p>{selectedPlacement?.text || 'The Ascendant describes the sign rising over the eastern horizon at birth and is a key point in the chart.'} {selectedPlacement && `Placed in the ${ordinal(selectedPlacement.house)} house.`}</p>
            {selectedPlanetAspects.length > 0 && <span className="selected-aspects">Aspects: {selectedPlanetAspects.slice(0, 3).map((item) => `${item.symbol} ${item.a.name === selectedName ? item.b.name : item.a.name}`).join(' · ')}</span>}
          </div>
        </div>
        <div className="chart-footnote"><span>✳</span><span>Select any planet or point to explore it. Chiron’s position is an orbital estimate; lunar nodes use the mean node.</span></div>
      </div>
      <div className="summary-column">
        <div className="big-three-card">
          <div className="big-three-title"><Sparkles size={15} /><span>THE BIG THREE</span></div>
          {core.map((placement, index) => <button className="big-three-row big-three-button" key={placement.name} onClick={() => setSelectedName(placement.name)}>
            <span className={`big-three-icon big-three-${index}`}>{placement.symbol}</span>
            <span className="big-three-info"><span className="big-three-label">{placement.name === 'Ascendant' ? 'Rising' : placement.name}</span><strong>{placement.sign.name}</strong><span>{placement.theme}</span></span>
            <span className="big-three-degree">{Math.floor(placement.degree)}°{String(Math.floor((placement.degree % 1) * 60)).padStart(2, '0')}′</span>
          </button>)}
          {sunNearBoundary && <p className="sun-boundary-note">Your Sun is near a sign boundary at {sun.degree.toFixed(2)}° {sun.sign.name}. This chart uses its calculated position, not a fixed birthday cutoff. For tropical charts, the change can fall on different dates or times depending on the year and time zone; sidereal charts use different boundaries.</p>}
        </div>
        <div className="reading-card">
          <span className="reading-spark">✳</span>
          <div className="reading-card-content">
            <span className="reading-kicker">YOUR CHART AT A GLANCE</span>
            <p>{interpretation.paragraphs[0]}</p>
            <div className="at-glance-big-three">
              {interpretation.bigThree.map((item) => <div className="at-glance-sign" key={item.label}>
                <strong>{item.label} · {item.sign}</strong>
                <span><ModalityText>{item.description}</ModalityText></span>
              </div>)}
            </div>
            <div className="at-glance-balances">
              <div className="at-glance-balance">
                <strong>Elements <span>What kind of energy</span></strong>
                {interpretation.elements.map((item) => <div className="quality-row" key={item.name}>
                  <span>{item.name}</span><span className="quality-bar"><i style={{ width: `${item.count * 10}%` }} /></span><span>{item.count}</span>
                </div>)}
              </div>
              <div className="at-glance-balance">
                <strong>Styles <span>How energy moves</span></strong>
                {interpretation.modes.map((item) => <div className="quality-row" key={item.name}>
                  <span><ModalityText>{item.name}</ModalityText></span><span className="quality-bar"><i style={{ width: `${item.count * 10}%` }} /></span><span>{item.count}</span>
                </div>)}
              </div>
            </div>
            <div className="at-glance-definitions">
              <p><strong>Elements:</strong> Fire brings energy and initiative; Earth grounds ideas in practical steps; Air emphasizes ideas and communication; Water centers feeling and intuition.</p>
              <p><strong>Styles (modalities):</strong> <ModalityText>Cardinal starts, Fixed sustains, and Mutable adapts.</ModalityText> These describe different ways a sign may approach change and action.</p>
              <small>Counts show how the ten planets are distributed across these sign groups. Every chart contains all four elements and all three styles; a lower count does not mean an area is missing.</small>
            </div>
          </div>
        </div>
        <div className="chart-meta"><span><Compass size={14} /> {chart.date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</span><span><Moon size={14} /> Birth time shapes the rising sign</span></div>
      </div>
    </div>
    <section className="personal-reading" aria-labelledby="personal-reading-title">
      <div><span className="eyebrow">A beginner-friendly reading</span><h3 id="personal-reading-title">How your placements work together</h3></div>
      <div className="personal-reading-copy">{interpretation.paragraphs.map((paragraph) => <p key={paragraph}><ModalityText>{paragraph}</ModalityText></p>)}
        <h4>One chart, different sides of experience</h4>
        {interpretation.synthesis.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <p>Being near a sign boundary does not assign a planet to two signs in this chart. Other signs contribute through their own planetary placements and house cusps—not because a nearby sign automatically blends into your Sun sign.</p>
        <div className="placement-style-grid">
          {interpretation.placementStyles.map((style) => <article className="placement-style-card" key={style.name}>
            <h4>{style.name} in {style.sign}</h4>
            <strong>{style.theme}</strong>
            <p><ModalityText>{style.description}</ModalityText></p>
            <small>{style.context}</small>
          </article>)}
        </div>
        <div className="element-insight"><Sparkles size={15} /><span>{interpretation.elementDescription}</span></div>
        <small>{interpretation.note}</small>
      </div>
    </section>
    <TransitReadings chart={chart} />
    <PersonalityProfile chart={chart} />
    <div className="placements-block" id="placements">
      <div className="placements-heading"><div><span className="eyebrow">Planetary placements</span><h3>Your planets, by sign & house</h3></div><span className="placement-caption">✦ Sign = how it expresses · House = where it lives <InfoTip label="Reading a placement">The planet describes what part of experience is involved, its sign describes the style it may take, and its house points to an area of life where it may show up.</InfoTip></span></div>
      <div className="placement-table">
        <div className="placement-table-head"><span>BODY <InfoTip label="Planet">A planet represents a part of experience, such as identity, emotions, communication, connection, or drive.</InfoTip></span><span>SIGN <InfoTip label="Sign">A sign describes the style or quality through which a planet’s theme may be expressed.</InfoTip></span><span>HOUSE <InfoTip label="House">A house represents an area of life where a planet’s themes may be noticed.</InfoTip></span><span>MEANING <InfoTip label="Placement meaning">A short description of the planet’s traditional astrological theme.</InfoTip></span></div>
        {chart.placements.map((placement) => {
          const house = houses[placement.house - 1];
          const planetMeaning = planetMeanings[placement.name] || placement.text || `${placement.name} is an astrological point used as a symbolic reflection on growth and personal themes.`;
          const signMeaning = signMeanings[placement.sign.name];
          return <div className={`placement-row${selectedName === placement.name ? ' selected' : ''}`} key={placement.name}>
            <span className="placement-planet"><button className="placement-select" onClick={() => setSelectedName(placement.name)} aria-pressed={selectedName === placement.name}><span>{placement.symbol}</span>{placement.name}</button><InfoTip label={placement.name}>{planetMeaning}</InfoTip></span>
            <span className="placement-sign"><span>{placement.sign.symbol}</span>{placement.sign.name}<small>{Math.floor(placement.degree)}°{String(Math.floor((placement.degree % 1) * 60)).padStart(2, '0')}′</small><InfoTip label={`${placement.sign.name} sign`}>{signMeaning}</InfoTip></span>
            <span className="placement-house">{String(placement.house).padStart(2, '0')}<small>house</small><InfoTip label={`${house.title}, house ${placement.house}`}>{house.description} The sign on this house cusp gives additional context.</InfoTip></span>
            <span className="placement-theme">{placement.theme}<InfoTip label={placement.theme}>{planetMeaning}</InfoTip></span>
          </div>;
        })}
      </div>
    </div>
    <section className="aspects-section" aria-labelledby="aspects-title">
      <div className="placements-heading"><div><span className="eyebrow">Planetary relationships</span><h3 id="aspects-title">Major aspects <InfoTip label="Major aspects">Aspects are angular relationships between two chart points. This list shows conjunctions, sextiles, squares, trines, and oppositions that fall within the selected orb.</InfoTip></h3></div><span className="placement-caption">Major angles within a 6° orb (8° for Sun and Moon) <InfoTip label="Orb">The orb is how many degrees an aspect is from its exact angle. A smaller orb means the angle is closer to exact, not that it predicts a stronger event.</InfoTip></span></div>
      {chart.aspects.length ? <>
        <div className="aspect-list">
          {chart.aspects.map((item) => <button
            className={`aspect-item${selectedAspectKey(item) === (aspect && selectedAspectKey(aspect)) ? ' selected' : ''}`}
            key={selectedAspectKey(item)}
            onClick={() => setSelectedAspect(selectedAspectKey(item))}
          >
            <span className="aspect-symbol">{item.symbol}</span>
            <span><strong>{item.a.name} {item.name} {item.b.name}</strong><small>{item.a.sign.name} · {item.b.sign.name}</small></span>
            <span className="aspect-orb">{item.orb.toFixed(1)}° orb</span>
          </button>)}
        </div>
        {aspect && <div className="aspect-explanation" aria-live="polite"><strong>{aspect.symbol} {aspect.name}: {aspect.a.name} and {aspect.b.name} <InfoTip label={aspect.name}>{aspect.meaning} In this chart, the angle describes a symbolic relationship between these two planetary themes.</InfoTip></strong><p>This {aspect.name.toLowerCase()} {aspect.meaning} In this chart, {aspect.a.name} in {aspect.a.sign.name} connects with {aspect.b.name} in {aspect.b.sign.name}. Astrology offers reflective symbolism, not a factual prediction.</p></div>}
      </> : <p className="no-aspects">No major aspects fell within the selected orbs for these placements.</p>}
    </section>
  </section>;
}
