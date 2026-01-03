import { Lesson } from '../types';

/**
 * API Configuration
 * Uses environment variables for API base URL and settings
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true' || !import.meta.env.VITE_API_BASE_URL;

/**
 * API endpoints
 */
const API_ENDPOINTS = {
  LESSONS: '/lessons',
  TAKE_CLASS: '/lessons/take',
} as const;

/**
 * Mock data for development/testing
 * This data is used when VITE_USE_MOCK_API is set to 'true'
 */
const mockLessons: Lesson[] = [
  {
    id: "L001",
    date: "2025-10-28T14:00:00Z",
    type: "Historic",
    subject: "Minecraft Game Design - Level 1",
    students: ["Ethan", "Ava"],
    tutor: "Sarah Tan",
    status: "Completed"
  },
  {
    id: "L002",
    date: "2025-11-02T09:00:00Z",
    type: "Historic",
    subject: "Roblox Coding Basics",
    students: ["Lucas"],
    tutor: "Sarah Tan",
    status: "Completed"
  },
  {
    id: "L003",
    date: "2025-11-05T16:00:00Z",
    type: "Historic",
    subject: "Python for Kids - Introduction",
    students: ["Chloe", "Aaron"],
    tutor: "Sarah Tan",
    status: "Completed"
  },
  {
    id: "L004",
    date: "2025-11-08T10:00:00Z",
    type: "Upcoming",
    subject: "Minecraft Redstone Logic",
    students: ["Emma", "Noah"],
    tutor: "Sarah Tan",
    status: "Confirmed"
  },
  {
    id: "L005",
    date: "2025-11-09T15:00:00Z",
    type: "Upcoming",
    subject: "Roblox Game Design - Level 2",
    students: ["Ryan", "Mia"],
    tutor: "Sarah Tan",
    status: "Confirmed"
  },
  {
    id: "L006",
    date: "2025-11-10T12:00:00Z",
    type: "Upcoming",
    subject: "Website Design for Beginners",
    students: ["Olivia"],
    tutor: "Sarah Tan",
    status: "Confirmed"
  },
  {
    id: "L007",
    date: "2025-11-12T11:00:00Z",
    type: "Available",
    subject: "Python for Kids - Game Projects",
    students: [],
    tutor: null,
    status: "Available"
  },
  {
    id: "L008",
    date: "2025-11-13T17:00:00Z",
    type: "Available",
    subject: "Roblox Game Design - Level 1",
    students: [],
    tutor: null,
    status: "Available"
  },
  {
    id: "L009",
    date: "2025-11-14T10:00:00Z",
    type: "Available",
    subject: "Minecraft AI Coding Adventure",
    students: [],
    tutor: null,
    status: "Available"
  },
  {
    id: "L010",
    date: "2025-11-15T09:00:00Z",
    type: "Upcoming",
    subject: "Python Automation for Kids",
    students: ["Elijah"],
    tutor: "Sarah Tan",
    status: "Confirmed"
  },
  {
    id: "L011",
    date: "2026-01-03T09:00:00Z",
    type: "Upcoming",
    subject: "Python Automation for Kids2",
    students: ["Celtic"],
    tutor: "Sarah Tan",
    status: "Confirmed"
  }
];

/**
 * Simulate API delay for mock API
 * @param ms - Delay in milliseconds
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Create a fetch request with timeout
 * @param url - Request URL
 * @param options - Fetch options
 * @param timeout - Timeout in milliseconds
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout: number = API_TIMEOUT
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
};

/**
 * Fetch lessons from the API
 * Uses mock data if VITE_USE_MOCK_API is true, otherwise makes a real API call
 * @returns Promise resolving to an array of lessons
 * @throws Error if the request fails
 */
export const fetchLessons = async (): Promise<Lesson[]> => {
  if (USE_MOCK_API) {
    // Use mock data with simulated delay
    await delay(500);
    return [...mockLessons];
  }

  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.LESSONS}`;
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch lessons: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Failed to fetch lessons: ${error.message}`
        : 'Failed to fetch lessons'
    );
  }
};

/**
 * Take/claim an available class
 * Uses mock data if VITE_USE_MOCK_API is true, otherwise makes a real API call
 * @param lessonId - ID of the lesson to take
 * @returns Promise resolving to the updated lesson with status changed to 'Upcoming' and 'Confirmed'
 * @throws Error if the lesson is not found or the request fails
 */
export const takeClass = async (lessonId: string): Promise<Lesson> => {
  if (USE_MOCK_API) {
    // Use mock data with simulated delay
    await delay(300);
    const lesson = mockLessons.find((l) => l.id === lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }
    
    // In mock mode, simulate the API response by returning an updated lesson
    // This mimics what a real API would return after successfully taking a class
    if (lesson.type === 'Available') {
      return {
        ...lesson,
        type: 'Upcoming' as const,
        status: 'Confirmed' as const,
        tutor: lesson.tutor || 'Sarah Tan', // Use existing tutor or default
        // Keep students as they were (or empty if none)
        students: lesson.students || [],
      };
    }
    
    // If lesson is not available, return as-is (though this shouldn't happen in normal flow)
    return lesson;
  }

  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.TAKE_CLASS}`;
    const response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lessonId }),
      },
      API_TIMEOUT
    );

    if (!response.ok) {
      throw new Error(`Failed to take class: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Failed to take class: ${error.message}`
        : 'Failed to take class'
    );
  }
};

