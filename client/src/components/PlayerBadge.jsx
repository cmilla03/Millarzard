import React from "react";
import AvatarDisplay from "./AvatarDisplay";

function getInitials(name) {
  if (!name) {
    return "?";
  }

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function BidTrickMarkers({ bid, tricksWon }) {
  if (bid === null || bid === undefined) {
    return (
      <div className="cm-marker-row cm-marker-empty">
        <span className="cm-no-bid">No bid</span>
      </div>
    );
  }

  if (bid === 0) {
    return (
      <div className="cm-marker-row">
        <span className={`cm-zero-bid ${tricksWon === 0 ? "cm-zero-good" : "cm-zero-missed"}`}>
          0
        </span>
      </div>
    );
  }

  const markers = [];

  for (let index = 0; index < bid; index++) {
    markers.push(
      <span
        key={index}
        className={`cm-trick-marker ${index < tricksWon ? "cm-trick-lit" : ""}`}
      />
    );
  }

  return <div className="cm-marker-row">{markers}</div>;
}

function PlayerBadge({ player, isYou, isDealer, isActive, positionClass }) {
  const cardCount = player.cardsLeft ?? "?";

  return (
    <div className={`cm-player ${positionClass} ${isActive ? "cm-player-active" : ""} ${isYou ? "cm-player-you" : ""}`}>
      <div className="cm-avatar-wrap">
        <AvatarDisplay avatar={player.avatar} size="small" />
        {isDealer && <span className="cm-dealer-dot">D</span>}
      </div>

      <div className="cm-nameplate">
        <div className="cm-name-row">
          <strong>{player.name}</strong>
          <span>{player.totalScore}</span>
        </div>

        <BidTrickMarkers bid={player.bid} tricksWon={player.tricksWon} />

        <div className="cm-card-count-line">
          {cardCount} card{cardCount === 1 ? "" : "s"}
        </div>
      </div>
    </div>
  );
}

export default PlayerBadge;
