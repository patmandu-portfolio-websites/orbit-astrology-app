import tzLookup from 'tz-lookup';

function makeUtcDate(year, month, day, hour = 0, minute = 0) {
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(hour, minute, 0, 0);
  return date;
}

function partsAt(formatter, date) {
  const values = Object.fromEntries(formatter.formatToParts(date).map(({ type, value }) => [type, Number(value)]));
  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour,
    minute: values.minute,
    second: values.second,
  };
}

function sameLocalMinute(left, right) {
  return left.year === right.year
    && left.month === right.month
    && left.day === right.day
    && left.hour === right.hour
    && left.minute === right.minute;
}

export function timezoneForCoordinates(latitude, longitude) {
  const lat = Number(latitude);
  const lon = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    throw new Error('Enter valid coordinates before determining the time zone.');
  }
  return tzLookup(lat, lon);
}

export function offsetForLocalDateTime(timeZone, birthDate, birthTime) {
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hour, minute] = birthTime.split(':').map(Number);
  const localAsUtc = makeUtcDate(year, month, day, hour, minute);
  if (
    !birthDate
    || !birthTime
    || !Number.isFinite(localAsUtc.getTime())
    || localAsUtc.getUTCFullYear() !== year
    || localAsUtc.getUTCMonth() + 1 !== month
    || localAsUtc.getUTCDate() !== day
    || hour < 0 || hour > 23
    || minute < 0 || minute > 59
  ) {
    throw new Error('Enter a valid birth date and time to determine the local UTC offset.');
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });
  const target = { year, month, day, hour, minute };
  const possibleOffsets = new Set();
  for (let hours = -48; hours <= 48; hours += 6) {
    const instant = new Date(localAsUtc.getTime() + hours * 3600000);
    const localParts = partsAt(formatter, instant);
    const reconstructed = makeUtcDate(
      localParts.year,
      localParts.month,
      localParts.day,
      localParts.hour,
      localParts.minute,
    );
    possibleOffsets.add(Math.round((reconstructed.getTime() - instant.getTime()) / 60000));
  }

  const matches = [...possibleOffsets]
    .map((offsetMinutes) => ({
      offsetMinutes,
      instant: new Date(localAsUtc.getTime() - offsetMinutes * 60000),
    }))
    .filter(({ instant }) => sameLocalMinute(partsAt(formatter, instant), target))
    .sort((left, right) => left.instant - right.instant);

  if (matches.length === 0) {
    throw new Error('That local birth time does not exist because the clock moved forward. Choose a valid time or enter a manual UTC offset.');
  }
  return matches[0].offsetMinutes / 60;
}
