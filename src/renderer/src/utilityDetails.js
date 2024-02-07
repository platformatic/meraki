export const getLabelDownloads = (downloads) => {
  let unit = ''
  if (downloads === null || Number.isNaN(downloads) || isNaN(downloads)) {
    return '-'
  }
  let downloadsConverted = downloads
  if (downloads >= 1000) {
    unit = 'k'
    downloadsConverted = downloads / 1000
  }
  if (downloads >= 1000000) {
    unit = 'M'
    downloadsConverted = downloads / 1000000
  }
  return `${Math.trunc(downloadsConverted)}${unit}`
}

export const getLabelReleasedAt = (releasedAt) => {
  if (releasedAt === '-') return '-'
  if (!(typeof releasedAt === 'string' || typeof releasedAt === 'number')) return '-'

  const time = parseInt(releasedAt)
  if (isNaN(time)) return '-'

  const releasedAtDate = new Date(parseInt(releasedAt))
  if (releasedAtDate === 'Invalid Date') return '-'

  const oneDay = 1000 * 60 * 60 * 24
  const today = new Date()
  const result = Math.round((today.getTime() - releasedAtDate.getTime()) / oneDay)
  const numberOfDays = result.toFixed(0)
  const numberOfWeeks = (numberOfDays / 4).toFixed(0)
  const numberOfMonths = (numberOfDays / 30).toFixed(0)
  const numberOfYears = (numberOfDays / 365).toFixed(0)
  let value = numberOfDays
  let unit = numberOfDays > 1 ? 'days' : 'day'
  if (numberOfWeeks > 1 && numberOfWeeks <= 4) {
    value = numberOfWeeks
    unit = numberOfWeeks > 1 ? 'weeks' : 'week'
  }
  if (numberOfWeeks > 4 && numberOfMonths <= 12) {
    value = numberOfMonths
    unit = numberOfMonths > 1 ? 'months' : 'month'
  }
  if (numberOfMonths > 12) {
    value = numberOfYears
    unit = numberOfYears > 1 ? 'years' : 'year'
  }

  return `${value} ${unit} ago`
}
