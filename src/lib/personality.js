import { houses, signs } from '../data/astrology.js';

export const signVoices = {
  Aries: {
    qualities: 'directness, courage, and a readiness to begin',
    strengths: 'taking initiative, acting decisively, and bringing fresh energy',
    stretch: 'slowing down long enough to notice timing, context, and other people’s pace',
    needs: 'room to act independently and a worthwhile challenge',
    collaboration: 'clear goals, honest feedback, and the freedom to move quickly',
  },
  Taurus: {
    qualities: 'steadiness, sensory awareness, and a preference for what lasts',
    strengths: 'reliability, patience, and building value step by step',
    stretch: 'staying open when a familiar plan or viewpoint no longer fits',
    needs: 'time to settle, tangible security, and a comfortable pace',
    collaboration: 'consistency, practical expectations, and enough time to do things well',
  },
  Gemini: {
    qualities: 'curiosity, communication, and an appetite for varied perspectives',
    strengths: 'asking useful questions, connecting ideas, and learning quickly',
    stretch: 'giving promising ideas enough focus to develop beyond the first spark',
    needs: 'interesting conversation, mental variety, and room to explore',
    collaboration: 'open exchange, flexible thinking, and clear shared information',
  },
  Cancer: {
    qualities: 'emotional attentiveness, protectiveness, and a strong sense of belonging',
    strengths: 'noticing what people need, caring consistently, and creating connection',
    stretch: 'making space between a strong feeling and the story attached to it',
    needs: 'trust, emotional safety, and a sense of home or belonging',
    collaboration: 'considerate communication, trust, and a team that values people',
  },
  Leo: {
    qualities: 'warmth, creative confidence, and wholehearted self-expression',
    strengths: 'encouraging others, expressing ideas vividly, and bringing heart to a goal',
    stretch: 'letting recognition be shared and receiving feedback without losing confidence',
    needs: 'creative room, appreciation, and the chance to contribute with heart',
    collaboration: 'visible purpose, generous recognition, and room to lead or create',
  },
  Virgo: {
    qualities: 'careful observation, practical thinking, and a desire to make things work better',
    strengths: 'finding useful details, improving processes, and following through thoughtfully',
    stretch: 'accepting that useful progress can be imperfect and still worthwhile',
    needs: 'clarity, meaningful contribution, and workable everyday rhythms',
    collaboration: 'clear roles, thoughtful planning, and respect for the details',
  },
  Libra: {
    qualities: 'social awareness, fairness, and an instinct for considering both sides',
    strengths: 'building bridges, noticing imbalance, and creating thoughtful partnerships',
    stretch: 'stating a personal preference even when it may not please everyone',
    needs: 'mutual respect, balance, and considerate exchange',
    collaboration: 'shared decisions, respectful dialogue, and a sense of fairness',
  },
  Scorpio: {
    qualities: 'focus, emotional perception, and a desire to understand what is beneath the surface',
    strengths: 'staying present through complexity, protecting trust, and committing deeply',
    stretch: 'allowing trust to grow without requiring certainty or control at every step',
    needs: 'honesty, privacy when needed, and relationships with depth',
    collaboration: 'candor, discretion, shared commitment, and room to investigate thoroughly',
  },
  Sagittarius: {
    qualities: 'exploration, candor, and an instinct for the bigger picture',
    strengths: 'sharing perspective, inspiring possibility, and learning through experience',
    stretch: 'balancing enthusiasm for the horizon with care for present details',
    needs: 'freedom to learn, honest conversation, and room to explore',
    collaboration: 'a meaningful direction, independence, and openness to new approaches',
  },
  Capricorn: {
    qualities: 'purposefulness, realism, and a respect for steady progress',
    strengths: 'taking responsibility, setting priorities, and building lasting results',
    stretch: 'making room for rest and flexibility alongside high standards',
    needs: 'clear aims, earned trust, and progress that can be measured over time',
    collaboration: 'reliability, sensible plans, and responsibility that is fairly shared',
  },
  Aquarius: {
    qualities: 'independent thought, original perspective, and attention to group dynamics',
    strengths: 'questioning assumptions, imagining alternatives, and thinking beyond convention',
    stretch: 'keeping personal warmth present while stepping back to analyze a situation',
    needs: 'intellectual freedom, authentic connection, and space to be unconventional',
    collaboration: 'shared ideals, autonomy, and openness to fresh ideas',
  },
  Pisces: {
    qualities: 'imagination, empathy, and receptivity to subtle feeling',
    strengths: 'responding compassionately, imagining possibilities, and sensing nuance',
    stretch: 'checking boundaries and facts when a situation feels emotionally absorbing',
    needs: 'quiet recovery, creative expression, and gentle understanding',
    collaboration: 'compassion, creativity, and clear expectations that prevent guesswork',
  },
};

