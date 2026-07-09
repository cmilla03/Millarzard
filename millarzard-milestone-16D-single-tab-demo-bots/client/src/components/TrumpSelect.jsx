import React from "react";
import Card from "./Card";

const SUITS = ["Hearts", "Spades", "Diamonds", "Clubs"];

function getSuitSymbol(suit) {
  if (suit === "Hearts") return "♥";
  if (suit === "Diamonds") return "♦";
  if (suit === "Spades") return "♠";
  if (suit === "Clubs") return "♣";
  return "";
}

function TrumpSelect({ room, yourPlayerId, onChooseTrump }) {
  const dealer = room.players[room.dealerIndex];
  const youAreDealer = dealer?.id === yourPlayerId;

  function handleChooseTrump(suit) {
    onChooseTrump(suit);
  }

  return (
    <section className="section-box trump-select-box cm-modal-panel">
      <div className="section-title-row">
        <h2>Choose Trump</h2>
        <span className="phase-pill">Dealer</span>
      </div>

      <p>
        A Wizard was flipped. Dealer <strong>{dealer?.name}</strong> chooses trump.
      </p>

      <div className="trump-choice-layout">
        <div>
          <p className="hint">Flipped card</p>
          <Card card={room.trumpCard} disabled={true} />
        </div>

        <div className="trump-choice-panel">
          {youAreDealer ? (
            <>
              <p>Pick one suit:</p>

              <div className="suit-button-grid">
                {SUITS.map((suit) => (
                  <button
                    type="button"
                    key={suit}
                    className={`suit-choice-button ${
                      suit === "Hearts" || suit === "Diamonds" ? "red-suit" : "black-suit"
                    }`}
                    onClick={() => handleChooseTrump(suit)}
                  >
                    <span>{getSuitSymbol(suit)}</span>
                    {suit}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="hint">Waiting for the dealer to choose trump.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default TrumpSelect;
