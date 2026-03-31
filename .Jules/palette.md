## 2025-05-15 - Improving Accessibility of Global Navigation and Footer
**Learning:** Icon-only interactive elements like mobile menu toggles, profile dropdowns, and social links in the footer lack descriptive ARIA labels, making them inaccessible to screen reader users. Dynamic labels for toggles (e.g., "Open menu" vs "Close menu") improve the experience further.
**Action:** Always check for `aria-label`, `aria-expanded`, and `aria-haspopup` on icon-only buttons and links during UX audits.
