import { differenceInWeeks, format, formatDistanceToNow, getYear, isSameYear } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

const formatDate = (dateString) => {
  if (!dateString || dateString.length === 1) {
    return null;
  }

  const utcDateTime = utcToZonedTime(dateString);
  const isDifferentWeek = differenceInWeeks(Date.now(), utcDateTime) > 0 ? true : false;
  const formattedTime = format(utcDateTime, 'iii, MMM d');
  const yearSuffix = !isSameYear(Date.now(), utcDateTime) ? `, ${getYear(utcDateTime)}` : '';
  const distanceToNow = formatDistanceToNow(utcDateTime, { addSuffix: true });

  return isDifferentWeek ? `on ${formattedTime}${yearSuffix}` : distanceToNow;
}

export { formatDate }