const placementVoices = {
  Sun: {
    heading: 'Core identity',
    role: 'Your Sun describes a way your identity, vitality, and sense of purpose may express themselves.',
  },
  Moon: {
    heading: 'Emotional world',
    role: 'Your Moon offers a lens on emotional needs, instincts, and what can help you feel settled.',
  },
  Ascendant: {
    heading: 'First impressions',
    role: 'Your Rising sign describes how you may approach new situations and the first impression you tend to make.',
  },
  Mercury: {
    heading: 'Thinking & communication',
    role: 'Mercury describes ways you may gather information, make connections, and communicate.',
  },
  Venus: {
    heading: 'Connection & values',
    role: 'Venus offers clues about what you value, enjoy, and look for in mutual connection.',
  },
  Mars: {
    heading: 'Drive & action',
    role: 'Mars describes how you may pursue aims, meet resistance, and direct your energy.',
  },
};

const bigThreeRoles = {
  Sun: {
    title: 'The heart of the chart',
    prompt: 'At your center, you may be drawn toward',
    reflection: 'This can show up in the people, projects, and values you choose to invest yourself in.',
  },
  Moon: {
    title: 'The inner world',
    prompt: 'To feel emotionally settled, you may appreciate',
    reflection: 'You can care deeply and still need a personal way and pace to process what you feel.',
  },
  Ascendant: {
    title: 'The way you meet the world',
    prompt: 'When approaching something new, you may lean toward',
    reflection: 'This is one possible first impression, not a complete account of who you are or how everyone sees you.',
  },
};

const ordinal = (number) => {
  const suffix = number % 100 >= 11 && number % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[number % 10] || 'th');
  return `${number}${suffix}`;
};

function signAt(longitude) {
  return signs[Math.floor((((longitude % 360) + 360) % 360) / 30)];
}

function findPlacement(chart, name) {
  return name === 'Ascendant'
    ? chart.ascendant
    : chart.placements.find((placement) => placement.name === name);
}

