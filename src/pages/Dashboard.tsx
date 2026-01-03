import { useEffect, useState, useMemo } from 'react';
import { useAuthStore } from '../store/authStore';
import { useLessonStore } from '../store/lessonStore';
import { useThemeStore } from '../store/themeStore';
import FilterBar from '../components/FilterBar';
import LessonSection from '../components/LessonSection';
import Toast from '../components/Toast';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import { startOfMonth, format, subMonths, addMonths } from 'date-fns';
import { MONTH_FILTER, DATE_FILTER } from '../constants';
import { filterTodayLessons, filterLessonsByDateRange, getMonthRange } from '../utils';
import { LessonFilterType } from '../types';

/**
 * Dashboard component - Main page for tutors to view and manage their lessons
 * 
 * Features:
 * - Display lessons grouped by type (Today's, Available, Upcoming, Historic)
 * - Filter lessons by month or date range
 * - Take available classes
 * - Responsive sidebar navigation
 * - Theme toggle (light/dark mode)
 * 
 * @returns JSX element representing the dashboard
 */
const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const { lessons, loading, error, fetchLessonsData, takeClass, filteredLessons } = useLessonStore();
  const { theme, toggleTheme } = useThemeStore();
  
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch lessons data on component mount
  // Note: fetchLessonsData is stable from Zustand store, but we include it in deps
  // to satisfy exhaustive-deps rule. In practice, it won't cause re-renders.
  useEffect(() => {
    fetchLessonsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps array is safe here as fetchLessonsData is stable

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleTakeClass = async (lessonId: string) => {
    try {
      await takeClass(lessonId);
      setToast({ message: 'Successfully took the class!', type: 'success' });
    } catch (error) {
      setToast({ 
        message: error instanceof Error ? error.message : 'Failed to take class', 
        type: 'error' 
      });
    }
  };

  const handleMonthChange = (monthIndex: number) => {
    if (monthIndex === DATE_FILTER.CLEAR_MONTH_INDEX) {
      setSelectedMonth(null);
      setDateRange(null);
    } else {
      setSelectedMonth(monthIndex);
      setDateRange(null);
    }
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    if (start && end) {
      setDateRange({ start, end });
      setSelectedMonth(null);
    } else {
      setDateRange(null);
    }
  };

  /**
   * Get filtered lessons by type with optional month and date range filters
   * 
   * This function applies multiple filters in sequence:
   * 1. First filters by lesson type (Historic, Upcoming, Available, or Today)
   * 2. Then applies month filter if a month is selected
   * 3. Finally applies date range filter if provided
   * 
   * Month filter calculation:
   * - The selectedMonth index represents a position in a 12-month array
   * - Index 0-5: represents past months (5 months back to current month)
   * - Index 6-11: represents future months (1-6 months forward)
   * - The calculation converts the index to an actual date by:
   *   - For past months: subtracting (MONTHS_BACK - index) months from current month
   *   - For future months: adding (index - MONTHS_BACK) months to current month
   * 
   * @param type - Lesson type to filter by (Historic, Upcoming, Available, or 'Today' for today's lessons)
   * @returns Filtered array of lessons matching all applied filters
   */
  const getFilteredLessonsByType = (type: LessonFilterType) => {
    let filtered = filteredLessons(type, dateRange || undefined);
    
    // If month is selected, filter further
    if (selectedMonth !== null) {
      // Calculate target month based on index in 12 months array
      // Index 0-5: past months (MONTHS_BACK months back to current)
      // Index 6-11: future months (1-MONTHS_FORWARD months forward)
      const currentMonth = startOfMonth(new Date());
      let targetDate: Date;
      if (selectedMonth <= MONTH_FILTER.PAST_MONTHS_THRESHOLD) {
        // Past months: MONTHS_BACK - selectedMonth months ago
        targetDate = subMonths(currentMonth, MONTH_FILTER.MONTHS_BACK - selectedMonth);
      } else {
        // Future months: selectedMonth - MONTHS_BACK months forward
        targetDate = addMonths(currentMonth, selectedMonth - MONTH_FILTER.MONTHS_BACK);
      }
      const { start: monthStart, end: monthEnd } = getMonthRange(targetDate);
      filtered = filterLessonsByDateRange(filtered, monthStart, monthEnd);
    }
    
    return filtered;
  };

  /**
   * Get today's lessons with optional month and date range filters
   * 
   * This function:
   * 1. First filters lessons to only include those scheduled for today
   * 2. Then applies month filter if selected (same logic as getFilteredLessonsByType)
   * 3. Finally applies date range filter if provided
   * 
   * Note: When both month and date range filters are applied, the date range filter
   * takes precedence and further narrows the results from the month filter.
   * 
   * @returns Filtered array of today's lessons matching all applied filters
   */
  const getTodayLessons = () => {
    // Step 1: Filter to only today's lessons
    let todayLessons = filterTodayLessons(lessons);
    
    // Step 2: Apply month filter if selected
    // The month filter calculation converts the selectedMonth index to an actual date:
    // - Index 0-5: past months (5 months back to current)
    // - Index 6-11: future months (1-6 months forward)
    if (selectedMonth !== null) {
      const currentMonth = startOfMonth(new Date());
      let targetDate: Date;
      
      if (selectedMonth <= MONTH_FILTER.PAST_MONTHS_THRESHOLD) {
        // Past months: calculate how many months ago
        // Example: selectedMonth = 3 means 2 months ago (5 - 3 = 2)
        targetDate = subMonths(currentMonth, MONTH_FILTER.MONTHS_BACK - selectedMonth);
      } else {
        // Future months: calculate how many months forward
        // Example: selectedMonth = 8 means 3 months forward (8 - 5 = 3)
        targetDate = addMonths(currentMonth, selectedMonth - MONTH_FILTER.MONTHS_BACK);
      }
      
      // Get the full month range (start and end of the target month)
      const { start: monthStart, end: monthEnd } = getMonthRange(targetDate);
      todayLessons = filterLessonsByDateRange(todayLessons, monthStart, monthEnd);
    }
    
    // Step 3: Apply date range filter if provided
    // This further narrows the results to the specified date range
    if (dateRange) {
      todayLessons = filterLessonsByDateRange(todayLessons, dateRange.start, dateRange.end);
    }
    
    return todayLessons;
  };

  /**
   * Get available months (months with data) from the filter range
   * 
   * This memoized value calculates which months have lesson data within the
   * filter range (current month ± MONTHS_BACK/MONTHS_FORWARD months).
   * 
   * The result is a Set of month keys in 'yyyy-MM' format, which is used to:
   * - Enable/disable month filter buttons in the FilterBar
   * - Show which months have data available for filtering
   * 
   * Range calculation:
   * - Start: MONTHS_BACK months before current month
   * - End: MONTHS_FORWARD months after current month
   * 
   * @returns Set of month keys (yyyy-MM format) that contain lesson data
   */
  const availableMonths = useMemo(() => {
    const now = new Date();
    const currentMonth = startOfMonth(now);
    
    // Calculate the date range for months to include
    const monthsAgo = subMonths(currentMonth, MONTH_FILTER.MONTHS_BACK);
    const monthsForward = addMonths(currentMonth, MONTH_FILTER.MONTHS_FORWARD);
    
    const monthsSet = new Set<string>();
    
    // Iterate through all lessons and collect months that have data
    lessons.forEach(lesson => {
      const lessonDate = new Date(lesson.date);
      const lessonMonth = startOfMonth(lessonDate);
      
      // Check if lesson is within the filter range
      if (lessonMonth >= monthsAgo && lessonMonth <= monthsForward) {
        // Add month key in 'yyyy-MM' format for easy lookup
        const monthKey = format(lessonDate, 'yyyy-MM');
        monthsSet.add(monthKey);
      }
    });
    
    return monthsSet;
  }, [lessons]);

  const historicLessons = getFilteredLessonsByType('Historic');
  const upcomingLessons = getFilteredLessonsByType('Upcoming');
  const availableLessons = getFilteredLessonsByType('Available');
  const todayLessons = getTodayLessons();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/50 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="px-3 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 py-3 sm:py-0 sm:h-16">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Hamburger menu button for mobile */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Logo */}
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 dark:text-white">
                  Champ Code Academy
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                )}
              </button>
              
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate flex-1 sm:flex-none">
                Welcome, {user?.name}
              </span>
              <button
                onClick={logout}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs sm:text-sm font-medium whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content area with sidebar and main content */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toast Notification */}
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
            <Breadcrumb />
            
            {loading && (
          <div className="text-center py-8 sm:py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <FilterBar
              onMonthChange={handleMonthChange}
              onDateRangeChange={handleDateRangeChange}
              selectedMonth={selectedMonth}
              availableMonths={availableMonths}
            />

            <LessonSection
              title="Today's Lessons"
              lessons={todayLessons}
              emptyMessage="No lessons today"
            />

            <LessonSection
              title="Available Lessons"
              lessons={availableLessons}
              onTakeClass={handleTakeClass}
              emptyMessage="No available lessons"
            />

            <LessonSection
              title="Upcoming Lessons"
              lessons={upcomingLessons}
              emptyMessage="No upcoming lessons"
            />

            <LessonSection
              title="Historic Lessons"
              lessons={historicLessons}
              emptyMessage="No historic lessons"
            />
          </>
        )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

