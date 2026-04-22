# TeacherFlowAI

TeacherFlowAI is a teacher workflow app that helps teachers turn one lesson idea into a fuller classroom-ready package.

Instead of giving only a short lesson summary, the app is designed to generate materials teachers can actually use:

- lesson slides
- warm-ups
- guided practice
- independent work
- homework
- exit tickets
- answer keys
- substitute-friendly lesson materials
- repurposed assessments and parallel versions

It also includes a student support dashboard so a teacher can organize class data, review student needs, and prepare communication and intervention follow-up.

## How to use 
visit https://69e8d12a3b684048dea562d6--teacherflowai.netlify.app
## Why This App Exists

A lot of teacher planning tools stop too early. They summarize a topic, but they still leave the teacher doing the real work:

- building slides
- writing student questions
- preparing homework
- adjusting for a substitute
- making alternate assessment versions

TeacherFlowAI is meant to reduce that extra workload. The goal is to help a teacher move faster from idea to presentation-ready lesson materials.

## What TeacherFlowAI Does

TeacherFlowAI is organized around five main workflows:

1. One-Click Teaching Pack  
   Builds a fuller lesson package from a topic, objective, class period, and lesson settings.

2. Auto-Repurpose Builder  
   Takes an existing file or lesson and repurposes it into another classroom format.

3. Assessment Version Builder  
   Creates typed quizzes and parallel assessments with different versions instead of duplicate copies.

4. Student Support Dashboard  
   Helps teachers upload student data, review support levels, and generate follow-up actions.

5. Observation/Admin-Ready Version  
   Organizes lesson outputs in a clearer format that is easier to present and review.

## Main Benefits

- Saves planning time by generating more of the actual student-facing materials.
- Helps teachers stay organized by grouping outputs into clear lesson parts.
- Supports substitute coverage with shorter, clearer materials.
- Makes assessments more usable by producing different versions.
- Gives a teacher a starting point they can revise instead of forcing them to start from scratch.
- Works as a web app and has iPhone/Android wrapper support through Capacitor.

## How It Works

At a high level, the app works like this:

1. The teacher enters a topic, objective, time, and lesson needs.
2. The app organizes that input into a fuller classroom structure.
3. It generates lesson components such as:
   - warm-up
   - mini-lesson
   - guided practice
   - independent practice
   - homework
   - exit ticket
4. If the user is creating a substitute plan, it also restructures what the sub needs to know into a shorter, clearer brief.
5. If the user is building assessments, the app creates parallel versions with changed stems, values, and contexts instead of repeating the same question set.
6. The results are grouped into materials that are easier for a teacher to present and adjust.

## Teacher Experience

The app is meant to feel more interactive than a one-shot generator.

Instead of only returning plain text, the current setup focuses more on:

- lesson slides that contain student-facing prompts
- clearer pacing by class period
- practice and challenge flow
- video suggestions based on teacher keywords
- materials a teacher can revise after generation

## Student-Facing Materials

TeacherFlowAI is built to produce materials students can actually use during class, not just planning notes for the teacher.

Examples include:

- warm-up prompts
- guided practice questions
- independent work
- homework/classwork tasks
- exit tickets
- answer keys
- lesson slides with actual prompt content

## Substitute Plan Support

The substitute workflow is designed to be simpler and more usable.

Instead of dumping teacher notes directly onto the page, it aims to:

- shorten the substitute brief
- organize directions clearly
- include lesson materials in the slide flow
- include video suggestions when relevant
- prepare work students can complete even if the regular teacher is absent

## Assessment Version Builder

The assessment workflow supports:

- typed quizzes
- parallel assessments
- alternate versions

The versioning logic was updated so Version A and Version B do not simply repeat the same 12 questions. The goal is to preserve skill alignment while changing wording, surface context, and numbers where appropriate.

## Student Support Dashboard

TeacherFlowAI also includes a student support workflow. It uses an explainable support score rather than a black-box model.

The support score is based on classroom and performance indicators such as:

- attendance
- missing assignments
- late submissions
- participation
- behavior concern
- recent quiz average
- recent test average
- score trend
- days since intervention

