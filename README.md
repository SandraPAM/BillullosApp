# Billullos - Smart Budgeting App

Billullos is a modern web application designed to help users take control of their personal finances. It provides a suite of tools for budget management, savings goal tracking, and financial analysis, all powered by a smart, AI-driven backend.

## ✨ Features

- **Authentication**: Secure user sign-up and login with email/password and Google OAuth.
- **Budget Management**: Create and manage monthly or one-time budgets. Users can log expenses against budgets, with support for receipt uploads.
- **Savings Goals**: Define and track progress towards financial goals, from saving for a new gadget to a down payment.
- **Transaction Tracking**: Easily log expenses and savings contributions with descriptions, amounts, and optional image attachments (receipts or screenshots).
- **AI-Powered Tips**: Leverage Genkit and Google's Gemini model to analyze financial data and provide personalized, actionable tips for better budgeting and saving habits.
- **Interactive Dashboard**: A central hub providing a summary of budgets, savings progress, and recent financial activity through intuitive charts and lists.
- **Responsive Design**: A beautiful and accessible user interface built with Shadcn UI and Tailwind CSS that works seamlessly across desktop and mobile devices.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore, Firebase Authentication, Cloud Storage for Firebase)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini models
- **UI**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Component Library**: [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation
- **Charts**: [Recharts](https://recharts.org/)

## 📂 Project Structure

The project follows a standard Next.js App Router structure.

```
.
├── src
│   ├── app                 # Next.js App Router pages and layouts
│   │   ├── dashboard       # Protected dashboard routes
│   │   ├── login           # Login page
│   │   ├── signup          # Signup page
│   │   └── ...
│   ├── ai                  # Genkit flows and AI-related logic
│   │   ├── flows           # Genkit flow definitions
│   │   └── genkit.ts       # Genkit initialization
│   ├── components          # Reusable React components
│   │   ├── auth            # Auth-related components (login/signup forms)
│   │   ├── budgets         # Components for budget features
│   │   ├── dashboard       # Components for the main dashboard
│   │   ├── goals           # Components for savings goals
│   │   └── ui              # Generic UI components from Shadcn
│   ├── context             # React context providers (e.g., AuthProvider)
│   ├── hooks               # Custom React hooks (e.g., useAuth)
│   ├── lib                 # Utility functions and libraries
│   │   ├── firebase        # Firebase configuration and service functions
│   │   └── utils.ts        # General utility functions
│   └── types               # TypeScript type definitions
├── public                  # Static assets (images, fonts)
├── firebase.json           # Firebase project configuration
├── firestore.rules         # Firestore security rules
└── ...                     # Other configuration files
```

---

This documentation provides a clear starting point for any developer looking to understand, run, or contribute to the Billullos application.
