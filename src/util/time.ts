/**
 * Converts a number of seconds to a string of the form "HH:MM:SS", omitting the hours if they are zero.
 */
export const toTimestamp = (seconds: number): string => {
  seconds = Math.round(seconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const includeHours = hours > 0;

  const hoursStr = includeHours ? `${hours}:` : "";
  const minutesStr = `${minutes}`.padStart(includeHours ? 2 : 1, "0");
  const secondsStr = `${secs}`.padStart(2, "0");

  return `${hoursStr}${minutesStr}:${secondsStr}`;
};