The dashboard then helps surface likely support level and follow-up ideas.

## Tech Overview

This project is a lightweight web app with a Node server backend.

Main pieces:

- `index.html`, `planning.html`, `support.html`, `insights.html`, `settings.html`: frontend pages
- `styles.css`: styling and responsive layout
- `app.js`: frontend logic and lesson/material generation behavior
- `server.js`: local auth, session handling, API routes, storage, and backend logic
- `data/`: local storage for users and student records
- `capacitor.config.json`: iPhone/Android wrapper config
- `render.yaml`: Render deployment blueprint

## Local Run

From the project folder:

```bash
cp .env.example .env
node server.js
```

Then open:

```text
http://localhost:3000
```

## Environment Variables

Important values:

- `PORT`
- `SESSION_SECRET`
- `DATABASE_URL`
- `APP_BASE_URL`
- `GOOGLE_REDIRECT_URI`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `MAIL_FROM`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

For local work, `.env.example` gives a starting template.

## Data Storage

TeacherFlowAI now supports two storage modes:

- `DATABASE_URL` set: uses hosted PostgreSQL for users, students, and workspace activity
- no `DATABASE_URL`: falls back to local JSON files in `data/`

Local fallback files include:

- `data/users.json`
- `data/students.json`
- `data/activities.json`

For free hosting, use a hosted PostgreSQL database and set `DATABASE_URL`.

## Deploying the App

This project is set up for Render deployment.

The repo includes [render.yaml](/Users/seoyeonchoi/Desktop/LFA_Work/TeacherFlowAI/render.yaml:1), which configures:

- Docker deployment
- health check at `/healthz`
- production environment structure
- `DATABASE_URL` support for hosted PostgreSQL

### Render Steps

1. Push the repo to GitHub.
2. Create a new `Blueprint` service in Render.
3. Select this repository.
4. Let Render create the service using `render.yaml`.
5. Set the required environment variables:
   - `DATABASE_URL=your-hosted-postgres-connection-string`
   - `APP_BASE_URL=https://your-service-name.onrender.com`
   - `GOOGLE_REDIRECT_URI=https://your-service-name.onrender.com/api/auth/google/callback`
6. Add optional email and Google OAuth settings if you want those features enabled.
7. Deploy.
8. Test the health endpoint:

```text
https://your-service-name.onrender.com/healthz
```

## iPhone and Android App Packaging

This repo also includes Capacitor setup so the web app can be wrapped for mobile:

- `ios/`
- `android/`
- `capacitor.config.json`
- `mobile-shell/`
- `manifest.webmanifest`

Important: the phone app depends on the live backend. It is not a fully offline standalone app.

That means before mobile publishing, you must:

1. deploy the backend to a live HTTPS URL
2. replace the placeholder URL in `capacitor.config.json`
3. run:

```bash
npm run mobile:sync
```

4. open the native projects:

```bash
npm run mobile:open:ios
npm run mobile:open:android
```

## App Store / Play Store Reality

This repo is prepared for mobile packaging, but actual store publishing still requires:

- a real deployed backend URL
- Apple Developer account
- Google Play Developer account
- real device testing
- app screenshots
- app icon and branding review
- store listing copy
- privacy disclosures and permissions review

## Current Strengths

- richer lesson generation than a plain summary
- substitute planning support
- assessment version generation
- explainable student support workflow
- responsive design improvements for phones and medium-size screens
- deployment path prepared for Render
- native app wrappers prepared for iPhone and Android

## Current Limitations

- final lesson quality still depends on how specific the teacher input is
- the mobile app still depends on the deployed web backend
- store submission work is not finished until live deployment and device testing are complete
- local fallback storage is still file-based when `DATABASE_URL` is not configured

## Sample Use Cases

- A teacher needs a fast teaching pack for tomorrow’s lesson.
- A substitute needs a clear set of lesson materials and student tasks.
- A teacher wants Version A and Version B of the same quiz.
- A teacher wants to upload student data and identify students who may need support.
- A teacher wants a web app that can later be packaged for phones.

## Project Goal

The core goal of TeacherFlowAI is simple:

Help teachers spend less time formatting and rebuilding materials, and more time teaching.
