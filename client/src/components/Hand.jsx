import React from "react";
import Card from "./Card";

function Hand({ cards, isYourTurn, playableCardIds, onPlayCard }) {
  const playableSet = new Set(playableCardIds || []);

  return (
    <section className={`cm-hand ${isYourTurn ? "cm-hand-active" : ""}`}>
      <div className="cm-hand-row" aria-label="Your cards">
        {cards.map((card) => {
          const isPlayable = playableSet.has(card.id);
          const shouldDim = isYourTurn && !isPlayable;
          const shouldDisable = !isYourTurn || !isPlayable;

          return (
            <Card
              key={card.id}
              card={card}
              onClick={() => onPlayCard(card.id)}
              disabled={shouldDisable}
              dimmed={shouldDim}
            />
          );
        })}
      </div>
    </section>
  );
}

export default Hand;
