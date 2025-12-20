# Saileela Rahasya

**Saileela Rahasya** is a progressive web application dedicated to uncovering the hidden spiritual instructions ("Bodhakatha") within the miraculous stories ("Leela") of Sai Baba.

This project, originally architected in `ARCHITECTURE.md`, has evolved into a full-featured PWA that provides devotees with a structured, immersive platform to explore Sai Baba's teachings.

---

> **Current Status:**
> - **Web App:** v1.2.2 (Production Release)
> - **Backend:** Next.js Server Actions + Prisma + Neon (Postgres)
> - **Authentication:** Clerk
> - **Infrastructure:** Vercel

---

## 🌟 Core Features

The application is built around five core pillars of spiritual engagement:

1.  **Leela (The Narrative)**: A chronological library of Sai Baba's divine plays, linking narrative articles directly to source video content.
2.  **Bodhakatha (The Instruction)**: Semantic organization of content by virtue (e.g., Faith, Patience), focusing on the "Why" behind the miracles.
3.  **Live Stream (Darshan)**: Real-time video integration for live events and a curated archive of past discourses and Aartis.
4.  **Audio (Bhajan)**: A specialized audio player for daily Aartis, Mantras, and Bhajans, optimized for background listening.
5.  **Ask (Personal Guidance)**: A private, ticket-based inquiry system allowing users to seek personalized spiritual guidance from the Saileela Rahasya team.

## 🛠 Tech Stack

*   **Framework:** Next.js 14+ (App Router)
*   **Styling:** Tailwind CSS + Custom Design System (Ochre Theme)
*   **Database:** PostgreSQL (Neon) via Prisma ORM
*   **Auth:** Clerk (Custom Appearance)
*   **Icons:** Lucide React + Custom SVG Assets
*   **Deployment:** Vercel

## 📂 Project Structure

- **`web/`**: Main Next.js application.
  - `src/app`: App Router pages and layouts.
  - `src/components`: Reusable UI components (Atomic design).
  - `src/lib`: Utilities for DB, Auth, and helpers.
  - `src/actions`: Server Actions for data mutation.
  - `src/context`: React Context for global state (Audio, Inquiry).
- **`data/`**: Schemas and migration scripts for content generation.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm/pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Karrot-Tech/saileela-rahasya.git
    cd saileela-rahasya/web
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in `web/` based on `.env.example`, populating keys for Clerk, Database URL, and Admin settings.

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open `http://localhost:3000` to view the app.
