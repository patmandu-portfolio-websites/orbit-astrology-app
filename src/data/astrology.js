export const signs = [
  { name: 'Aries', symbol: '♈', element: 'Fire', mode: 'Cardinal', ruler: 'Mars', date: 'Mar 21 – Apr 19', tone: '#e47a5d' },
  { name: 'Taurus', symbol: '♉', element: 'Earth', mode: 'Fixed', ruler: 'Venus', date: 'Apr 20 – May 20', tone: '#a88b51' },
  { name: 'Gemini', symbol: '♊', element: 'Air', mode: 'Mutable', ruler: 'Mercury', date: 'May 21 – Jun 20', tone: '#d3a84f' },
  { name: 'Cancer', symbol: '♋', element: 'Water', mode: 'Cardinal', ruler: 'Moon', date: 'Jun 21 – Jul 22', tone: '#7998ab' },
  { name: 'Leo', symbol: '♌', element: 'Fire', mode: 'Fixed', ruler: 'Sun', date: 'Jul 23 – Aug 22', tone: '#d9894c' },
  { name: 'Virgo', symbol: '♍', element: 'Earth', mode: 'Mutable', ruler: 'Mercury', date: 'Aug 23 – Sep 22', tone: '#8a9a72' },
  { name: 'Libra', symbol: '♎', element: 'Air', mode: 'Cardinal', ruler: 'Venus', date: 'Sep 23 – Oct 22', tone: '#af8191' },
  { name: 'Scorpio', symbol: '♏', element: 'Water', mode: 'Fixed', ruler: 'Pluto', date: 'Oct 23 – Nov 21', tone: '#956b79' },
  { name: 'Sagittarius', symbol: '♐', element: 'Fire', mode: 'Mutable', ruler: 'Jupiter', date: 'Nov 22 – Dec 21', tone: '#bd795a' },
  { name: 'Capricorn', symbol: '♑', element: 'Earth', mode: 'Cardinal', ruler: 'Saturn', date: 'Dec 22 – Jan 19', tone: '#748b83' },
  { name: 'Aquarius', symbol: '♒', element: 'Air', mode: 'Fixed', ruler: 'Uranus', date: 'Jan 20 – Feb 18', tone: '#6c9baa' },
  { name: 'Pisces', symbol: '♓', element: 'Water', mode: 'Mutable', ruler: 'Neptune', date: 'Feb 19 – Mar 20', tone: '#8b82ae' },
];

export const planets = [
  { name: 'Sun', symbol: '☉', theme: 'Identity & vitality', text: 'Your core self, the qualities you grow into, and the way you seek to shine.' },
  { name: 'Moon', symbol: '☽', theme: 'Feelings & needs', text: 'Your emotional instincts, private self, and what helps you feel at home.' },
  { name: 'Mercury', symbol: '☿', theme: 'Mind & communication', text: 'How you think, learn, make sense of things, and share your ideas.' },
  { name: 'Venus', symbol: '♀', theme: 'Love & values', text: 'What you’re drawn to, how you connect, and what you find beautiful.' },
  { name: 'Mars', symbol: '♂', theme: 'Drive & action', text: 'How you pursue what you want, meet challenges, and express energy.' },
  { name: 'Jupiter', symbol: '♃', theme: 'Growth & possibility', text: 'Where curiosity, opportunity, and a larger outlook tend to flourish.' },
  { name: 'Saturn', symbol: '♄', theme: 'Structure & mastery', text: 'Where patience, boundaries, and steady effort build lasting confidence.' },
  { name: 'Uranus', symbol: '♅', theme: 'Change & originality', text: 'Where you question convention and make room for fresh approaches.' },
  { name: 'Neptune', symbol: '♆', theme: 'Imagination & ideals', text: 'What inspires your dreams, empathy, and sense of the intangible.' },
  { name: 'Pluto', symbol: '♇', theme: 'Depth & renewal', text: 'Where profound change, honesty, and personal reinvention can unfold.' },
];

export const houses = [
  ['Self & first impressions', 'Your identity, appearance, and how you begin things.'],
  ['Resources & values', 'Your possessions, talents, self-worth, and relationship with security.'],
  ['Learning & connection', 'Everyday communication, siblings, short journeys, and early learning.'],
  ['Home & roots', 'Family, belonging, private life, and the foundations you build on.'],
  ['Creativity & joy', 'Play, romance, creative expression, and what brings you alive.'],
  ['Work & wellbeing', 'Daily routines, useful service, habits, and tending to your health.'],
  ['Partnerships', 'Close relationships, collaboration, and what you seek in a partner.'],
  ['Shared bonds & change', 'Intimacy, shared resources, vulnerability, and transformation.'],
  ['Exploration & meaning', 'Travel, higher learning, philosophy, and broadening your horizons.'],
  ['Calling & contribution', 'Career direction, public life, responsibility, and long-term aims.'],
  ['Community & hopes', 'Friendship, groups, collective projects, and future aspirations.'],
  ['Rest & reflection', 'The inner life, solitude, closure, and what happens behind the scenes.'],
].map(([title, description], i) => ({ number: i + 1, title, description }));

export const elements = {
  Fire: {
    signs: 'Aries, Leo, Sagittarius',
    keywords: 'energy · courage · inspiration',
    description: 'Fire signs are associated with enthusiasm, creative spark, and the urge to act. They often bring warmth and momentum to what matters to them.',
  },
  Earth: {
    signs: 'Taurus, Virgo, Capricorn',
    keywords: 'grounding · patience · practicality',
    description: 'Earth signs are associated with practical attention, patience, and building something tangible. They often look for steady ways to make an idea work in everyday life.',
  },
  Air: {
    signs: 'Gemini, Libra, Aquarius',
    keywords: 'ideas · connection · perspective',
    description: 'Air signs are associated with curiosity, communication, and exchanging perspectives. They often approach experience by thinking, discussing, and connecting ideas.',
  },
  Water: {
    signs: 'Cancer, Scorpio, Pisces',
    keywords: 'feeling · intuition · empathy',
    description: 'Water signs are associated with emotional awareness, empathy, and intuition. They often notice the feelings and atmosphere beneath the surface of an experience.',
  },
};
