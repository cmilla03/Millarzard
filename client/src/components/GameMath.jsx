import React from "react";

function getDeckSize(playerCount) {
  if (playerCount <= 6) {
    return 60;
  }

  return 120;
}

function getMaxRounds(deckSize, playerCount) {
  return Math.floor(deckSize / playerCount);
}

function getDeckDescription(deckSize) {
  if (deckSize === 60) {
    return "Standard 60-card deck";
  }

  return "Expanded 120-card deck";
}

function GameMath({ playerCount, lockedDeckSize, lockedMaxRounds }) {
  const deckSize = lockedDeckSize || getDeckSize(playerCount);
  const maxRounds = lockedMaxRounds || getMaxRounds(deckSize, playerCount);

  return (
    <section className="math-box">
      <h3>Game Setup</h3>

      <div className="math-grid">
        <div>
          <span className="label">Players</span>
          <strong>{playerCount}</strong>
        </div>

        <div>
          <span className="label">Deck</span>
          <strong>{deckSize}</strong>
        </div>

        <div>
          <span className="label">Rounds</span>
          <strong>{maxRounds}</strong>
        </div>
      </div>

      <p className="hint">
        {getDeckDescription(deckSize)} · Max rounds = deck size ÷ players, rounded down.
      </p>
    </section>
  );
}

export default GameMath;
