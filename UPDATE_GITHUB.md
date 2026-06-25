# Updating the live MillarZard site

This update adds the first local profile/login system.

## Upload to GitHub

Replace the current project files with the contents of this folder, then commit with:

```text
Add local profile login system
```

Netlify and Render should redeploy automatically.

## Important

No new environment variables are needed for this version.

The profile is stored in the player's browser using localStorage. That means:
- It works immediately on the live website.
- It saves on that device/browser.
- It is not yet a true cross-device account system.

## Test after deployment

1. Open the Netlify site.
2. Create a profile.
3. Create a room.
4. Finish a game.
5. Confirm wins/games update on the home screen.
