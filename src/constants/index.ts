/**
 * Application constants
 */

/**
 * Month names in full format
 */
export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

/**
 * Month names in abbreviated format
 */
export const MONTH_ABBREVIATIONS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/**
 * Month filter constants
 * These define the range of months displayed in the filter (5 months back + current + 6 months forward)
 */
export const MONTH_FILTER = {
  /** Number of months to show before the current month */
  MONTHS_BACK: 5,
  /** Number of months to show after the current month */
  MONTHS_FORWARD: 6,
  /** Total number of months in the filter range */
  TOTAL_MONTHS: 12,
  /** Index threshold: months with index <= this are in the past, > this are in the future */
  PAST_MONTHS_THRESHOLD: 5,
} as const;

/**
 * Date filter constants
 */
export const DATE_FILTER = {
  /** Value used to clear/reset month filter */
  CLEAR_MONTH_INDEX: -1,
} as const;

