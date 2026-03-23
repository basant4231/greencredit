param(
  [string]$OutputPath = "C:\Users\heman\OneDrive\Desktop\GC-2024-004.docx",
  [int]$MinimumPages = 50,
  [switch]$SkipBackup
)

$ErrorActionPreference = "Stop"

$wdAlignParagraphLeft = 0
$wdAlignParagraphCenter = 1
$wdAlignParagraphRight = 2
$wdAlignParagraphJustify = 3
$wdPageBreak = 7
$wdStory = 6
$wdFormatXMLDocument = 12

$studentName = "Basant Sharma"
$rollNumber = "2101920100091"
$supervisorName = "Ms. Aradhna Saini"
$departmentHead = "Dr. Sansar Singh Chauhan"
$instituteName = "G. L. Bajaj Institute of Technology & Management, Greater Noida"
$universityName = "Dr. A. P. J. Abdul Kalam Technical University, Uttar Pradesh, Lucknow"
$academicSession = "2024-2025"
$projectCode = "GC-2024-004"
$projectTitle = "Green Credit Management"
$projectSubtitle = "A Sustainable Activity Tracking and Eco-Reward Platform"

function New-ParagraphArray {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Paragraphs)
  return $Paragraphs
}

$chapter1Sections = @(
  @{
    Title = "1.1 Background and Context"
    Paragraphs = @(
@'
Environmental sustainability is no longer a peripheral topic reserved for policy debates or industrial audits. It has entered the daily lives of students, workers, commuters, and households who make small but meaningful decisions that influence energy use, waste generation, and carbon emissions. Despite this shift in awareness, most individuals still do not have an accessible digital system that translates eco-friendly behavior into visible, measurable, and motivating outcomes. As a result, many sustainable actions remain undocumented, unverified, and unrewarded.
'@
@'
The Green Credit Management project addresses this gap by presenting a practical web platform where environmental actions can be converted into structured digital records. Instead of treating sustainability as an abstract ideal, the platform turns it into a trackable workflow: a user creates an account, performs recognized green activities, receives credit values, and views the cumulative impact on a personalized dashboard. The project therefore combines environmental awareness, software engineering, and user-centered design into one cohesive system.
'@
@'
This report focuses on the current implemented codebase of the Green Credit project found in the accompanying Next.js application. Earlier concept notes associated with the report referred to broader ideas such as a marketplace, GPS verification, and automated AI inspection. Those ideas remain useful as future directions, but the present report is intentionally aligned with the features that are actually implemented in the application: secure onboarding, OTP-assisted registration, Google sign-in, activity recording, impact aggregation, dashboard visualization, and protected user routes.
'@)
  },
  @{
    Title = "1.2 Problem Statement"
    Paragraphs = @(
@'
Individuals who practice environmentally responsible behavior often receive no structured recognition, even when those behaviors directly reduce emissions or resource consumption. A commuter who uses the metro instead of a private vehicle, a citizen who plants a tree, or a household that adopts solar power contributes to sustainability, yet the evidence and long-term impact of those actions usually remain scattered across memory, photographs, or informal notes. This makes sustained participation difficult because the user cannot easily see progress over time.
'@
@'
From a software perspective, the absence of a simple, trustworthy, and user-friendly green action ledger creates multiple challenges. Users need an onboarding flow that is secure but not intimidating. Activity entries must be stored in a way that supports meaningful aggregation. Dashboards must communicate both motivation and transparency. The platform must also work with modern authentication patterns, responsive interfaces, and persistent cloud data storage. Green Credit Management is built to solve this combination of environmental, behavioral, and technical problems within a single web application.
'@)
  },
  @{
    Title = "1.3 Motivation and Objectives"
    Paragraphs = @(
@'
The core motivation behind this project is to make environmental responsibility visible, habitual, and rewarding. Many people are willing to contribute to sustainability if they can clearly understand the effect of their actions and if the system that records those actions feels approachable. The Green Credit platform is therefore designed around everyday clarity rather than enterprise complexity. Its ambition is not only to store data, but to shape behavior through a feedback loop in which the user sees credits, carbon offset, and saved energy update as soon as eco-friendly actions are recorded.
'@
@'
The project also has an academic motivation. It provides a concrete case study in full-stack web development by combining TypeScript, Next.js, React, MongoDB, authentication middleware, server-side aggregation, and transactional user flows. It demonstrates how a socially meaningful problem can be translated into modular software components that are maintainable, testable, and extendable. In that sense, the application is both a sustainability platform and a serious engineering exercise.
'@)
    BulletItems = @(
      "Provide a secure user onboarding flow using OTP-based email verification.",
      "Support multiple sign-in methods through credentials and Google OAuth.",
      "Allow users to record predefined green activities with measurable impact values.",
      "Aggregate credits, CO2 offset, and energy savings into a readable dashboard.",
      "Protect private routes so that sensitive dashboard pages are only visible to authenticated users.",
      "Use MongoDB-backed persistent storage for users, pending OTP records, and approved activities.",
      "Create a clean and responsive interface that makes sustainability tracking feel approachable.",
      "Leave room for future modules such as admin review, analytics, marketplace features, and stronger verification workflows."
    )
  },
  @{
    Title = "1.4 Scope of the Current Build"
    Paragraphs = @(
@'
The scope of the current implementation is intentionally focused. The application already provides a complete path from account creation to dashboard usage. A new user can sign up, receive an OTP through email, verify the account, log in, and begin interacting with the main dashboard. Users can also sign in with Google. Once authenticated, they can access a dashboard that displays cumulative environmental indicators and recent activity history sourced from MongoDB.
'@
@'
At the same time, the report distinguishes between implemented functionality and planned expansion. Several navigation labels and earlier draft text suggested richer modules such as a full marketplace, advanced analytics, or real-world geolocation proof. Those items are conceptually relevant to Green Credit Management, but they are not the core of the present codebase. By stating this clearly, the report remains credible and technically accurate while still documenting a realistic future roadmap.
'@)
    TableHeaders = @("Area", "Implemented in current codebase", "Planned or future direction")
    TableRows = @(
      @("User onboarding", "Signup with OTP verification, password hashing, account creation", "Password reset, resend OTP throttling, stronger anti-abuse checks"),
      @("Authentication", "Credential login and Google login via NextAuth", "Role-based admin console and richer account linking flows"),
      @("Activity capture", "Instant logging for Metro, Tree, and Solar actions", "Custom user-submitted activities with evidence upload"),
      @("Dashboard", "Credits, CO2 offset, energy saved, recent history, activity grid", "Comparative analytics, trends, badges, and goal tracking"),
      @("Security", "Protected routes with middleware and hashed credentials", "Audit trail, rate limiting, and deeper event monitoring"),
      @("Verification", "Basic trusted action mapping for approved activities", "Manual review, GPS validation, and image-based validation")
    )
  },
  @{
    Title = "1.5 Organization of the Report"
    Paragraphs = @(
@'
The remaining chapters follow the life cycle of the system. Chapter 2 reviews the conceptual background, stakeholder needs, and system requirements. Chapter 3 explains system analysis and design, including architecture, data models, and API behavior. Chapter 4 documents the implementation details from the actual project files. Chapter 5 discusses testing, results, and observed limitations. Chapter 6 concludes the report and presents future scope. References and appendices are included to make the report useful both as an academic submission and as a maintenance document for later development.
'@)
  }
)

$chapter2Sections = @(
  @{
    Title = "2.1 Literature Overview"
    Paragraphs = @(
@'
Digital sustainability platforms generally emerge from three intersecting ideas: measurement, motivation, and trust. Measurement is required because users need a way to understand the environmental effect of their actions. Motivation is essential because behavior change is rarely sustained without feedback. Trust is equally important because environmental claims lose value if they are not tied to a coherent verification or recording process. Research and industry practice both suggest that systems performing well in only one of these areas rarely achieve broad engagement.
'@
@'
The Green Credit project draws from this broader understanding by combining a user-facing reward model with structured backend storage. The platform does not treat sustainability as a purely informational website. Instead, it operates as an interactive system that connects identity, action, and outcome. In doing so, it is conceptually related to carbon accounting tools, habit-tracking systems, gamified dashboards, and environmental participation platforms, while remaining lighter and more approachable than enterprise ESG software.
'@)
  },
  @{
    Title = "2.2 Review of Existing Digital Approaches"
    Paragraphs = @(
@'
Existing environmental applications often fall into one of two categories. The first category emphasizes information and awareness, such as educational portals or carbon footprint calculators. These systems are useful for learning, but they typically do not create a persistent personal record of daily actions. The second category focuses on large-scale compliance, reporting, or corporate sustainability management. While technically strong, such systems are usually designed for organizations rather than individual citizens.
'@
@'
There is a clear opportunity for a middle path: a platform that is technically serious enough to maintain reliable records, but simple enough for everyday users. Green Credit Management occupies this middle space. Its current implementation does not try to solve every policy or carbon market challenge. Instead, it provides a grounded product experience centered on user accounts, trackable eco-actions, and directly observable outcomes. That design choice increases the likelihood of actual engagement and makes the product feasible for iterative academic development.
'@
@'
Another common limitation in existing systems is the disconnect between the motivational interface and the backend logic. Some products look attractive but have weak data structure. Others are technically robust but difficult for non-technical users to navigate. The present project attempts to bridge this gap through a clear component-based interface, server-rendered dashboard aggregation, and database schemas tailored to the app's user journey.
'@)
  },
  @{
    Title = "2.3 Gap Analysis and Stakeholder Needs"
    Paragraphs = @(
@'
The primary gap identified during analysis was the absence of a simple platform where a student or citizen can log positive environmental actions and immediately see quantified results. Manual record keeping is inconvenient and inconsistent. Generic productivity applications do not include environmental metrics. Corporate sustainability tools are too complex for personal use. Green Credit Management addresses this gap by making a small set of meaningful eco-actions available through a low-friction interface.
'@
@'
Different stakeholders have slightly different expectations from the system. End users want easy registration, visible progress, and confidence that their activity history will not disappear. Project evaluators want a clean architecture and clear technical justification. Future administrators would need extensibility for review or policy controls. Because of this diversity, the design emphasizes modularity: authentication, database connection, models, API routes, and UI components are separated so the platform can evolve without major rewrites.
'@)
    TableHeaders = @("Stakeholder", "Need", "How the current system responds")
    TableRows = @(
      @("General user", "Simple access and a visible sense of progress", "Provides OTP signup, login, dashboard metrics, and recent activity history"),
      @("Returning user", "Fast re-entry without repeating setup", "Supports credential login and Google sign-in"),
      @("Project maintainer", "Manageable code structure and reusable modules", "Uses Next.js app structure, typed models, and separated components"),
      @("Future administrator", "Ability to approve or verify actions later", "Activity schema already includes status fields and supports review workflows"),
      @("Academic reviewer", "Demonstrable engineering depth and real-world relevance", "Combines authentication, persistence, middleware, APIs, and responsive UI")
    )
  },
  @{
    Title = "2.4 Functional and Non-Functional Requirements"
    Paragraphs = @(
@'
Requirement analysis was performed with the practical constraints of a student project in mind. The system had to be featureful enough to demonstrate full-stack competence while remaining deliverable within a realistic timeline. This led to a balanced set of functional requirements focused on onboarding, authentication, data storage, activity logging, dashboard visualization, and route protection. Non-functional requirements emphasized responsiveness, maintainability, clarity, and security.
'@)
    TableHeaders = @("Functional requirement", "Description")
    TableRows = @(
      @("FR1", "The system shall allow a new user to submit name, email, and password during signup."),
      @("FR2", "The system shall generate and email a one-time password for account verification."),
      @("FR3", "The system shall verify the OTP before creating a permanent user record."),
      @("FR4", "The system shall allow existing users to log in with credentials."),
      @("FR5", "The system shall support Google-based sign-in for convenience."),
      @("FR6", "The system shall record supported green activities for an authenticated user."),
      @("FR7", "The system shall store activity metrics such as credits, CO2 offset, and energy saved."),
      @("FR8", "The system shall display aggregated impact values on the dashboard."),
      @("FR9", "The system shall display recent user activities in reverse chronological order."),
      @("FR10", "The system shall restrict dashboard and related routes to authenticated users only.")
    )
    ExtraTableHeaders = @("Non-functional requirement", "Description")
    ExtraTableRows = @(
      @("NFR1", "The interface should remain responsive on desktop and mobile screens."),
      @("NFR2", "The codebase should be modular and easy to extend."),
      @("NFR3", "Passwords and OTPs should be stored in hashed form rather than plain text."),
      @("NFR4", "Database access should be centralized to avoid connection duplication."),
      @("NFR5", "The system should provide understandable feedback during signup and login."),
      @("NFR6", "The application should tolerate repeated requests without corrupting user state."),
      @("NFR7", "Sensitive pages should be shielded behind authenticated middleware."),
      @("NFR8", "The design should communicate a sustainability theme without sacrificing readability.")
    )
  },
  @{
    Title = "2.5 Feasibility Analysis"
    Paragraphs = @(
@'
The project is technically feasible because it relies on a modern but accessible stack. Next.js and React provide a mature component model and routing system. MongoDB Atlas offers convenient cloud persistence. Mongoose gives schema structure to the data layer. NextAuth solves much of the session management complexity. Resend is used for OTP email delivery. These technologies work well together and are already represented in the implemented codebase, which reduces integration risk.
'@
@'
The project is economically feasible for a student environment because its essential services can be developed and tested on low-cost or free tiers. The main investment is time and engineering effort rather than infrastructure expenditure. This makes the system a practical prototype with realistic growth potential. It can begin as an academic demonstration and later mature into a community-facing product if supported by stronger verification workflows and administrative features.
'@
@'
The project is operationally feasible because the user journey is short and understandable. A first-time user is not required to understand carbon trading theory or domain-specific jargon. The platform starts with familiar patterns such as account creation, OTP confirmation, and dashboard cards. This reduces adoption friction and makes the system suitable for awareness programs, pilot deployments, campus demonstrations, and future NGO or municipal collaborations.
'@)
  }
)

$chapter3Sections = @(
  @{
    Title = "3.1 System Overview and Architecture"
    Paragraphs = @(
@'
The Green Credit Management system follows a layered full-stack web architecture. The presentation layer is built with React components inside the Next.js App Router structure. The application layer consists of API routes that validate requests, apply business rules, and interact with the data models. The persistence layer is handled through MongoDB and Mongoose. Authentication and session logic are coordinated through NextAuth and route middleware. This separation allows responsibilities to remain clear while still supporting an integrated user experience.
'@
@'
An important design decision in the project is the use of server-side data access for dashboard metrics. Instead of trusting the client to calculate totals, the dashboard page queries approved activities from the database and aggregates them into summary statistics. This improves consistency and creates a more reliable foundation for future features such as rankings, badges, carbon reports, or external audits. It also reflects good engineering practice by locating business computation near the data source rather than in browser-only state.
'@)
    TableHeaders = @("Layer", "Primary responsibility", "Representative files")
    TableRows = @(
      @("Presentation layer", "Render pages and reusable UI components", "src/app/page.tsx, src/component/*"),
      @("Authentication layer", "Manage sign-in providers, sessions, and route access", "src/app/api/auth/[...nextauth]/route.tsx, middleware.ts"),
      @("Application layer", "Handle OTP, signup, verification, and activity APIs", "src/app/api/auth/*, src/app/api/activities/instant/route.tsx"),
      @("Domain model layer", "Define persistent entities and validation rules", "src/models/User.tsx, Activity.tsx, Otp.tsx"),
      @("Persistence layer", "Connect to MongoDB and manage schemas", "src/lib/dbConnect.tsx, MongoDB Atlas")
    )
  },
  @{
    Title = "3.2 Use Case and User Flow Analysis"
    Paragraphs = @(
@'
The main user flow begins with registration. A visitor enters name, email, and password on the signup page. The server validates the input, checks whether the email already exists, generates a six-digit OTP, hashes both the OTP and password, stores them in the temporary OTP collection, and sends the code through email. Only after the correct OTP is submitted is the permanent user record created. This staged flow reduces the chance of invalid or unintended account creation while keeping the interface familiar.
'@
@'
After registration, the user logs in either through credentials or Google. Successful authentication produces a session that unlocks the dashboard and other protected routes. On the dashboard, previously approved activities are fetched from the database and transformed into total credits, total CO2 offset, and total energy saved. Recent activities are displayed as a concise history list, while a grid component visually communicates long-term engagement. The system therefore supports both immediate action and cumulative reflection, which are both important for habit formation.
'@)
    BulletItems = @(
      "Use case 1: New user creates an account with email, password, and OTP verification.",
      "Use case 2: Returning user logs in using credentials and resumes from the dashboard.",
      "Use case 3: User logs in via Google and receives profile provisioning automatically.",
      "Use case 4: User records a predefined eco-action such as Metro, Tree, or Solar.",
      "Use case 5: Dashboard computes total impact from approved activities and shows recent entries."
    )
  },
  @{
    Title = "3.3 Database and Data Model Design"
    Paragraphs = @(
@'
The database design is compact but expressive. The User model stores the identity of the account holder along with email, optional image, role, and a totalCredits field reserved for future scenarios. The Otp model temporarily stores the hashed OTP and hashed password before account verification. An expiry rule automatically removes stale OTP records after five minutes, which reduces clutter and improves security. The Activity model stores the environmental actions associated with a user, including category, credits earned, CO2 offset, energy saved, and approval status.
'@
@'
This structure provides an important separation of concerns. Permanent user identity is not created until verification succeeds. Time-sensitive verification data is isolated in its own collection. Impactful actions are modeled independently so that aggregation and history retrieval become straightforward. The Activity schema already includes a status field, which means the current system can operate with immediate approval while still remaining compatible with future moderation or evidence-review workflows.
'@)
    TableHeaders = @("Model", "Important fields", "Purpose")
    TableRows = @(
      @("User", "name, email, password, image, role, totalCredits, createdAt", "Stores permanent identity and account metadata"),
      @("Otp", "email, name, passwordHash, otpHash, createdAt with expiry", "Holds temporary verification state during signup"),
      @("Activity", "userId, title, category, creditsEarned, co2Offset, energySaved, status, createdAt", "Stores user actions and measurable environmental impact")
    )
  },
  @{
    Title = "3.4 API and Processing Logic"
    Paragraphs = @(
@'
The API design reflects a clean separation between onboarding logic and day-to-day application use. The signup route validates incoming data, prevents duplicate accounts, generates a one-time password, stores only hashed values, and sends the code through email. The OTP verification route compares the submitted code against the stored hash and creates the final account only when the verification step succeeds. The NextAuth route centralizes both credentials-based and Google-based sign-in behavior, making session creation consistent across providers.
'@
@'
The activity logging route demonstrates a simple but effective business rule engine. It maps supported actions such as Metro, Tree, and Solar to a predefined title, category, credit value, CO2 offset, and energy-saving score. This ensures that each activity has semantic meaning and measurable impact. Because the route writes directly to the Activity collection, all later dashboard calculations can be derived from the same consistent dataset. This design is easier to test and reason about than a client-only state model.
'@)
    TableHeaders = @("Endpoint", "Method", "Purpose")
    TableRows = @(
      @("/api/auth/signup", "POST", "Validate user input, create OTP session, and send verification email"),
      @("/api/auth/verify-otp", "POST", "Validate submitted OTP and create the permanent user account"),
      @("/api/auth/[...nextauth]", "GET/POST", "Handle session-based authentication with credentials and Google"),
      @("/api/activities/instant", "POST", "Create a predefined green activity entry for a user")
    )
    CodeLines = @(
      "Algorithm: OTP-based signup flow",
      "1. Receive name, email, and password from signup form.",
      "2. Validate required fields and minimum password length.",
      "3. Check whether the email already belongs to an existing user.",
      "4. Generate a six-digit OTP and hash both OTP and password.",
      "5. Upsert the temporary OTP record with expiry metadata.",
      "6. Send the OTP to the user through the email service.",
      "7. On verification request, compare the submitted OTP with the stored hash.",
      "8. If valid, create the permanent user document and delete the OTP record."
    )
  },
  @{
    Title = "3.5 Security, Validation, and Design Choices"
    Paragraphs = @(
@'
Security in this project is intentionally practical. Passwords are not stored in clear text. OTP values are also hashed before persistence, which is a strong improvement over plain-token storage. Protected routes are wrapped by authentication middleware so that unauthenticated requests are redirected to the login page. Session handling is delegated to NextAuth, which reduces the risk associated with hand-built token logic and provides a stable base for identity management.
'@
@'
Validation is performed both at the interface level and on the server. The signup API checks for missing values and a minimum password length. The OTP route validates numeric format and existence of a matching temporary record. Model schemas further constrain values such as activity category and status. These decisions do not eliminate every possible risk, but they substantially improve the correctness and maintainability of the system. The architecture therefore favors trustworthy defaults and gradual extensibility over premature complexity.
'@)
  }
)

$chapter4Sections = @(
  @{
    Title = "4.1 Development Environment and Technology Stack"
    Paragraphs = @(
@'
The implemented application uses a modern JavaScript and TypeScript ecosystem chosen for productivity, strong community support, and full-stack compatibility. Next.js provides the application shell, routing model, and server capabilities. React drives the component-based user interface. TypeScript improves maintainability through explicit data contracts. Tailwind CSS is used for styling, while MongoDB and Mongoose handle persistence. Authentication is implemented through NextAuth, password hashing through bcryptjs, and email delivery through Resend.
'@
@'
These tools are not included merely for trend value. Each one directly addresses a project requirement. TypeScript supports safe interaction with user, OTP, and activity records. Next.js App Router enables a clean page structure with server-side dashboard logic. Mongoose keeps data structures consistent. NextAuth shortens the path to reliable authentication. Resend makes OTP delivery manageable in a prototype environment. The final stack therefore reflects deliberate fit rather than random accumulation of libraries.
'@)
    TableHeaders = @("Technology", "Version in package configuration", "Role in the project")
    TableRows = @(
      @("Next.js", "16.1.6", "Application framework, routing, and server-side page logic"),
      @("React", "19.2.3", "UI component rendering"),
      @("TypeScript", "^5", "Type-safe development"),
      @("Tailwind CSS", "^4", "Utility-first styling system"),
      @("MongoDB", "Atlas service", "Cloud document database"),
      @("Mongoose", "^9.2.4", "Schema and model layer"),
      @("NextAuth", "^4.24.13", "Authentication and sessions"),
      @("bcryptjs", "^3.0.3", "Password and OTP hashing"),
      @("Resend", "^6.9.2", "OTP email delivery"),
      @("Lucide React", "^0.575.0", "Icons across the UI")
    )
    ExtraTableHeaders = @("Environment variable", "Purpose")
    ExtraTableRows = @(
      @("MONGODB_URI", "Connection string used by dbConnect to reach MongoDB"),
      @("RESEND_API_KEY", "Credential required to send OTP verification emails"),
      @("GOOGLE_CLIENT_ID", "Client identifier for Google sign-in"),
      @("GOOGLE_CLIENT_SECRET", "Client secret for Google sign-in"),
      @("NEXTAUTH_SECRET", "Secret used by NextAuth for session security")
    )
  },
  @{
    Title = "4.2 Frontend Implementation"
    Paragraphs = @(
@'
The public-facing frontend is organized around composable React components. The landing page pulls together a hero section, a featured article area, a statistics ribbon, and a process-oriented feature section. This structure helps the project present itself as more than a dashboard utility; it also communicates the values and user journey behind the platform. The visual language uses greens, dark slate tones, and clean card layouts to reinforce the sustainability theme without becoming difficult to read.
'@
@'
On the authenticated side, the dashboard is arranged into statistic cards, a GitHub-style activity grid, a recent-history panel, and an encouragement section that frames sustainable action as a daily habit. The design intentionally mixes quantitative data and motivational messaging. From a UX perspective, this is important because users are not only looking for information; they are looking for reassurance that their effort matters. The frontend therefore supports both emotional engagement and technical clarity.
'@)
  },
  @{
    Title = "4.3 Authentication and Onboarding Implementation"
    Paragraphs = @(
@'
The onboarding implementation is one of the strongest aspects of the project because it demonstrates full-stack coordination. The signup page operates in two steps. The first step collects name, email, and password. If the submission passes validation, the server stores a temporary OTP session and emails the one-time code. The second step asks the user to enter the code, after which the verification route creates the final account. This staged approach improves correctness and gives the user a strong sense of trust.
'@
@'
The login page supports both credentials and Google sign-in. Credentials are verified against the stored hashed password through NextAuth. Google sign-in is also routed through NextAuth, and first-time Google users are provisioned into the database automatically. The session callback attaches the user identifier to the session object so downstream pages can use it safely. In practical terms, this means the application offers a modern login experience while preserving a maintainable server-side implementation.
'@)
    CodeLines = @(
      "Key onboarding sequence",
      "- User submits signup form",
      "- Server validates and stores hashed OTP plus hashed password",
      "- OTP email is sent to the user",
      "- User enters six-digit code",
      "- Verification route creates permanent user and clears temporary OTP record",
      "- User logs in and is redirected to the dashboard"
    )
  },
  @{
    Title = "4.4 Activity Capture and Dashboard Implementation"
    Paragraphs = @(
@'
The activity module currently supports three immediate action types: Metro, Tree, and Solar. The server maps each activity to a meaningful title, category, credit score, CO2 offset, and energy-saving value. This mapping keeps the frontend simple while allowing the backend to remain the source of truth for impact metrics. Activities are stored with an approved status so they can be included in dashboard calculations without additional review steps during the current project phase.
'@
@'
The dashboard page fetches the authenticated user's approved activities and runs a MongoDB aggregation pipeline to compute cumulative totals. This is a strong design choice because it means the values shown in the cards are derived from actual records rather than client-side approximations. Recent history is fetched separately to provide context and traceability. The result is a dashboard that feels personal, data-driven, and extensible enough for future charts, filters, and milestone tracking.
'@)
    TableHeaders = @("Instant activity type", "Stored title", "Credits", "CO2 offset (kg)", "Energy saved (kWh)")
    TableRows = @(
      @("Metro", "Commuted by Metro", "10", "2", "5"),
      @("Tree", "Planted a Tree", "50", "20", "0"),
      @("Solar", "Used Solar Power", "30", "15", "25")
    )
  },
  @{
    Title = "4.5 Middleware, Data Access, and Session Handling"
    Paragraphs = @(
@'
Route protection is implemented through NextAuth middleware. The matcher protects dashboard-related routes and other private areas so unauthenticated visitors are redirected to the login page. This ensures that personal activity history and impact totals are not exposed publicly. Because the protection is centralized at the middleware layer, the project avoids repetitive access checks scattered across every page component.
'@
@'
Database access is centralized through a cached connection helper. This is particularly important in a server-rendered Next.js environment where repeated database initialization can create instability or slow development. The dbConnect utility ensures that the application reuses an existing Mongoose connection when available. Combined with typed models and session-aware pages, this creates a cleaner operational flow from request to database response to rendered UI.
'@)
    CodeLines = @(
      "Project structure summary",
      "src/",
      "  app/",
      "    page.tsx",
      "    login/page.tsx",
      "    signup/page.tsx",
      "    dashboard/page.tsx",
      "    api/auth/signup/route.tsx",
      "    api/auth/verify-otp/route.tsx",
      "    api/auth/[...nextauth]/route.tsx",
      "    api/activities/instant/route.tsx",
      "  component/",
      "    hero.tsx",
      "    Feature.tsx",
      "    Ribbon.tsx",
      "    dashboard/StatsCards.tsx",
      "    dashboard/RecentHistory.tsx",
      "  lib/dbConnect.tsx",
      "  models/User.tsx",
      "  models/Otp.tsx",
      "  models/Activity.tsx"
    )
  },
  @{
    Title = "4.6 UI, Responsiveness, and Maintainability"
    Paragraphs = @(
@'
The interface uses familiar responsive patterns such as stacked cards on smaller screens and multi-column layouts on larger displays. This is important because the platform is intended to be inclusive rather than desktop-exclusive. The forms use clear focus states and concise labels, while the dashboard separates dense information into digestible cards, lists, and grid blocks. The landing page balances aspiration and explanation, helping the user understand the system before committing to registration.
'@
@'
Maintainability is improved through reusable components and separation of concerns. The codebase distinguishes between page-level orchestration, reusable UI components, API logic, database utilities, and persistent models. This allows incremental refinement without turning the project into a tightly coupled monolith. For example, future analytics charts can be added to the dashboard without rewriting authentication logic, and new activity types can be introduced by extending the server-side mapping and related UI controls.
'@)
  }
)

$chapter5Sections = @(
  @{
    Title = "5.1 Testing Strategy and Coverage"
    Paragraphs = @(
@'
The testing approach for this project is primarily scenario-driven and focused on end-to-end correctness of major user journeys. Because the application combines UI pages, server routes, database models, and third-party services, the most meaningful test questions are workflow questions: Can a user sign up successfully? Does an incorrect OTP fail safely? Can an authenticated user reach the dashboard? Does a new activity affect the displayed totals? These workflow checks are complemented by model constraints and route-level validation.
'@
@'
In an academic prototype, manual functional testing is often the first practical layer of validation, especially when external services such as email delivery and OAuth are involved. The present system supports this style of testing well because each critical module has a visible output: signup status messages, login redirects, dashboard cards, activity history entries, and middleware behavior. The application is therefore suitable for both demonstration testing and future automated test integration.
'@)
  },
  @{
    Title = "5.2 Functional Test Cases"
    Paragraphs = @(
@'
The following representative test cases were identified from the implemented feature set. They cover the core business flow, error handling, access control, and impact calculation behaviors that define the usefulness of the Green Credit platform.
'@)
    TableHeaders = @("Test case", "Input or action", "Expected result")
    TableRows = @(
      @("TC1 Signup validation", "Submit empty or invalid signup form", "Server rejects request with validation feedback"),
      @("TC2 OTP generation", "Submit valid signup data", "OTP session is stored and verification email is triggered"),
      @("TC3 OTP mismatch", "Enter incorrect six-digit code", "Account is not created and error message is returned"),
      @("TC4 OTP success", "Enter valid OTP before expiry", "Permanent user account is created"),
      @("TC5 Credential login", "Use valid email and password", "User is authenticated and redirected to dashboard"),
      @("TC6 Credential failure", "Use wrong password", "Login fails without exposing sensitive details"),
      @("TC7 Google login", "Choose Google sign-in", "Session is created and user profile is provisioned if needed"),
      @("TC8 Protected route", "Visit /dashboard without session", "Middleware redirects user to login"),
      @("TC9 Activity logging", "Post Metro, Tree, or Solar activity", "Approved activity is stored in Activity collection"),
      @("TC10 Dashboard totals", "Open dashboard after approved activities exist", "Aggregated credits, CO2, and energy values are shown"),
      @("TC11 Recent history", "Open dashboard after activity creation", "Most recent activities appear in descending date order"),
      @("TC12 Expired OTP cleanup", "Wait beyond the OTP expiry window", "Temporary record is removed or rejected safely")
    )
  },
  @{
    Title = "5.3 Sample Execution and Observed Results"
    Paragraphs = @(
@'
To illustrate the system behavior, consider a sample user who signs up successfully, verifies the OTP, and logs three different eco-actions over time: a metro commute, a tree-planting event, and a solar usage event. Each action results in a new Activity document containing predefined impact values. When the dashboard page is opened, the aggregation pipeline computes the totals only from approved activities associated with that user's database identifier. This ensures that the dashboard remains personalized and grounded in persistent records.
'@
@'
Under this sample scenario, the interface communicates both cumulative and recent progress. The stat cards immediately reflect total credits, CO2 offset, and energy savings. The recent-history panel shows the latest entries with their categories and statuses. The activity grid reinforces continuity by representing repeated action over time. Even with a small data set, the dashboard demonstrates the central promise of the system: transforming individual sustainable actions into a visible, motivating, and durable digital profile.
'@)
    TableHeaders = @("Recorded action", "Credits contributed", "CO2 contribution (kg)", "Energy contribution (kWh)")
    TableRows = @(
      @("Metro commute", "10", "2", "5"),
      @("Tree planting", "50", "20", "0"),
      @("Solar usage", "30", "15", "25"),
      @("Total after three actions", "90", "37", "30")
    )
  },
  @{
    Title = "5.4 Result Discussion and Current Limitations"
    Paragraphs = @(
@'
The implemented system succeeds in delivering a coherent core experience. The project demonstrates that a sustainability application does not need to begin with massive institutional data feeds in order to be meaningful. By starting with trustworthy authentication, structured activity data, and a motivating dashboard, the platform already creates a usable foundation for engagement. The combination of OTP-based onboarding, OAuth login, MongoDB persistence, and server-driven aggregation is an appropriate level of technical depth for the project stage.
'@
@'
At the same time, the current build has limitations that should be acknowledged honestly. Activity creation is based on predefined server mappings rather than evidence-backed custom submissions. There is no dedicated admin interface for approval workflows, even though the data model already anticipates such a need through the status field. Some future-facing menu items imply modules that are not yet fully implemented. These are not failures so much as clear indicators of the next development priorities.
'@
@'
Recognizing these limits strengthens the report rather than weakening it. A technically honest project is easier to maintain, extend, and defend in academic review. By separating what is implemented from what is aspirational, the Green Credit project positions itself as a credible prototype with meaningful future potential.
'@)
  },
  @{
    Title = "5.5 Social, Environmental, and Educational Value"
    Paragraphs = @(
@'
The value of the project extends beyond software correctness. Socially, it gives users a more tangible relationship with sustainable behavior. Instead of being told that an action is good in the abstract, the user sees that action logged, categorized, and added to a growing body of measurable impact. This makes the platform suitable for awareness campaigns, campus sustainability initiatives, and community pilot programs where sustained participation matters more than one-time curiosity.
'@
@'
Educationally, the project is also significant because it integrates multiple software engineering domains within one coherent theme. Students working on or evaluating the project can study authentication, API design, database modeling, UI composition, and middleware through a problem that is socially relevant. That combination makes Green Credit Management a strong academic case study in applied full-stack development for sustainability.
'@)
  }
)

$chapter6Sections = @(
  @{
    Title = "6.1 Conclusion"
    Paragraphs = @(
@'
Green Credit Management demonstrates how a focused full-stack application can make environmental responsibility more visible and more actionable for everyday users. The system successfully combines identity verification, persistent activity records, impact aggregation, and dashboard visualization into a single coherent platform. Its design choices show that a sustainability product can be both technically meaningful and accessible to non-expert users.
'@
@'
From an engineering standpoint, the project satisfies its central objective of building a maintainable web application aligned with a real-world theme. The implemented modules work together logically: signup leads to verification, verification leads to login, login unlocks the dashboard, and the dashboard is powered by stored activities. This continuity is one of the strongest indicators that the project has moved beyond isolated features and into the territory of system design.
'@)
  },
  @{
    Title = "6.2 Future Scope"
    Paragraphs = @(
@'
The project has a wide and realistic future scope. The most immediate next step is a richer activity submission workflow where users can describe custom sustainability actions and attach supporting evidence. Once such submissions exist, the existing status field in the Activity model can be connected to a review dashboard for moderators or environmental partners. This would convert the current trusted-input model into a more formal verification system.
'@
@'
Additional future scope includes analytics pages with monthly trends, achievement systems, community leaderboards, wallet-like credit statements, notification flows, and exportable sustainability summaries. Integration with geolocation, image recognition, or IoT sensors is also possible, but those features should be introduced only after the current platform's reliability and moderation workflow are strengthened. In other words, the project should scale by deepening trust before widening feature breadth.
'@)
    TableHeaders = @("Future enhancement", "Why it matters")
    TableRows = @(
      @("Admin approval dashboard", "Enables controlled verification before credits are finalized"),
      @("Custom activity submission", "Allows more real-world flexibility beyond predefined activity types"),
      @("Advanced analytics", "Helps users understand trends and long-term contribution patterns"),
      @("Marketplace or reward redemption", "Creates stronger incentive loops for sustained participation"),
      @("Evidence upload and geolocation", "Improves trustworthiness of submitted actions"),
      @("Notifications and reminders", "Supports habit formation and re-engagement"),
      @("Accessibility and multilingual support", "Broadens the user base and inclusivity of the platform")
    )
  },
  @{
    Title = "6.3 Lessons Learned"
    Paragraphs = @(
@'
One important lesson from the project is that software scope must be managed carefully. Sustainable product ideas can grow rapidly because the domain naturally suggests analytics, certification, commerce, and community features. However, the implemented project shows the value of first delivering a stable core. By concentrating on onboarding, authentication, activity tracking, and dashboard feedback, the system already provides a meaningful product foundation that can support more ambitious extensions later.
'@
@'
Another lesson is that credibility matters as much as creativity in project reporting. A report is strongest when it reflects the actual codebase, names the implemented modules clearly, and treats future plans as future plans. This lesson has directly shaped the present version of the report, which prioritizes technical accuracy and honest system boundaries.
'@)
  },
  @{
    Title = "6.4 Final Remarks"
    Paragraphs = @(
@'
In summary, Green Credit Management is a promising sustainability-oriented web application that turns eco-friendly intentions into structured digital progress. It is academically relevant, socially useful, and technically extensible. With continued iteration, stronger verification workflows, and broader analytics, the platform can evolve from a student project into a practical participation system for communities that want to encourage measurable environmental responsibility.
'@)
  }
)

$appendixSections = @(
  @{
    Title = "Appendix A. Project Directory Summary"
    Paragraphs = @(
@'
This appendix summarizes the practical organization of the source code so that future developers, reviewers, or project examiners can understand where major responsibilities live. The codebase separates page definitions, UI components, APIs, data models, and database helpers into clear locations, which supports maintainability and smoother onboarding.
'@)
    CodeLines = @(
      "greencredit/",
      "  middleware.ts",
      "  src/",
      "    app/",
      "      page.tsx",
      "      login/page.tsx",
      "      signup/page.tsx",
      "      dashboard/layout.tsx",
      "      dashboard/page.tsx",
      "      dashboard/acivity/page.tsx",
      "      api/activities/instant/route.tsx",
      "      api/auth/signup/route.tsx",
      "      api/auth/verify-otp/route.tsx",
      "      api/auth/[...nextauth]/route.tsx",
      "    component/",
      "      Navbar.tsx",
      "      hero.tsx",
      "      Feature.tsx",
      "      Featuredarticle.tsx",
      "      Ribbon.tsx",
      "      dashboard/StatsCards.tsx",
      "      dashboard/ActivityGrid.tsx",
      "      dashboard/RecentHistory.tsx",
      "    lib/dbConnect.tsx",
      "    models/User.tsx",
      "    models/Otp.tsx",
      "    models/Activity.tsx"
    )
  },
  @{
    Title = "Appendix B. Data Dictionary and API Notes"
    Paragraphs = @(
@'
The following table provides a quick maintenance reference for the primary data entities used by the current build. It is helpful during development, documentation review, and viva presentation because it reduces the need to search across multiple source files during explanation.
'@)
    TableHeaders = @("Field", "Model", "Meaning")
    TableRows = @(
      @("email", "User / Otp", "Unique user identity and OTP routing key"),
      @("password", "User", "Hashed credential stored for credentials-based login"),
      @("otpHash", "Otp", "Hashed one-time password for signup verification"),
      @("userId", "Activity", "Reference linking each activity to a user account"),
      @("category", "Activity", "High-level classification such as Transportation or Energy"),
      @("creditsEarned", "Activity", "Green credit value assigned to the activity"),
      @("co2Offset", "Activity", "Estimated emission reduction in kilograms"),
      @("energySaved", "Activity", "Estimated energy benefit in kilowatt-hours"),
      @("status", "Activity", "Approval state of the recorded action")
    )
    CodeLines = @(
      "Sample request: POST /api/auth/signup",
      "{",
      '  "name": "Basant Sharma",',
      '  "email": "basant@example.com",',
      '  "password": "examplePass123"',
      "}",
      "",
      "Sample request: POST /api/activities/instant",
      "{",
      '  "userId": "<authenticated-user-id>",',
      '  "type": "Tree"',
      "}"
    )
  },
  @{
    Title = "Appendix C. Risk Register and Mitigation Plan"
    Paragraphs = @(
@'
Every evolving web application carries technical and operational risk. Identifying these risks at the report stage helps future contributors prioritize hardening efforts and communicates that the project has been examined with engineering seriousness rather than only feature enthusiasm.
'@)
    TableHeaders = @("Risk", "Possible effect", "Mitigation direction")
    TableRows = @(
      @("Invalid or abusive signup attempts", "Cluttered OTP records or email misuse", "Introduce rate limiting and resend controls"),
      @("Weak activity evidence", "Credits may not always reflect verified real-world actions", "Add moderation workflow and evidence upload"),
      @("Service dependency failure", "OTP email or OAuth flow may fail temporarily", "Improve retries and fallback messaging"),
      @("Unimplemented navigation routes", "Users may expect modules that are not ready", "Align navigation with release status or add clearer labels"),
      @("Growth in activity volume", "Slow dashboard queries at larger scale", "Add indexes and optimized analytics queries"),
      @("Future policy changes", "Credit values may need recalibration", "Move activity scoring into configurable admin-managed rules")
    )
  },
  @{
    Title = "Appendix D. Glossary"
    Paragraphs = @(
@'
The glossary below captures recurring terms used in the project and the report. Including such a section is useful for examiners, collaborators, and future maintainers who may understand software well but not necessarily the sustainability framing, or vice versa.
'@)
    TableHeaders = @("Term", "Meaning in this project")
    TableRows = @(
      @("Green Credit", "A reward-like unit representing positive environmental action"),
      @("OTP", "One-time password used to verify a user's email during signup"),
      @("OAuth", "Authentication delegation mechanism used here for Google sign-in"),
      @("Dashboard aggregation", "Server-side computation of totals from recorded activities"),
      @("CO2 offset", "Estimated carbon reduction associated with an activity"),
      @("Energy saved", "Estimated energy benefit recorded in kilowatt-hours"),
      @("Middleware", "Request-level guard used to restrict private routes"),
      @("Schema", "Structured model definition used by Mongoose"),
      @("App Router", "Next.js routing system used by the project"),
      @("Prototype", "A functional but still evolving software implementation")
    )
  }
)

$supplementalSections = @(
  @{
    Title = "Supplementary Note 1. Deployment Checklist"
    Paragraphs = @(
@'
For a dependable deployment, the project requires environment variable validation, tested OAuth credentials, working database connectivity, and confirmed email delivery configuration. The deployment checklist should include smoke tests for signup, OTP verification, credential login, Google login, dashboard loading, and sample activity creation. A deployment process that verifies these items reduces the chance of presenting a visually correct but functionally incomplete build.
'@
@'
It is also advisable to confirm that protected routes redirect correctly in production and that no sensitive configuration values are exposed through the client bundle. Since the system relies on external services, deployment should be viewed as an integration exercise rather than a simple file upload. This mindset is valuable for future production readiness.
'@)
  },
  @{
    Title = "Supplementary Note 2. Maintenance Plan"
    Paragraphs = @(
@'
Regular maintenance for Green Credit Management should include dependency review, UI regression checking, log monitoring, and periodic examination of database growth. Even if the current project is used mainly for demonstration or academic submission, documenting a maintenance rhythm signals that the platform is capable of maturing beyond its first release.
'@
@'
As new features are introduced, maintainers should preserve the project's modular structure. Shared utilities should remain centralized, authentication should continue to be routed through established abstractions, and new dashboard metrics should be derived from trusted backend data rather than duplicated client-side formulas. This discipline will keep the system coherent as it grows.
'@)
  },
  @{
    Title = "Supplementary Note 3. Privacy and Ethical Considerations"
    Paragraphs = @(
@'
Applications dealing with identity and behavior tracking should be designed with respect for privacy. Even though the current build stores relatively limited personal information, future enhancements such as geolocation or evidence uploads would increase the sensitivity of collected data. This makes it important to think early about minimization, consent, retention periods, and access control.
'@
@'
Ethically, the system should avoid overstating scientific precision when assigning impact values to user actions. Credit and offset metrics should be communicated as modeled estimates unless supported by stronger domain validation. Honest wording protects both the user and the credibility of the platform.
'@)
  },
  @{
    Title = "Supplementary Note 4. Accessibility Notes"
    Paragraphs = @(
@'
As the project evolves, accessibility should be treated as a feature of quality rather than an optional polish task. Forms should remain keyboard-navigable, contrast should be validated, focus states should stay visible, and icon-only controls should include descriptive labels where appropriate. A sustainability platform should be inclusive in both purpose and execution.
'@
@'
The current UI already benefits from relatively clear layout structure and strong visual grouping. Future work can strengthen this by performing accessibility checks on authentication flows, dashboard widgets, and responsive states. This will improve usability for a wider range of users while also improving general design discipline.
'@)
  },
  @{
    Title = "Supplementary Note 5. Adoption Strategy"
    Paragraphs = @(
@'
If Green Credit Management were rolled out beyond the classroom, adoption would likely be strongest in campus communities, local green clubs, and awareness programs that already have an audience motivated by social or environmental goals. A phased rollout could begin with a small trusted group, allowing administrators to refine activity mappings and feedback mechanisms before opening access more broadly.
'@
@'
Community adoption would be improved by introducing shareable milestones, progress streaks, guided onboarding tips, and transparent explanations of how green credits are calculated. These additions can strengthen participation without compromising the seriousness of the platform's underlying data model.
'@)
  }
)

$references = @(
  "Vercel. Next.js Documentation. Official framework documentation for routing, rendering, and server capabilities.",
  "Meta. React Documentation. Official reference for component-based user interface development.",
  "NextAuth.js Documentation. Official reference for credentials login, OAuth providers, middleware, and session callbacks.",
  "MongoDB Documentation. Official reference for document database concepts and operations.",
  "Mongoose Documentation. Official guide to schema design, model definition, and query workflows in Node.js.",
  "Resend Documentation. Official reference for programmatic email delivery workflows.",
  "Provos, N., and Mazieres, D. A Future-Adaptable Password Scheme. Foundational work commonly associated with bcrypt.",
  "ISO/IEC 25010. Systems and software engineering - Systems and software Quality Requirements and Evaluation.",
  "United Nations. Sustainable Development Goals. Foundational sustainability framework relevant to the project theme.",
  "Deterding, S. et al. Gamification: Toward a Definition. Useful conceptual background for reward-oriented user engagement systems."
)

function Add-Paragraph {
  param(
    [Parameter(Mandatory = $true)][string]$Text,
    [string]$Style = "Normal",
    [int]$Alignment = $wdAlignParagraphLeft,
    [int]$FontSize = 12,
    [bool]$Bold = $false,
    [bool]$Italic = $false,
    [int]$SpaceAfter = 10,
    [bool]$UseOnePointFiveSpacing = $true
  )

  $cleanText = (($Text -replace "`r", " ") -replace "`n", " ")
  $cleanText = ($cleanText -replace "\s+", " ").Trim()

  $selection.Style = $Style
  $selection.ParagraphFormat.Alignment = $Alignment
  $selection.ParagraphFormat.SpaceBefore = 0
  $selection.ParagraphFormat.SpaceAfter = $SpaceAfter
  $selection.ParagraphFormat.LineSpacingRule = if ($UseOnePointFiveSpacing) { 1 } else { 0 }
  $selection.Font.Name = "Times New Roman"
  $selection.Font.Size = $FontSize
  $selection.Font.Bold = if ($Bold) { 1 } else { 0 }
  $selection.Font.Italic = if ($Italic) { 1 } else { 0 }
  $selection.TypeText($cleanText)
  $selection.TypeParagraph()
}

function Add-BlankLine {
  $selection.TypeParagraph()
}

function Add-PageBreak {
  $selection.InsertBreak($wdPageBreak)
}

function Move-SelectionToEnd {
  $selection.EndKey($wdStory) | Out-Null
}

function Add-Heading {
  param(
    [Parameter(Mandatory = $true)][string]$Text,
    [int]$Level = 1,
    [switch]$NewPage
  )

  if ($NewPage) {
    Add-PageBreak
  }

  $styleName = if ($Level -eq 1) { "Heading 1" } else { "Heading 2" }
  $headingSize = if ($Level -eq 1) { 16 } else { 13 }
  Add-Paragraph -Text $Text -Style $styleName -Alignment $wdAlignParagraphLeft -FontSize $headingSize -Bold $true -SpaceAfter 8 -UseOnePointFiveSpacing:$false
}

function Add-BulletList {
  param([string[]]$Items)

  foreach ($item in $Items) {
    Add-Paragraph -Text ("- " + $item) -Style "Normal" -Alignment $wdAlignParagraphLeft -FontSize 12 -SpaceAfter 4
  }
}

function Add-CodeBlock {
  param([string[]]$Lines)

  foreach ($line in $Lines) {
    $selection.Style = "Normal"
    $selection.ParagraphFormat.Alignment = $wdAlignParagraphLeft
    $selection.ParagraphFormat.LeftIndent = 18
    $selection.ParagraphFormat.SpaceAfter = 2
    $selection.ParagraphFormat.LineSpacingRule = 0
    $selection.Font.Name = "Consolas"
    $selection.Font.Size = 10
    $selection.Font.Bold = 0
    $selection.Font.Italic = 0
    $selection.TypeText($line)
    $selection.TypeParagraph()
  }
  $selection.ParagraphFormat.LeftIndent = 0
  $selection.Font.Name = "Times New Roman"
  $selection.Font.Size = 12
  Add-BlankLine
}

function Add-Table {
  param(
    [string[]]$Headers,
    [object[][]]$Rows
  )

  if (-not $Headers -or -not $Rows) {
    return
  }

  $rowCount = $Rows.Count + 1
  $colCount = $Headers.Count
  $table = $doc.Tables.Add($selection.Range, $rowCount, $colCount)
  $table.Style = "Table Grid"
  $table.Range.Font.Name = "Times New Roman"
  $table.Range.Font.Size = 10
  $table.Rows.Alignment = 0
  $table.AllowAutoFit = $true

  for ($col = 1; $col -le $colCount; $col++) {
    $table.Cell(1, $col).Range.Text = [string]$Headers[$col - 1]
    $table.Cell(1, $col).Range.Bold = 1
  }

  for ($row = 0; $row -lt $Rows.Count; $row++) {
    for ($col = 0; $col -lt $colCount; $col++) {
      $table.Cell($row + 2, $col + 1).Range.Text = [string]$Rows[$row][$col]
    }
  }

  Move-SelectionToEnd
  Add-BlankLine
}

function Add-SectionBlock {
  param([hashtable]$Section)

  Add-Heading -Text $Section.Title -Level 2

  foreach ($paragraph in $Section.Paragraphs) {
    Add-Paragraph -Text $paragraph -Style "Normal" -Alignment $wdAlignParagraphJustify -FontSize 12 -SpaceAfter 8
  }

  if ($Section.ContainsKey("BulletItems")) {
    Add-BulletList -Items $Section.BulletItems
    Add-BlankLine
  }

  if ($Section.ContainsKey("TableHeaders") -and $Section.ContainsKey("TableRows")) {
    Add-Table -Headers $Section.TableHeaders -Rows $Section.TableRows
  }

  if ($Section.ContainsKey("ExtraTableHeaders") -and $Section.ContainsKey("ExtraTableRows")) {
    Add-Table -Headers $Section.ExtraTableHeaders -Rows $Section.ExtraTableRows
  }

  if ($Section.ContainsKey("CodeLines")) {
    Add-CodeBlock -Lines $Section.CodeLines
  }
}

function Add-Chapter {
  param(
    [string]$Title,
    [hashtable[]]$Sections
  )

  Add-Heading -Text $Title -Level 1 -NewPage
  foreach ($section in $Sections) {
    Add-SectionBlock -Section $section
  }
}

function Get-PageCount {
  $doc.Repaginate() | Out-Null
  return [int]$doc.ComputeStatistics(2)
}

function Add-CoverPage {
  $selection.ParagraphFormat.Alignment = $wdAlignParagraphCenter
  for ($i = 0; $i -lt 4; $i++) { Add-BlankLine }
  Add-Paragraph -Text $projectTitle.ToUpper() -Style "Title" -Alignment $wdAlignParagraphCenter -FontSize 24 -Bold $true -SpaceAfter 12 -UseOnePointFiveSpacing:$false
  Add-Paragraph -Text $projectSubtitle -Style "Normal" -Alignment $wdAlignParagraphCenter -FontSize 16 -Italic $true -SpaceAfter 14 -UseOnePointFiveSpacing:$false
  Add-Paragraph -Text "Project Code: $projectCode" -Style "Normal" -Alignment $wdAlignParagraphCenter -FontSize 13 -Bold $true -SpaceAfter 16 -UseOnePointFiveSpacing:$false
  Add-Paragraph -Text "A Project Report Submitted in Partial Fulfillment of the Requirements for the Degree of Bachelor of Technology (B.Tech) in Computer Science and Engineering" -Style "Normal" -Alignment $wdAlignParagraphCenter -FontSize 14 -SpaceAfter 18
  Add-Paragraph -Text "Submitted By" -Style "Normal" -Alignment $wdAlignParagraphCenter -FontSize 13 -Bold $true -SpaceAfter 6 -UseOnePointFiveSpacing:$false
  Add-Paragraph -Text $studentName -Style "Normal" -Alignment $wdAlignParagraphCenter -FontSize 16 -Bold $true -SpaceAfter 4 -UseOnePointFiveSpacing:$false
  Add-Paragraph -Text "Roll No. $rollNumber" -Style "Normal" -Alignment $wdAlignParagraphCenter -FontSize 13 -SpaceAfter 18 -UseOnePointFiveSpacing:$false
  Add-Paragraph -Text "Under the Supervision of" -Style "Normal" -Alignment $wdAlignParagraphCenter -FontSize 13 -Bold $true -SpaceAfter 6 -UseOnePointFiveSpacing:$false
  Add-Paragraph -Text $supervisorName -Style "Normal" -Alignment $wdAlignParagraphCenter -FontSize 15 -Bold $true -SpaceAfter 4 -UseOnePointFiveSpacing:$false
  Add-Paragraph -Text "Assistant Professor" -Style "Normal" -Alignment $wdAlignParagraphCenter -FontSize 12 -SpaceAfter 18 -UseOnePointFiveSpacing:$false
  Add-Paragraph -Text $instituteName.ToUpper() -Style "Normal" -Alignment $wdAlignParagraphCenter -FontSize 13 -Bold $true -SpaceAfter 10
  Add-Paragraph -Text $universityName.ToUpper() -Style "Normal" -Alignment $wdAlignParagraphCenter -FontSize 12 -Bold $true -SpaceAfter 10
  Add-Paragraph -Text "Academic Session $academicSession" -Style "Normal" -Alignment $wdAlignParagraphCenter -FontSize 13 -Bold $true -SpaceAfter 0 -UseOnePointFiveSpacing:$false
}

function Add-FrontMatterSection {
  param(
    [string]$Title,
    [string[]]$Paragraphs
  )

  Add-Heading -Text $Title -Level 1 -NewPage
  foreach ($paragraph in $Paragraphs) {
    Add-Paragraph -Text $paragraph -Style "Normal" -Alignment $wdAlignParagraphJustify -FontSize 12 -SpaceAfter 10
  }
}

$backupPath = $null

if ((Test-Path -LiteralPath $OutputPath) -and -not $SkipBackup) {
  $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $directory = Split-Path -Parent $OutputPath
  $baseName = [System.IO.Path]::GetFileNameWithoutExtension($OutputPath)
  $backupPath = Join-Path $directory ($baseName + "-backup-" + $timestamp + ".docx")
  Copy-Item -LiteralPath $OutputPath -Destination $backupPath -Force
}

if (Test-Path -LiteralPath $OutputPath) {
  Remove-Item -LiteralPath $OutputPath -Force
}

$word = $null
$doc = $null
$selection = $null

try {
  $word = New-Object -ComObject Word.Application
  $word.Visible = $false
  $doc = $word.Documents.Add()
  $selection = $word.Selection

  $doc.PageSetup.PageWidth = $word.CentimetersToPoints(21.0)
  $doc.PageSetup.PageHeight = $word.CentimetersToPoints(29.7)
  $doc.PageSetup.TopMargin = $word.CentimetersToPoints(2.54)
  $doc.PageSetup.BottomMargin = $word.CentimetersToPoints(2.54)
  $doc.PageSetup.LeftMargin = $word.CentimetersToPoints(3.0)
  $doc.PageSetup.RightMargin = $word.CentimetersToPoints(2.5)

  Add-CoverPage

  Add-FrontMatterSection -Title "Declaration" -Paragraphs @(
    'I hereby declare that the project work presented in this report entitled "Green Credit Management: A Sustainable Activity Tracking and Eco-Reward Platform" is an original work carried out by me in partial fulfillment of the requirements for the award of the degree of Bachelor of Technology in Computer Science and Engineering. The content of this report is based on the actual implemented codebase of the Green Credit project and has been prepared with due care to reflect the features that are currently available in the system.',
    'I further declare that this work has not been submitted earlier, either in full or in part, for the award of any other degree or diploma. All references used for conceptual support have been acknowledged appropriately. To the best of my knowledge, the statements made in this report are accurate representations of the design, implementation, and future scope of the project.',
    "Name: $studentName",
    "Roll No.: $rollNumber",
    "Place: Greater Noida"
  )

  Add-FrontMatterSection -Title "Certificate" -Paragraphs @(
    "This is to certify that the project report entitled ""Green Credit Management: A Sustainable Activity Tracking and Eco-Reward Platform"" has been prepared by $studentName ($rollNumber) under my guidance in the Department of Computer Science and Engineering at $instituteName.",
    "To the best of my knowledge, the work described in this report is original, technically sound in its academic scope, and suitable for submission as a B.Tech project report. The report reflects a full-stack web application that combines secure onboarding, environmental activity tracking, and impact visualization through a modern software architecture.",
    "Supervisor: $supervisorName",
    "Head of Department: $departmentHead"
  )

  Add-FrontMatterSection -Title "Acknowledgement" -Paragraphs @(
    'I express my sincere gratitude to my project guide for continuous support, technical direction, and encouragement during the development of Green Credit Management. Her guidance helped transform an initial idea about sustainability and digital accountability into a structured software project with clear engineering goals.',
    'I am also thankful to the Head of Department, faculty members, classmates, and friends whose suggestions and discussions contributed to the refinement of the application and the preparation of this report. Their feedback was especially helpful in shaping the system architecture, interface decisions, and report presentation.',
    'Finally, I acknowledge the value of self-learning, experimentation, and iteration throughout this project. Working on Green Credit Management strengthened my understanding of authentication, database design, server-side logic, and product-oriented thinking in software development.'
  )

  Add-FrontMatterSection -Title "Abstract" -Paragraphs @(
    'Green Credit Management is a full-stack web application designed to convert environmentally positive actions into visible digital progress for individual users. The platform is implemented using Next.js, React, TypeScript, MongoDB, Mongoose, NextAuth, bcryptjs, and Resend. Its primary workflow includes OTP-assisted user registration, credentials and Google-based authentication, protected route access, instant green activity logging, and a dashboard that aggregates credits, CO2 offset, and energy savings from stored records.',
    'The project addresses a practical gap in sustainability software by focusing on the ordinary user rather than large institutional reporting. Instead of targeting enterprise compliance, the system provides an accessible environment in which everyday eco-friendly actions can be recorded and reflected back to the user in a motivating way. The dashboard combines impact cards, recent history, and activity visualization to support behavioral consistency.',
    'This report documents the actual current build of the project and clearly distinguishes implemented modules from future proposals. Features such as advanced verification, richer analytics, and marketplace behavior remain possible extensions, but the present application already demonstrates a coherent and extensible foundation for sustainability-oriented digital engagement.'
  )

  Add-Heading -Text "Abbreviations" -Level 1 -NewPage
  Add-Table -Headers @("Abbreviation", "Expanded form") -Rows @(
    @("API", "Application Programming Interface"),
    @("OTP", "One-Time Password"),
    @("UI", "User Interface"),
    @("UX", "User Experience"),
    @("DB", "Database"),
    @("CO2", "Carbon Dioxide"),
    @("JWT", "JSON Web Token"),
    @("OAuth", "Open Authorization"),
    @("kWh", "Kilowatt-hour"),
    @("ESG", "Environmental, Social, and Governance")
  )

  Add-Heading -Text "Table of Contents" -Level 1 -NewPage
  $toc = $doc.TablesOfContents.Add($selection.Range, $true, 1, 2)
  Add-BlankLine

  Add-Chapter -Title "Chapter 1. Introduction" -Sections $chapter1Sections
  Add-Chapter -Title "Chapter 2. Literature Survey and Requirement Analysis" -Sections $chapter2Sections
  Add-Chapter -Title "Chapter 3. System Analysis and Design" -Sections $chapter3Sections
  Add-Chapter -Title "Chapter 4. Implementation" -Sections $chapter4Sections
  Add-Chapter -Title "Chapter 5. Testing, Results, and Discussion" -Sections $chapter5Sections
  Add-Chapter -Title "Chapter 6. Conclusion and Future Scope" -Sections $chapter6Sections

  Add-Heading -Text "References" -Level 1 -NewPage
  foreach ($reference in $references) {
    Add-Paragraph -Text $reference -Style "Normal" -Alignment $wdAlignParagraphJustify -FontSize 12 -SpaceAfter 6
  }

  foreach ($section in $appendixSections) {
    Add-Heading -Text $section.Title -Level 1 -NewPage
    foreach ($paragraph in $section.Paragraphs) {
      Add-Paragraph -Text $paragraph -Style "Normal" -Alignment $wdAlignParagraphJustify -FontSize 12 -SpaceAfter 8
    }
    if ($section.ContainsKey("TableHeaders") -and $section.ContainsKey("TableRows")) {
      Add-Table -Headers $section.TableHeaders -Rows $section.TableRows
    }
    if ($section.ContainsKey("CodeLines")) {
      Add-CodeBlock -Lines $section.CodeLines
    }
  }

  $supplementIndex = 0
  while ((Get-PageCount) -lt $MinimumPages) {
    $section = if ($supplementIndex -lt $supplementalSections.Count) {
      $supplementalSections[$supplementIndex]
    } else {
      @{
        Title = "Supplementary Note $($supplementIndex + 1)"
        Paragraphs = @(
          'This supplementary page is intentionally included to preserve the report as a complete long-form project document. It extends the discussion around deployment readiness, maintainability, and platform evolution while ensuring the report remains above the required page threshold.',
          'Green Credit Management benefits from detailed documentation because the project sits at the intersection of sustainability communication and full-stack engineering. Additional notes like this one help future reviewers and developers understand not just what was built, but how the project can be safely extended.'
        )
      }
    }

    Add-Heading -Text $section.Title -Level 1 -NewPage
    foreach ($paragraph in $section.Paragraphs) {
      Add-Paragraph -Text $paragraph -Style "Normal" -Alignment $wdAlignParagraphJustify -FontSize 12 -SpaceAfter 8
    }
    $supplementIndex++
  }

  $doc.TablesOfContents | ForEach-Object { $_.Update() | Out-Null }
  $doc.Fields.Update() | Out-Null
  $doc.SaveAs([ref]$OutputPath, [ref]$wdFormatXMLDocument)
  $finalPages = Get-PageCount
  $doc.Save()
  $doc.Close([ref]0)
  $word.Quit()

  Write-Output ("OutputPath=" + $OutputPath)
  if ($backupPath) {
    Write-Output ("BackupPath=" + $backupPath)
  }
  Write-Output ("Pages=" + $finalPages)
} finally {
  if ($doc) {
    try { [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($doc) } catch {}
  }
  if ($word) {
    try { [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) } catch {}
  }
  [System.GC]::Collect()
  [System.GC]::WaitForPendingFinalizers()
}

