import React from "react";

function RoundComplete({ room, yourPlayerId, onNextRound }) {
  const youAreHost = yourPlayerId === room.hostId;

  return (
    <section className="section-box round-complete-box">
      <div className="section-title-row">
        <h2>Round {room.roundNumber} Complete</h2>
        <span className="phase-pill">Scored</span>
      </div>

      <table className="score-table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Bid</th>
            <th>Tricks</th>
            <th>Round Score</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {room.players.map((player) => (
            <tr key={player.id}>
              <td>
                {player.name}
                {player.id === yourPlayerId && <span className="mini-you">You</span>}
              </td>
              <td>{player.bid}</td>
              <td>{player.tricksWon}</td>
              <td className={player.roundScore >= 0 ? "positive-score" : "negative-score"}>
                {player.roundScore >= 0 ? `+${player.roundScore}` : player.roundScore}
              </td>
              <td>{player.totalScore}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {youAreHost ? (
        <button onClick={onNextRound}>Start Next Round</button>
      ) : (
        <p className="hint">Waiting for the host to start the next round.</p>
      )}
    </section>
  );
}

export default RoundComplete;
