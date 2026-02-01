# StudyBuddy - Your Academic Companion

StudyBuddy is a powerful, comprehensive web application designed to help students manage their academic life with ease. From tracking tasks and calculating GPA to staying focused with gamified timers, StudyBuddy is your all-in-one student success tool.

---

## Features

- Task Management: Create, prioritize, and track your daily study tasks.
- GPA and Marks Tracker: Automatic GPA calculation for undergraduates with subject-wise performance analysis.
- Focus Timer: High-impact Pomodoro-style timer to boost your productivity.
- Activity Heatmap: Visualize your study consistency with a GitHub-style activity grid on your profile.
- Achievement System: Unlock rewards and characters as you maintain your study streaks.
- Exam Countdown: Never miss a deadline with live countdown timers for your upcoming exams.
- Daily AI Insights: Personalized study recommendations driven by AI analysis.
- Dark/Light Mode: Styled with a premium, high-contrast UI for any environment.

---

## Technology Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Lucide Icons
- Backend: Node.js, Express
- Database: MySQL (via XAMPP)
- AI: Google Gemini API (for personalized study insights)

---

## Getting Started

Follow these steps to get StudyBuddy running on your local machine.

### 1. Prerequisites

- Node.js installed on your system.
- XAMPP (or any MySQL server) running.

### 2. Clone the Repository

```bash
git clone https://github.com/yourusername/StudyBuddy.git
cd StudyBuddy
```

### 3. Database Setup

1. Open your XAMPP Control Panel and start MySQL.
2. Run the database initialization script:
    ```bash
    cd server
    node initDb.js
    ```
    *This will create the study_buddy database and all necessary tables.*

### 4. Configuration

Edit the server/.env file to match your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=study_buddy
PORT=3000
```

### 5. Install Dependencies

From the root folder, run:
```bash
npm run install-all
```

### 6. Run the Application

Start both the frontend and backend concurrently:
```bash
npm run dev
```

The application will be available at: http://localhost:5173

---

## Project Structure

- client/: React frontend (Vite)
- server/: Node.js + Express backend
- common/: Shared types and constants (if applicable)

---

## Attribution
Developed as a complete academic management solution to help students stay organized and motivated.

---

## License
This project is licensed under the MIT License - see the LICENSE file for details.
