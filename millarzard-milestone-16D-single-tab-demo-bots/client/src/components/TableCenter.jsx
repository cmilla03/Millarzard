import React from "react";
import Card from "./Card";

function getTrumpText(room) {
  if (room.needsDealerChoice) {
    return "Dealer choosing trump";
  }

  if (room.trumpSuit) {
    return `${room.trumpSuit} trump`;
  }

  return "No trump";
}

function TableCenter({ room }) {
  return (
    <div className="table-center">
      <div className="center-top-info">
        <div>
          <span className="label">Trump</span>
          <strong>{getTrumpText(room)}</strong>
        </div>

        <div>
          <span className="label">Phase</span>
          <strong>{room.phase.replace("_", " ")}</strong>
        </div>
      </div>

      <div className="center-card-zones">
        <div className="trump-mini-zone">
          <p>Trump Card</p>
          <Card card={room.trumpCard} disabled={true} />
        </div>

        <div className="played-card-zone">
          <p>Current Trick</p>

          {room.currentTrick.length === 0 ? (
            <div className="empty-trick-message">Cards will appear here</div>
          ) : (
            <div className="center-trick-cards">
              {room.currentTrick.map((play) => (
                <div className="center-play-card" key={`${play.playerId}-${play.card.id}`}>
                  <span>{play.playerName}</span>
                  <Card card={play.card} disabled={true} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TableCenter;
