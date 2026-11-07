import { elements } from '../data/astrology.js';

const elementDescriptions = {
  Fire: 'energy, initiative, enthusiasm, and creative spark',
  Earth: 'practicality, patience, stability, and tangible results',
  Air: 'ideas, communication, curiosity, and perspective',
  Water: 'emotion, intuition, empathy, and sensitivity to atmosphere',
};

const modeDescriptions = {
  Cardinal: 'starting things, taking initiative, and creating momentum',
  Fixed: 'sustaining effort, building consistency, and staying with what matters',
  Mutable: 'adapting, learning, and adjusting as circumstances change',
};

export function interpretChart(chart) {
  const byName = Object.fromEntries(chart.placements.map((placement) => [placement.name, placement]));
  const sun = byName.Sun;
  const moon = byName.Moon;
  const venus = byName.Venus;
  const mars = byName.Mars;
  const saturn = byName.Saturn;
  const ascendant = chart.ascendant;
  const personalPlanets = chart.placements.filter((placement) => [
    'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
    'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
  ].includes(placement.name));
  const elementCounts = personalPlanets.reduce((counts, placement) => {
    counts[placement.sign.element] = (counts[placement.sign.element] || 0) + 1;
    return counts;
  }, {});
  const modeCounts = personalPlanets.reduce((counts, placement) => {
    counts[placement.sign.mode] = (counts[placement.sign.mode] || 0) + 1;
    return counts;
  }, {});
  const dominantElement = Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const mode = (sign) => sign.mode.toLowerCase();
  const bigThree = [
    { label: 'Sun', placement: sun },
    { label: 'Moon', placement: moon },
    { label: 'Rising', placement: ascendant },
  ].map(({ label, placement }) => ({
    label,
    sign: placement.sign.name,
    element: placement.sign.element,
    mode: placement.sign.mode,
    description: `${placement.sign.element} brings ${elementDescriptions[placement.sign.element]}; ${placement.sign.mode} describes a style of ${modeDescriptions[placement.sign.mode]}.`,
  }));

  return {
    dominantElement,
    elementDescription: dominantElement
      ? `${dominantElement} is the most represented element among your ten planets. In astrology, elements describe the kind of energy a sign symbolizes—not a literal trait or a measure of personality.`
      : '',
    elements: Object.entries(elements).map(([name, value]) => ({
      name,
      count: elementCounts[name] || 0,
      signs: value.signs,
      description: elementDescriptions[name],
    })),
    modes: Object.entries(modeDescriptions).map(([name, description]) => ({
      name,
      count: modeCounts[name] || 0,
      description,
    })),
    bigThree,
    paragraphs: [
      `Your ${sun.sign.name} Sun combines ${sun.sign.element} energy with a ${mode(sun.sign)} style. Your ${moon.sign.name} Moon brings ${moon.sign.element} qualities to emotional needs, while ${ascendant.sign.name} rising brings ${ascendant.sign.element} qualities to the way you meet new situations.`,
      `In relationships and motivation, ${venus.sign.name} Venus and ${mars.sign.name} Mars add their own styles. Saturn in ${saturn.sign.name} offers another reflection point: the areas where patience, structure, and practice may feel especially meaningful.`,
    ],
    note: 'These are traditional astrological reflections, not scientific or psychological assessments. Keep what feels useful and leave the rest.',
  };
}
