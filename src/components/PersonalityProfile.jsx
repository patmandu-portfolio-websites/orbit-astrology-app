import SectionHeading from './SectionHeading.jsx';
import { bigThreeReading, lifeAreaReadings, overallPersonality, personalityProfile } from '../lib/personality.js';
import './PersonalityProfile.css';

export default function PersonalityProfile({ chart }) {
  const placements = personalityProfile(chart);
  const bigThree = bigThreeReading(chart);
  const overall = overallPersonality(chart);
  const lifeAreas = lifeAreaReadings(chart);
  return <section className="personality-section" aria-labelledby="personality-title">
    <SectionHeading
      eyebrow="Personality & way of being"
      title="A fuller picture of you"
      description="Explore your core personality, the way your signs work together, and how the chart can offer reflection on relationships and direction."
    />
    <section className="big-three-reading" aria-labelledby="big-three-reading-title">
      <header className="big-three-reading-heading">
        <span className="eyebrow">The Big Three</span>
        <h3 id="big-three-reading-title">{bigThree.headline}</h3>
        <p>{bigThree.combination}</p>
      </header>
      <p className="big-three-synthesis">{bigThree.synthesis}</p>
      <div className="big-three-narratives">
        {bigThree.sections.map((section) => <article className="big-three-narrative" key={section.key}>
          <div className="big-three-narrative-title">
            <span className="big-three-narrative-symbol">{section.symbol}</span>
            <div><h4>{section.heading}</h4><span>{section.subtitle}</span></div>
          </div>
          <div className="big-three-narrative-copy">
            <p>{section.lead}</p>
            <p>{section.detail}</p>
            {section.innerQuote && <blockquote>{section.innerQuote}</blockquote>}
            <p className="big-three-trait"><strong>Possible strengths</strong>{section.strengths}.</p>
            <p className="big-three-trait"><strong>A possible growth edge</strong>{section.challenge}.</p>
          </div>
        </article>)}
      </div>
      <p className="big-three-note">{bigThree.note}</p>
    </section>
    <article className="personality-overview">
      <div className="personality-overview-heading">
        <span className="eyebrow">Your overall personality</span>
        <h3>The pattern of your Big Three</h3>
      </div>
      <div className="personality-overview-copy">
        <p>{overall.summary}</p>
        <ul>{overall.threeThemes.map((theme) => <li key={theme}>{theme}</li>)}</ul>
        <div className="personality-pattern">
          <strong>Your chart’s elemental rhythm</strong>
          <p>{overall.pattern.description}</p>
        </div>
        <small>{overall.note}</small>
      </div>
    </article>
    <div className="personality-life-areas">
      {Object.values(lifeAreas).map((reading) => <article className="personality-life-card" key={reading.title}>
        <div className="personality-life-heading">
          <span className="eyebrow">{reading.title}</span>
          <h3>{reading.sign.symbol} {reading.sign.name} on the {reading.title.startsWith('Relationships') ? '7th' : '10th'}-house cusp</h3>
        </div>
        <div>
          <p>{reading.description}</p>
          <ul>{reading.themes.map((theme) => <li key={theme}>{theme}</li>)}</ul>
        </div>
      </article>)}
    </div>
    <div className="personality-placement-heading">
      <span className="eyebrow">Your personal sign placements</span>
      <h3>Different sides of your personality</h3>
      <p>The sign suggests a style; the house points to an area of life; the planet describes a part of your experience.</p>
    </div>
    <div className="personality-grid">
      {placements.map((placement) => <article className="personality-card" key={placement.name}>
        <div className="personality-card-top">
          <span className="personality-symbol">{placement.symbol}</span>
          <span className="personality-house">{placement.houseNumber} HOUSE</span>
        </div>
        <span className="eyebrow">{placement.heading}</span>
        <h3>{placement.sign.symbol} {placement.sign.name}</h3>
        <p>{placement.role} {placement.description}</p>
        <div className="personality-guidance">
          <p><strong>Helpful qualities</strong>{placement.strengths}</p>
          <p><strong>A gentle growth edge</strong>{placement.stretch}</p>
        </div>
        <span className="personality-context">{placement.sign.element} · {placement.sign.mode} · {placement.houseTitle}</span>
      </article>)}
    </div>
    <p className="personality-note">Sign descriptions are broad archetypes, not fixed labels or scientific assessments. Your chart is one interpretive lens; your experiences and choices are your own.</p>
  </section>;
}
