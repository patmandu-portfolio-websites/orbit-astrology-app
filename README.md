# Orbit — Astrology Birth Chart

A responsive React app for exploring a natal chart. Enter a birth date and local time, UTC offset, and latitude/longitude to calculate Sun, Moon, planets, Ascendant, Midheaven, and whole-sign houses. The page includes a chart wheel, planetary placement table, zodiac guide, house guide, and a plain-language introduction to chart symbols.

The visual design combines a warm reading surface with night-sky accents, decorative constellation lines, a moon-phase divider, and celestial section motifs. These illustrations are decorative, not a representation of the current sky or lunar phase; responsive text sizes and chart interactions are preserved.

## Run locally

```sh
npm install
npm run dev
```

Then open the local URL shown by Vite. Create a production bundle with `npm run build`.

## Calculation notes

Select **I don't know my birth time** for a date-only reading. It uses a labeled local-noon snapshot and hourly samples plus 23:59 to flag possible sign changes (not an exhaustive range). Rising sign, Midheaven, houses, wheel, aspects, full personality synthesis, transit readings, and personalized numerology/astrology pairings are omitted. Numerology remains available. Automatic time-zone offsets are resolved separately for each sample; a manual offset override applies to the whole day. Unresolvable local sample times produce a visible error rather than a guessed offset.

Planetary positions are calculated in the browser with [Astronomy Engine](https://github.com/cosinekitty/astronomy). Choose the tropical zodiac or a Lahiri sidereal conversion, and Whole Sign, Equal, or Porphyry houses. Major aspects and a reflective chart overview are calculated locally. Lunar nodes use the mean node; Chiron is an approximate two-body orbital estimate based on [JPL Small-Body Database](https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2060) elements and is labeled as such in the chart.

Sun signs use the calculated solar longitude, not fixed calendar cutoffs. The zodiac guide's dates are approximate tropical ranges: exact transitions vary by year, time, and time zone, and sidereal boundaries differ. For example, December 22, 1954 at 14:32 in Auckland (UTC+12) has a Sagittarius Sun; the December solstice/Capricorn ingress occurred around 21:24 local time that day. Charts with the Sun within one degree of a sign boundary show an explanatory note.

The "How your placements work together" reading explains each of the ten planets' sign styles, elements, modalities, and house contexts, plus a chart-specific synthesis and a personal-planet aspect example when available. Near a boundary, a planet is assigned to one calculated sign, not a blended cusp sign; the chart's other signs contribute through their own placements.

Daily and weekly "Life areas in focus" cards include plain-language house explanations, everyday examples, reflection questions, and the themes of the planets responsible for the emphasis. Daily focus ranks houses by current planet count; weekly focus ranks by occupied daily samples, then unique planet count. These rankings are not measures of life importance or predictions of events.

Use **Find coordinates** to look up a birthplace with [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/). This is an explicit, one-off search (not autocomplete); only the place name is sent to the service, and the returned coordinates remain editable. The public Nominatim server is intended for moderate, user-initiated usage, allows at most one request per second per application, and requires attribution. See its [usage policy](https://operations.osmfoundation.org/policies/nominatim/). For a larger public deployment, use a geocoding provider or proxy with application-wide rate limiting and caching.

Coordinates are mapped to an IANA time zone locally with `tz-lookup`; the browser's time-zone data determines the historical UTC offset for the entered birth date and time, including daylight-saving changes. The offset can be manually overridden. The place name is sent to Nominatim only when the user requests a search; date and time are not sent to a service. Chart interpretations are for reflection and education, not scientific predictions.

After calculating a chart, the app also shows a daily transit snapshot and a seven-day overview. It compares current planetary positions with natal placements and house cusps locally in the browser; the weekly view samples positions once per day. A personality profile describes the Sun, Moon, Ascendant, Mercury, Venus, and Mars through their sign and house placements, plus a Big Three synthesis, elemental pattern, relationship themes, and career/direction reflections. Transit readings and personality descriptions are astrological reflection, not certain predictions or scientific assessments.

The learning guide includes an aspect glossary for conjunction, sextile, square, trine, and opposition, explaining their approximate angles and how they relate to the chart's major aspects and orb values.

The chart also offers an optional numerology companion: Life Path and Birthday numbers from the birth date, a Personal Year number (reduced to 1–9) for the current calendar year, and (when entered) Expression and Soul Urge numbers from the full birth name. Numerology is calculated locally with the Pythagorean letter-number system; 11, 22, and 33 are preserved as master numbers where applicable, and Soul Urge counts A, E, I, O, and U as vowels. The full birth name is optional and is not sent to any service. The readings include everyday reflection prompts and a personalized, explicitly interpretive comparison with the Sun, Moon, and Rising signs. The comparison is not presented as a traditional correspondence, scientific assessment, or prediction.
