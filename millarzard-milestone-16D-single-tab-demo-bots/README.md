# MillarZard - Milestone 2

## Milestone 16B: No-login demo website

Set `VITE_DEMO_MODE=true` on a separate Netlify deployment to bypass Supabase
authentication and create a temporary player per browser tab. See
`DEMO_SETUP.md`. The production deployment remains unchanged when the variable
is absent.

## Milestone 16A: Seated Table + Avaturn

This build introduces the experimental seated-table presentation based on
`design/seated-table-reference.png` while preserving the existing game rules.

- Players are arranged in chairs around a responsive oval table.
- Standard, emoji, and Avaturn avatars share one seated presentation.
- Avaturn models are framed as upper-body portraits inside the chair.
- The active chair receives a warm gold glow.
- Bid, trick, score, dealer, and card-count information remains visible.
- The current trick stays centered and the local hand stays docked at the bottom.
- Seat spacing scales from 3 through 12 players.
- The Standard Builder, optional Avaturn flow, and default-avatar opt-out all work.
- No scoring, card rules, rooms, Socket.IO events, or Supabase schema were changed.

This version adds deck creation, shuffling, dealing, trump card flipping, and a basic game table screen.

## What works now

- Create a room
- Join a room
- Start with 3–12 players
- 60-card deck for 3–6 players
- 120-card deck for 7–12 players
- Shuffle deck
- Deal round 1
- Flip trump card
- Show each player only their own hand
- Show the basic game table

## How to run

Open two terminal windows.

### Terminal 1: server

```bash
cd ~/Downloads/millarzard-milestone-2/server
npm install
npm run dev
```

### Terminal 2: client

