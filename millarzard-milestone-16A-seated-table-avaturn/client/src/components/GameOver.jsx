import React from "react";

function GameOver({ room, yourPlayerId, onRestartGame }) {
  const rankedPlayers = [...room.players].sort((a, b) => b.totalScore - a.totalScore);
  const winner = rankedPlayers[0];

  const youAreHost = yourPlayerId === room.hostId;

  return (
    <section className="section-box game-over-box">
      <div className="section-title-row">
        <h2>Game Over</h2>
        <span className="phase-pill">Final</span>
      </div>

      <p className="winner-text">
        Winner: {winner?.name}
      </p>

      <table className="score-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Total Score</th>
          </tr>
        </thead>
        <tbody>
          {rankedPlayers.map((player, index) => (
            <tr key={player.id}>
              <td>{index + 1}</td>
              <td>
                {player.name}
                {player.id === yourPlayerId && <span className="mini-you">You</span>}
              </td>
              <td>{player.totalScore}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {youAreHost ? (
        <button onClick={onRestartGame}>Back to Lobby</button>
      ) : (
        <p className="hint">Waiting for the host to return everyone to the lobby.</p>
      )}
    </section>
  );
}

export default GameOver;
