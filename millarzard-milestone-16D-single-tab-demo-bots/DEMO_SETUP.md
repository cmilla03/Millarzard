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


## Important: allow the demo URL on Render

Because the demo site has a different Netlify URL than the main site, the Render backend must allow both frontends.

In Render, add this environment variable to the MillarZard backend:

```text
CLIENT_URLS=https://millarzard.netlify.app,https://demomillarzard.netlify.app
```

Keep the old `CLIENT_URL` if it already exists.

Then redeploy the Render backend.

## Demo Netlify variables

On the demo Netlify site, make sure these exist:

```text
VITE_DEMO_MODE=true
VITE_SERVER_URL=https://millarzard.onrender.com
```

Then run:

```text
Deploys → Trigger deploy → Clear cache and deploy site
```

When demo mode is active, the home page should say:

```text
Demo Mode
Testing as Demo Player ...
New Demo Player
```

If it says `Signed in as`, then `VITE_DEMO_MODE=true` is not active yet.


## Single-tab demo bots

After deploying Milestone 16D:

1. Open the demo site.
2. Click `Create Room`.
3. In the lobby, use:
   - `Fill to 3` for a fast playable test.
   - `Fill to 6` for table layout testing.
   - `Fill to 12` for crowded layout testing.
4. Click `Start Game`.

Bots will automatically:
- submit random valid bids,
- play random legal cards,
- follow suit when required,
- score using the same rules as everyone else.

You still control your own player from the same tab.
