/**
 * Lesson type - Represents the classification of a lesson
 */
export type LessonType = 'Historic' | 'Upcoming' | 'Available';

/**
 * Lesson status - Represents the current status of a lesson
 */
export type LessonStatus = 'Completed' | 'Confirmed' | 'Available';

/**
 * Lesson interface - Represents a single lesson/class
 */
export interface Lesson {
  id: string;
  date: string;
  type: LessonType; // Use LessonType instead of literal union
  subject: string;
  students: string[];
  tutor: string | null;
  status: LessonStatus; // Use LessonStatus instead of literal union
}

/**
 * User interface - Represents a tutor/user
 */
export interface User {
  id: string;
  name: string;
  email: string;
}

/**
 * Filter type for lessons - Includes 'Today' for filtering today's lessons
 * This is used for filtering purposes, not as a lesson type
 */
export type LessonFilterType = LessonType | 'Today';

