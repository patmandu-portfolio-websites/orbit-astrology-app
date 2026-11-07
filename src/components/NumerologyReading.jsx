import { Sparkles } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';
import ModalityText from './ModalityText.jsx';
import { calculateNumerology, guidanceForNumber } from '../lib/numerology.js';
import './NumerologyReading.css';

function NumberCard({ label, number, detail }) {
  const guidance = guidanceForNumber(number);
  return <article className="numerology-card">
    <span className="numerology-card-label">{label}</span>
    <strong className="numerology-number">{number}</strong>
    <strong className="numerology-theme">{guidance.meaning}</strong>
    <p>{guidance.detail}</p>
    <div className="numerology-everyday"><strong>Everyday idea</strong><span>{guidance.everyday}</span></div>
    <div className="numerology-prompt"><strong>Ask yourself</strong><span>{guidance.prompt}</span></div>
    <small>{detail}</small>
  </article>;
}

function astrologyLink(numberLabel, number, placement, connection) {
  return <article className="numerology-bridge-card" key={numberLabel}>
    <span className="numerology-card-label">{numberLabel} {number} + {placement.name} in {placement.sign.name}</span>
    <p><ModalityText>{connection(placement.sign, guidanceForNumber(number))}</ModalityText></p>
    <small>{placement.sign.element} · <ModalityText>{placement.sign.mode}</ModalityText></small>
  </article>;
}

export default function NumerologyReading({ birthDate, birthName, chart }) {
  const reading = calculateNumerology(birthDate, birthName);
  const sun = chart.birthTimeUnknown ? null : chart.placements.find((placement) => placement.name === 'Sun');
  const moon = chart.birthTimeUnknown ? null : chart.placements.find((placement) => placement.name === 'Moon');
  const rising = chart.ascendant;

  return <section className="numerology-section" id="numerology" aria-labelledby="numerology-title">
    <SectionHeading
      eyebrow="A companion perspective"
      title="Your numerology"
      description="Explore number patterns from your birth date and, if you choose, your full birth name—with ideas for bringing their themes into everyday life."
    />
    <div className="numerology-intro">
      <Sparkles size={16} aria-hidden="true" />
      <p>Astrology describes planetary patterns through signs and life areas; numerology reflects on number patterns. The descriptions below offer practical reflection prompts, not rules about who you are or predictions about what will happen.</p>
    </div>
    <div className="numerology-grid">
      <NumberCard label="Life Path" number={reading.lifePath} detail="Calculated from all digits in your birth date." />
      <NumberCard label="Birthday" number={reading.birthday} detail="Based on the day of the month you were born." />
      <NumberCard label={`Personal Year · ${reading.personalYearCalendar}`} number={reading.personalYear} detail="A calendar-year theme, recalculated each year." />
      {reading.expression !== null && <>
        <NumberCard label="Expression" number={reading.expression} detail="Uses all letters in your full birth name." />
        <NumberCard label="Soul Urge" number={reading.soulUrge} detail="Uses the vowels in your full birth name (A, E, I, O, U)." />
      </>}
    </div>
    {reading.expression === null && <p className="numerology-name-note">Name-based numbers are optional. Add your full birth name in the form above to include them; it is used only in this browser.</p>}
    <section className="numerology-bridge" aria-labelledby="numerology-bridge-title">
      <div className="numerology-bridge-heading">
        <span className="eyebrow">Two symbolic lenses, one reflection</span>
        <h3 id="numerology-bridge-title">Where numerology and astrology meet</h3>
        <p>These pairings are a conversational way to explore both systems, not a traditional rule that one number belongs to one planet. Notice what resonates and leave what does not.</p>
        {chart.birthTimeUnknown && <p>Numerology does not require a birth time. Personalized astrology pairings are omitted here because your birth time is unknown; use the date-only sign possibilities above as tentative reflection prompts.</p>}
      </div>
      <div className="numerology-bridge-grid">
        {sun && astrologyLink('Life Path', reading.lifePath, sun, (sign, guidance) =>
          `Your Life Path ${reading.lifePath} offers a broad numerology theme: ${guidance.meaning.toLowerCase()} Your ${sign.name} Sun describes identity and vitality through ${sign.element.toLowerCase()} qualities. Together, they invite you to consider how this number’s theme might find expression in what you care about and choose to grow into.`)}
        {moon && astrologyLink('Birthday', reading.birthday, moon, (sign, guidance) =>
          `Your Birthday number ${reading.birthday} highlights a personal quality in numerology: ${guidance.meaning.toLowerCase()} Your ${sign.name} Moon describes emotional needs and instincts through ${sign.element.toLowerCase()} qualities. You might reflect on how the number’s theme could support the ways you process feelings and seek steadiness.`)}
        {rising && astrologyLink(`Personal Year ${reading.personalYearCalendar}`, reading.personalYear, rising, (sign, guidance) =>
          `Your Personal Year ${reading.personalYear} is a numerology prompt for this calendar year: ${guidance.meaning.toLowerCase()} Your ${sign.name} Rising describes one way you may approach new situations, with ${sign.mode.toLowerCase()} ${sign.element.toLowerCase()} qualities. Consider a small way to carry the year’s theme into a new beginning or routine.`)}
      </div>
      <p className="numerology-reflection"><strong>Use it as a check-in:</strong> choose one description, ask whether it feels useful in your current circumstances, then turn it into a small action or question. Your choices and lived experience matter more than any label.</p>
    </section>
    <div className="numerology-everyday-guide">
      <strong>A simple everyday practice</strong>
      <ol>
        <li><b>Notice:</b> Pick a number theme that feels relevant, rather than trying to apply every description.</li>
        <li><b>Connect:</b> Compare it with one chart placement, such as your Sun’s sense of purpose or Moon’s emotional needs.</li>
        <li><b>Apply:</b> Choose a practical prompt from the cards and revisit how it felt later—without treating it as a forecast.</li>
      </ol>
    </div>
    <p className="numerology-note">These are traditional numerology interpretations for reflection and education, not scientific assessments or fixed outcomes. This uses the Pythagorean letter-number system and preserves 11, 22, and 33 as master numbers.</p>
  </section>;
}
