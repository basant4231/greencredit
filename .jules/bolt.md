## 2024-05-24 - Unbounded historical queries for UI components
**Learning:** The dashboard activity grid UI component (`ActivityGrid`) only renders the last 112 days of data, however the backend query (`Activity.find().select("createdAt")`) was unbounded, fetching the complete activity history. For long term users this leads to massive unneeded DB payloads and memory consumption.
**Action:** Always bound database queries with date filters (e.g. `$gte`) when populating date-bounded UI components to restrict payloads to only the data strictly needed by the view.
