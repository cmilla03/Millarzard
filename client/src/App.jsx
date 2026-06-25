import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import socket from "./socket";
import Home from "./components/Home";
import Lobby from "./components/Lobby";
import GameTable from "./components/GameTable";
import "./styles.css";

function App() {
  const [room, setRoom] = useState(null);
  const [yourPlayerId, setYourPlayerId] = useState(null);
  const [yourHand, setYourHand] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    socket.on("roomJoined", ({ room, yourPlayerId }) => {
      setRoom(room);
      setYourPlayerId(yourPlayerId);
      setYourHand([]);
      setErrorMessage("");
    });

    socket.on("roomUpdated", (updatedRoom) => {
      setRoom(updatedRoom);
    });

    socket.on("gameUpdated", (gameState) => {
      setRoom(gameState);
      setYourPlayerId(gameState.yourPlayerId);
      setYourHand(gameState.yourHand || []);
      setErrorMessage("");
    });

    socket.on("errorMessage", (message) => {
      setErrorMessage(message);
    });

    return () => {
      socket.off("roomJoined");
      socket.off("roomUpdated");
      socket.off("gameUpdated");
      socket.off("errorMessage");
    };
  }, []);

  function createRoom(playerName, playerAvatar) {
    socket.emit("createRoom", { playerName, playerAvatar });
  }

  function joinRoom(playerName, roomCode, playerAvatar) {
    socket.emit("joinRoom", { playerName, roomCode, playerAvatar });
  }

  function startGame() {
    socket.emit("startGame", { roomCode: room.roomCode });
  }

  function chooseTrump(trumpSuit) {
    socket.emit("chooseTrump", { roomCode: room.roomCode, trumpSuit });
  }

  function submitBid(bid) {
    socket.emit("submitBid", { roomCode: room.roomCode, bid });
  }

  function playCard(cardId) {
    socket.emit("playCard", { roomCode: room.roomCode, cardId });
  }

  function continueAfterTrick() {
    socket.emit("continueAfterTrick", { roomCode: room.roomCode });
  }

  function nextRound() {
    socket.emit("nextRound", { roomCode: room.roomCode });
  }

  function restartGame() {
    socket.emit("restartGame", { roomCode: room.roomCode });
  }

  if (!room) {
    return (
      <main className="app">
        <Home
          onCreateRoom={createRoom}
          onJoinRoom={joinRoom}
          errorMessage={errorMessage}
        />
      </main>
    );
  }

  if (room.phase === "LOBBY") {
    return (
      <main className="app">
        <Lobby
          room={room}
          yourPlayerId={yourPlayerId}
          onStartGame={startGame}
          errorMessage={errorMessage}
        />
      </main>
    );
  }

  return (
    <main className="app game-layout">
      <GameTable
        room={room}
        yourPlayerId={yourPlayerId}
        yourHand={yourHand}
        errorMessage={errorMessage}
        onChooseTrump={chooseTrump}
        onSubmitBid={submitBid}
        onPlayCard={playCard}
        onContinueAfterTrick={continueAfterTrick}
        onNextRound={nextRound}
        onRestartGame={restartGame}
      />
    </main>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
