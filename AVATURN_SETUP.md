# MillarZard Avaturn Setup

This version uses your Avaturn developer domain:

```text
https://millarzard.avaturn.dev
```

No Netlify environment variable is required for this version.

The browser loads Avaturn's SDK from its documented jsDelivr CDN integration.
The npm package is intentionally not installed, which avoids registry failures
during Netlify dependency installation.

## How it works

- In profile setup/edit profile, click `Create Selfie Avatar`.
- MillarZard opens Avaturn in a modal.
- User creates/customizes an avatar.
- When the user exports/clicks Next inside Avaturn, MillarZard receives the avatar export callback.
- Click `Save Avaturn Avatar` to save it to the player profile.

## Notes

- Avaturn returns a GLB model URL.
- MillarZard displays that GLB using Google's `<model-viewer>` web component.
- Supabase stores the Avaturn avatar object as JSON in the user's profile.
- At the game table, the GLB camera is cropped to the head and upper body so the
  player appears seated in the same chair presentation as standard avatars.
