import moment from 'moment'

export default function (obj: any, optName: string, timeFormat?: string) {
  const fnc = () => {
    obj[optName] = moment(new Date()).format(timeFormat)
  }
  const timerVal = setInterval(fnc, 1000)
  fnc()
  return timerVal
}
