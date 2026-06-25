import React from "react";
import Card from "./Card";
import Hand from "./Hand";
import Bidding from "./Bidding";
import TrickResult from "./TrickResult";
import RoundComplete from "./RoundComplete";
import GameOver from "./GameOver";
import TrumpSelect from "./TrumpSelect";
import PlayerBadge from "./PlayerBadge";
import ScorePanel from "./ScorePanel";

function getCurrentPlayer(players, yourPlayerId) {
  return players.find((player) => player.id === yourPlayerId);
}

function getPhaseLabel(phase) {
  if (phase === "TRUMP_SELECT") {
    return "Choose Trump";
  }

  if (phase === "BIDDING") {
    return "Bidding";
  }

  if (phase === "PLAYING") {
    return "Playing";
  }

  if (phase === "TRICK_COMPLETE") {
    return "Trick Complete";
  }

  if (phase === "ROUND_COMPLETE") {
    return "Round Complete";
  }

  if (phase === "GAME_OVER") {
    return "Game Over";
  }

  return phase;
}

function getTurnMessage(room, yourPlayerId) {
  const currentPlayer = room.players[room.currentTurnIndex];
  const dealer = room.players[room.dealerIndex];
  const yourPlayer = room.players.find((player) => player.id === yourPlayerId);

  if (room.phase === "TRUMP_SELECT") {
    return dealer?.id === yourPlayerId
      ? "Choose the trump suit"
      : `Waiting for ${dealer?.name || "dealer"} to choose trump`;
  }

  if (room.phase === "BIDDING") {
    return yourPlayer?.bid == null
      ? "Choose your bid"
      : "Waiting for bids";
  }

  if (room.phase === "PLAYING") {
    return currentPlayer?.id === yourPlayerId
      ? "Your turn — play a card"
      : `Waiting for ${currentPlayer?.name || "next player"}`;
  }

  if (room.phase === "TRICK_COMPLETE") {
    return `${room.lastTrick?.winnerName || "Player"} won the trick`;
  }

  if (room.phase === "ROUND_COMPLETE") {
    return "Round scored";
  }

  if (room.phase === "GAME_OVER") {
    return "Final scores";
  }

  return "Game in progress";
}

function getSeatPosition(index, total, isYou) {
  if (isYou) {
    return "cm-seat-bottom";
  }

  const otherPlayers = Math.max(total - 1, 1);
  const slot = index % otherPlayers;

  if (otherPlayers === 1) {
    return "cm-seat-top";
  }

  if (otherPlayers === 2) {
    return slot === 0 ? "cm-seat-left" : "cm-seat-right";
  }

  if (otherPlayers === 3) {
    return ["cm-seat-left", "cm-seat-top", "cm-seat-right"][slot];
  }

  if (otherPlayers === 4) {
    return ["cm-seat-left-top", "cm-seat-top-left", "cm-seat-top-right", "cm-seat-right-top"][slot];
  }

  if (otherPlayers === 5) {
    return ["cm-seat-left-top", "cm-seat-left", "cm-seat-top", "cm-seat-right", "cm-seat-right-top"][slot];
  }

  if (otherPlayers === 6) {
    return ["cm-seat-left-top", "cm-seat-left", "cm-seat-top-left", "cm-seat-top-right", "cm-seat-right", "cm-seat-right-top"][slot];
  }

  if (otherPlayers === 7) {
    return ["cm-seat-left-top", "cm-seat-left", "cm-seat-left-bottom", "cm-seat-top", "cm-seat-right-bottom", "cm-seat-right", "cm-seat-right-top"][slot];
  }

  return [
    "cm-seat-left-top",
    "cm-seat-left",
    "cm-seat-left-bottom",
    "cm-seat-top-left",
    "cm-seat-top",
    "cm-seat-top-right",
    "cm-seat-right-bottom",
    "cm-seat-right",
    "cm-seat-right-top",
    "cm-seat-far-left",
    "cm-seat-far-right"
  ][slot] || "cm-seat-top";
}

function orderPlayersForTable(players, yourPlayerId) {
  const you = players.find((player) => player.id === yourPlayerId);
  const others = players.filter((player) => player.id !== yourPlayerId);

  return {
    you,
    others
  };
}

function getLedSuit(currentTrick) {
  const firstNumberCardPlay = currentTrick.find((play) => play.card.type === "number");
  return firstNumberCardPlay ? firstNumberCardPlay.card.suit : null;
}

function getPlayableCardIds(hand, currentTrick) {
  const ledSuit = getLedSuit(currentTrick);

  if (!ledSuit) {
    return hand.map((card) => card.id);
  }

  const hasLedSuit = hand.some((card) => card.type === "number" && card.suit === ledSuit);

  return hand
    .filter((card) => {
      if (card.type === "wizard" || card.type === "jester") {
        return true;
      }

      if (!hasLedSuit) {
        return true;
      }

      return card.suit === ledSuit;
    })
    .map((card) => card.id);
}

