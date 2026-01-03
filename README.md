# 🧑‍🏫 Champ Code Academy — Tutor Portal Case Study

## 🎯 Overview

In this case study, you will design and implement a **Tutor Portal** frontend for Champ Code Academy.  
This portal will allow tutors to log in, view their teaching schedule, and take on available classes.

Your goal is to create a **clean, modern, and intuitive user interface** that connects to a backend (FastAPI or mock API).  
This challenge evaluates your **frontend engineering, data handling, and design thinking** skills.

---

## ⚙️ Requirements

### Core Features

1. **Login Page**
   - Create a basic login page for tutors.
   - No real authentication required — simulate login using mock credentials or API call.
   - After login, redirect to the Tutor Dashboard.

2. **Tutor Dashboard**
   - Show **four sections** of class data:
     - **Historic Lessons** (completed)
     - **Upcoming Lessons**
     - **Available Lessons** (open slots tutor can take)
     - **Today’s Lessons**
   - Each lesson card should display:
     - Date, Time, Student(s), Subject/Course, and Lesson Type.
   - Include a button (e.g., “Take Class”) for available lessons.

3. **Monthly and Date Filters**
   - Display lessons grouped by **month** by default.
   - Provide a **date filter or calendar picker** so tutors can filter by specific date range.
   - Lessons should dynamically re-render when filters are applied.

4. **Better UI/UX**
   - Design should focus on clarity, usability, and a professional aesthetic.
   - Use consistent components for cards, tables, and navigation.

5. **Backend Integration**
   - Connect to an API endpoint (FastAPI or mock JSON server) to fetch lesson data.
   - Handle loading states and errors gracefully.

---

## 🧱 Technical Guidelines

### Stack

- **Frontend Framework:** React (TypeScript preferred)
- **Build Tool:** Vite or Next.js
- **Styling:** Styled Components / Emotion / TailwindCSS (no UI kits)
- **State Management:** Zustand, Redux Toolkit, or React Context
- **API Handling:** Fetch / Axios

### Data Example

You can use mock data or connect to a real API endpoint.  
Sample structure:

```json
[
  {
    "id": "L001",
    "date": "2025-10-28T14:00:00Z",
    "type": "Historic",
    "subject": "Minecraft Game Design - Level 1",
    "students": ["Ethan", "Ava"],
    "tutor": "Sarah Tan",
    "status": "Completed"
  },
  {
    "id": "L002",
    "date": "2025-11-02T09:00:00Z",
    "type": "Historic",
    "subject": "Roblox Coding Basics",
    "students": ["Lucas"],
    "tutor": "Sarah Tan",
    "status": "Completed"
  },
  {
    "id": "L003",
    "date": "2025-11-05T16:00:00Z",
    "type": "Historic",
    "subject": "Python for Kids - Introduction",
    "students": ["Chloe", "Aaron"],
    "tutor": "Sarah Tan",
    "status": "Completed"
  },
  {
    "id": "L004",
    "date": "2025-11-08T10:00:00Z",
    "type": "Upcoming",
    "subject": "Minecraft Redstone Logic",
    "students": ["Emma", "Noah"],
    "tutor": "Sarah Tan",
    "status": "Confirmed"
  },
  {
    "id": "L005",
    "date": "2025-11-09T15:00:00Z",
    "type": "Upcoming",
    "subject": "Roblox Game Design - Level 2",
    "students": ["Ryan", "Mia"],
    "tutor": "Sarah Tan",
    "status": "Confirmed"
  },
  {
    "id": "L006",
    "date": "2025-11-10T12:00:00Z",
    "type": "Upcoming",
    "subject": "Website Design for Beginners",
    "students": ["Olivia"],
    "tutor": "Sarah Tan",
    "status": "Confirmed"
  },
  {
    "id": "L007",
    "date": "2025-11-12T11:00:00Z",
    "type": "Available",
    "subject": "Python for Kids - Game Projects",
    "students": [],
    "tutor": null,
    "status": "Available"
  },
  {
    "id": "L008",
    "date": "2025-11-13T17:00:00Z",
    "type": "Available",
    "subject": "Roblox Game Design - Level 1",
    "students": [],
    "tutor": null,
    "status": "Available"
  },
  {
    "id": "L009",
    "date": "2025-11-14T10:00:00Z",
    "type": "Available",
    "subject": "Minecraft AI Coding Adventure",
    "students": [],
    "tutor": null,
    "status": "Available"
  },
  {
    "id": "L010",
    "date": "2025-11-15T09:00:00Z",
    "type": "Upcoming",
    "subject": "Python Automation for Kids",
    "students": ["Elijah"],
    "tutor": "Sarah Tan",
    "status": "Confirmed"
  }
]
```

---

## 🧠 Deliverables

### UI Components
- [ ] Login page  
- [ ] Dashboard layout with sidebar/topbar  
- [ ] Lesson list/grid components  
- [ ] Filter and month selector  
- [ ] Available lesson card with “Take Class” action  

### Functionality
- [ ] Data fetched from mock or live API  
- [ ] Dynamic filtering by month/date  
- [ ] Loading and error states  
- [ ] State management for user session and lessons  

### Optional Bonuses
- [ ] Light/Dark mode toggle  
- [ ] Calendar view (monthly grid)  
- [ ] Responsive mobile layout  
- [ ] Smooth transitions and animations  

---

## 🧑‍💻 Submission Guidelines

- Include this `README.md` in your repo  
- Do **not** fork; create your own public repo  
- First commit = clean boilerplate setup  
- Deploy preview on **GitHub Pages** (required)  
- Provide setup instructions:
  - `npm install`
  - `npm run dev`
  - Optional: Copy `.env.example` to `.env` and configure API URLs

---

## 🚀 Evaluation Criteria

| Category | Description |
|-----------|-------------|
| **UI/UX Design** | Clarity, hierarchy, and visual polish |
| **Frontend Architecture** | Reusable components and clean structure |
| **API Integration** | Proper handling of data fetching, loading, and errors |
| **State Management** | Logical and predictable data flow |
| **Maintainability** | Code readability, naming, and organization |
| **Bonus Points** | Creative UI, animations, or advanced filtering |