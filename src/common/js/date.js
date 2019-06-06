export function dateFormat (date, timeStr) {
  if (/(y+)/.test(timeStr)) {
    timeStr = timeStr.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(timeStr)) {
      let str = o[k] + ''
      timeStr = timeStr.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return timeStr
}
function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}
