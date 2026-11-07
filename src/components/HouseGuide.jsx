import { ArrowUpRight } from 'lucide-react';
import { houses, signs } from '../data/astrology.js';
import SectionHeading from './SectionHeading.jsx';
import InfoTip from './InfoTip.jsx';
import './HouseGuide.css';

export default function HouseGuide({ chart }) {
  const placementsByHouse = chart.placements.reduce((acc, p) => ((acc[p.house] ||= []).push(p), acc), {});
  return <section className="content-section house-section" id="houses"><SectionHeading eyebrow="The twelve houses" title="Where life happens" description="Signs describe the style; houses point to the part of life where that energy shows up. Your rising sign sets the first house." />
    <div className="house-grid">{houses.map((house) => {
      const cuspSign = signs[Math.floor(chart.houseCusps[house.number - 1] / 30)];
      return <article className="house-card" key={house.number}>
        <div className="house-card-head"><span className="house-index">{String(house.number).padStart(2, '0')}</span><span className="house-sign" aria-label={`${cuspSign.name} on house cusp`}>{cuspSign.symbol}<InfoTip label={`${cuspSign.name} on the ${house.number}${house.number === 1 ? 'st' : house.number === 2 ? 'nd' : house.number === 3 ? 'rd' : 'th'} house cusp`}>The cusp is the starting point of a house. This sign adds its style to the life area represented by the house.</InfoTip></span></div>
        <h3>{house.title}<InfoTip label={`House ${house.number}: ${house.title}`}>{house.description} In astrology, the house describes a life area, while its cusp sign describes a style of approaching that area.</InfoTip></h3>
        <p>{house.description}</p>
        <div className="house-planets">{placementsByHouse[house.number]?.map(p => <span key={p.name}>{p.symbol} {p.name}</span>) || <span className="empty-house">No planets here</span>}</div>
      </article>;
    })}</div>
    <p className="house-note"><span>✳</span> An empty house still matters. Its sign and ruling planet offer clues to how that area of life unfolds.</p>
  </section>;
}
