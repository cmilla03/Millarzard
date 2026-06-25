import React from "react";
import Card from "./Card";

function TrickResult({ lastTrick, onContinueAfterTrick }) {
  if (!lastTrick) {
    return null;
  }

  return (
    <section className="section-box trick-result-box">
      <div className="section-title-row">
        <h2>Trick Winner</h2>
        <span className="phase-pill">Complete</span>
      </div>

      <p className="winner-text">
        {lastTrick.winnerName} won the trick.
      </p>

      <div className="winning-card-row">
        <div>
          <p className="hint">Winning card</p>
          <Card card={lastTrick.winningCard} disabled={true} />
        </div>
      </div>

      <button onClick={onContinueAfterTrick}>Continue</button>
    </section>
  );
}

export default TrickResult;
