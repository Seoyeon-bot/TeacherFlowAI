# TeacherFlowAI Mobile App Setup

## Current State

This repo now includes:

- Capacitor config: `capacitor.config.json`
- iOS wrapper: `ios/`
- Android wrapper: `android/`
- Mobile shell: `mobile-shell/`
- Installable web manifest: `manifest.webmanifest`

## Important Requirement

TeacherFlowAI is not a fully static app. It depends on the Node server in `server.js`.

That means:

- the native iPhone and Android apps must point to a deployed backend URL
- they will not work correctly as standalone offline apps with only local HTML files

## Before Building For App Store / Play Store

1. Deploy the TeacherFlowAI web app and backend to a live HTTPS URL.
2. The easiest free-friendly path for this repo is Render plus a hosted PostgreSQL database.
3. This repo includes `render.yaml` already configured for:

- Docker deployment
- `/healthz` checks
- `DATABASE_URL` support for hosted PostgreSQL

4. Set:

- `DATABASE_URL=your-hosted-postgres-connection-string`
- `APP_BASE_URL=https://your-live-domain.com`
- `GOOGLE_REDIRECT_URI=https://your-live-domain.com/api/auth/google/callback`

5. Update `server.url` in `capacitor.config.json`.
6. Run:

```bash
npm run mobile:sync
```

7. Open the native projects:

```bash
npm run mobile:open:ios
npm run mobile:open:android
```

## Render Deployment Steps

1. Push this repo to GitHub.
2. In Render, choose `New +` -> `Blueprint`.
3. Select this repo. Render will read `render.yaml`.
4. Let it create the web service.
5. In the Render dashboard, set:

- `DATABASE_URL=your-hosted-postgres-connection-string`
- `APP_BASE_URL=https://your-service-name.onrender.com`
- `GOOGLE_REDIRECT_URI=https://your-service-name.onrender.com/api/auth/google/callback`

6. Add optional email / Google auth env vars if you want those features.
7. Deploy.
8. Test:

- `https://your-service-name.onrender.com/healthz`
- sign in
- create account
- lesson generation
- uploaded file flow
- student data save/load

9. Replace the placeholder URL in `capacitor.config.json`.
10. Run `npm run mobile:sync`.
11. Open Xcode and Android Studio from the Capacitor scripts and test on real devices.

## Current Placeholder

The config currently uses:

```json
"url": "https://teacherflowai.example.com"
```

Replace that with your real deployed domain.

## App Store Reality

This repo is now set up for deployment and native wrapping, but App Store submission still requires:

- a real live backend URL
- working Apple Developer and Google Play developer accounts
- app icons, splash assets, screenshots, and privacy answers in the native store listings
- real device testing for iPhone and Android webview behavior

## Recommended Next Testing

- iPhone Safari and iPhone Capacitor webview
- Android Chrome and Android Capacitor webview
- keyboard overlap on forms
- auth/session persistence
- file upload behavior on mobile
- lesson slide readability on narrow screens

## What I Still Need From You To Finish Publishing

I still need the real deployed backend domain.

Until that exists, the native wrappers are scaffolded but still point at the placeholder:

```json
https://teacherflowai.example.com
```
