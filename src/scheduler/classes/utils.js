export function pad(input) {
  return '00'.substring(0, 2 - ("" + input).length) + input;
}
export function timeToMin(time) {
  let timeX = time.split(':');
  return +(+timeX[0]) * 60 + (+time[1]);
}
export function minToTime(mins) {
  return [pad(Math.floor(mins / 60)), pad(mins % 60)].join(':');
}