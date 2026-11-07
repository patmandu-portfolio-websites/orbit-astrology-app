import { useState } from 'react';
import { ArrowDown, ArrowRight, Menu, Sparkles, Sun, X } from 'lucide-react';
import BirthForm from './components/BirthForm.jsx';
import { ChartSummary } from './components/ChartSummary.jsx';
import SignGuide from './components/SignGuide.jsx';
import HouseGuide from './components/HouseGuide.jsx';
import SymbolGuide from './components/SymbolGuide.jsx';
import SectionHeading from './components/SectionHeading.jsx';
import { calculateChart, calculateDateOnlyChart } from './lib/chart.js';
import NumerologyReading from './components/NumerologyReading.jsx';
import DateOnlyReading from './components/DateOnlyReading.jsx';

export default function App() {
  const [chart, setChart] = useState(null);
  const [person, setPerson] = useState('');
  const [numerologyDetails, setNumerologyDetails] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  function handleSubmit(values) {
    setBusy(true); setError('');
    try {
      const result = values.birthTimeUnknown ? calculateDateOnlyChart(values) : calculateChart(values);
      setChart(result); setPerson(values.name || '');
      setNumerologyDetails({ birthDate: values.birthDate, birthName: values.birthName || '' });
      requestAnimationFrame(() => document.getElementById('chart')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch (err) { setError(err.message || 'We couldn’t calculate this chart. Check the details and try again.'); }
    finally { setBusy(false); }
  }
  return <div className="app-shell">
    <header className="site-header"><a href="#top" className="brand"><span className="brand-mark"><Sun size={17} /></span><span>orbit<span className="brand-period">.</span></span></a><nav className={menuOpen ? 'main-nav nav-open' : 'main-nav'}><a href="#chart" onClick={() => setMenuOpen(false)}>Your chart</a><a href="#signs" onClick={() => setMenuOpen(false)}>Zodiac signs</a><a href="#houses" onClick={() => setMenuOpen(false)}>The houses</a><a href="#symbols" onClick={() => setMenuOpen(false)}>How it works</a></nav><a className="header-cta" href="#birth-form">Make my chart <ArrowRight size={15} /></a><button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button></header>
    <main id="top"><section className="hero-section"><div className="hero-copy"><div className="hero-eyebrow"><span /> A SKY THAT'S UNIQUELY YOURS</div><h1>The sky at your<br /><em>beginning.</em></h1><p className="hero-lede">A birth chart is a little like a cosmic snapshot: the planets, signs, and houses all captured in the moment you arrived. Let’s see what yours says.</p><a href="#birth-form" className="hero-link">Discover your chart <span><ArrowDown size={16} /></span></a><div className="hero-footnote"><span className="tiny-stars">✳ ✦</span><span>Thoughtful astrology, made easy to explore.</span></div></div><div className="hero-art" aria-label="Illustration of the night sky and zodiac"><div className="art-wash" /><div className="art-sun" /><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-orbit orbit-three" /><span className="art-star star-a">✧</span><span className="art-star star-b">✳</span><span className="art-star star-c">✦</span><span className="art-star star-d">·</span><span className="art-zodiac zodiac-a">♈</span><span className="art-zodiac zodiac-b">♋</span><span className="art-zodiac zodiac-c">♎</span><span className="art-zodiac zodiac-d">♑</span><span className="art-caption">YOUR SKY, AT THE MOMENT OF BIRTH</span></div></section>
      <section className="form-section" id="birth-form"><div className="form-intro"><span className="eyebrow">Start with the details</span><h2>Your story<br />starts <em>here.</em></h2><p>The closer your birth time is, the more personal your chart. Even a few minutes can shift your rising sign.</p><div className="form-tip"><span>✦</span><p>Not sure of the exact time? Check your birth certificate, or ask family. You can still explore planetary signs without it.</p></div><div className="form-step"><span>01</span><span>YOUR BIRTH DETAILS</span><i /></div></div><div className="form-column"><BirthForm onSubmit={handleSubmit} busy={busy} />{error && <div className="form-error" role="alert">{error}</div>}</div></section>
      {chart ? <>{chart.birthTimeUnknown ? <DateOnlyReading chart={chart} /> : <ChartSummary chart={chart} personName={person} />}<NumerologyReading {...numerologyDetails} chart={chart} />{!chart.birthTimeUnknown && <HouseGuide chart={chart} />}</> : <section className="empty-preview"><div className="empty-wheel"><div className="empty-wheel-inner"><span>✳</span><span>YOUR<br />CHART</span><small>✦ &nbsp; ☽ &nbsp; ✧</small></div></div><div><span className="eyebrow">Waiting for your details</span><h2>Your chart is a map<br />of the <em>moment.</em></h2><p>Enter your birth details above to discover your planetary placements and see how the houses shape your personal sky.</p><a href="#birth-form" className="empty-link">Start with your birth details <span>↓</span></a></div></section>}
      <SignGuide /><SymbolGuide />
      <section className="closing-banner"><div className="closing-decoration">✳</div><span className="eyebrow">Keep looking up</span><h2>Your chart is a beginning,<br />not a <em>box.</em></h2><p>Use these symbols as a language for reflection. You get to decide what resonates and what you make of it.</p><a href="#birth-form" className="submit-button closing-button">Revisit your chart <span>↑</span></a></section>
    </main><footer className="site-footer"><a href="#top" className="brand"><span className="brand-mark"><Sun size={16} /></span><span>orbit<span className="brand-period">.</span></span></a><span className="footer-copy">A little more wonder in the everyday.</span><div><a href="#symbols">Astrology guide</a><span>© 2025 Orbit</span></div></footer>
  </div>;
}
