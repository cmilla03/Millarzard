const SUITS = ["Hearts", "Spades", "Diamonds", "Clubs"];

function getDeckSize(playerCount) {
  if (playerCount <= 6) {
    return 60;
  }

  return 120;
}

function getMaxRounds(deckSize, playerCount) {
  return Math.floor(deckSize / playerCount);
}

function getGameSetup(playerCount) {
  const deckSize = getDeckSize(playerCount);
  const maxRounds = getMaxRounds(deckSize, playerCount);

  return {
    playerCount,
    deckSize,
    maxRounds,
    deckDescription:
      deckSize === 60
        ? "Standard 60-card deck"
        : "Expanded 120-card deck"
  };
}

function createDeck(playerCount) {
  const deckSize = getDeckSize(playerCount);
  const copies = deckSize === 60 ? 1 : 2;
  const specialCount = deckSize === 60 ? 4 : 8;
  const deck = [];

  for (let copy = 1; copy <= copies; copy++) {
    for (const suit of SUITS) {
      for (let value = 1; value <= 13; value++) {
        deck.push({
          id: `${suit.toLowerCase()}-${value}-copy-${copy}`,
          type: "number",
          suit,
          value
        });
      }
    }
  }

  for (let i = 1; i <= specialCount; i++) {
    deck.push({
      id: `wizard-${i}`,
      type: "wizard",
      suit: null,
      value: null
    });

    deck.push({
      id: `jester-${i}`,
      type: "jester",
      suit: null,
      value: null
    });
  }

  return deck;
}

function shuffleDeck(deck) {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[randomIndex];
    shuffled[randomIndex] = temp;
  }

  return shuffled;
}

function dealCards(deck, players, roundNumber) {
  const newDeck = [...deck];

  for (const player of players) {
    player.hand = [];
  }

  for (let cardNumber = 0; cardNumber < roundNumber; cardNumber++) {
    for (const player of players) {
      const card = newDeck.shift();
      player.hand.push(card);
    }
  }

  return newDeck;
}

function flipTrumpCard(deck) {
  if (deck.length === 0) {
    return {
      remainingDeck: deck,
      trumpCard: null,
      trumpSuit: null,
      needsDealerChoice: false
    };
  }

  const remainingDeck = [...deck];
  const trumpCard = remainingDeck.shift();

  if (trumpCard.type === "number") {
    return {
      remainingDeck,
      trumpCard,
      trumpSuit: trumpCard.suit,
      needsDealerChoice: false
    };
  }

  if (trumpCard.type === "jester") {
    return {
      remainingDeck,
      trumpCard,
      trumpSuit: null,
      needsDealerChoice: false
    };
  }

  return {
    remainingDeck,
    trumpCard,
    trumpSuit: null,
    needsDealerChoice: true
  };
}

function cardToText(card) {
  if (!card) {
    return "No card";
  }

  if (card.type === "wizard") {
    return "Wizard";
  }

  if (card.type === "jester") {
    return "Jester";
  }

  return `${card.suit} ${card.value}`;
}

function scoreRound(room) {
  const roundResults = [];

  for (const player of room.players) {
    const bid = player.bid;
    const tricksWon = player.tricksWon;
    const difference = Math.abs(bid - tricksWon);

    let roundScore = 0;

    if (bid === tricksWon) {
      roundScore = 20 + 10 * tricksWon;
    } else {
      roundScore = -10 * difference;
    }

    player.roundScore = roundScore;
    player.totalScore += roundScore;

    roundResults.push({
      playerId: player.id,
      playerName: player.name,
      bid,
      tricksWon,
      roundScore,
      totalScore: player.totalScore
    });
  }

  room.roundHistory.push({
    roundNumber: room.roundNumber,
    results: roundResults
  });

  return roundResults;
}

