# Patch Notes

## Summary of Changes

- **SQL Operator Precedence Fix:** Fixed missing parentheses in `TaskRepository.java`, `search_tasks.sql`, and `task_search_package.sql` (`AND (LOWER(title) LIKE :term OR LOWER(description) LIKE :term OR LOWER(assignee) LIKE :term)`). This stopped archived tasks from leaking in search results and ensured status filters were respected.
- **Backend Exception & Latency Fix:** Wrapped `TaskStatus.valueOf()` in `TaskController.java` with safety checks returning a clean HTTP 400 Bad Request on invalid status parameters instead of crashing with HTTP 500. Removed artificial `Thread.sleep` delay to make API responses instantaneous.
- **Backend Pagination Bounds:** Sanitized `page` and `pageSize` in `TaskController.java` to prevent negative index crashes (`IndexOutOfBoundsException`).
- **Assignee Filtering Feature:** Added an `assignee` filter parameter to `TaskRepository.java` and `TaskController.java` (`?assignee=Alice`), enabling targeted user filtering alongside title/description search.
- **Frontend Race Condition & Error Handling:** Added `AbortController` in `useTasks.js` to cancel out-of-order fetch requests. Updated `.finally()` to clear `loading` state on API errors, preventing UI loading freezes.
- **Frontend UX & Search Debouncing:** Added a `useDebounce` hook (300ms) to prevent server flooding on keystrokes. Reset page to `1` on query/status/assignee change in `App.jsx`, added an `AssigneeFilter` dropdown, a "Clear Filters" button, page size dropdown, total count metadata badge, priority pills, and polished UI micro-animations in `styles.css`.

---

## What We Chose Not to Change

- **In-Memory SQL Pagination:** Kept `taskRepository.searchTasks()` returning a full list to slice in memory (`subList`) rather than adding native SQL `LIMIT/OFFSET` to avoid breaking H2 compatibility or altering existing repository interface signatures within the patch window.
- **Backend Architecture:** Kept Spring Boot controller structure intact without introducing unnecessary layers (Services/DTOs) as the current scope is focused on bug fixes.

---

## Biggest Remaining Risk

- **Database Memory Overhead:** Loading all un-archived task records into JVM RAM before applying in-memory sublisting will degrade backend memory and CPU performance if the task count scales to tens or hundreds of thousands of rows. Proper database-level pagination (`Pageable` / `Page<Task>`) is recommended for production.

---

## Tools Used

- **AI Assistant (Antigravity AI):** Used to perform cross-layer static analysis, identify operator precedence logic errors across SQL/Java/Oracle, implement the React search debouncing hook, and construct clean CSS visual polish.