export function bigThreeReading(chart) {
  const placements = [
    { ...findPlacement(chart, 'Sun'), key: 'Sun' },
    { ...findPlacement(chart, 'Moon'), key: 'Moon' },
    { ...findPlacement(chart, 'Ascendant'), key: 'Ascendant' },
  ];
  const [sun, moon, rising] = placements;
  const sunQuality = signVoices[sun.sign.name];
  const moonQuality = signVoices[moon.sign.name];
  const risingQuality = signVoices[rising.sign.name];
  const headline = `${sun.sign.symbol} ${sun.sign.name} Sun + ${moon.sign.symbol} ${moon.sign.name} Moon + ${rising.sign.symbol} ${rising.sign.name} Rising`;
  const sameElements = new Set(placements.map((placement) => placement.sign.element)).size;
  const sameModes = new Set(placements.map((placement) => placement.sign.mode)).size;
  const combination = sameElements === 1
    ? `All three placements are in ${sun.sign.element.toLowerCase()} signs, giving the Big Three a shared symbolic element. Their different roles still describe distinct parts of experience.`
    : sameModes === 1
      ? `Your Big Three share a ${sun.sign.mode.toLowerCase()} style, while their different elements give each placement a distinct quality.`
      : `This is a varied combination: ${sun.sign.element.toLowerCase()}, ${moon.sign.element.toLowerCase()}, and ${rising.sign.element.toLowerCase()} elements bring different symbolic qualities to identity, feelings, and first impressions.`;

  return {
    headline,
    combination,
    synthesis: `Your ${sun.sign.name} Sun centers ${sunQuality.qualities}, while your ${moon.sign.name} Moon brings ${moonQuality.qualities} to your inner world. ${risingQuality.qualities.slice(0, 1).toUpperCase()}${risingQuality.qualities.slice(1)} may be more visible in how you approach new people and situations. These parts can complement one another or feel different in different contexts; neither side has to cancel out the others.`,
    sections: placements.map((placement) => {
      const character = signVoices[placement.sign.name];
      const role = bigThreeRoles[placement.key];
      const house = houses[placement.house - 1];
      const ruler = signs.find((sign) => sign.name === placement.sign.name)?.ruler;
      const rulerText = placement.key === 'Sun'
        ? `${placement.sign.name} is traditionally ruled by ${ruler}, adding another symbolic layer to its style.`
        : '';
      return {
        key: placement.key,
        symbol: placement.key === 'Ascendant' ? '⬆' : placement.symbol,
        heading: `${placement.sign.symbol} ${placement.sign.name} ${placement.key === 'Ascendant' ? 'Rising' : placement.key}`,
        subtitle: role.title,
        lead: `${role.prompt} ${character.needs}.`,
        innerQuote: placement.key === 'Moon'
          ? `“I feel most at ease with ${character.needs}.”`
          : '',
        detail: placement.key === 'Sun'
          ? `${placement.sign.name} symbolism often emphasizes ${character.qualities}. ${rulerText} In the ${house.title.toLowerCase()} area of your chart, these themes may feel especially relevant.`
          : placement.key === 'Moon'
            ? `A ${placement.sign.name} Moon is associated with ${character.qualities}. You may also recognize an interest in ${character.collaboration.toLowerCase()}. In the ${house.title.toLowerCase()} area, these needs may become easier to notice.`
            : `A ${placement.sign.name} Ascendant is associated with ${character.qualities}. Others may first notice ${character.strengths}; with time, they may also see ${character.needs}. This sign falls in your first house, which is associated with identity and first impressions.`,
        strengths: character.strengths,
        challenge: character.stretch,
        houseTitle: house.title,
      };
    }),
    note: 'Astrology is an interpretive tradition, not a scientifically validated way to determine personality. These descriptions are reflective prompts, not fixed labels.',
  };
}

export function relatingReflection(placement) {
  const character = signVoices[placement.sign.name];
  const reflections = {
    Sun: `In groups or friendships, your ${placement.sign.name} Sun offers ${character.strengths} as possible contributions. Notice when you feel free to be yourself, and invite others to express their own priorities too.`,
    Moon: `Your ${placement.sign.name} Moon points toward ${character.needs} as possible emotional needs. Try explaining what support looks like for you, while asking whether the other person wants listening, reassurance, or practical help.`,
    Ascendant: `${placement.sign.name} Rising may bring ${character.qualities} to first meetings. First impressions are only a starting point: give yourself and others time to show more than an initial style.`,
    Mercury: `${placement.sign.name} Mercury suggests ${character.collaboration} as useful conditions for exchanging ideas. Check what someone understood and allow a different communication pace, especially when a conversation matters.`,
    Venus: `${placement.sign.name} Venus offers ${character.needs} as connection themes in friendship as well as partnership. Share what makes you feel appreciated, and ask how the other person prefers to give and receive care.`,
    Mars: `${placement.sign.name} Mars adds ${character.qualities} to taking action with others. A useful balancing practice is ${character.stretch}. Agree on a pace, name boundaries respectfully, and pause if a disagreement becomes unproductive.`,
  };
  return reflections[placement.name] || null;
}

