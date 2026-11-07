import SectionHeading from './SectionHeading.jsx';
import { signVoices, relatingReflection } from '../lib/personality.js';
import './ChartSummary.css';

export default function DateOnlyReading({ chart }) {
  return <section className="chart-section" id="chart">
    <SectionHeading eyebrow="Birth time unknown" title="Your date-only sky" description="An approximate local-noon snapshot, not an exact birth chart." />
    <p className="sun-boundary-note">Without a birth time we cannot determine your Rising sign, Midheaven, or houses. The chart wheel, aspects, house-based daily/weekly readings, and full personality synthesis are omitted rather than guessed. Signs below are sampled hourly plus 23:59 across the local birth date; they are not a guarantee of every possible position.</p>
    <p>The {chart.zodiacMode === 'sidereal' ? 'Sidereal · Lahiri' : 'Tropical'} zodiac setting is still applied. Degrees are deliberately omitted. Even where a sign stays the same in the samples, the Moon’s position and aspects can change substantially during the day.</p>
    <div className="placement-style-grid">
      {chart.placements.map((placement) => <article className="placement-style-card" key={placement.name}>
        <h4>{placement.name}: {placement.sampledSigns.join(' / ')}</h4>
        <strong>{placement.theme}</strong>
        <p>{placement.text}</p>
        {placement.sampledSigns.length > 1
          ? <p>Time-sensitive: more than one sign appears in this day’s samples. Neither sign can be confirmed without a birth time.</p>
          : <p>At the sampled times, {placement.sign.name} adds {signVoices[placement.sign.name].qualities}.</p>}
        {placement.sampledSigns.length === 1 && relatingReflection(placement) && <p><strong>A tentative relationship reflection:</strong> {relatingReflection(placement)} This uses sampled sign positions, not an exact birth time.</p>}
      </article>)}
    </div>
  </section>;
}
