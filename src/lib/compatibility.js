import { calculateAspects } from './chart.js';
import { signVoices } from './personality.js';
import { calculateNumerology, guidanceForNumber } from './numerology.js';

const areas = [
  { name: 'Sun', title: 'Identity & purpose', trait: 'qualities', prompt: 'What matters to each of us, and where can we support different aims?' },
  { name: 'Moon', title: 'Emotional needs', trait: 'needs', prompt: 'How does each of us prefer to receive support or take time to settle?' },
  { name: 'Mercury', title: 'Communication', trait: 'collaboration', prompt: 'How can we check understanding rather than assume we mean the same thing?' },
  { name: 'Venus', title: 'Connection & values', trait: 'needs', prompt: 'What helps each of us feel appreciated in this relationship?' },
  { name: 'Mars', title: 'Action & differences', trait: 'qualities', prompt: 'How can we respect different paces and disagree without dismissing each other?' },
];

const relatingIdeas = {
  Sun: 'Take turns describing a goal or interest that matters to you. Look for a way to encourage each other without needing to share every priority.',
  Moon: 'Ask whether the other person wants listening, reassurance, practical help, or quiet space. Agree on how to check in rather than interpreting a different response as a lack of care.',
  Mercury: 'Choose a time when both people can pay attention, then summarize what you heard before replying. If your paces differ, allow time to think or follow up in writing.',
  Venus: 'Each name a small gesture that helps you feel appreciated. Try one another’s preferences instead of assuming the way you give care is the way the other person wants to receive it.',
  Mars: 'Before a shared task, agree on pace, responsibilities, and boundaries. During disagreement, name the specific issue and take a mutually agreed pause if the conversation becomes unproductive.',
};

const aspectRelatingIdeas = {
  Conjunction: 'Shared focus may be easy to notice, but check whether both people have room to express their needs rather than assuming you want the same thing.',
  Sextile: 'Try a small shared activity or conversation that gives both themes room. A symbolic opportunity still needs willingness and effort from both people.',
  Square: 'Name the different priorities without labeling either person as the problem. Ask what adjustment is realistic for both, and respect a boundary if agreement is not possible.',
  Trine: 'Appreciate what feels easy, while continuing to ask questions. Familiarity or ease does not remove the need for clear expectations and consent.',
  Opposition: 'Take turns describing your perspective and look for a workable balance. You do not need to agree on everything to treat one another respectfully.',
};

export function compareCharts(first, second) {
  if (first.zodiacMode !== second.zodiacMode) throw new Error('Use the same zodiac system for both charts.');
  const placementFor = (chart, name) => chart.placements.find((placement) => placement.name === name);
  const readings = areas.map((area) => {
    const a = placementFor(first, area.name);
    const b = placementFor(second, area.name);
    const signsFor = (placement) => placement.sampledSigns || [placement.sign.name];
    const uncertain = signsFor(a).length > 1 || signsFor(b).length > 1;
    return {
      ...area,
      firstSigns: signsFor(a).join(' / '),
      secondSigns: signsFor(b).join(' / '),
      firstDescription: uncertain ? null : signVoices[a.sign.name][area.trait],
      secondDescription: uncertain ? null : signVoices[b.sign.name][area.trait],
      reflection: uncertain
        ? 'A sign changed during the sampled birth date. These possibilities cannot be narrowed down without the missing birth time.'
        : a.sign.name === b.sign.name
          ? 'These placements share a symbolic style, which can offer familiar ground. Similarity still does not guarantee understanding or agreement.'
          : 'Different styles can bring fresh perspectives or require more explanation. Neither style is better, and a difference is not a verdict on the relationship.',
      relating: uncertain
        ? 'Use the conversation idea below without attaching it to either possible sign. Ask about lived preferences directly instead of choosing an interpretation for the other person.'
        : `As a reflection, ${a.sign.name} offers ${signVoices[a.sign.name].strengths}, while ${b.sign.name} offers ${signVoices[b.sign.name].strengths}. These are possible contributions, not assigned roles: either person may bring either quality in practice.`,
      everyday: relatingIdeas[area.name],
    };
  });
  const timeUnknown = Boolean(first.birthTimeUnknown || second.birthTimeUnknown);
  const placements = (chart, owner) => chart.placements
    .filter((placement) => areas.some((area) => area.name === placement.name))
    .map((placement) => ({ ...placement, owner }));
  const aspects = timeUnknown ? [] : calculateAspects([...placements(first, 'first'), ...placements(second, 'second')])
    .filter((aspect) => aspect.a.owner !== aspect.b.owner)
    .map((aspect) => ({ ...aspect, relating: aspectRelatingIdeas[aspect.name] }));
  return { readings, aspects, timeUnknown };
}

export function compareNumerology(first, second) {
  const a = calculateNumerology(first.birthDate, first.birthName);
  const b = calculateNumerology(second.birthDate, second.birthName);
  return [
    ['lifePath', 'Life Path'], ['birthday', 'Birthday'], ['personalYear', `Personal Year (${a.personalYearCalendar})`],
    ['expression', 'Expression'], ['soulUrge', 'Soul Urge'],
  ].filter(([key]) => a[key] !== null && b[key] !== null).map(([key, label]) => ({
    label, firstNumber: a[key], secondNumber: b[key],
    firstMeaning: guidanceForNumber(a[key]).meaning,
    secondMeaning: guidanceForNumber(b[key]).meaning,
    firstEveryday: guidanceForNumber(a[key]).everyday,
    secondEveryday: guidanceForNumber(b[key]).everyday,
  }));
}