export function personalityProfile(chart) {
  const keyPlacements = ['Sun', 'Moon', 'Ascendant', 'Mercury', 'Venus', 'Mars']
    .map((name) => findPlacement(chart, name))
    .filter(Boolean);

  return keyPlacements.map((placement) => {
    const house = houses[placement.house - 1];
    const voice = placementVoices[placement.name];
    const character = signVoices[placement.sign.name];
    return {
      ...placement,
      heading: voice.heading,
      role: voice.role,
      description: `${placement.sign.name} brings ${character.qualities.toLowerCase()} to this part of your chart. In the ${house.title.toLowerCase()} area of life, this influence may be especially noticeable.`,
      strengths: character.strengths,
      stretch: character.stretch,
      relating: relatingReflection(placement),
      signQuality: character.qualities,
      houseTitle: house.title,
      houseNumber: ordinal(placement.house),
    };
  });
}

function strengthFromPattern(chart, dominantElement) {
  const counts = chart.placements.reduce((result, placement) => {
    result[placement.sign.mode] = (result[placement.sign.mode] || 0) + 1;
    return result;
  }, {});
  const strongestMode = Object.entries(counts).sort((left, right) => right[1] - left[1])[0]?.[0];
  const elementStrength = {
    Fire: 'enthusiasm, initiative, and creative energy',
    Earth: 'practicality, patience, and attention to what is sustainable',
    Air: 'ideas, communication, and the ability to see different perspectives',
    Water: 'emotional awareness, empathy, and sensitivity to context',
  };
  const modeStrength = {
    Cardinal: 'starting things and creating momentum',
    Fixed: 'sustaining effort and staying with what matters',
    Mutable: 'adapting, learning, and responding to change',
  };
  return {
    element: dominantElement,
    mode: strongestMode,
    description: `${dominantElement} is the most represented element among your planetary placements, suggesting a chart emphasis on ${elementStrength[dominantElement]}. ${strongestMode} is the most common mode, adding a theme of ${modeStrength[strongestMode]}.`,
  };
}

