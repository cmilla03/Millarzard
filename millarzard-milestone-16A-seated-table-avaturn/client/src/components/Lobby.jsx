import React from "react";
import GameMath from "./GameMath";
import AvatarDisplay from "./AvatarDisplay";

function Lobby({ room, yourPlayerId, onStartGame, errorMessage }) {
  const youAreHost = yourPlayerId === room.hostId;
  const canStart = room.playerCount >= 3 && room.playerCount <= 12;

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
          </li>
        ))}
      </ul>

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
