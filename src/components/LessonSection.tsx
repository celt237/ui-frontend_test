import { Lesson } from '../types';
import LessonCard from './LessonCard';

interface LessonSectionProps {
  title: string;
  lessons: Lesson[];
  onTakeClass?: (lessonId: string) => void;
  emptyMessage?: string;
}

/**
 * LessonSection component - Displays a section of lesson cards
 * 
 * Renders a title and a grid of lesson cards. Shows an empty message
 * if there are no lessons in the section.
 * 
 * @param title - Section title (e.g., "Today's Lessons", "Available Lessons")
 * @param lessons - Array of lessons to display in this section
 * @param onTakeClass - Optional callback function for taking a class
 * @param emptyMessage - Message to display when there are no lessons (default: "No lessons")
 */
const LessonSection = ({ 
  title, 
  lessons, 
  onTakeClass,
  emptyMessage = 'No lessons' 
}: LessonSectionProps) => {
  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">{title}</h2>
      {lessons.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 sm:p-8 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
          {emptyMessage}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onTakeClass={onTakeClass}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonSection;

