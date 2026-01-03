import { create } from 'zustand';
import { Lesson, LessonFilterType } from '../types';
import { fetchLessons, takeClass as takeClassAPI } from '../services/api';
import { useAuthStore } from './authStore';

interface LessonState {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
  fetchLessonsData: () => Promise<void>;
  takeClass: (lessonId: string) => Promise<void>;
  filteredLessons: (type?: LessonFilterType, dateRange?: { start: Date; end: Date }) => Lesson[];
}

export const useLessonStore = create<LessonState>((set, get) => ({
  lessons: [],
  loading: false,
  error: null,
  fetchLessonsData: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchLessons();
      set({ lessons: data, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch lessons data',
        loading: false 
      });
    }
  },
  /**
   * Take/claim an available class
   * 
   * This function updates a lesson from 'Available' to 'Upcoming' status
   * when a tutor takes an available class. It:
   * - Makes an API call to persist the change on the server
   * - Updates local state with the response from the API
   * - Handles errors gracefully
   * 
   * @param lessonId - ID of the lesson to take
   * @throws Error if the API call fails or the lesson is not found
   */
  takeClass: async (lessonId: string) => {
    const { lessons } = get();
    
    // Find the lesson to ensure it exists and is available
    const lessonToTake = lessons.find(
      (lesson) => lesson.id === lessonId && lesson.type === 'Available'
    );
    
    if (!lessonToTake) {
      throw new Error('Lesson not found or not available');
    }

    try {
      // Call the API to take the class
      const updatedLesson = await takeClassAPI(lessonId);
      
      // Get current user from auth store
      const authState = useAuthStore.getState();
      const currentUser = authState.user?.name || 'Unknown Tutor';
      
      // Merge API response with local lesson data
      // API may return partial data, so we merge with existing lesson data
      const finalLesson: Lesson = {
        ...lessonToTake,
        ...updatedLesson,
        // Ensure required fields are set correctly
        type: (updatedLesson.type || 'Upcoming') as Lesson['type'],
        tutor: updatedLesson.tutor || currentUser,
        status: (updatedLesson.status || 'Confirmed') as Lesson['status'],
        // Preserve students if API doesn't return them
        students: updatedLesson.students ?? lessonToTake.students ?? [],
      };
      
      // Update local state with the merged lesson data
      const updatedLessons = lessons.map((lesson) =>
        lesson.id === lessonId ? finalLesson : lesson
      );
      
      set({ lessons: updatedLessons });
    } catch (error) {
      // Re-throw the error so the caller can handle it (e.g., show toast)
      throw error;
    }
  },
  /**
   * Filter lessons by type and/or date range
   * 
   * This function applies filters to the lessons array:
   * - Type filter: filters by lesson type (Historic, Upcoming, Available) or 'Today' for today's lessons
   * - Date range filter: filters lessons within a specific date range
   * 
   * Note: When 'Today' is used as the type, it filters lessons scheduled for today
   * regardless of their actual type (Historic, Upcoming, or Available).
   * 
   * @param type - Optional lesson type filter (Historic, Upcoming, Available, or 'Today')
   * @param dateRange - Optional date range filter with start and end dates
   * @returns Filtered array of lessons matching the criteria
   */
  filteredLessons: (type?: LessonFilterType, dateRange?: { start: Date; end: Date }) => {
    const { lessons } = get();
    let filtered = [...lessons];

    // Filter by type
    if (type) {
      if (type === 'Today') {
        // Special case: filter for today's lessons regardless of type
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow (exclusive end)
        
        filtered = filtered.filter(lesson => {
          const lessonDate = new Date(lesson.date);
          return lessonDate >= today && lessonDate < tomorrow;
        });
      } else {
        // Filter by specific lesson type
        filtered = filtered.filter(lesson => lesson.type === type);
      }
    }

    // Filter by date range
    if (dateRange) {
      filtered = filtered.filter(lesson => {
        const lessonDate = new Date(lesson.date);
        // Include lessons that fall within the date range (inclusive)
        return lessonDate >= dateRange.start && lessonDate <= dateRange.end;
      });
    }

    return filtered;
  },
}));

