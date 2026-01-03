import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

/**
 * Breadcrumb component - Displays navigation breadcrumbs
 * 
 * Automatically generates breadcrumbs based on the current route.
 * Shows the navigation path and allows users to navigate back to previous levels.
 */
const Breadcrumb = () => {
  const location = useLocation();

  // Define breadcrumb mapping
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathname = location.pathname;
    
    if (pathname === '/dashboard') {
      return [
        { label: 'Home', path: '/dashboard' },
        { label: 'Dashboard' },
      ];
    }
    
    // Default breadcrumb
    return [
      { label: 'Home', path: '/dashboard' },
      { label: pathname.split('/').pop() || 'Page' },
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="flex items-center space-x-2 text-sm mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg
                className="w-4 h-4 text-gray-400 mx-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
            {item.path && index < breadcrumbs.length - 1 ? (
              <Link
                to={item.path}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 dark:text-gray-100 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

