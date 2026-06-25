import React from "react";
import Card from "./Card";

function CurrentTrick({ plays, playerCount }) {
  return (
    <section className="section-box">
      <div className="section-title-row">
        <h2>Current Trick</h2>
        <span className="phase-pill">
          {plays.length} / {playerCount} played
        </span>
      </div>

      {plays.length === 0 ? (
        <p className="hint">No cards have been played yet.</p>
      ) : (
        <div className="trick-row">
          {plays.map((play) => (
            <div className="trick-play" key={`${play.playerId}-${play.card.id}`}>
              <p>{play.playerName}</p>
              <Card card={play.card} disabled={true} />
            </div>
          ))}
        </div>
      )}

      {plays.length === playerCount && (
        <p className="hint">
          The trick is complete. The winner is shown below.
        </p>
      )}
    </section>
  );
}

export default CurrentTrick;
