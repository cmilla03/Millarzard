import React from "react";

function TurnBanner({ room, yourPlayerId }) {
  const currentPlayer = room.players[room.currentTurnIndex];
  const dealer = room.players[room.dealerIndex];
  const youAreCurrentPlayer = currentPlayer?.id === yourPlayerId;
  const youAreDealer = dealer?.id === yourPlayerId;
  const yourPlayer = room.players.find((player) => player.id === yourPlayerId);

  let title = "";
  let subtitle = "";

  if (room.phase === "TRUMP_SELECT") {
    title = youAreDealer ? "Choose Trump" : `Waiting for ${dealer?.name || "the dealer"}`;
    subtitle = "A Wizard was flipped, so the dealer chooses trump.";
  } else if (room.phase === "BIDDING") {
    title = yourPlayer?.bid == null ? "Make Your Bid" : "Bid Submitted";
    subtitle = yourPlayer?.bid == null
      ? "Choose how many tricks you think you will win."
      : "Waiting for everyone else to bid.";
  } else if (room.phase === "PLAYING") {
    title = youAreCurrentPlayer ? "YOUR TURN" : `Waiting for ${currentPlayer?.name || "next player"}`;
    subtitle = youAreCurrentPlayer ? "Click one card from your hand." : "The active player has a glowing seat.";
  } else if (room.phase === "TRICK_COMPLETE") {
    title = `${room.lastTrick?.winnerName || "Someone"} won the trick`;
    subtitle = "Continue to the next trick or finish the round.";
  } else if (room.phase === "ROUND_COMPLETE") {
    title = `Round ${room.roundNumber} Complete`;
    subtitle = "Scores have been updated.";
  } else if (room.phase === "GAME_OVER") {
    title = "Game Over";
    subtitle = "Final rankings are ready.";
  } else {
    title = room.phase;
    subtitle = "Game in progress.";
  }

  return (
    <section className={`turn-banner ${youAreCurrentPlayer && room.phase === "PLAYING" ? "your-turn-banner" : ""}`}>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </section>
  );
}

export default TurnBanner;
