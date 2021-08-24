export default function (obj: any, optName: string) {
  const fnc = () => {
    const dt = new Date()
    obj[optName] = `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDay()} ${dt.getHours()}:${dt.getMinutes()}`
  }
  const timerVal = setInterval(fnc, 60000)
  fnc()
  return timerVal
}