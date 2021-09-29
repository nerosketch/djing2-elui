import moment from 'moment'

export default function (obj: any, optName: string, timeFormat?: string) {
  const fnc = () => {
    // obj[optName] = `${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDay()} ${dt.getHours()}:${dt.getMinutes()}`
    obj[optName] = moment(new Date()).format(timeFormat)
  }
  const timerVal = setInterval(fnc, 1000)
  fnc()
  return timerVal
}
