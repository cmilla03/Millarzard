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


## Milestone 14C deploy fix

Upload this version to GitHub and make sure this file exists in the repo after upload:

```text
client/package-lock.json
```

That file is important because it replaces the old lockfile that pointed Netlify to the internal registry.

Commit message:

```text
Fix npm lockfile registry
```

Then in Netlify:

```text
Deploys → Trigger deploy → Clear cache and deploy site
```


## Milestone 15 Avaturn update

Upload these files/folders to GitHub:

```text
.npmrc
client
server
supabase
AVATURN_SETUP.md
DEPLOYMENT.md
README.md
render.yaml
SUPABASE_SETUP.md
UPDATE_GITHUB.md
```

Commit message:

```text
Add Avaturn selfie avatar creator
```

Then Netlify should redeploy. If not, trigger:

```text
Deploys → Trigger deploy → Clear cache and deploy site
```


## Milestone 15B avatar opt-out update

Upload these files/folders to GitHub:

```text
.npmrc
client
server
supabase
AVATURN_SETUP.md
DEPLOYMENT.md
README.md
render.yaml
SUPABASE_SETUP.md
UPDATE_GITHUB.md
```

Commit message:

```text
Make selfie avatar optional
```

Then Netlify should redeploy. If needed, trigger:

```text
Deploys → Trigger deploy → Clear cache and deploy site
```

## Milestone 16A seated-table update

Upload/replace these items in GitHub:

```text
.npmrc
client
server
supabase
design
AVATURN_SETUP.md
DEPLOYMENT.md
MILESTONE_16A.md
README.md
render.yaml
SUPABASE_SETUP.md
UPDATE_GITHUB.md
```

Commit message:

```text
Add seated table with Avaturn avatars
```

Then use Netlify:

```text
Deploys → Trigger deploy → Clear cache and deploy site
```
