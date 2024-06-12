export function fromMS(duration: number): string {
  const seconds = Math.floor((duration / 1e3) % 60).toString();
  const minutes = Math.floor((duration / 6e4) % 60).toString();
  const hours = Math.floor(duration / 36e5).toString();
  const secondsPad = seconds.padStart(2, "0");
  const minutesPad = minutes.padStart(2, "0");
  const hoursPad = hours.padStart(2, "0");
  return `${hours ? `${hoursPad}:` : ""}${minutesPad}:${secondsPad}`;
}
