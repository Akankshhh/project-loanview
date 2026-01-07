# Project Review Questions for the Multilingual Loan Disbursal System

This document provides a comprehensive set of questions to guide a project review. The questions cover high-level architecture, technical implementation, feature specifics, and best practices relevant to this application's stack (Next.js, Firebase, Genkit, ShadCN).

## 1. High-Level Architecture & Project Goals

- **Objective:** What is the primary business problem this application solves? Who is the target user?
- **Core Value:** What is the main value proposition of this platform compared to other loan comparison tools?
- **Tech Stack Rationale:** Why was the combination of Next.js, Firebase, and Genkit chosen for this project? What are the key advantages?
- **Data Flow:** Can you walk through the high-level data flow for a user from initial visit to submitting a loan application? Where does data live at each stage (client-side, Firestore, Genkit)?
- **Scalability:** What were the key considerations for scalability when designing the application architecture and Firestore data model?

## 2. Frontend & UI/UX (Next.js & ShadCN)

- **Component Strategy:** How was the decision made on when to use a pre-built ShadCN component versus creating a custom component?
- **State Management:** The app uses a mix of `useState`, `useMemo`, and context. What is the strategy for managing local, shared, and server-cached state?
- **Internationalization (i18n):** The custom i18n solution uses React Context. What are the pros and cons of this approach? How are new languages and translation strings added?
- **Performance:** What steps were taken to ensure good performance, especially on the data-heavy dashboard and comparison pages? (e.g., Server Components, `useMemo`, lazy loading).
- **Responsiveness:** How is the application's responsive design handled across different device sizes? Are there any mobile-specific UI/UX considerations?
- **Accessibility (a11y):** What measures were implemented to ensure the application is accessible (e.g., ARIA roles, keyboard navigation, semantic HTML)?

## 3. Backend & Database (Firebase)

- **Data Modeling (`backend.json`):**
    - Can you explain the reasoning behind the Firestore data structure, particularly the nesting of `loanApplications` and `documents` under the `/users/{userId}` path?
    - How does the data model support the key query patterns of the application (e.g., fetching all applications for a single user)?
- **Security Rules (`firestore.rules`):**
    - How do the security rules enforce user ownership of data (e.g., a user can only see their own applications)?
    - What is the purpose of the `isOwner()` and `isExistingOwner()` helper functions in the rules?
    - How are public collections like `loanCategories` secured to be read-only for all users?
- **Authentication:** The app uses Firebase Email/Password and Anonymous auth. What is the intended use case for anonymous authentication?
- **Error Handling:** The app has a custom `FirestorePermissionError` and an `errorEmitter`. How does this system help in debugging security rule issues during development?
- **Data Service:** What is the role of the `data-service.ts` file? Why is it beneficial to centralize Firestore write operations there?

## 4. Generative AI (Genkit)

- **Flow Design (`banking-advisor-flow.ts`):** The AI advisor uses a rule-based approach (regex for intent/scenario detection). Why was this chosen over a purely generative model or a tool-based approach?
- **Prompt Engineering:** How was the prompt for the AI advisor constructed to guide the model's responses?
- **Input/Output Schemas:** Why is it important to define strict input (`BankingAdvisorInput`) and output (`BankingAdvisorOutput`) schemas with Zod for the Genkit flow?
- **Potential Improvements:** How could the Banking Advisor be improved? Could it use Genkit Tools to fetch live interest rates or check eligibility dynamically instead of using hardcoded logic?

## 5. Key Features Walkthrough

- **Loan Application (`/apply`):**
    - How does the multi-step form maintain its state as the user moves between steps?
    - How is validation handled at each step before allowing the user to proceed?
- **Compare & Calculate (`/compare`):**
    - The `loanProducts` and `loanDetails` calculations use `useMemo` and `useEffect`. Why are these hooks critical for performance on this page?
    - How is data passed from the EMI calculation to the PDF generation feature? (Hint: `localStorage`).
- **PDF Report Generation (`/report` & `pdfUtils.ts`):**
    - What were the main challenges with generating PDFs on the client side, and how were they overcome? (e.g., font loading, formatting).
    - Why was `jsPDF` chosen? What are its limitations?
- **Dashboard (`/`):**
    - How do the various filters (search, bank, loan type, rate) work together to update the `BankLoanRatesTable`?
    - Explain the purpose of the `useAllBankLoanProducts` custom hook. What problem does it solve?

## 6. Code Quality & Best Practices

- **File Structure:** How is the project organized? What is the purpose of the `lib`, `hooks`, `contexts`, and `constants` directories?
- **TypeScript Usage:** How is TypeScript used to ensure type safety, especially with data coming from Firestore and Genkit flows? (e.g., `DetailedApplicationData`, `UserProfile` types).
- **Separation of Concerns:** How does the application separate UI components, business logic (e.g., `loanUtils`), and data-fetching logic?
- **Environment Variables:** Are there any environment variables (`.env`) needed to run this project locally? If so, what are they for?
- **Future Maintainability:** If a new developer joined the team, what would be the most complex part of the codebase for them to understand? What could be done to improve it?
