import { calculateEstimated1RM, formatDate, getWeekStartDate, calculateVolume, calculateAverageWeight } from './utils';

describe('calculateEstimated1RM', () => {
  test('calculates 1RM correctly using Epley formula', () => {
    expect(calculateEstimated1RM(100, 5)).toBeCloseTo(116.7, 1);
    expect(calculateEstimated1RM(80, 10)).toBeCloseTo(106.7, 1);
  });

  test('returns 0 for invalid inputs', () => {
    expect(calculateEstimated1RM(0, 5)).toBe(0);
    expect(calculateEstimated1RM(100, 0)).toBe(0);
    expect(calculateEstimated1RM(100, 15)).toBe(0);
  });
});

describe('formatDate', () => {
  test('formats date as YYYY-MM-DD', () => {
    const date = new Date('2023-11-20T12:00:00Z');
    expect(formatDate(date)).toBe('2023-11-20');
  });
});

describe('getWeekStartDate', () => {
  test('returns Monday for a given date', () => {
    // Wednesday
    const date = new Date('2023-11-22T12:00:00Z');
    const monday = getWeekStartDate(date);
    expect(formatDate(monday)).toBe('2023-11-20');
    
    // Sunday
    const sunday = new Date('2023-11-26T12:00:00Z');
    const mondayFromSunday = getWeekStartDate(sunday);
    expect(formatDate(mondayFromSunday)).toBe('2023-11-20');
  });
});

describe('calculateVolume', () => {
  test('calculates volume correctly with single rep value', () => {
    expect(calculateVolume(100, [10, 10, 10], 3)).toBe(3000);
  });

  test('calculates volume correctly with array of rep values', () => {
    expect(calculateVolume(100, [10, 8, 8], 3)).toBe(2600);
  });

  test('handles zero sets correctly', () => {
    expect(calculateVolume(100, [10], 0)).toBe(0);
  });
});

describe('calculateAverageWeight', () => {
  test('calculates average weight correctly', () => {
    expect(calculateAverageWeight(100, 3)).toBeCloseTo(33.3, 1);
    expect(calculateAverageWeight(150, 5)).toBeCloseTo(30.0, 1);
  });

  test('returns 0 for zero sets', () => {
    expect(calculateAverageWeight(100, 0)).toBe(0);
  });
});
