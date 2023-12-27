// IsValidYear checks if given string is a 4 digits number, like "1234" (not "-123", "123", or "12345").
export function isValidYear(num: number | null): boolean {
  return num !== null && num > 1 && num < 10_000
}

// SliceYear returns slice of the full year, like 85 from 1985.
export function sliceYear(year: number | null): string {
  return String(year).substring(2, 4)
}

// CenturyEqual checks if two given years are of the same century, like 1320 and 1399.
export function centuryEqual(
  year1: number | null,
  year2: number | null,
): boolean {
  if (!isValidYear(year1) || !isValidYear(year2)) {
    return false
  }
  const getCentury = (year: number | null): string =>
    String(year).substring(0, 2)
  return getCentury(year1) === getCentury(year2)
}

// FormatYearsRangeString formats the range of two years into the string, e.g. "1720–95", or "1720–1805", or "1720–".
// Start year and dash are always present.
// It's supposed to be used for lifespans, meaning we always have birth, but may not have death.
export function formatYearsRangeString(
  startYear: number | null,
  finishYear: number | null,
): string {
  if (!isValidYear(startYear) && !isValidYear(finishYear)) {
    return ''
  }
  if (!isValidYear(finishYear)) {
    return `${startYear}–`
  }
  if (!isValidYear(startYear)) {
    return String(finishYear)
  }
  if (centuryEqual(startYear, finishYear)) {
    return `${startYear}–${sliceYear(finishYear)}`
  }
  return `${startYear}–${finishYear}`
}

// FormatWorkLength formats minutes into a string with hours and minutes, like "2h 35m"
export function formatWorkLength(lengthInMinutes: number): string {
  const hours = Math.floor(lengthInMinutes / 60)
  const minutes = lengthInMinutes % 60
  if (hours === 0 && minutes === 0) {
    return ''
  }
  if (hours < 0 || minutes < 0) {
    return ''
  }
  if (hours === 0) {
    return `${minutes}m`
  }
  if (minutes === 0) {
    return `${hours}h`
  }
  return `${hours}h ${minutes}m`
}

// FormatCatalogueName formats catalogue name of the musical work, like "BWV 12p".
export function formatCatalogueName(
  catalogueName: string | null,
  catalogueNumber: number | null,
  cataloguePostfix: string | null,
): string {
  if (catalogueName === null || catalogueNumber === null) {
    return ''
  }
  return `${catalogueName} ${catalogueNumber}${cataloguePostfix || ''}`
}

// FormatWorkName formats music work full name, like "Symphony No. 9 Great".
export function formatWorkName(
  workTitle: string,
  workNo: number | null,
  workNickname: string | null,
  skipHtml = false,
): string {
  if (workTitle === '') {
    return ''
  }
  let workName = workTitle
  if (workNo !== null) {
    workName = `${workName} No. ${workNo}`
  }
  if (workNickname !== null) {
    workName = skipHtml
      ? `${workName} ${workNickname}`
      : `${workName}&nbsp;<em>${workNickname}</em>`
  }
  return workName
}
