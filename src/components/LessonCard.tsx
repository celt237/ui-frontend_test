import { Lesson } from '../types';
import { formatDate, formatTime } from '../utils';

interface LessonCardProps {
  lesson: Lesson;
  onTakeClass?: (lessonId: string) => void;
}

/**
 * LessonCard component - Displays a single lesson with its details
 * 
 * Shows lesson information including date, time, subject, students, tutor, and status.
 * For available lessons, displays a "Take Class" button.
 * 
 * @param lesson - The lesson data to display
 * @param onTakeClass - Optional callback function when "Take Class" button is clicked
 */
const LessonCard = ({ lesson, onTakeClass }: LessonCardProps) => {
  const lessonDate = new Date(lesson.date);
  const formattedDate = formatDate(lessonDate);
  const formattedTime = formatTime(lessonDate);

  const getStatusColor = () => {
    switch (lesson.status) {
      case 'Completed':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      case 'Confirmed':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'Available':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const getTypeColor = () => {
    switch (lesson.type) {
      case 'Historic':
        return 'border-l-gray-400';
      case 'Upcoming':
        return 'border-l-blue-400';
      case 'Available':
        return 'border-l-green-400';
      default:
        return 'border-l-gray-400';
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-4 sm:p-6 border-l-4 ${getTypeColor()} hover:shadow-lg dark:hover:shadow-gray-900/70 transition-shadow duration-200`}
    >
      <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1 break-words">
            {lesson.subject}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {formattedDate} {formattedTime}
          </p>
        </div>
        <span
          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor()}`}
        >
          {lesson.status === 'Completed' ? 'Completed' : 
           lesson.status === 'Confirmed' ? 'Confirmed' : 'Available'}
        </span>
      </div>

      <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
        <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium mr-2">Type:</span>
          <span className="break-words">{lesson.type === 'Historic' ? 'Historic' : 
                 lesson.type === 'Upcoming' ? 'Upcoming' : 'Available'}</span>
        </div>

        {lesson.students && lesson.students.length > 0 ? (
          <div className="flex items-start text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium mr-2 flex-shrink-0">Students:</span>
            <span className="break-words">{lesson.students.join(', ')}</span>
          </div>
        ) : (
          <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-500">
            <span>No students</span>
          </div>
        )}

        {lesson.tutor && (
          <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium mr-2">Tutor:</span>
            <span className="break-words">{lesson.tutor}</span>
          </div>
        )}
      </div>

      {lesson.type === 'Available' && onTakeClass && (
        <button
          onClick={() => onTakeClass(lesson.id)}
          className="w-full mt-3 sm:mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition font-medium text-sm sm:text-base"
          aria-label={`Take class: ${lesson.subject}`}
        >
          Take Class
        </button>
      )}
    </div>
  );
};

export default LessonCard;

