import { useState, useMemo } from 'react';
import { format, subMonths, addMonths, startOfMonth } from 'date-fns';
import { MONTH_NAMES, MONTH_ABBREVIATIONS, MONTH_FILTER, DATE_FILTER } from '../constants';

interface FilterBarProps {
  onMonthChange: (month: number) => void;
  onDateRangeChange: (start: Date | null, end: Date | null) => void;
  selectedMonth: number | null;
  availableMonths?: Set<string>; // Set of month keys in 'yyyy-MM' format
}

/**
 * FilterBar component for filtering lessons by month and date range
 * 
 * Displays a list of month buttons (5 months back + current + 6 months forward)
 * and a date range picker for custom date filtering.
 * 
 * @param onMonthChange - Callback when a month is selected (receives month index 0-11, or -1 to clear)
 * @param onDateRangeChange - Callback when date range is applied (receives start and end dates, or null to clear)
 * @param selectedMonth - Currently selected month index (0-11) or null if none selected
 * @param availableMonths - Set of month keys (yyyy-MM format) that have lesson data
 */
const FilterBar = ({ onMonthChange, onDateRangeChange, selectedMonth, availableMonths = new Set() }: FilterBarProps) => {
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Get 12 months: current month + 5 months back + 6 months forward
  const last12Months = useMemo(() => {
    const now = new Date();
    const currentMonth = startOfMonth(now);
    const months: Array<{ monthIndex: number; year: number; monthKey: string; monthName: string; monthAbbr: string }> = [];
    
    // Add months: 5 months back, current month
    for (let i = MONTH_FILTER.MONTHS_BACK; i >= 0; i--) {
      const date = subMonths(currentMonth, i);
      const year = date.getFullYear();
      const monthIndex = date.getMonth();
      const monthKey = format(date, 'yyyy-MM');
      
      months.push({
        monthIndex,
        year,
        monthKey,
        monthName: MONTH_NAMES[monthIndex],
        monthAbbr: MONTH_ABBREVIATIONS[monthIndex]
      });
    }
    
    // Add 6 months forward
    for (let i = 1; i <= MONTH_FILTER.MONTHS_FORWARD; i++) {
      const date = addMonths(currentMonth, i);
      const year = date.getFullYear();
      const monthIndex = date.getMonth();
      const monthKey = format(date, 'yyyy-MM');
      
      months.push({
        monthIndex,
        year,
        monthKey,
        monthName: MONTH_NAMES[monthIndex],
        monthAbbr: MONTH_ABBREVIATIONS[monthIndex]
      });
    }
    
    return months;
  }, []);

  const handleMonthSelect = (indexInLast12: number, monthKey: string) => {
    // Check if this month has data
    if (!availableMonths.has(monthKey)) {
      return; // Don't allow selection if no data
    }
    
    // Pass the index in last 12 months array (0-11)
    onMonthChange(indexInLast12);
    setShowDateRange(false);
    setStartDate('');
    setEndDate('');
  };

  const handleDateRangeApply = () => {
    if (startDate && endDate) {
      onDateRangeChange(new Date(startDate), new Date(endDate));
      setShowDateRange(false);
    }
  };

  const handleClearFilters = () => {
    onMonthChange(DATE_FILTER.CLEAR_MONTH_INDEX);
    onDateRangeChange(null, null);
    setStartDate('');
    setEndDate('');
    setShowDateRange(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-3 sm:p-4 mb-6">
      <div className="space-y-4">
        <div className="w-full">
          <span className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-0 sm:inline sm:mr-2">
            Filter by Month:
          </span>
          <div className="flex gap-1.5 sm:gap-2 flex-wrap mt-2 sm:mt-0 sm:inline-flex">
            {last12Months.map((monthInfo, index) => {
              const hasData = availableMonths.has(monthInfo.monthKey);
              const isSelected = selectedMonth === index;
              
              return (
                <button
                  key={monthInfo.monthKey}
                  onClick={() => handleMonthSelect(index, monthInfo.monthKey)}
                  disabled={!hasData}
                  className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm transition ${
                    !hasData
                      ? 'bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
                      : isSelected
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title={!hasData ? 'No lessons in this month' : `${monthInfo.monthName} ${monthInfo.year}`}
                >
                  <span className="hidden sm:inline">{monthInfo.monthName} {monthInfo.year}</span>
                  <span className="sm:hidden">{monthInfo.monthAbbr} {monthInfo.year.toString().slice(-2)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowDateRange(!showDateRange)}
            className="px-3 sm:px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition text-xs sm:text-sm font-medium"
          >
            Date Range
          </button>

          {(selectedMonth !== null || startDate || endDate) && (
            <button
              onClick={handleClearFilters}
              className="px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition text-xs sm:text-sm font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {showDateRange && (
        <div className="mt-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4">
            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={handleDateRangeApply}
                className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium whitespace-nowrap text-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;