function startRound(room, roundNumber) {
  const playerCount = room.players.length;

  room.phase = "BIDDING";
  room.roundNumber = roundNumber;

  if (!room.deckSize) {
    room.deckSize = getDeckSize(playerCount);
  }

  if (!room.maxRounds) {
    room.maxRounds = getMaxRounds(room.deckSize, playerCount);
  }

  room.leaderIndex = (room.dealerIndex + 1) % playerCount;
  room.currentTurnIndex = room.leaderIndex;
  room.currentTrick = [];
  room.lastTrick = null;

  for (const player of room.players) {
    player.hand = [];
    player.bid = null;
    player.tricksWon = 0;
    player.roundScore = 0;
    player.totalScore = player.totalScore || 0;
  }

  const deck = shuffleDeck(createDeck(playerCount));
  const deckAfterDeal = dealCards(deck, room.players, room.roundNumber);
  const trumpResult = flipTrumpCard(deckAfterDeal);

  room.deck = trumpResult.remainingDeck;
  room.trumpCard = trumpResult.trumpCard;
  room.trumpSuit = trumpResult.trumpSuit;
  room.needsDealerChoice = trumpResult.needsDealerChoice;

  if (room.needsDealerChoice) {
    room.phase = "TRUMP_SELECT";
  }

  return room;
}

function startFirstRound(room) {
  const playerCount = room.players.length;
  const setup = getGameSetup(playerCount);

  room.startingPlayerCount = setup.playerCount;
  room.deckSize = setup.deckSize;
  room.maxRounds = setup.maxRounds;
  room.deckDescription = setup.deckDescription;
  room.dealerIndex = 0;
  room.roundHistory = [];

  return startRound(room, 1);
}

function startNextRound(room) {
  const playerCount = room.players.length;

  room.dealerIndex = (room.dealerIndex + 1) % playerCount;

  return startRound(room, room.roundNumber + 1);
}

function getLedSuit(currentTrick) {
  const firstNumberCardPlay = currentTrick.find((play) => play.card.type === "number");

  if (!firstNumberCardPlay) {
    return null;
  }

  return firstNumberCardPlay.card.suit;
}

function playerHasSuit(player, suit) {
  if (!suit) {
    return false;
  }

  return player.hand.some((card) => card.type === "number" && card.suit === suit);
}

function isLegalPlay(player, card, currentTrick) {
  if (!card) {
    return {
      legal: false,
      error: "Card not found."
    };
  }

  if (card.type === "wizard" || card.type === "jester") {
    return {
      legal: true
    };
  }

  const ledSuit = getLedSuit(currentTrick);

  if (!ledSuit) {
    return {
      legal: true
    };
  }

  if (card.suit === ledSuit) {
    return {
      legal: true
    };
  }

  if (playerHasSuit(player, ledSuit)) {
    return {
      legal: false,
      error: `You must follow ${ledSuit} if you can.`
    };
  }

  return {
    legal: true
  };
}

function removeCardFromHand(player, cardId) {
  const cardIndex = player.hand.findIndex((card) => card.id === cardId);

  if (cardIndex === -1) {
    return null;
  }

  const [card] = player.hand.splice(cardIndex, 1);
  return card;
}

function determineTrickWinner(currentTrick, trumpSuit) {
  const firstWizardPlay = currentTrick.find((play) => play.card.type === "wizard");

  if (firstWizardPlay) {
    return firstWizardPlay;
  }

  const trumpPlays = currentTrick.filter(
    (play) => play.card.type === "number" && play.card.suit === trumpSuit
  );

  if (trumpPlays.length > 0) {
    let winningPlay = trumpPlays[0];

    for (const play of trumpPlays) {
      if (play.card.value > winningPlay.card.value) {
        winningPlay = play;
      }
    }

    return winningPlay;
  }

  const ledSuit = getLedSuit(currentTrick);

  if (ledSuit) {
    const ledSuitPlays = currentTrick.filter(
      (play) => play.card.type === "number" && play.card.suit === ledSuit
    );

    let winningPlay = ledSuitPlays[0];

    for (const play of ledSuitPlays) {
      if (play.card.value > winningPlay.card.value) {
        winningPlay = play;
      }
    }

    return winningPlay;
  }

  return currentTrick[0];
}

function getPlayerIndexById(players, playerId) {
  return players.findIndex((player) => player.id === playerId);
}

export {
  SUITS,
  createDeck,
  shuffleDeck,
  dealCards,
  flipTrumpCard,
  cardToText,
  getDeckSize,
  getMaxRounds,
  getGameSetup,
  startFirstRound,
  startNextRound,
  scoreRound,
  getLedSuit,
  playerHasSuit,
  isLegalPlay,
  removeCardFromHand,
  determineTrickWinner,
  getPlayerIndexById
};
