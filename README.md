# Blog Management System

A production-ready, clean, and modern Blog Management System built with **Next.js 14+ App Router**, **TypeScript**, **Redux Toolkit**, **Context API**, and **Tailwind CSS**.

## Features

### Public Face
- **Home Page**: A beautiful, server-rendered listing of published blog posts. Features a featured hero post and a grid layout for secondary posts.
- **Category Filtering**: Instant server-side category filtering using search parameters.
- **Blog Reader**: Server-rendered view of posts with full markdown support (via `react-markdown` and `remark-gfm`).
- **Interaction Trackers**: Page view counter triggers server-side updates on page load.
- **Comment Section**: Allows readers to submit comments. Submissions default to a pending moderation state.

### Author Dashboard
- **Protected Paths**: Behind a router-level check (`proxy.ts`) to prevent unauthenticated access.
- **Author Identity Switcher**: Simulates authentication by selecting from pre-seeded author profiles. Keeps the active author synchronized using Context API and cookies.
- **Overview Stats**: Aggregated statistics dashboard displaying total posts, drafts, published counts, views, comment status, and top 5 posts.
- **CRUD Post Editor**: A full markdown editor with a dual-pane live preview, standard formatting buttons (Bold, Italic, Link, List, Heading, Code), live word count, and reading time indicator.
- **Comment Moderation**: A moderation board divided into tabs for Pending and Approved comments, allowing authors to approve or delete comments.

---

## Technical Stack & Architecture

- **Framework**: [Next.js 14+ (App Router)](https://nextjs.org/) utilizing React Server Components (RSC) for page loads and Client Components for dashboard interactions.
- **Language**: Strictly typed [TypeScript](https://www.typescriptlang.org/) for reliability and self-documentation.
- **State Management**: 
  - **Redux Toolkit**: Manages global client-side state for posts, filters, and comments. Supports async operations using `createAsyncThunk`.
  - **Context API (`AuthorContext`)**: Manages the logged-in author session and UI theme (light/dark mode) with persistence in `localStorage` and cookies.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a sleek, responsive, and modern look.
- **Security / Middleware**: Uses the new Next.js 16 `proxy.ts` convention to enforce login/author selection before accessing `/dashboard`.

---

## Getting Started

### Prerequisites
Make sure you have Node.js 18.17.0 or later installed.

### Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   ```

5. **Start Production Server**:
   ```bash
   npm run start
   ```

---

## Directory Structure

```text
├── app/                  # Next.js App Router routes
│   ├── api/              # API endpoints for posts and comments
│   ├── blog/[slug]/      # Public post reader (RSC)
│   ├── dashboard/        # Dashboard layout and pages
│   ├── globals.css       # Styling root
│   ├── layout.tsx        # Root HTML shell and provider wrappers
│   └── page.tsx          # Public homepage (RSC)
├── components/           # Reusable UI component library
│   ├── CategoryBadge.tsx
│   ├── CommentCard.tsx
│   ├── CommentSection.tsx
│   ├── DashboardPostsList.tsx
│   ├── MarkdownEditor.tsx
│   ├── PostCard.tsx
│   └── TopNav.tsx
├── context/              # Context API providers (Session + Theme)
├── hooks/                # Custom hooks for stats, forms, and moderation
├── lib/                  # In-memory storage, mock data, and utilities
├── store/                # Redux Toolkit store, slices, and providers
├── types/                # Strict TypeScript interface declarations
└── proxy.ts              # Route guards and analytics logger
```

---

## Deployment on Vercel

To deploy this project to Vercel:

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Go to the [Vercel Dashboard](https://vercel.com/) and click **Add New Project**.
3. Select your repository.
4. Add the environment variable `NEXT_PUBLIC_APP_URL` matching your production deployment domain.
5. Click **Deploy**. Vercel will automatically build the Next.js application with zero configuration needed.
