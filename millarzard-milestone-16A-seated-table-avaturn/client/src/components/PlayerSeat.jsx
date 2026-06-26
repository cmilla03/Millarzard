import React from "react";

function PlayerSeat({ player, isYou, isDealer, isCurrentTurn, seatStyle }) {
  const cardCount = player.cardCount ?? "?";

  return (
    <div
      className={`player-seat ${isCurrentTurn ? "active-seat" : ""} ${isYou ? "your-seat" : ""}`}
      style={seatStyle}
    >
      <div className="seat-name-row">
        <strong>{player.name}</strong>
        {isYou && <span className="seat-badge you-seat-badge">You</span>}
        {isDealer && <span className="seat-badge dealer-seat-badge">Dealer</span>}
      </div>

      <div className="seat-stats">
        <span>Bid: {player.bid ?? "-"}</span>
        <span>Tricks: {player.tricksWon}</span>
        <span>Score: {player.totalScore}</span>
      </div>

      <div className="seat-card-count">
        {cardCount} card{cardCount === 1 ? "" : "s"}
      </div>
    </div>
  );
}

export default PlayerSeat;