```bash
cd ~/Downloads/millarzard-milestone-2/client
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

Open multiple tabs to test multiple players.


## Visual update

This version changes the regular suits to classic card suits: Hearts, Spades, Diamonds, and Clubs.


## Polished card/table update

This version improves the card visuals and game table layout while keeping the Milestone 2 logic the same.

## Milestone 3 update

This version adds bidding:

- The game starts in the BIDDING phase after cards are dealt.
- Each player can bid from 0 to the current round number.
- Players can only bid once.
- The scoreboard updates as bids come in.
- Once everyone has bid, the game moves to the PLAYING phase.
- Actual card playing will be added in Milestone 4.

## Card rank visual fix

This version displays normal card ranks:

- 1 displays as A
- 11 displays as J
- 12 displays as Q
- 13 displays as K

The internal game values are unchanged, so scoring and winner logic can still compare cards correctly.

## Full rank names visual update

This version shows full rank names in the center of the card:

- Ace
- Jack
- Queen
- King

The corners still use normal short deck labels A, J, Q, K so the cards are easy to read.

## Milestone 4 update

This version adds basic card playing:

- After all bids are submitted, the game enters PLAYING phase.
- Only the current player can play a card.
- Players click a card from their hand to play.
- Wizards and Jesters can be played anytime.
- Number cards must follow the led suit if possible.
- Played cards appear in the Current Trick area.
- Turn order advances after each card.
- Once everyone has played one card, the trick pauses.

Trick winner logic will be added in Milestone 5.

## Milestone 5 update

This version adds trick-winner logic:

- First Wizard played wins.
- Otherwise, highest trump card wins.
- Otherwise, highest card of the led suit wins.
- If every card is a Jester, the first Jester wins.
- If duplicate cards tie, the first tied card played wins.
- The winner gets +1 trick won.
- The winner leads the next trick.
- When all hands are empty, the app moves to ROUND_COMPLETE.

Round scoring will be added in Milestone 6.

## Fix

This version fixes the Milestone 5 transition so the game changes from PLAYING to TRICK_COMPLETE once every player has played a card.

## Milestone 6 update

This version adds round scoring and next rounds:

- When all cards in a round have been played, the round is scored.
- Exact bid earns 20 + 10 × tricks won.
- Missed bid loses 10 × the difference between bid and tricks won.
- Round score is added to each player's total score.
- The host can start the next round.
- Dealer rotates each round.
- The next round deals one more card per player.
- The game ends after the max round and shows final rankings.


## Crash fix

This version fixes the missing `determineTrickWinner` export crash in `server/gameLogic.js`.

## Scoring fix v2

This version fixes the round-complete transition so `scoreRound(room)` is actually called before the Round Complete screen appears.

Correct examples:
- Bid 1, tricks 1 = +30
- Bid 0, tricks 0 = +20
- Bid 2, tricks 0 = -20

## Milestone 7 update

This version adds missing rule and flow polish:

- If the flipped trump card is a Wizard, the game enters TRUMP_SELECT.
- Only the dealer can choose trump.
- Dealer can choose Hearts, Spades, Diamonds, or Clubs.
- After trump is chosen, the game moves to BIDDING.
- Game over screen now includes Back to Lobby for the host.
- Player totals reset when returning to the lobby.

## Milestone 8 update

This version makes the player-count/deck/round math clearer and safer:

- 3–6 players use the standard 60-card deck.
- 7–12 players use the expanded 120-card deck.
- Max rounds are calculated automatically using: floor(deck size / player count).
- The lobby shows the setup before the host starts.
- The game screen shows the locked setup after the game begins.
- The game continues round by round until the calculated max round is reached.

## Milestone 9A update

This version makes the game feel more like a real online card table:

- Replaces the stacked game screen with a table-style layout.
- Adds player seats around the table.
- Adds glowing active-player turn indicator.
- Adds a large turn banner that says what is happening.
- Moves trick cards to the center of the table.
- Adds a side scoreboard panel.
- Keeps the working backend/game logic from Milestone 8.

## Milestone 9B update

This version moves the game closer to the screenshot-style online table layout:

- Full-screen green felt table.
- Compact top status bar.
- Player avatar/name panels around the edges.
- Active player's panel glows.
- Trick cards are played to the center pile.
- Trump card is shown near the lower-right.
- Your hand is docked across the bottom.
- Scoreboard is collapsed into a small drawer.

This is inspired by that style, but uses original visual design and no copied art/assets.

## Milestone 9C update

Cleanup changes based on table testing:

- Added bid/trick marker boxes to player panels.
- Lit markers show how many tricks each player has won relative to their bid.
- Removed the white hand dock so the hand sits over the green felt.
- Moved trump to the center of the table.
- Played cards now appear around the trump card.
- Strengthened dealer trump selection handling and button click behavior.
- Added public card-count values for opponents while keeping actual hands private.

## Milestone 9D update

This version adds the next cleanup changes:

- Removed the redundant center message box.
- Cards are no longer greyed out just because it is not your turn.
- During your turn, only illegal cards are greyed out.
- Legal cards stay bright and clickable.
- Added avatar/emoji selection on the home screen.
- Avatars show in the lobby and around the table.
- Strengthened dealer trump-selection handling.

## Milestone 9E update

This version improves the start screen and hand area:

- Expanded the avatar picker with many more options.
- Added People, Fantasy, Animals, and Icons avatar categories.
- Added more human-style avatar options.
- Added a larger avatar preview before creating/joining.
- Removed the “Your Hand” text/header area.
- Cards now sit more cleanly at the bottom of the table.

## Milestone 9F update

This version fixes the card visuals:

- Card rank/suit corners now use a proper top-left and bottom-right layout.
- Bottom-right rank/suit no longer hangs outside the card.
- Center text and suit names stay inside the white card border.
- Wizard/Jester text is constrained so it does not spill out.
- Smaller trump/center cards use tighter typography so they still fit.


## Milestone 9G update

This version cleans up the card face:

- Removed written suit names like SPADES, HEARTS, DIAMONDS, CLUBS.
- Cards now rely on suit symbols only.
- Card center spacing was tightened slightly.

## Milestone 10 update

This version adds a first custom avatar builder:

- Replaces the emoji-only avatar picker with editable cartoon avatars.
- Choose skin tone, hair style, hair color, eyes, mouth, accessory, and background.
- Includes a Randomize button.
- Custom avatars appear in the lobby and around the table.
- Existing emoji fallback still works if an older avatar value appears.

## Milestone 10B update

This version makes the avatar builder more like a face-only avatar editor:

- Added Neutral, Feminine, and Masculine style presets.
- Added more realistic face-shape choices.
- Added many more hair silhouettes, including longer/feminine styles.
- Added hair color, eye color, lip color, brows, nose, mouth, accessories, and background.
- Reorganized the builder into Face, Hair, Features, and Style tabs.
- This is inspired by common avatar-builder structure, but uses original CSS art.


## Milestone 10C update

This version polishes the avatar builder UI and keeps the game logic untouched:

- Reworked the editor into clearer tabs: Face, Hair, Eyes, Nose, Mouth, Accessories, Background.
- Added larger preview panel at the left/top.
- Hair choices now use visual thumbnails instead of plain text buttons.
- Added more hairstyles, including pixie, locs, fade, and quiff.
- Added more specific feature previews for eyes, nose, mouth, and accessories.
- Cleaned spacing and reduced clutter in the builder panel.
- Avatars still display in the lobby and around the game table.


## Milestone 11 update

This version prepares the app for deployment:

- Frontend uses `VITE_SERVER_URL` instead of hardcoded localhost.
- Backend uses `CLIENT_URL` for CORS instead of hardcoded localhost only.
- Added production `npm start` for the backend.
- Added `.env.example` files.
- Added Netlify config for the frontend.
- Added Render blueprint for the backend.
- Added `DEPLOYMENT.md`.


## Milestone 12 update

Branding cleanup only:

- Updated visible app branding to MillarZard.
- Updated browser tab title to MillarZard.
- Updated backend running message to MillarZard server is running.
- Updated project/deployment text where needed.
- Gameplay, rules, deck logic, scoring, bidding, Socket.IO events, and card terms were not changed.


## Milestone 13 update

This version adds a first profile/login system without changing gameplay:

- Players create a local profile before entering the room screen.
- Profile saves name, avatar, wins, and games played in browser localStorage.
- Create Room and Join Room now use the saved profile name/avatar automatically.
- Players can edit their saved profile or sign out.
- Wins and games played update after a completed game.
- This version does not require a database or extra environment variables.
- Because it uses browser storage, the profile is saved on that device/browser only.
- Future upgrade: replace local profiles with Supabase/Firebase accounts for cross-device login.

## Milestone 14 update

This version adds Supabase account support:

- Email/password sign in and account creation.
- Cross-device profile saving through Supabase.
- Saved name, avatar, wins, and games played.
- Local browser profile remains as fallback if Supabase variables are not configured.
- Added `supabase/profiles_schema.sql`.
- Added `SUPABASE_SETUP.md`.
- Existing room/game/card/scoring logic was not changed.


## Milestone 14B update

This version fixes the Netlify dependency install issue:

- Added `.npmrc` files that force npm to use the public npm registry.
- Removed generated `package-lock.json` files that may reference an internal registry.
- Cleaned the Netlify build command so Netlify installs dependencies normally, then runs `npm run build`.
- Supabase account/profile code is unchanged.


## Milestone 14C update

This version fixes the Netlify install failure by including a clean `client/package-lock.json`.

- The lockfile does not reference the internal OpenAI package registry.
- `.npmrc` files are included at the root and client level to force `https://registry.npmjs.org/`.
- Supabase account/profile code is unchanged.


