export default function(obj: any, optName: string) {
  const fnc = () => {
    const dt = new Date()
    obj[optName] = `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDay()} ${dt.getHours()}:${dt.getMinutes()}`
  }
  const timerVal = setInterval(fnc, 1000)
  fnc()
  return timerVal
}
