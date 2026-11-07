import { elements, houses } from '../data/astrology.js';
import { signVoices } from './personality.js';

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
  const placementStyles = personalPlanets.map((placement) => ({
    name: placement.name,
    sign: placement.sign.name,
    theme: placement.theme,
    description: `${placement.text} ${placement.sign.name} adds ${signVoices[placement.sign.name].qualities}. Its ${placement.sign.element.toLowerCase()} element emphasizes ${elementDescriptions[placement.sign.element]}, while its ${mode(placement.sign)} style favors ${modeDescriptions[placement.sign.mode]}.`,
    context: `House ${placement.house}: ${houses[placement.house - 1].title}. ${houses[placement.house - 1].description}`,
  }));
  const mercury = byName.Mercury;
  const connection = chart.aspects.find((aspect) => ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'].includes(aspect.a.name)
    && ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'].includes(aspect.b.name));

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
    placementStyles,
    synthesis: [
      `You are not represented by your Sun sign alone. For example, your ${sun.sign.name} Sun suggests ${signVoices[sun.sign.name].qualities} in identity and purpose, while your ${moon.sign.name} Moon points to ${signVoices[moon.sign.name].needs} for emotional comfort. ${sun.sign.name === moon.sign.name ? 'Sharing a sign gives these two roles a similar symbolic style, but identity and emotional needs are still different parts of experience.' : 'These different signs can describe different priorities: what motivates you may not be exactly what helps you feel settled.'}`,
      `In everyday situations, your ${mercury.sign.name} Mercury adds ${signVoices[mercury.sign.name].qualities} to communication. Your ${venus.sign.name} Venus brings ${signVoices[venus.sign.name].needs} into connection and values, while your ${mars.sign.name} Mars adds ${signVoices[mars.sign.name].qualities} to taking action. When making a shared plan, you might compare how you explain your idea, what makes the exchange feel worthwhile, and how you prefer to move forward.`,
      `Jupiter and Saturn add lenses on growth and responsibility; Uranus, Neptune, and Pluto describe slower-moving themes of change, imagination, and renewal. Their signs are shared by many people born in similar periods, so houses and aspects help provide more individual context rather than making these signs a personal label on their own.`,
      ...(connection ? [`One example in your chart is ${connection.a.name} ${connection.name.toLowerCase()} ${connection.b.name} (${connection.orb.toFixed(1)}° orb). This ${connection.name.toLowerCase()} ${connection.meaning} Consider it alongside ${connection.a.name} in ${connection.a.sign.name} and ${connection.b.name} in ${connection.b.sign.name}: the signs describe each style, while the aspect describes a symbolic relationship between them.`] : []),
    ],
    paragraphs: [
      `Your ${sun.sign.name} Sun combines ${sun.sign.element} energy with a ${mode(sun.sign)} style. Your ${moon.sign.name} Moon brings ${moon.sign.element} qualities to emotional needs, while ${ascendant.sign.name} rising brings ${ascendant.sign.element} qualities to the way you meet new situations.`,
      `In relationships and motivation, ${venus.sign.name} Venus and ${mars.sign.name} Mars add their own styles. Saturn in ${saturn.sign.name} offers another reflection point: the areas where patience, structure, and practice may feel especially meaningful.`,
    ],
    note: 'These are traditional astrological reflections, not scientific or psychological assessments. Keep what feels useful and leave the rest.',
  };
}
