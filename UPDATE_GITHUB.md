# Updating the live MillarZard site

This update adds Supabase account support.

## Upload to GitHub

Replace the current project files with the contents of this folder, then commit with:

```text
Add Supabase account profiles
```

Netlify and Render should redeploy automatically.

## New setup required

Before the live account system works, complete `SUPABASE_SETUP.md`.

You need to add these Netlify environment variables:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

Keep the existing Netlify variable:

```text
VITE_SERVER_URL=https://millarzard.onrender.com
```

No new Render variables are needed.


## Netlify registry fix

If Netlify failed during dependency installation with an internal registry URL, this version fixes it.

Upload these files/folders to GitHub:

```text
.npmrc
client
server
supabase
DEPLOYMENT.md
README.md
render.yaml
SUPABASE_SETUP.md
UPDATE_GITHUB.md
```

Commit message:

```text
Fix Netlify npm registry for Supabase deploy
```

Then in Netlify, redeploy with:

```text
Deploys → Trigger deploy → Clear cache and deploy site
```