function GameTable({
  room,
  yourPlayerId,
  yourHand,
  errorMessage,
  onChooseTrump,
  onSubmitBid,
  onPlayCard,
  onContinueAfterTrick,
  onNextRound,
  onRestartGame
}) {
  const currentPlayer = getCurrentPlayer(room.players, yourPlayerId);
  const isYourTurn = room.players[room.currentTurnIndex]?.id === yourPlayerId;
  const trickComplete = room.currentTrick.length === room.players.length;
  const playableCardIds = getPlayableCardIds(yourHand, room.currentTrick);
  const { you, others } = orderPlayersForTable(room.players, yourPlayerId);

  const playersWithCounts = room.players.map((player) => ({
    ...player,
    cardsLeft: player.id === yourPlayerId ? yourHand.length : player.cardsLeft
  }));

  const youWithCount = playersWithCounts.find((player) => player.id === yourPlayerId);
  const othersWithCounts = playersWithCounts.filter((player) => player.id !== yourPlayerId);

  return (
    <section className="cm-game">
      <header className="cm-topbar">
        <div>
          <strong>Wizard Table</strong>
          <span>Room {room.roomCode}</span>
        </div>

        <div className="cm-turn-status">
          {getTurnMessage(room, yourPlayerId)}
        </div>

        <div>
          <strong>Round {room.roundNumber || "-"} / {room.maxRounds || "-"}</strong>
          <span>{getPhaseLabel(room.phase)}</span>
        </div>
      </header>

      {errorMessage && <p className="cm-error">{errorMessage}</p>}

      <main className="cm-felt-table">
        <div className="cm-table-shade top-shade" />
        <div className="cm-table-shade bottom-shade" />

        {othersWithCounts.map((player, index) => (
          <PlayerBadge
            key={player.id}
            player={player}
            isYou={false}
            isDealer={room.players[room.dealerIndex]?.id === player.id}
            isActive={room.players[room.currentTurnIndex]?.id === player.id && room.phase === "PLAYING"}
            positionClass={getSeatPosition(index, room.players.length, false)}
          />
        ))}

        {youWithCount && (
          <PlayerBadge
            player={youWithCount}
            isYou={true}
            isDealer={room.players[room.dealerIndex]?.id === youWithCount.id}
            isActive={room.players[room.currentTurnIndex]?.id === youWithCount.id && room.phase === "PLAYING"}
            positionClass="cm-seat-bottom"
          />
        )}

<section className="cm-center-pile">
  <div className="cm-trump-center-card">
    <span className="cm-center-label">Trump</span>
    <Card card={room.trumpCard} disabled={true} />
    <strong>{room.trumpSuit || (room.needsDealerChoice ? "Choose" : "None")}</strong>
  </div>
  {room.currentTrick.map((play, index) => (
    <div
      className={`cm-played-card cm-played-${index}`}
      key={`${play.playerId}-${play.card.id}`}
    >
      <span>{play.playerName}</span>
      <Card card={play.card} disabled={true} />
    </div>
  ))}
</section>

        <div className="cm-actions">
          {room.phase === "TRUMP_SELECT" && (
            <TrumpSelect
              room={room}
              yourPlayerId={yourPlayerId}
              onChooseTrump={onChooseTrump}
            />
          )}

          {room.phase === "BIDDING" && (
            <Bidding
              roundNumber={room.roundNumber}
              yourBid={currentPlayer?.bid}
              onSubmitBid={onSubmitBid}
            />
          )}

          {room.phase === "TRICK_COMPLETE" && (
            <TrickResult
              lastTrick={room.lastTrick}
              onContinueAfterTrick={onContinueAfterTrick}
            />
          )}

          {room.phase === "ROUND_COMPLETE" && (
            <RoundComplete
              room={room}
              yourPlayerId={yourPlayerId}
              onNextRound={onNextRound}
            />
          )}

          {room.phase === "GAME_OVER" && (
            <GameOver
              room={room}
              yourPlayerId={yourPlayerId}
              onRestartGame={onRestartGame}
            />
          )}
        </div>

        <ScorePanel room={room} yourPlayerId={yourPlayerId} />
      </main>

      <footer className="cm-hand-dock">
        <Hand
          cards={yourHand}
          isYourTurn={room.phase === "PLAYING" && isYourTurn && !trickComplete}
          playableCardIds={playableCardIds}
          onPlayCard={onPlayCard}
        />
      </footer>
    </section>
  );
}

export default GameTable;