export function lifeAreaReadings(chart) {
  const placements = Object.fromEntries(chart.placements.map((placement) => [placement.name, placement]));
  const venus = placements.Venus;
  const mars = placements.Mars;
  const moon = placements.Moon;
  const saturn = placements.Saturn;
  const jupiter = placements.Jupiter;
  const mercury = placements.Mercury;
  const partnershipSign = signAt(chart.houseCusps[6]);
  const careerSign = signAt(chart.houseCusps[9]);
  const partnershipVoice = signVoices[partnershipSign.name];
  const careerVoice = signVoices[careerSign.name];

  return {
    relationships: {
      sign: partnershipSign,
      title: 'Relationships & connection',
      description: `Your ${partnershipSign.name} partnership-house cusp points toward ${partnershipVoice.needs.toLowerCase()} as qualities to consider in close one-to-one relationships. Venus in ${venus.sign.name} describes ${signVoices[venus.sign.name].needs.toLowerCase()} as part of your connection style, while Mars in ${mars.sign.name} adds ${signVoices[mars.sign.name].qualities.toLowerCase()} to how you pursue what matters. Your ${moon.sign.name} Moon can offer another clue about emotional comfort and safety. These placements are prompts for reflection, not a formula for compatibility.`,
      themes: [
        `Connection style: Venus in ${venus.sign.name}`,
        `Energy and boundaries: Mars in ${mars.sign.name}`,
        `Emotional comfort: Moon in ${moon.sign.name}`,
      ],
      relating: [
        { title: 'Communicating with care', text: `Mercury in ${mercury.sign.name} suggests ${signVoices[mercury.sign.name].collaboration} as helpful conditions for conversation. You might try stating your intention, asking a genuine question, and checking understanding rather than expecting others to read between the lines.` },
        { title: 'Support, closeness & boundaries', text: `Your ${moon.sign.name} Moon points to ${signVoices[moon.sign.name].needs}, while ${venus.sign.name} Venus adds ${signVoices[venus.sign.name].needs} to connection. These needs can coexist. Discuss what feels supportive and how much space each person wants; caring does not require identical preferences.` },
        { title: 'Friendship & belonging', text: `The ${signAt(chart.houseCusps[10]).name} sign on your eleventh-house cusp offers ${signVoices[signAt(chart.houseCusps[10]).name].qualities} as a lens on friendship and groups. Notice which communities welcome your contribution while allowing you to be yourself. This is not a prescription for which people to befriend.` },
        { title: 'Navigating differences', text: `Mars in ${mars.sign.name} brings ${signVoices[mars.sign.name].qualities} to pursuing aims. Consider ${signVoices[mars.sign.name].stretch} when another person approaches things differently. A practical check-in is: “What do we each need, and what agreement is realistic for both of us?”` },
      ],
    },
    career: {
      sign: careerSign,
      title: 'Work, contribution & direction',
      description: `Your ${careerSign.name} tenth-house cusp can describe the style you may appreciate in public roles and long-term aims: ${careerVoice.collaboration.toLowerCase()}. Saturn in ${saturn.sign.name} offers a reflection on how you build skill and responsibility; Jupiter in ${jupiter.sign.name} points to a style of growth and exploration. Use these themes to consider environments that suit you, rather than as fixed career predictions.`,
      themes: [
        `Public direction: ${careerSign.name} on the tenth-house cusp`,
        `Practice and responsibility: Saturn in ${saturn.sign.name}`,
        `Growth and perspective: Jupiter in ${jupiter.sign.name}`,
      ],
      relating: [
        { title: 'Working alongside others', text: `Your ${careerSign.name} public-role style suggests ${careerVoice.collaboration}. Saturn in ${saturn.sign.name} adds ${signVoices[saturn.sign.name].qualities} to responsibility. Try agreeing on roles, deadlines, and how feedback will be shared rather than assuming everyone works in the same way.` },
      ],
    },
  };
}

export function overallPersonality(chart) {
  const sun = findPlacement(chart, 'Sun');
  const moon = findPlacement(chart, 'Moon');
  const rising = chart.ascendant;
  const sunQuality = signVoices[sun.sign.name];
  const moonQuality = signVoices[moon.sign.name];
  const risingQuality = signVoices[rising.sign.name];
  const elementCounts = chart.placements.reduce((result, placement) => {
    result[placement.sign.element] = (result[placement.sign.element] || 0) + 1;
    return result;
  }, {});
  const dominantElement = Object.entries(elementCounts).sort((left, right) => right[1] - left[1])[0]?.[0];
  const pattern = strengthFromPattern(chart, dominantElement);
  const article = /^[aeiou]/i.test(sun.sign.name) ? 'An' : 'A';

  return {
    summary: `${article} ${sun.sign.name} Sun, ${moon.sign.name} Moon, and ${rising.sign.name} Rising point to ${sunQuality.qualities} at your center, ${moonQuality.qualities} in your inner world, and ${risingQuality.qualities} in the way you meet the world. The Sun describes a core drive, the Moon a private emotional rhythm, and the Rising sign a way of approaching new situations. You may recognize each part in different settings rather than experiencing them as one fixed personality.`,
    threeThemes: [
      `At your center: ${sunQuality.needs}.`,
      `To feel emotionally at ease: ${moonQuality.needs}.`,
      `In new situations: ${risingQuality.needs}.`,
    ],
    pattern,
    note: 'Astrology is an interpretive tradition, not a scientifically validated way to determine personality. These ideas are optional prompts; they do not define you.',
  };
}
