import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import {
  createRoom,
  getRoom,
  addPlayerToRoom,
  removePlayer,
  publicRoomState,
  privateRoomStateForPlayer
} from "./rooms.js";

import {
  startFirstRound,
  startNextRound,
  scoreRound,
  isLegalPlay,
  removeCardFromHand,
  determineTrickWinner,
  getPlayerIndexById
} from "./gameLogic.js";

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
  ...(process.env.CLIENT_URLS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins
}));
app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

const BOT_NAMES = [
  "Maple Bot",
  "Sunny Bot",
  "Oak Bot",
  "Pine Bot",
  "River Bot",
  "Moon Bot",
  "Fox Bot",
  "Cedar Bot",
  "Star Bot",
  "Bear Bot",
  "Raven Bot"
];

const BOT_AVATARS = ["🦊", "🐻", "🦉", "🐸", "🦁", "🐼", "🦄", "🐺", "🐯", "🐵", "🧙"];

const SUIT_CHOICES = ["hearts", "spades", "diamonds", "clubs"];

app.get("/", (req, res) => {
  res.send("MillarZard server is running.");
});

function isBot(player) {
  return Boolean(player?.isBot) || String(player?.id || "").startsWith("bot-");
}

function isDemoClient(socket) {
  const origin = socket.handshake.headers.origin || "";

  return (
    origin.includes("localhost") ||
    origin.includes("127.0.0.1") ||
    origin.includes("demomillarzard") ||
    origin === process.env.DEMO_CLIENT_URL
  );
}

function getRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function createBotPlayer(room) {
  const usedNames = new Set(room.players.map((player) => player.name));
  const botNumber = room.players.filter(isBot).length + 1;

  let name = BOT_NAMES[(botNumber - 1) % BOT_NAMES.length];

  if (usedNames.has(name)) {
    name = `Demo Bot ${botNumber}`;
  }

  return {
    id: `bot-${room.roomCode}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name,
    avatar: BOT_AVATARS[(botNumber - 1) % BOT_AVATARS.length],
    isHost: false,
    isBot: true,
    connected: true,
    hand: [],
    bid: null,
    tricksWon: 0,
    roundScore: 0,
    totalScore: 0
  };
}

function addDemoBots(room, count) {
  if (!room || room.phase !== "LOBBY") {
    return { error: "Demo bots can only be added in the lobby." };
  }

  let added = 0;

  while (added < count && room.players.length < 12) {
    room.players.push(createBotPlayer(room));
    added += 1;
  }

  return { room, added };
}

function fillDemoBots(room, targetPlayerCount) {
  if (!room || room.phase !== "LOBBY") {
    return { error: "Demo bots can only be added in the lobby." };
  }

  const safeTarget = Math.max(3, Math.min(12, Number(targetPlayerCount) || 3));
  const needed = Math.max(0, safeTarget - room.players.length);

  return addDemoBots(room, needed);
}

function removeDemoBots(room) {
  if (!room || room.phase !== "LOBBY") {
    return { error: "Demo bots can only be removed in the lobby." };
  }

  room.players = room.players.filter((player) => !isBot(player));

  if (!room.players.some((player) => player.id === room.hostId)) {
    room.hostId = room.players[0]?.id || null;
  }

  return { room };
}

function emitLobbyState(room) {
  io.to(room.roomCode).emit("roomUpdated", publicRoomState(room));
}

function emitPrivateGameState(room) {
  for (const player of room.players) {
    if (!isBot(player)) {
      io.to(player.id).emit("gameUpdated", privateRoomStateForPlayer(room, player.id));
    }
  }

  scheduleBotAction(room);
}

function finishPlayedCard(room, playerIndex, playedCard) {
  const player = room.players[playerIndex];

  room.currentTrick.push({
    playerId: player.id,
    playerName: player.name,
    card: playedCard
  });

  if (room.currentTrick.length < room.players.length) {
    room.currentTurnIndex = (room.currentTurnIndex + 1) % room.players.length;
    return;
  }

  const winningPlay = determineTrickWinner(room.currentTrick, room.trumpSuit);
  const winnerIndex = getPlayerIndexById(room.players, winningPlay.playerId);
  const winner = room.players[winnerIndex];

  winner.tricksWon += 1;

  room.lastTrick = {
    plays: room.currentTrick,
    winnerId: winner.id,
    winnerName: winner.name,
    winningCard: winningPlay.card
  };

  room.currentTurnIndex = winnerIndex;
  room.leaderIndex = winnerIndex;
  room.phase = "TRICK_COMPLETE";
}

function getLegalBotCards(botPlayer, room) {
  return botPlayer.hand.filter((card) => isLegalPlay(botPlayer, card, room.currentTrick).legal);
}

function processOneBotAction(room) {
  if (!room || room.phase === "LOBBY" || room.phase === "GAME_OVER") {
    return false;
  }

  if (room.phase === "TRUMP_SELECT") {
    const dealer = room.players[room.dealerIndex];

    if (!isBot(dealer)) {
      return false;
    }

    room.trumpSuit = getRandomItem(SUIT_CHOICES[0] ? ["Hearts", "Spades", "Diamonds", "Clubs"] : ["Hearts"]);
    room.needsDealerChoice = false;
    room.phase = "BIDDING";
    return true;
  }

  if (room.phase === "BIDDING") {
    const botNeedingBid = room.players.find((player) => isBot(player) && player.bid === null);

    if (!botNeedingBid) {
      return false;
    }

    botNeedingBid.bid = Math.floor(Math.random() * (room.roundNumber + 1));

    const allPlayersHaveBid = room.players.every((player) => player.bid !== null);

    if (allPlayersHaveBid) {
      room.phase = "PLAYING";
    }

    return true;
  }

  if (room.phase === "PLAYING") {
    const playerIndex = room.currentTurnIndex;
    const player = room.players[playerIndex];

    if (!isBot(player)) {
      return false;
    }

    const legalCards = getLegalBotCards(player, room);
    const cardToPlay = legalCards.length > 0 ? getRandomItem(legalCards) : player.hand[0];

    if (!cardToPlay) {
      return false;
    }

    const playedCard = removeCardFromHand(player, cardToPlay.id);
    finishPlayedCard(room, playerIndex, playedCard);
    return true;
  }

  return false;
}

function scheduleBotAction(room) {
  if (!room || room.botActionTimer) {
    return;
  }

  const hasBots = room.players.some(isBot);

  if (!hasBots) {
    return;
  }

  const needsBotAction =
    (room.phase === "TRUMP_SELECT" && isBot(room.players[room.dealerIndex])) ||
    (room.phase === "BIDDING" && room.players.some((player) => isBot(player) && player.bid === null)) ||
    (room.phase === "PLAYING" && isBot(room.players[room.currentTurnIndex]));

  if (!needsBotAction) {
    return;
  }

  room.botActionTimer = setTimeout(() => {
    room.botActionTimer = null;

    const changed = processOneBotAction(room);

    if (changed) {
      emitPrivateGameState(room);
    }
  }, 650);
}

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("createRoom", ({ playerName, playerAvatar }) => {
    const cleanedName = playerName?.trim();

    if (!cleanedName) {
      socket.emit("errorMessage", "Please enter a name.");
      return;
    }

    const room = createRoom(socket.id, cleanedName, playerAvatar || "🧙");
    socket.join(room.roomCode);

    socket.emit("roomJoined", {
      room: publicRoomState(room),
      yourPlayerId: socket.id
    });

    emitLobbyState(room);
  });

  socket.on("joinRoom", ({ roomCode, playerName, playerAvatar }) => {
    const cleanedRoomCode = roomCode?.trim().toUpperCase();

    if (!cleanedRoomCode) {
      socket.emit("errorMessage", "Please enter a room code.");
      return;
    }

    const result = addPlayerToRoom(cleanedRoomCode, socket.id, playerName || "", playerAvatar || "🙂");

    if (result.error) {
      socket.emit("errorMessage", result.error);
      return;
    }

    socket.join(cleanedRoomCode);

    socket.emit("roomJoined", {
      room: publicRoomState(result.room),
      yourPlayerId: socket.id
    });

    emitLobbyState(result.room);
  });

  socket.on("addDemoBots", ({ roomCode, count = 1, targetPlayerCount = null }) => {
    if (!isDemoClient(socket)) {
      socket.emit("errorMessage", "Demo bots are only available on the demo site.");
      return;
    }

    const cleanedRoomCode = roomCode?.trim().toUpperCase();
    const room = getRoom(cleanedRoomCode);

    if (!room) {
      socket.emit("errorMessage", "Room not found.");
      return;
    }

    if (socket.id !== room.hostId) {
      socket.emit("errorMessage", "Only the host can add demo bots.");
      return;
    }

    const result = targetPlayerCount
      ? fillDemoBots(room, targetPlayerCount)
      : addDemoBots(room, Math.max(1, Math.min(11, Number(count) || 1)));

    if (result.error) {
      socket.emit("errorMessage", result.error);
      return;
    }

    emitLobbyState(room);
  });

  socket.on("removeDemoBots", ({ roomCode }) => {
    if (!isDemoClient(socket)) {
      socket.emit("errorMessage", "Demo bots are only available on the demo site.");
      return;
    }

    const cleanedRoomCode = roomCode?.trim().toUpperCase();
    const room = getRoom(cleanedRoomCode);

    if (!room) {
      socket.emit("errorMessage", "Room not found.");
      return;
    }

    if (socket.id !== room.hostId) {
      socket.emit("errorMessage", "Only the host can remove demo bots.");
      return;
    }

    const result = removeDemoBots(room);

    if (result.error) {
      socket.emit("errorMessage", result.error);
      return;
    }

    emitLobbyState(room);
  });

  socket.on("startGame", ({ roomCode }) => {
    const cleanedRoomCode = roomCode?.trim().toUpperCase();
    const room = getRoom(cleanedRoomCode);

    if (!room) {
      socket.emit("errorMessage", "Room not found.");
      return;
    }

    if (socket.id !== room.hostId) {
      socket.emit("errorMessage", "Only the host can start the game.");
      return;
    }

    if (room.players.length < 3) {
      socket.emit("errorMessage", "You need at least 3 players to start.");
      return;
    }

    if (room.players.length > 12) {
      socket.emit("errorMessage", "The maximum is 12 players.");
      return;
    }

    startFirstRound(room);
    emitPrivateGameState(room);
  });

  socket.on("chooseTrump", ({ roomCode, trumpSuit }) => {
    const cleanedRoomCode = roomCode?.trim().toUpperCase();
    const room = getRoom(cleanedRoomCode);

    if (!room) {
      socket.emit("errorMessage", "Room not found.");
      return;
    }

    if (room.phase !== "TRUMP_SELECT") {
      socket.emit("errorMessage", "It is not time to choose trump.");
      return;
    }

    const dealer = room.players[room.dealerIndex];

    if (!dealer || socket.id !== dealer.id) {
      socket.emit("errorMessage", "Only the dealer can choose trump.");
      return;
    }

    const suitMap = {
      hearts: "Hearts",
      spades: "Spades",
      diamonds: "Diamonds",
      clubs: "Clubs"
    };

    const normalizedSuit = suitMap[String(trumpSuit || "").trim().toLowerCase()];

    if (!normalizedSuit) {
      socket.emit("errorMessage", "Please choose Hearts, Spades, Diamonds, or Clubs.");
      return;
    }

    room.trumpSuit = normalizedSuit;
    room.needsDealerChoice = false;
    room.phase = "BIDDING";

    emitPrivateGameState(room);
  });

  socket.on("submitBid", ({ roomCode, bid }) => {
    const cleanedRoomCode = roomCode?.trim().toUpperCase();
    const room = getRoom(cleanedRoomCode);

    if (!room) {
      socket.emit("errorMessage", "Room not found.");
      return;
    }

    if (room.phase !== "BIDDING") {
      socket.emit("errorMessage", "It is not the bidding phase.");
      return;
    }

    const player = room.players.find((player) => player.id === socket.id);

    if (!player) {
      socket.emit("errorMessage", "You are not in this room.");
      return;
    }

    if (!Number.isInteger(bid) || bid < 0 || bid > room.roundNumber) {
      socket.emit("errorMessage", `Your bid must be between 0 and ${room.roundNumber}.`);
      return;
    }

    if (player.bid !== null) {
      socket.emit("errorMessage", "You already submitted a bid.");
      return;
    }

    player.bid = bid;

    const allPlayersHaveBid = room.players.every((player) => player.bid !== null);

    if (allPlayersHaveBid) {
      room.phase = "PLAYING";
    }

    emitPrivateGameState(room);
  });

  socket.on("playCard", ({ roomCode, cardId }) => {
    const cleanedRoomCode = roomCode?.trim().toUpperCase();
    const room = getRoom(cleanedRoomCode);

    if (!room) {
      socket.emit("errorMessage", "Room not found.");
      return;
    }

    if (room.phase !== "PLAYING") {
      socket.emit("errorMessage", "It is not the playing phase.");
      return;
    }

    const playerIndex = room.players.findIndex((player) => player.id === socket.id);

    if (playerIndex === -1) {
      socket.emit("errorMessage", "You are not in this room.");
      return;
    }

    if (playerIndex !== room.currentTurnIndex) {
      socket.emit("errorMessage", "It is not your turn.");
      return;
    }

    if (room.currentTrick.length >= room.players.length) {
      socket.emit("errorMessage", "This trick is already complete.");
      return;
    }

    const player = room.players[playerIndex];
    const card = player.hand.find((card) => card.id === cardId);

    const legalResult = isLegalPlay(player, card, room.currentTrick);

    if (!legalResult.legal) {
      socket.emit("errorMessage", legalResult.error);
      return;
    }

    const playedCard = removeCardFromHand(player, cardId);
    finishPlayedCard(room, playerIndex, playedCard);

    emitPrivateGameState(room);
  });

  socket.on("continueAfterTrick", ({ roomCode }) => {
    const cleanedRoomCode = roomCode?.trim().toUpperCase();
    const room = getRoom(cleanedRoomCode);

    if (!room) {
      socket.emit("errorMessage", "Room not found.");
      return;
    }

    if (room.phase !== "TRICK_COMPLETE") {
      socket.emit("errorMessage", "There is no completed trick to continue from.");
      return;
    }

    const allHandsEmpty = room.players.every((player) => player.hand.length === 0);

    room.currentTrick = [];

    if (allHandsEmpty) {
      scoreRound(room);

      if (room.roundNumber >= room.maxRounds) {
        room.phase = "GAME_OVER";
      } else {
        room.phase = "ROUND_COMPLETE";
      }
    } else {
      room.phase = "PLAYING";
    }

    emitPrivateGameState(room);
  });

  socket.on("nextRound", ({ roomCode }) => {
    const cleanedRoomCode = roomCode?.trim().toUpperCase();
    const room = getRoom(cleanedRoomCode);

    if (!room) {
      socket.emit("errorMessage", "Room not found.");
      return;
    }

    if (socket.id !== room.hostId) {
      socket.emit("errorMessage", "Only the host can start the next round.");
      return;
    }

    if (room.phase !== "ROUND_COMPLETE") {
      socket.emit("errorMessage", "The round is not complete yet.");
      return;
    }

    if (room.roundNumber >= room.maxRounds) {
      room.phase = "GAME_OVER";
      emitPrivateGameState(room);
      return;
    }

    startNextRound(room);
    emitPrivateGameState(room);
  });

  socket.on("restartGame", ({ roomCode }) => {
    const cleanedRoomCode = roomCode?.trim().toUpperCase();
    const room = getRoom(cleanedRoomCode);

    if (!room) {
      socket.emit("errorMessage", "Room not found.");
      return;
    }

    if (socket.id !== room.hostId) {
      socket.emit("errorMessage", "Only the host can restart the game.");
      return;
    }

    for (const player of room.players) {
      player.hand = [];
      player.bid = null;
      player.tricksWon = 0;
      player.roundScore = 0;
      player.totalScore = 0;
    }

    room.phase = "LOBBY";
    room.deck = [];
    room.discard = [];
    room.deckSize = null;
    room.roundNumber = 0;
    room.maxRounds = 0;
    room.dealerIndex = 0;
    room.leaderIndex = 0;
    room.currentTurnIndex = 0;
    room.trumpCard = null;
    room.trumpSuit = null;
    room.needsDealerChoice = false;
    room.currentTrick = [];
    room.lastTrick = null;
    room.roundHistory = [];

    emitLobbyState(room);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);

    const updatedRoom = removePlayer(socket.id);

    if (updatedRoom) {
      if (updatedRoom.phase === "LOBBY") {
        emitLobbyState(updatedRoom);
      } else {
        emitPrivateGameState(updatedRoom);
      }
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
