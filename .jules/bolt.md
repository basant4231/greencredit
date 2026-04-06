## 2024-04-06 - Unbounded Date Queries for UI Components
**Learning:** Returning all historical activity dates just to render a rolling 112-day window grid causes unbounded payload growth and query duration over time. The aggregation `$gte` was missing on the dashboard, making `ActivityDates` pull the entire user history.
**Action:** Always bound `createdAt` queries matching the UI component's timeframe (e.g. `gridStartDate`) and add a compound index `{ userId: 1, createdAt: -1 }` to make the bounded fetch fast.
