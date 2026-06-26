# Milestone 16A — Seated Table + Avaturn

## Visual reference

The implementation follows `design/seated-table-reference.png`:

- deep forest-green room
- warm wood oval table with green felt
- visible chairs around the table
- upper-body avatars positioned inside each chair
- gold active-player lighting
- compact bid/trick information beside each player
- current trick in the center
- local player's cards along the bottom

## Responsive seating

The local player remains at the bottom. All other players are distributed along
the remaining arc of an ellipse. Seat scale automatically decreases for larger
rooms so the same layout supports 3–12 players without changing game logic.

## Avaturn

Avaturn remains optional. Exported GLB URLs are saved in the existing avatar
JSON object in Supabase. At the table, `<model-viewer>` uses a closer camera and
target so the model appears as a head-and-upper-body portrait inside the chair.

## Preserved systems

This update does not change:

- deck or card rules
- legal-card calculations
- bidding
- trick resolution
- scoring
- room creation/joining
- Socket.IO event names
- Supabase authentication or profile schema
