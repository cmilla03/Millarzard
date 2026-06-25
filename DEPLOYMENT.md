# MillarZard Deployment Guide

This version is prepared for deployment.

## What changed

- The frontend now connects to the backend using `VITE_SERVER_URL`.
- The backend now allows the deployed frontend using `CLIENT_URL`.
- The server has a production `npm start` command.
- The client has a Netlify config.
- A Render blueprint file is included for the backend.

## Recommended simple setup

Use:
- Render for the backend server
- Netlify for the frontend
- A custom domain pointed at Netlify
- Optional subdomain for backend, such as `api.yourdomain.com`

## Environment variables

### Backend / Render

Set:

```text
CLIENT_URL=https://yourdomain.com
```

Before the custom domain is connected, you can temporarily use your Netlify URL:

```text
CLIENT_URL=https://your-site-name.netlify.app
```

### Frontend / Netlify

Set:

```text
VITE_SERVER_URL=https://your-render-server-url.onrender.com
```

If you later set up an API subdomain, use:

```text
VITE_SERVER_URL=https://api.yourdomain.com
```

## Local development still works

Server:

```bash
cd server
npm install
npm run dev
```

Client:

```bash
cd client
npm install
npm run dev
```

The local defaults are still:

```text
Frontend: http://localhost:5173
Backend: http://localhost:3001
```
