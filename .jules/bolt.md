## 2024-04-07 - Bounding Date Queries for UI Grids
**Learning:** When fetching data for fixed-window UI components (like a GitHub-style 112-day activity grid), querying the entire history (e.g., all `createdAt` dates for a user) causes unnecessary database load and memory usage.
**Action:** Always bound date queries to the exact window required by the UI (e.g., using `$gte` in MongoDB) to prevent performance degradation as the user's history grows over time.
