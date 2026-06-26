# MillarZard Demo Website

This project can power both the real account website and a separate no-login
demo website.

## Production website

Keep the existing Netlify site unchanged. Do not add `VITE_DEMO_MODE` there.
It will continue using Supabase authentication and permanent profiles.

## Demo website

Create a second Netlify site from the same GitHub repository.

Use these build settings:

```text
Base directory: client
Build command: npm run build
Publish directory: dist
```

Add these demo-site environment variables:

```text
VITE_DEMO_MODE=true
VITE_SERVER_URL=https://millarzard.onrender.com
```

Do not add the Supabase variables to the demo site.

## How demo players work

- No email, password, or Supabase account is required.
- Each new browser tab receives a randomly named temporary player.
- The profile is stored in `sessionStorage`, not the account database.
- Players can edit their temporary name/avatar and use optional Avaturn.
- `New Demo Player` immediately resets the current tab.
- Rooms and actual gameplay still use the existing Render game server.

Demo stats are temporary and disappear with the browser session. The real
production site's saved accounts and statistics are not affected.
