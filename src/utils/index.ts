import { format, startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';
import { Lesson } from '../types';

/**
 * Format a date to a readable string (e.g., "January 15, 2025")
 * @param date - The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMMM dd, yyyy');
};

/**
 * Format a date to time string (e.g., "14:30")
 * @param date - The date to format
 * @returns Formatted time string in HH:mm format
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'HH:mm');
};

/**
 * Get the start and end of today
 * @returns Object with start and end of today
 */
export const getTodayRange = () => {
  const today = startOfDay(new Date());
  const tomorrow = endOfDay(new Date());
  return { start: today, end: tomorrow };
};

/**
 * Check if a date is within today
 * @param date - The date to check
 * @returns True if the date is today
 */
export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const { start, end } = getTodayRange();
  return dateObj >= start && dateObj <= end;
};

/**
 * Get the month range for a given date
 * @param date - The date to get month range for
 * @returns Object with start and end of the month
 */
export const getMonthRange = (date: Date) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  return { start: monthStart, end: monthEnd };
};

/**
 * Filter lessons by date range
 * @param lessons - Array of lessons to filter
 * @param startDate - Start date of the range
 * @param endDate - End date of the range
 * @returns Filtered array of lessons
 */
export const filterLessonsByDateRange = (
  lessons: Lesson[],
  startDate: Date,
  endDate: Date
): Lesson[] => {
  return lessons.filter((lesson) => {
    const lessonDate = new Date(lesson.date);
    return lessonDate >= startDate && lessonDate <= endDate;
  });
};

/**
 * Filter lessons by a specific date (today)
 * @param lessons - Array of lessons to filter
 * @returns Filtered array of lessons for today
 */
export const filterTodayLessons = (lessons: Lesson[]): Lesson[] => {
  const { start, end } = getTodayRange();
  return filterLessonsByDateRange(lessons, start, end);
};

