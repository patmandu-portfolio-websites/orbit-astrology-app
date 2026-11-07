const masterNumbers = new Set([11, 22, 33]);
const vowels = new Set(['A', 'E', 'I', 'O', 'U']);

const numberGuidance = {
   1: {
     meaning: 'Initiative, independence, and the courage to begin.',
     detail: 'In numerology, 1 is associated with self-direction and the first step of a new cycle. It can invite you to notice where you are ready to take ownership, while remembering that independence does not mean you have to do everything alone.',
     everyday: 'Choose one priority and take a manageable first step. Speak up when you have a clear idea, then stay open to useful input.',
     prompt: 'Where would a small act of initiative make a difference today?',
   },
   2: {
     meaning: 'Cooperation, sensitivity, and the work of creating balance.',
     detail: 'The 2 theme emphasizes listening, patience, and working with others. Its reflective edge is keeping your own needs in the conversation instead of smoothing over every difference.',
     everyday: 'Make room for a thoughtful conversation, check assumptions before reacting, and practice a kind but clear boundary when you need one.',
     prompt: 'How can I be considerate without setting aside what I need?',
   },
   3: {
     meaning: 'Creative expression, communication, and a sense of joy.',
     detail: 'The 3 is linked with sharing ideas and bringing imagination into everyday life. It can encourage expression in many forms, while inviting enough focus to bring an idea beyond its exciting beginning.',
     everyday: 'Write, make, talk, or play with an idea. Pick one small creative project and give it a little uninterrupted time.',
     prompt: 'What would feel good to express, even in a simple way?',
   },
   4: {
     meaning: 'Practical foundations, patience, and steady effort.',
     detail: 'The 4 points toward structure, reliability, and the patient work that helps plans take shape. It can also be a reminder to leave room for rest and adjustment rather than demanding perfection.',
     everyday: 'Break a large task into steps, make a routine easier to maintain, or organize one practical area that has been taking up attention.',
     prompt: 'What small structure would make the next step easier?',
   },
   5: {
     meaning: 'Curiosity, adaptability, and learning through change.',
     detail: 'The 5 is associated with variety, movement, and discovering through experience. Its balancing question is how to explore without scattering attention or making change for its own sake.',
     everyday: 'Try a different route, learn something new, or bring flexibility to a plan. Keep one steady commitment while experimenting elsewhere.',
     prompt: 'Where would a little flexibility help me respond well?',
   },
   6: {
     meaning: 'Care, responsibility, and attention to home or community.',
     detail: 'The 6 draws attention to care, belonging, and the responsibilities we choose. It can invite warmth and contribution while reminding you that support should be shared and care includes yourself.',
     everyday: 'Offer practical support, tend to your space, or reconnect with someone important. Notice whether you are carrying a responsibility that could be shared.',
     prompt: 'What kind of care is needed—and what kind is mine to give?',
   },
   7: {
     meaning: 'Reflection, analysis, and a search for deeper understanding.',
     detail: 'The 7 is connected with inquiry, study, and taking time to make sense of experience. Reflection can be restorative, especially when it is balanced with connection and action.',
     everyday: 'Protect a little quiet time, research a question that matters, or pause before accepting the first explanation that comes to mind.',
     prompt: 'What do I know, what am I assuming, and what would I like to understand better?',
   },
   8: {
     meaning: 'Organization, ambition, and a thoughtful relationship with resources.',
     detail: 'The 8 is associated with stewardship, capability, and working toward tangible aims. It can prompt reflection on how you use influence, time, money, and energy—not just on achievement.',
     everyday: 'Review a goal or resource, make a realistic plan, or acknowledge progress. Consider whether success is being defined in a way that feels worthwhile to you.',
     prompt: 'What would responsible progress look like for me right now?',
   },
   9: {
     meaning: 'Compassion, perspective, and bringing a chapter to completion.',
     detail: 'The 9 is linked with broad perspective, empathy, and transitions. It can help you recognize what has run its course without implying you must rush a decision or let go before you are ready.',
     everyday: 'Finish one lingering task, share a skill or kindness, or reflect on what an experience has taught you before deciding what comes next.',
     prompt: 'What am I ready to complete, appreciate, or carry forward?',
   },
   11: {
     meaning: 'Inspiration, intuition, and sensitivity to ideas or possibilities.',
     detail: 'In numerology traditions that preserve master numbers, 11 extends the reflective qualities of 2 with an emphasis on inspiration and sensitivity. It is not a measure of special ability; it can be a prompt to ground ideas and check impressions.',
     everyday: 'Capture an inspiring thought, then test it gently against facts and practical needs. Make space to reset if you feel overstimulated.',
     prompt: 'How can I give an inspired idea a grounded next step?',
   },
   22: {
     meaning: 'Turning a meaningful vision into something practical and lasting.',
     detail: 'The 22 is sometimes called a master builder number, combining big-picture ambition with steady implementation. It can be a reminder to scale a vision into steps and ask for help with what is too much to carry alone.',
     everyday: 'Name the outcome you care about, identify the next achievable milestone, and check that your plan is sustainable for the people involved.',
     prompt: 'What is one practical step that supports a larger intention?',
   },
   33: {
     meaning: 'Compassionate service, encouragement, and care for others.',
     detail: 'The 33 is associated in some traditions with teaching, compassion, and service. It can invite generosity while emphasizing consent, realistic limits, and the difference between supporting someone and taking over for them.',
     everyday: 'Share encouragement or knowledge where it is welcome. Set a clear limit around time and energy so care remains sustainable.',
     prompt: 'How can I offer support while respecting everyone’s agency?',
   },
};

function reduceNumber(number, preserveMaster = true) {
  let value = number;
  while (value > 9 && !(preserveMaster && masterNumbers.has(value))) {
    value = String(value).split('').reduce((sum, digit) => sum + Number(digit), 0);
  }
  return value;
}

function sumDigits(value) {
  return String(value).split('').reduce((sum, digit) => sum + Number(digit), 0);
}

function nameNumber(name, includeVowelsOnly = false) {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, '');
  const total = [...letters].reduce((sum, letter) => {
    if (includeVowelsOnly && !vowels.has(letter)) return sum;
    return sum + ((letter.charCodeAt(0) - 65) % 9) + 1;
  }, 0);
  return total ? reduceNumber(total) : null;
}

export function calculateNumerology(birthDate, birthName = '', year = new Date().getFullYear()) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate || '');
  if (!match) throw new Error('Enter a valid birth date to calculate numerology.');

  const [, yearText, monthText, dayText] = match;
  const birthYear = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(0);
  date.setUTCFullYear(birthYear, month - 1, day);
  date.setUTCHours(0, 0, 0, 0);
  if (date.getUTCFullYear() !== birthYear || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new Error('Enter a valid birth date to calculate numerology.');
  }

  const lifePath = reduceNumber(sumDigits(`${yearText}${monthText}${dayText}`));
  const birthday = reduceNumber(day);
  const personalYear = reduceNumber(sumDigits(`${monthText}${dayText}${year}`), false);
  const trimmedName = birthName.trim();

  return {
    lifePath,
    birthday,
    personalYear,
    personalYearCalendar: year,
    expression: trimmedName ? nameNumber(trimmedName) : null,
    soulUrge: trimmedName ? nameNumber(trimmedName, true) : null,
  };
}

export function meaningForNumber(number) {
  return numberGuidance[number]?.meaning || numberGuidance[reduceNumber(number)]?.meaning;
}

export function guidanceForNumber(number) {
  return numberGuidance[number] || numberGuidance[reduceNumber(number)];
}
