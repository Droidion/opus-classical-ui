import { describe, test, expect } from 'vitest'
import {
  isValidYear,
  sliceYear,
  centuryEqual,
  formatYearsRangeString,
  formatWorkLength,
  formatCatalogueName,
  formatWorkName,
} from '../helpers'

describe('isValidYear', () => {
  test('identifies valid year', () => {
    expect(isValidYear(500)).toBe(true)
    expect(isValidYear(1000)).toBe(true)
    expect(isValidYear(1234)).toBe(true)
    expect(isValidYear(9999)).toBe(true)
  })
  test('identifies invalid year', () => {
    expect(isValidYear(10000)).toBe(false)
    expect(isValidYear(0)).toBe(false)
    expect(isValidYear(-1)).toBe(false)
    expect(isValidYear(null)).toBe(false)
  })
})

describe('sliceYear', () => {
  test('creates valid slice', () => {
    expect(sliceYear(1985)).toBe('85')
    expect(sliceYear(9999)).toBe('99')
  })
})

describe('centuryEqual', () => {
  test('returns true for equal centuries', () => {
    expect(centuryEqual(1700, 1799)).toBe(true)
    expect(centuryEqual(1750, 1749)).toBe(true)
  })
  test('returns false for non equal centuries', () => {
    expect(centuryEqual(1699, 1700)).toBe(false)
    expect(centuryEqual(1799, 1800)).toBe(false)
    expect(centuryEqual(1200, 1500)).toBe(false)
    expect(centuryEqual(1, 2)).toBe(false)
  })
})

describe('formatYearsRangeString', () => {
  test('formats years range properly', () => {
    expect(formatYearsRangeString(1900, 1902)).toBe('1900–02')
    expect(formatYearsRangeString(1890, 1912)).toBe('1890–1912')
    expect(formatYearsRangeString(500, 1400)).toBe('500–1400')
    expect(formatYearsRangeString(1890, 1)).toBe('1890–')
    expect(formatYearsRangeString(1990, 0)).toBe('1990–')
    expect(formatYearsRangeString(0, 1950)).toBe('1950')
    expect(formatYearsRangeString(1, 1912)).toBe('1912')
    expect(formatYearsRangeString(-1, 0)).toBe('')
  })
})

describe('formatWorkLength', () => {
  test('formats properly', () => {
    expect(formatWorkLength(12)).toBe('12m')
    expect(formatWorkLength(59)).toBe('59m')
    expect(formatWorkLength(60)).toBe('1h')
    expect(formatWorkLength(62)).toBe('1h 2m')
    expect(formatWorkLength(123)).toBe('2h 3m')
    expect(formatWorkLength(-5)).toBe('')
    expect(formatWorkLength(0)).toBe('')
  })
})

describe('formatCatalogueName', () => {
  test('formats properly', () => {
    expect(formatCatalogueName('BWV', 12, 'm')).toBe('BWV 12m')
    expect(formatCatalogueName('BWV', 12, null)).toBe('BWV 12')
    expect(formatCatalogueName(null, 12, null)).toBe('')
    expect(formatCatalogueName('BWV', 0, null)).toBe('BWV 0')
    expect(formatCatalogueName(null, 0, null)).toBe('')
  })
})

describe('formatWorkName', () => {
  test('formats properly', () => {
    expect(formatWorkName('Symphony', 9, 'Great')).toBe(
      'Symphony No. 9&nbsp;<em>Great</em>',
    )
    expect(formatWorkName('Symphony', 9, null)).toBe('Symphony No. 9')
    expect(formatWorkName('Symphony', null, 'Great')).toBe(
      'Symphony&nbsp;<em>Great</em>',
    )
    expect(formatWorkName('', 9, 'Great')).toBe('')
  })
})
