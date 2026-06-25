# MillarZard Supabase Account Setup

This version upgrades profiles from browser-only storage to real accounts that work across devices.

## What Supabase saves

The `profiles` table stores:

- user id
- email
- profile name
- avatar JSON
- wins
- games played

## Step 1: Create a Supabase project

1. Go to Supabase.
2. Create a new project.
3. Wait for the project to finish setting up.

## Step 2: Create the profiles table

1. Open your Supabase project.
2. Go to SQL Editor.
3. Open `supabase/profiles_schema.sql` from this project.
4. Copy all of it into the SQL Editor.
5. Run it.

This enables Row Level Security so each signed-in user can read and update only their own profile.

## Step 3: Get your client keys

In Supabase, go to the project API keys/settings area.

You need:

```text
Project URL
Publishable key / anon key
```

Do not use the service role key in Netlify or frontend code.

## Step 4: Add Netlify environment variables

In Netlify → MillarZard → Environment variables, add:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

Keep your existing variable too:

```text
VITE_SERVER_URL=https://millarzard.onrender.com
```

## Step 5: Redeploy Netlify

Go to:

```text
Deploys → Trigger deploy → Clear cache and deploy site
```

## Step 6: Test

1. Open `https://millarzard.netlify.app`.
2. Create an account.
3. Create your profile/avatar.
4. Log in from another browser/device with the same account.
5. Confirm your profile appears there too.

## Notes

- This update still keeps local profile mode as a fallback if Supabase variables are missing.
- No new Render variables are needed.
- The game server remains on Render and the account/profile data lives in Supabase.
