# 🎓 S-Classes — AI-Powered Next-Generation Learning Platform

**S-Classes** is a modern, comprehensive, full-stack educational web application designed for learners of all ages—from K-12 (CBSE / ICSE) to competitive exam aspirants (JEE / NEET) and professional developers (Modern Java 21 LTS, Spring Boot, DSA, and Full-Stack Engineering).

Powered by the **Gemini API**, S-Classes combines structured interactive courses with intelligent step-by-step AI tutoring, multilingual voice problem solving, in-browser Java execution, active recall flashcards, and a centralized learning dashboard.

---

## 🌟 Key Features

### 1. 📊 Centralized Learning Hub & Progress Tracker
- **Real-Time KPIs**: Track total curriculum progress, active courses, streak days, academic XP, and daily target checklists.
- **Course History Management**: Filter and search through enrolled syllabi (`All`, `In Progress`, `Completed`) with one-click lesson resume.
- **Active AI Sessions Tracker**: Review active and resolved doubt sessions across subjects with continuous chat resumption.
- **Milestone & Badge System**: Unlock scholar achievements like *Streak Master*, *Java 21 Bytecode Explorer*, and *AI High Thinking Scholar*.

### 2. 🤖 Gemini AI Tutor & Step-by-Step Reasoner
- **Deep Derivations**: Mathematical, scientific, and algorithmic problems broken down step-by-step.
- **Multiple Reasoning Modes**:
  - *Step-by-Step Derivation* (Calculus, Physics, Organic Chemistry)
  - *Concept Deep Dive & Analogies*
  - *Java 21 Code Bug Fix & Bytecode Optimization*
- **Persistent AI Session Management**: Stores and organizes doubt-solving threads locally and across learning sessions.

### 3. 🎙️ Multilingual Voice AI Tutor
- Real-time spoken doubt resolution powered by Gemini.
- Supports voice interaction in **English**, **Hindi (हिन्दी)**, and **Marathi (मराठी)**.
- Hands-free query breakdown with real-time response transcription.

### 4. ☕ Java 21 LTS Code Studio & Sandbox
- In-browser interactive Java development workspace.
- Pre-built blueprints for OOPs, Project Loom Virtual Threads, Pattern Matching, Record Patterns, and Spring Boot 3.
- Integrated code repository, algorithmic challenges, and execution sandbox.

### 5. 📚 Comprehensive Curriculum & Qualification-Matched Tracks
- **School & Board Prep**: Class 1–12 (CBSE, ICSE, State Boards) in Mathematics, Physics, Chemistry, Biology, and English.
- **Competitive Exams**: JEE Main / Advanced, NEET, Foundation Olympiads.
- **Professional Engineering**: Core Java, Advanced Java 21, DSA, Spring Boot Microservices, and Web Development.

### 6. ⚡ AI Exam Arena & Active Recall Flashcards
- Timed practice exams and adaptive MCQs with instant explanations.
- Spaced repetition flashcard decks for high-retention exam revision.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router v7, React Icons |
| **Backend** | Express.js, Node.js, TypeScript (`tsx`, `esbuild`) |
| **AI Engine** | Google Gemini API (`@google/genai`) |
| **Authentication** | JSON Web Tokens (JWT), Context API |
| **Styling & UI** | Tailwind CSS with customized dark-first glassmorphism design |

---

## 📁 Project Structure

```
├── .env.example              # Environment variables template
├── metadata.json             # AI Studio applet metadata & capabilities
├── package.json              # NPM dependencies and scripts
├── server.ts                 # Full-stack Express server with Vite middleware & API routes
├── vite.config.js            # Vite bundler configuration
├── src/
│   ├── main.jsx              # React application root entry point
│   ├── App.jsx               # Route definitions and layout wrapper
│   ├── api/                  # Axios HTTP client configuration
│   ├── components/           # Reusable UI components
│   │   ├── CentralizedUserDashboard.jsx # Unified dashboard & progress hub
│   │   ├── Navbar.jsx        # Navigation bar with role-based links
│   │   ├── Footer.jsx        # App footer
│   │   ├── VoiceAiModal.jsx  # Interactive voice AI modal
│   │   └── YouTubePlayer.jsx # Video lecture player integration
│   ├── context/              # Auth & App global state contexts
│   ├── data/                 # Curated courses, quizzes, and Java blueprints
│   ├── pages/                # Application views and routes
│   │   ├── Dashboard.jsx     # Student dashboard
│   │   ├── Home.jsx          # Landing page
│   │   ├── ai/               # AI Tutor & doubt solver interfaces
│   │   ├── courses/          # Course catalog, details, and video player
│   │   ├── playground/       # Java 21 IDE and code studio
│   │   ├── quiz/             # AI Exam Arena and practice quizzes
│   │   └── student/          # Flashcards and learning analytics
│   └── utils/                # AI session manager, streak calculation, & content matching
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun** / **yarn**
- **Google Gemini API Key** ([Google AI Studio](https://aistudio.google.com/))

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/s-classes.git
cd s-classes

# Install dependencies
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Add your credentials to `.env`:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
JWT_SECRET=your_jwt_secret_key
```

### 3. Run the Development Server
```bash
npm run dev
```
The application will start on **`http://localhost:3000`** with hot module compilation.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📜 Available Scripts

- `npm run dev` — Starts the Express backend with Vite in development mode on port 3000.
- `npm run build` — Builds the Vite client to `dist/` and bundles `server.ts` with `esbuild`.
- `npm run start` — Runs the compiled production server (`dist/server.cjs`).
- `npm run lint` — Runs ESLint across all codebase files.

---

## 🔒 Security & Best Practices

- **Server-Side API Proxying**: The `GEMINI_API_KEY` and secret tokens remain strictly on the backend (`server.ts`) and are never exposed to client-side bundles.
- **JWT Protection**: Secured authentication routes for student and instructor profiles.
- **Graceful Fallbacks**: Offline-tolerant local caching and fallback AI mock generators if external network calls are rate-limited.

---

## 👥 Authors & Acknowledgments

- **Platform Architect & Lead**: Shubham Chavhan & S-Classes Academic Team
- **AI Acceleration**: Google DeepMind Gemini Models via `@google/genai`
