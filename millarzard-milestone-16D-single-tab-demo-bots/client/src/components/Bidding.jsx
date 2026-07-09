import React from "react";

function Bidding({ roundNumber, yourBid, onSubmitBid }) {
  const bidOptions = [];

  for (let bid = 0; bid <= roundNumber; bid++) {
    bidOptions.push(bid);
  }

  if (yourBid !== null && yourBid !== undefined) {
    return (
      <section className="section-box bidding-box">
        <h2>Your Bid</h2>
        <p className="submitted-bid">You bid {yourBid}.</p>
        <p className="hint">Waiting for the other players to finish bidding.</p>
      </section>
    );
  }

  return (
    <section className="section-box bidding-box">
      <h2>Make Your Bid</h2>
      <p>
        Round {roundNumber}: how many tricks do you think you will win?
      </p>

      <div className="bid-button-row">
        {bidOptions.map((bid) => (
          <button
            key={bid}
            className="bid-button"
            onClick={() => onSubmitBid(bid)}
          >
            {bid}
          </button>
        ))}
      </div>
    </section>
  );
}

export default Bidding;
