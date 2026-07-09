const rooms = new Map();

function generateRoomCode() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code = "";

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    code += letters[randomIndex];
  }

  if (rooms.has(code)) {
    return generateRoomCode();
  }

  return code;
}

function createRoom(hostSocketId, hostName, hostAvatar = "🧙") {
  const roomCode = generateRoomCode();

  const room = {
    roomCode,
    hostId: hostSocketId,
    phase: "LOBBY",
    players: [
      {
        id: hostSocketId,
        name: hostName,
        avatar: hostAvatar,
        isHost: true,
        isBot: false,
        connected: true,
        hand: [],
        bid: null,
        tricksWon: 0,
        roundScore: 0,
        totalScore: 0
      }
    ],
    deck: [],
    discard: [],
    startingPlayerCount: null,
    deckSize: null,
    deckDescription: null,
    roundNumber: 0,
    maxRounds: 0,
    dealerIndex: 0,
    leaderIndex: 0,
    currentTurnIndex: 0,
    trumpCard: null,
    trumpSuit: null,
    needsDealerChoice: false,
    currentTrick: [],
    lastTrick: null,
    roundHistory: []
  };

  rooms.set(roomCode, room);

  return room;
}

function getRoom(roomCode) {
  return rooms.get(roomCode);
}

function addPlayerToRoom(roomCode, socketId, playerName, playerAvatar = "🙂") {
  const room = getRoom(roomCode);

  if (!room) {
    return { error: "Room not found." };
  }

  if (room.phase !== "LOBBY") {
    return { error: "This game has already started." };
  }

  if (room.players.length >= 12) {
    return { error: "This room is full. The maximum is 12 players." };
  }

  const cleanedName = playerName.trim();

  if (!cleanedName) {
    return { error: "Please enter a name." };
  }

  const nameTaken = room.players.some(
    (player) => player.name.toLowerCase() === cleanedName.toLowerCase()
  );

  if (nameTaken) {
    return { error: "That name is already being used in this room." };
  }

  room.players.push({
    id: socketId,
    name: cleanedName,
    avatar: playerAvatar,
    isHost: false,
    isBot: false,
    connected: true,
    hand: [],
    bid: null,
    tricksWon: 0,
    roundScore: 0,
    totalScore: 0
  });

  return { room };
}

function removePlayer(socketId) {
  for (const room of rooms.values()) {
    const player = room.players.find((p) => p.id === socketId);

    if (!player) {
      continue;
    }

    room.players = room.players.filter((p) => p.id !== socketId);

    if (room.players.length === 0) {
      rooms.delete(room.roomCode);
      return null;
    }

    if (room.hostId === socketId) {
      room.hostId = room.players[0].id;
      room.players[0].isHost = true;
    }

    return room;
  }

  return null;
}

function publicRoomState(room) {
  return {
    roomCode: room.roomCode,
    hostId: room.hostId,
    phase: room.phase,
    playerCount: room.players.length,
    players: room.players.map((player) => ({
      id: player.id,
      name: player.name,
      avatar: player.avatar || "🙂",
      isHost: player.id === room.hostId,
      isBot: Boolean(player.isBot),
      bid: player.bid,
      tricksWon: player.tricksWon,
      roundScore: player.roundScore,
      totalScore: player.totalScore,
      cardsLeft: player.hand ? player.hand.length : 0
    })),
    startingPlayerCount: room.startingPlayerCount,
    deckSize: room.deckSize,
    deckDescription: room.deckDescription,
    roundNumber: room.roundNumber,
    maxRounds: room.maxRounds,
    dealerIndex: room.dealerIndex,
    leaderIndex: room.leaderIndex,
    currentTurnIndex: room.currentTurnIndex,
    trumpCard: room.trumpCard,
    trumpSuit: room.trumpSuit,
    needsDealerChoice: room.needsDealerChoice,
    currentTrick: room.currentTrick,
    lastTrick: room.lastTrick
  };
}

function privateRoomStateForPlayer(room, playerId) {
  const publicState = publicRoomState(room);
  const currentPlayer = room.players.find((player) => player.id === playerId);

  return {
    ...publicState,
    yourHand: currentPlayer ? currentPlayer.hand : [],
    yourPlayerId: playerId
  };
}

export {
  createRoom,
  getRoom,
  addPlayerToRoom,
  removePlayer,
  publicRoomState,
  privateRoomStateForPlayer
};
