import React from "react";
import GameMath from "./GameMath";
import AvatarDisplay from "./AvatarDisplay";

function Lobby({
  room,
  yourPlayerId,
  demoMode = false,
  onAddDemoBots,
  onFillDemoBots,
  onRemoveDemoBots,
  onStartGame,
  errorMessage
}) {
  const youAreHost = yourPlayerId === room.hostId;
  const canStart = room.playerCount >= 3 && room.playerCount <= 12;
  const botCount = room.players.filter((player) => player.isBot).length;

  return (
    <section className="card-panel">
      <h1>Lobby</h1>

      <p className="room-code">
        Room Code: <strong>{room.roomCode}</strong>
      </p>

      <p>
        Players: <strong>{room.playerCount}</strong> / 12
      </p>

      <GameMath playerCount={room.playerCount} />

      {errorMessage && <p className="error">{errorMessage}</p>}

      <ul className="player-list">
        {room.players.map((player) => (
          <li key={player.id}>
            {player.avatar && <AvatarDisplay avatar={player.avatar} size="tiny" />}
            {player.name}
            {player.isHost && <span className="host-badge">Host</span>}
            {player.id === yourPlayerId && <span className="you-badge">You</span>}
            {player.isBot && <span className="bot-badge">Bot</span>}
          </li>
        ))}
      </ul>

      {demoMode && youAreHost && (
        <section className="demo-bot-controls">
          <div>
            <h2>Single-Tab Demo Bots</h2>
            <p className="subtitle">
              Add fake players to this room so you can test the full game from one browser tab.
            </p>
            <p className="hint">
              Current fake players: <strong>{botCount}</strong>. Bots auto-bid and auto-play legal cards.
            </p>
          </div>

          <div className="demo-bot-button-grid">
            <button type="button" onClick={() => onAddDemoBots?.(1)} disabled={room.playerCount >= 12}>
              Add 1 Bot
            </button>
            <button type="button" onClick={() => onFillDemoBots?.(3)} disabled={room.playerCount >= 3}>
              Fill to 3
            </button>
            <button type="button" onClick={() => onFillDemoBots?.(6)} disabled={room.playerCount >= 6}>
              Fill to 6
            </button>
            <button type="button" onClick={() => onFillDemoBots?.(12)} disabled={room.playerCount >= 12}>
              Fill to 12
            </button>
            <button type="button" className="secondary-button" onClick={onRemoveDemoBots} disabled={botCount === 0}>
              Remove Bots
            </button>
          </div>
        </section>
      )}

      {youAreHost ? (
        <button disabled={!canStart} onClick={onStartGame}>
          Start Game
        </button>
      ) : (
        <p className="subtitle">Waiting for the host to start the game.</p>
      )}

      {!canStart && (
        <p className="hint">You need at least 3 players before starting.</p>
      )}
    </section>
  );
}

export default Lobby;
