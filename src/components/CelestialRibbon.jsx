export default function CelestialRibbon() {
  return <div className="celestial-ribbon">
    <span className="celestial-ribbon-label">A language of sky & self</span>
    <svg className="moon-phase-strip" viewBox="0 0 310 32" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        {[15, 55, 95, 135, 175, 215, 255, 295].map((x) => <circle key={x} cx={x} cy="16" r="11" />)}
      </g>
      <g fill="currentColor">
        <path d="M55 5a11 11 0 0 1 0 22c8-5 8-17 0-22Z" />
        <path d="M95 5a11 11 0 0 1 0 22Z" />
        <path d="M135 5a11 11 0 0 1 0 22c-8-5-8-17 0-22Z" />
        <circle cx="175" cy="16" r="11" />
        <path d="M215 5a11 11 0 0 0 0 22c8-5 8-17 0-22Z" />
        <path d="M255 5a11 11 0 0 0 0 22Z" />
        <path d="M295 5a11 11 0 0 0 0 22c-8-5-8-17 0-22Z" />
      </g>
    </svg>
    <span className="celestial-ribbon-label">Observe · Reflect · Explore</span>
  </div>;
}
