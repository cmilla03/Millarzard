import React from "react";

function ScorePanel({ room, yourPlayerId }) {
  const sortedPlayers = [...room.players].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <details className="cm-score-drawer">
      <summary>Scores</summary>

      <div className="cm-score-list">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`cm-score-row ${player.id === yourPlayerId ? "cm-score-you" : ""}`}
          >
            <span>#{index + 1}</span>
            <strong>{player.name}</strong>
            <span>{player.totalScore}</span>
          </div>
        ))}
      </div>
    </details>
  );
}

export default ScorePanel;
