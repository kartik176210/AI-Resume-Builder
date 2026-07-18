# Mainframe — AI Resume Builder

Full-stack resume builder: AI-generated content, three templates, PDF export, and an ATS score checker. Login/signup pages share the "Mainframe" visual identity (scrub-controlled hero video, typewriter copy, pill buttons).

## Stack
- React + TypeScript + Vite + Tailwind CSS v4 (frontend)
- Vercel serverless function (`api/generate-resume.ts`) calling the Anthropic API (backend)
- localStorage-based demo auth + resume persistence (no external DB required to run)

## Run locally
```bash
npm install
npm run dev
```
The AI generation feature needs a key — create `.env` (or set it in your shell) from `.env.example`:
```
ANTHROPIC_API_KEY=sk-ant-...
```
`vercel dev` (not plain `vite`) is required to run the `/api` function locally. Plain `npm run dev` runs the frontend only — the "Generate with AI" button will fail against a fetch to `/api/generate-resume` with no backend running, unless you use `vercel dev`.

## Deploy to Vercel
1. Push this project to a GitHub repo (or run `vercel` from this folder with the Vercel CLI).
2. Import the repo at vercel.com/new. Vercel auto-detects Vite + the `api/` folder.
3. In **Project Settings -> Environment Variables**, add:
   - `ANTHROPIC_API_KEY` = your Anthropic API key
4. Deploy. `vercel.json` already handles SPA routing for `/login`, `/signup`, `/builder`.

## What's real vs. demo-grade
- **AI generation** is a real API call to Claude, server-side, keeping your API key off the client.
- **ATS score checker** runs entirely client-side (keyword/heuristic scoring) — no API key needed, works offline.
- **PDF export** happens client-side via `html2canvas` + `jsPDF` — no server round-trip.
- **Auth & resume storage** are intentionally simple: accounts and resumes are saved in the browser's `localStorage`, not a real database. This keeps the project deployable with zero backend setup, but:
  - Passwords are stored in plain text in the browser — fine for a demo/portfolio, not for real users.
  - Data doesn't sync across devices/browsers.
  - Before using this for real users, swap `src/lib/auth.ts` for a real auth provider (e.g. Supabase Auth, Clerk, NextAuth) and persist resumes to a real database via additional `/api` routes.

## Project structure
```
api/generate-resume.ts     Vercel serverless function -> Anthropic API
src/components/            Navbar, background video, pill buttons
src/hooks/useTypewriter.ts Typewriter text effect
src/lib/auth.ts             Demo auth (localStorage)
src/lib/ats.ts              ATS scoring heuristic
src/lib/api.ts              Client -> /api/generate-resume
src/templates/              Classic / Modern / Minimal resume templates
src/pages/                  Landing, Login, Signup, Builder
```
