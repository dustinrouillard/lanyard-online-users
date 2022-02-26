export function automaticRelativeDifference(d: Date): { duration: number; unit: Intl.RelativeTimeFormatUnit } {
  const diff = -((new Date().getTime() - d.getTime()) / 1000) | 0;
  const absDiff = Math.abs(diff);

  if (absDiff > 86400 * 30 * 10) return { duration: Math.round(diff / (86400 * 365)), unit: 'years' };
  if (absDiff > 86400 * 25) return { duration: Math.round(diff / (86400 * 30)), unit: 'months' };
  if (absDiff > 3600 * 21) return { duration: Math.round(diff / 86400), unit: 'days' };
  if (absDiff > 60 * 44) return { duration: Math.round(diff / 3600), unit: 'hours' };
  if (absDiff > 30) return { duration: Math.round(diff / 60), unit: 'minutes' };
  return { duration: diff, unit: 'seconds' };
}

export function msToTime(ms: number) {
  let seconds = (ms / 1000).toFixed(1);
  let minutes = (ms / (1000 * 60)).toFixed(1);
  let hours = (ms / (1000 * 60 * 60)).toFixed(1);
  let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
  if (~~seconds < 60) return seconds + ' Sec';
  else if (~~minutes < 60) return minutes + ' Min';
  else if (~~hours < 24) return hours + ' Hrs';
  else return days + ' Days';
}
