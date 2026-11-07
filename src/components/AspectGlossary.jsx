import SectionHeading from './SectionHeading.jsx';
import InfoTip from './InfoTip.jsx';
import { modalities } from '../data/modalities.js';
import ModalityText from './ModalityText.jsx';
import './AspectGlossary.css';

const terms = [
  {
    name: 'Conjunction',
    symbol: '☌',
    angle: '0°',
    style: 'Blending',
    description: 'Two planets appear close together in the chart. Their themes can feel combined or especially noticeable.',
  },
  {
    name: 'Sextile',
    symbol: '⚹',
    angle: '60°',
    style: 'Opportunity',
    description: 'A supportive connection that may offer an opening. It often works best when you choose to engage with it.',
  },
  {
    name: 'Square',
    symbol: '□',
    angle: '90°',
    style: 'Tension',
    description: 'A dynamic angle associated with friction or competing priorities. It can be a prompt to adjust, act, or find a new approach.',
  },
  {
    name: 'Trine',
    symbol: '△',
    angle: '120°',
    style: 'Flow',
    description: 'A naturally compatible connection that may feel easy to access. Sometimes it takes intention to make the most of that ease.',
  },
  {
    name: 'Opposition',
    symbol: '☍',
    angle: '180°',
    style: 'Balance',
    description: 'Two planets face across the chart, highlighting contrasting needs or perspectives that may benefit from balance.',
  },
];

export default function AspectGlossary() {
  return <section className="aspect-glossary" id="aspect-glossary" aria-labelledby="aspect-glossary-title">
    <SectionHeading
      eyebrow="Astrology glossary"
      title="What are the major aspects?"
      description="Aspects are angular relationships between planets in a birth chart. They describe how the planets’ themes are connected in astrological interpretation."
    />
    <div className="glossary-intro">
      <span className="glossary-intro-symbol">✳</span>
      <p>The Major aspects shown in your chart are conjunction, sextile, square, trine, and opposition. The chart checks the angle between each pair of planets; the orb tells you how close that angle is to exact. A smaller orb means a closer match—not a stronger prediction.</p>
    </div>
    <div className="aspect-glossary-grid">
      {terms.map((term) => <article className="glossary-card" key={term.name}>
        <div className="glossary-card-top">
          <span className="glossary-symbol">{term.symbol}</span>
          <span className="glossary-angle">{term.angle}</span>
        </div>
        <h3>{term.name}<InfoTip label={term.name}>{term.description} The listed degree is the exact angle associated with this major aspect.</InfoTip></h3>
        <span className="glossary-style">{term.style}</span>
        <p>{term.description}</p>
      </article>)}
    </div>
    <section className="modality-glossary" aria-labelledby="modality-glossary-title">
      <h3 id="modality-glossary-title"><ModalityText>Cardinal, Fixed & Mutable</ModalityText>: the three modalities</h3>
      <p>A modality describes how a sign symbolically approaches action and change. Elements describe the kind of energy; modalities describe how it moves. Every chart contains all three styles—none is better than another, and they are not rigid personality labels.</p>
      <div className="modality-glossary-grid">
        {Object.entries(modalities).map(([name, term]) => <article className="glossary-card" key={name}>
          <h4><ModalityText>{name}</ModalityText></h4>
          <p>{term.description}</p>
          <p><strong>Signs:</strong> {term.signs}</p>
        </article>)}
      </div>
    </section>
    <p className="glossary-note">These are traditional astrological meanings offered as reflection prompts, not scientific findings or fixed outcomes.</p>
  </section>;
}
