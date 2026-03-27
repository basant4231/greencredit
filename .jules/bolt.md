
## 2024-03-20 - Dashboard Query Over-Fetching
**Learning:** The dashboard's ActivityGrid component only displays 112 days of activity, but the `activityDatesRaw` query was fetching the entire user history. For active users, this results in O(N) database reads and memory usage transferring mostly unused data. Additionally, missing database indexes on `userId` caused full collection scans.
**Action:** When populating date-bounded UI grids, always push the date filtering down to the database query layer (e.g., using `$gte` on `createdAt`). Always ensure queries filtering by user relationships have compound indexes covering the filtering/sorting fields (e.g., `{ userId: 1, createdAt: -1 }`).
