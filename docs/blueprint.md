# **App Name**: Billullos

## Core Features:

- User Authentication: User authentication via email/password and Google sign-in using Firebase Authentication. Restrict data access to authenticated users, while unauthenticated users only interact with a demo.
- Dashboard Summary: Display current monthly budget and savings summaries graphically on the main panel ('Budget row' and 'Goals row'), including quick access to specific budgets or goals.
- Budget Management: Allow users to create and manage budgets with a name, amount, and deadline, using Firestore as the main database, Cloud Storage for multimedia content, and Cloud Functions to trigger events. Redirect users to a dedicated page to manage or add an expense.
- Savings Goal Management: Enable users to define savings goals with a name, target amount, and deadline, using Firestore as the main database and Cloud Storage for multimedia content, and Cloud Functions to trigger events. Show dedicated single page to manage or add a new saving income.
- Expense Tracking: Provide functionality to add new expense records, attaching images of receipts using Firestore as the main database, Cloud Storage for multimedia content, and Cloud Functions to trigger events. Cloud Functions is used to update the amount left on the budget
- Savings Tracking: Allow users to add income records for savings goals, attaching images of transaction screenshots using Firestore as the main database and Cloud Storage for multimedia content, and Cloud Functions to trigger events. Cloud Functions is used to update the amount that has been currently added to the saving goal.
- AI Budgeting Tips: Employ an AI-powered tool using large language models to suggest personalized budgeting tips based on the user's expense and saving records.
- Messaging: Messaging to show notification on the browser when the user reaches the limit of a certain budget and when the user reaches a certain saving goal.
- Firebase Hosting: The application will be deployed using Firebase Hosting.

## Style Guidelines:

- Primary color: Forest green (#228B22) to represent growth, stability, and financial well-being.
- Background color: Light beige (#F5F5DC), creating a calm, neutral, and inviting base.
- Accent color: Terracotta (#E2725B), to draw attention to key interactive elements like 'add' buttons and completed goals.
- Font pairing: 'Poppins' (sans-serif) for headers, creating a clean, geometric look. 'PT Sans' (sans-serif) for body text to improve readability in longer paragraphs.
- Use flat, vector-based icons in the primary color, with a touch of the accent color for interactive states.
- Employ a responsive layout using a grid system, ensuring seamless adaptation across devices (desktop, tablet, mobile).
- Use subtle transitions and animations for actions like adding expenses or reaching savings goals, providing gentle feedback to the user.