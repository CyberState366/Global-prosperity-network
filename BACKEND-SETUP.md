# Backend Setup

This project now includes a small Node backend so sensitive checks and visitor analytics do not have to live in browser JavaScript.

## Run locally

PowerShell:

```powershell
$env:ADMIN_USER="Admin"
$env:ADMIN_PASS="choose-a-private-password"
node server.js
```

Open `http://localhost:3000`.

## What moved server-side

- Admin login validation is handled by `/api/admin/login`.
- Visitor recording is handled by `/api/visitors/record`.
- Admin visitor statistics are read from `/api/admin/visitors` with a session token.

For production, put real API keys, database passwords, and proprietary queries only in server environment variables or a private database layer. Never ship them in `app.js` or `index.html`.