import { useMemo } from 'react';

const polar = (cx, cy, radius, angle) => ({ x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) });
const signOrder = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const aspectColors = {
  Conjunction: '#80917d',
  Sextile: '#91a5a2',
  Square: '#c27f6c',
  Trine: '#758c78',
  Opposition: '#a27b86',
};

export default function ChartWheel({ chart, selectedName, onSelect }) {
  const cx = 240, cy = 240, outer = 205, inner = 149;
  const rotation = (longitude) => ((longitude - chart.ascendant.longitude + 360) % 360) - 90;
  const placements = useMemo(() => chart.placements.map((p, i) => {
    const angle = rotation(p.longitude) * Math.PI / 180;
    return { ...p, point: polar(cx, cy, 127 - (i % 2) * 24, angle) };
  }), [chart]);
  const pointsByName = new Map(placements.map((placement) => [placement.name, placement]));
  const aspectLines = chart.aspects.map((aspect) => ({
    ...aspect,
    first: pointsByName.get(aspect.a.name)?.point,
    second: pointsByName.get(aspect.b.name)?.point,
  })).filter((aspect) => aspect.first && aspect.second);
  return <div className="wheel-wrap"><svg className="chart-wheel" viewBox="0 0 480 480" role="group" aria-label="Interactive birth chart. Select a planet or point to explore it.">
    <circle cx={cx} cy={cy} r={outer} fill="#fbfaf7" stroke="#dedbd3" strokeWidth="1" />
    <circle cx={cx} cy={cy} r={inner} fill="none" stroke="#e6e2da" strokeWidth="1" />
    <circle cx={cx} cy={cy} r="83" fill="none" stroke="#eeeae3" strokeWidth="1" />
    {Array.from({ length: 12 }, (_, i) => {
      const rad = rotation(i * 30) * Math.PI / 180;
      const p1 = polar(cx, cy, inner, rad), p2 = polar(cx, cy, outer, rad);
      const label = polar(cx, cy, 178, rotation(i * 30 + 15) * Math.PI / 180);
      return <g key={`sign-${i}`}><line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#e3dfd7" strokeWidth="1" /><text x={label.x} y={label.y + 7} textAnchor="middle" className={`sign-glyph sign-${i}`}>{signOrder[i]}</text></g>;
    })}
    {aspectLines.map((aspect) => <line
      key={`${aspect.a.name}-${aspect.b.name}-${aspect.name}`}
      x1={aspect.first.x}
      y1={aspect.first.y}
      x2={aspect.second.x}
      y2={aspect.second.y}
      stroke={aspectColors[aspect.name]}
      strokeWidth="1"
      opacity=".34"
      aria-hidden="true"
    />)}
    {Array.from({ length: 12 }, (_, i) => {
      const cusp = chart.houseCusps[i];
      const lineAngle = rotation(cusp) * Math.PI / 180;
      const labelAngle = rotation(cusp + 15) * Math.PI / 180;
      const p = polar(cx, cy, inner, lineAngle), label = polar(cx, cy, 98, labelAngle);
      return <g key={`house-${i}`}><line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e9e5de" strokeWidth=".8" /><text x={label.x} y={label.y + 4} textAnchor="middle" className="house-number">{i + 1}</text></g>;
    })}
    <line x1={cx} y1="91" x2={cx} y2="35" stroke="#758b75" strokeWidth="1.4" />
    {placements.map((p) => <g
      key={p.name}
      className={`wheel-planet${selectedName === p.name ? ' selected' : ''}`}
      role="button"
      tabIndex="0"
      aria-label={`${p.name} in ${p.sign.name}, house ${p.house}`}
      aria-pressed={selectedName === p.name}
      onClick={() => onSelect(p.name)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(p.name);
        }
      }}
    ><circle cx={p.point.x} cy={p.point.y - 4} r="12" fill="#fbfaf7" /><text x={p.point.x} y={p.point.y} textAnchor="middle" dominantBaseline="middle" className={`planet-glyph ${p.name === 'Sun' || p.name === 'Moon' ? 'luminary' : ''}`}>{p.symbol}</text></g>)}
    <text x="240" y="223" textAnchor="middle" className="wheel-center-label">BIRTH</text><text x="240" y="246" textAnchor="middle" className="wheel-center-label">CHART</text>
    <text x="240" y="28" textAnchor="middle" className="angle-label">ASC</text><text x="438" y="246" textAnchor="middle" className="angle-label">DSC</text>
  </svg><div className="wheel-caption"><span><i className="legend-dot planet-dot" /> Planets</span><span><i className="legend-dot house-dot" /> Houses</span><span><i className="legend-line" /> Zodiac signs</span><span><i className="legend-line aspect-line" /> Aspects</span></div></div>;
}
