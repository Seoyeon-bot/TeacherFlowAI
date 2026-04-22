# TeacherFlowAI

TeacherFlowAI is a challenge-ready teacher workflow product demo rebuilt around five core modules:

- One-Click Teaching Pack
- Auto-Repurpose Builder
- Student Support Dashboard
- Class Summary Intelligence
- Observation/Admin-Ready Version

The app uses explainable support scoring, fixed-schema student imports, backend account auth, and per-teacher roster storage so it behaves more like software a school could actually buy.

## Current Workspace

Project path:

```text
/Users/seoyeonchoi/Desktop/LFA_Work/TeacherFlowAI
```

## What It Includes

- work email sign-in, create account, sign-out, and reset-link email flow
- hashed local passwords with PBKDF2
- Google OAuth scaffolding for Workspace login
- backend session cookies
- per-teacher roster persistence in `data/students.json`
- class-by-class roster management with advisor and parent email editing
- Gmail compose handoff for advisor/parent drafts
- Google Calendar reminder handoff for intervention follow-up
- polished multi-module UI optimized for the Codex Creator Challenge

## Student Import Schema

TeacherFlowAI expects this fixed schema for roster import:

```text
student_id,student_name,grade_level,class_name,attendance_percent,missing_assignments,late_submissions,participation_score,behavior_concern,recent_quiz_avg,recent_test_avg,score_trend,last_intervention_days_ago,teacher_notes,advisor_email,parent_email
```

Supported import paths:

- upload `.csv`
- upload `.tsv`
- paste CSV
- paste TSV

The app includes a sample CSV download. Start from that template instead of inventing custom column names.

## Explainable Support Scoring

TeacherFlowAI does not use a black-box student risk model. It computes a weighted score from:

- attendance
- missing assignments
- late submissions
- participation score
- behavior concern
- recent quiz average
- recent test average
- score trend
- intervention gap

Support levels:

- `0-34`: Low
- `35-64`: Moderate
- `65-100`: High

The dashboard shows the top 2-3 strongest contributing reasons for each flagged student, then generates:

- suggested intervention
- draft advisor/parent email
- progress summary

## Local Run

From this directory:

```bash
cd /Users/seoyeonchoi/Desktop/LFA_Work/TeacherFlowAI
cp .env.example .env
node server.js
```

Then open:

```text
http://localhost:3000
```

## Production Deploy

TeacherFlowAI needs a live backend URL before the iPhone and Android wrappers will work correctly.

Minimum production requirements:

- HTTPS domain for the Node server
- persistent writable storage for `data/`
- environment variables set in production

Recommended production env changes:

- `APP_BASE_URL=https://your-live-domain.com`
- `GOOGLE_REDIRECT_URI=https://your-live-domain.com/api/auth/google/callback`
- `SESSION_SECRET=` strong random value

Health check:

```text
GET /healthz
```

### Docker Deploy

Build:

```bash
docker build -t teacherflowai .
```

Run:

```bash
docker run --env-file .env -p 3000:3000 teacherflowai
```

After deployment, update `capacitor.config.json` with your real live URL, then run:

```bash
npm run mobile:sync
```

### Render Deploy

This repo now includes [render.yaml](/Users/seoyeonchoi/Desktop/LFA_Work/TeacherFlowAI/render.yaml:1), so Render can create the web service with the right basics:

- Docker runtime
- `/healthz` health check
- persistent disk mounted at `/app/data`
- generated `SESSION_SECRET`

Recommended Render flow:

1. Push this project to GitHub.
2. In Render, create a new Blueprint and select that repo.
3. Review the generated service and keep the disk mount at `/app/data`.
4. Fill in these required env vars in Render before first production use:
   - `APP_BASE_URL=https://your-service-name.onrender.com`
   - `GOOGLE_REDIRECT_URI=https://your-service-name.onrender.com/api/auth/google/callback`
5. Fill in these optional env vars if you want email reset and Google login:
   - `MAIL_FROM`
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_SECURE`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
6. Deploy and confirm `https://your-service-name.onrender.com/healthz` responds successfully.
7. Replace the placeholder URL in `capacitor.config.json`.
8. Run `npm run mobile:sync`.

## Google OAuth Setup

If you want Google Workspace sign-in to work, fill these values in `.env`:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `SESSION_SECRET`

Without Google credentials, local work-email account creation and password auth still work.

`server.js` now loads `.env` automatically at startup, so a normal `node server.js` run is enough.

## Password Reset Email

TeacherFlowAI now sends reset links by email.

Recommended `.env` mail settings for Google Workspace or Gmail SMTP:

- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=587`
- `SMTP_SECURE=false`
- `SMTP_USER=your-work-email@school.org`
- `SMTP_PASS=your-app-password-or-smtp-password`
- `MAIL_FROM=your-work-email@school.org`

Flow:

1. Open the `Reset Password` tab.
2. Enter the work email.
3. Submit the request.
4. Open the emailed reset link.
5. Choose a new password.

The reset token is still stored hashed on the backend and expires automatically.

You can also save SMTP settings from `Settings` → `Email Provider` in the app, then use `Send Test Email` before relying on password reset mail.

## Data Storage

- `data/users.json`: user accounts, hashed passwords, reset metadata
- `data/students.json`: roster data keyed by teacher account

## Main Files

- `index.html`: app shell and module layout
- `styles.css`: product UI styling
- `app.js`: frontend behavior, scoring, and module rendering
- `server.js`: auth, password reset, sessions, and roster APIs
- `.env.example`: local config template
- `render.yaml`: Render deployment blueprint with persistent disk
- `capacitor.config.json`: iPhone / Android wrapper config
- `MOBILE_APP_SETUP.md`: mobile packaging notes