## Milestone 15 update

This version adds Avaturn selfie avatar creation:

- Added `Create Selfie Avatar` to profile setup/edit profile.
- Embeds the Avaturn web creator using `https://millarzard.avaturn.dev`.
- Saves Avaturn export data to the player's Supabase profile.
- Displays Avaturn GLB avatars using `<model-viewer>`.
- Keeps the existing CSS avatar builder as a fallback/alternative.
- No gameplay/scoring/card logic changed.


## Milestone 15B update

This version makes face-photo avatar creation clearly optional:

- Added three avatar choices: Standard Builder, Selfie Avatar, and Use Default.
- Standard Builder is the default/safest path and does not use a photo.
- Selfie Avatar is labeled optional.
- Use Default lets players skip customization and still play.
- Added privacy-friendly wording explaining that no face photo is required.
- Gameplay/scoring/card logic unchanged.


## Milestone 16C update

This version fixes demo-site backend connection support:

- Server now supports `CLIENT_URLS` as a comma-separated list of allowed frontend URLs.
- This lets the same Render backend accept both the main MillarZard site and the demo Netlify site.
- Demo mode is still controlled only by `VITE_DEMO_MODE=true` on the demo Netlify project.
- Main production login is unchanged.


## Milestone 16D update

This version adds single-tab demo bots:

- Demo site can add fake players from the lobby.
- Buttons include Add 1 Bot, Fill to 3, Fill to 6, Fill to 12, and Remove Bots.
- Bots automatically bid during bidding.
- Bots automatically play legal cards during their turns.
- Bots use the same server-side rules, deck, turn order, trick winner logic, and scoring as normal players.
- Main Supabase/account site remains normal multiplayer.
