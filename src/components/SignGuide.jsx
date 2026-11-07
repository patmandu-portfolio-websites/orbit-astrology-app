import { ArrowUpRight } from 'lucide-react';
import { signs } from '../data/astrology.js';
import SectionHeading from './SectionHeading.jsx';

export default function SignGuide() {
  return <section className="content-section" id="signs"><SectionHeading eyebrow="The zodiac" title="12 signs, 4 elements" description="Each sign brings its own style. The element describes its natural energy; the modality describes how it moves. The dates below are approximate tropical Sun-sign ranges, not fixed cutoffs: the exact change depends on the year, birth time, and time zone. Sidereal dates differ." action={{ href: '#houses', label: 'Explore houses' }} />
    <div className="element-strip">{['Fire', 'Earth', 'Air', 'Water'].map((element) => <div className={`element-chip ${element.toLowerCase()}`} key={element}><span className="element-dot" />{element}</div>)}</div>
    <div className="sign-grid">{signs.map((sign) => <article className="sign-card" key={sign.name} style={{ '--sign-color': sign.tone }}><div className="sign-card-top"><span className="sign-card-symbol">{sign.symbol}</span><span className="sign-card-date">{sign.date}</span></div><h3>{sign.name}</h3><p>{sign.element} · {sign.mode}</p><div className="sign-card-footer"><span>Ruling planet</span><strong>{sign.ruler} <ArrowUpRight size={13} /></strong></div></article>)}</div>
  </section>;
}
