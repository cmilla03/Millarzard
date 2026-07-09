import React from "react";

function getSuitSymbol(suit) {
  if (suit === "Hearts") return "♥";
  if (suit === "Diamonds") return "♦";
  if (suit === "Spades") return "♠";
  if (suit === "Clubs") return "♣";
  return "";
}

function getSuitName(suit) {
  return suit || "";
}

function getRankLabel(value) {
  if (value === 1) return "A";
  if (value === 11) return "J";
  if (value === 12) return "Q";
  if (value === 13) return "K";
  return value;
}

function getRankName(value) {
  if (value === 1) return "Ace";
  if (value === 11) return "Jack";
  if (value === 12) return "Queen";
  if (value === 13) return "King";
  return value;
}

function CardIndex({ rank, symbol, position }) {
  return (
    <div className={`card-index ${position}`}>
      <span className="card-index-rank">{rank}</span>
      <span className="card-index-suit">{symbol}</span>
    </div>
  );
}

function Card({ card, onClick, disabled = false, dimmed = false }) {
  if (!card) {
    return <div className="playing-card empty-card">No card</div>;
  }

  if (card.type === "wizard") {
    return (
      <button
        className={`playing-card special-card wizard-card card-button ${dimmed ? "card-dimmed" : ""}`}
        onClick={onClick}
        disabled={disabled}
      >
        <CardIndex rank="W" symbol="★" position="top-left" />

        <div className="special-card-center">
          <div className="special-icon">★</div>
          <div className="special-title">Wizard</div>
        </div>

        <CardIndex rank="W" symbol="★" position="bottom-right" />
      </button>
    );
  }

  if (card.type === "jester") {
    return (
      <button
        className={`playing-card special-card jester-card card-button ${dimmed ? "card-dimmed" : ""}`}
        onClick={onClick}
        disabled={disabled}
      >
        <CardIndex rank="J" symbol="☻" position="top-left" />

        <div className="special-card-center">
          <div className="special-icon">☻</div>
          <div className="special-title">Jester</div>
        </div>

        <CardIndex rank="J" symbol="☻" position="bottom-right" />
      </button>
    );
  }

  const isRedSuit = card.suit === "Hearts" || card.suit === "Diamonds";
  const suitSymbol = getSuitSymbol(card.suit);
  const rankLabel = getRankLabel(card.value);
  const rankName = getRankName(card.value);

  return (
    <button
      className={`playing-card standard-card card-button suit-${card.suit.toLowerCase()} ${
        isRedSuit ? "red-suit" : "black-suit"
      } ${dimmed ? "card-dimmed" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      <CardIndex rank={rankLabel} symbol={suitSymbol} position="top-left" />

      <div className="standard-card-center">
        <div className="card-suit-large">{suitSymbol}</div>
        <div className="card-value">{rankName}</div>
      </div>

      <CardIndex rank={rankLabel} symbol={suitSymbol} position="bottom-right" />
    </button>
  );
}

export default Card;
