## 2024-03-12 - Dashboard Query Performance

**Learning:** The user dashboard was fetching the entire activity history of a user just to count the activities for the last 112 days in the activity grid. This creates an O(N) payload bottleneck that scales linearly with a user's total history, despite only needing a fixed window of data. Furthermore, dashboard aggregation queries on `status` and `createdAt` lacked supporting database indexes.

**Action:** Always constrain date-based UI components (like the 112-day activity grid) with a `$gte` database query filter rather than fetching all records and filtering in JavaScript. Additionally, ensure compound indexes exist for high-frequency dashboard queries filtering on `userId` alongside fields like `status` or `createdAt`.
