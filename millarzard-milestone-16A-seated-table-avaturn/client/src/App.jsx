import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import socket from "./socket";
import Home from "./components/Home";
import Lobby from "./components/Lobby";
import GameTable from "./components/GameTable";
import ProfileLogin from "./components/ProfileLogin";
import AuthGate from "./components/AuthGate";
import SupabaseSetupMissing from "./components/SupabaseSetupMissing";
import { clearProfile, loadProfile, recordCompletedGame, saveProfile } from "./profileStorage";
import { isSupabaseConfigured, supabase } from "./supabaseClient";
import { fetchSupabaseProfile, saveSupabaseProfile } from "./supabaseProfiles";
import "./styles.css";

function getGameRecordKey(profileId, roomCode) {
  return `millarzard-game-recorded-${profileId}-${roomCode}`;
}

function App() {
  const [useLocalMode, setUseLocalMode] = useState(!isSupabaseConfigured);
  const usingSupabase = isSupabaseConfigured && !useLocalMode;

  const [authReady, setAuthReady] = useState(!usingSupabase);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(() => (usingSupabase ? null : loadProfile()));
  const [profileLoading, setProfileLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [room, setRoom] = useState(null);
  const [yourPlayerId, setYourPlayerId] = useState(null);
  const [yourHand, setYourHand] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!usingSupabase) {
      setAuthReady(true);
      return;
    }

    let isMounted = true;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();

      if (!isMounted) return;

      setSession(data.session || null);
      setAuthReady(true);
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setRoom(null);
      setYourPlayerId(null);
      setYourHand([]);
      setErrorMessage("");
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [usingSupabase]);

  useEffect(() => {
    if (!usingSupabase || !session?.user) {
      return;
    }

    let isMounted = true;

    async function loadRemoteProfile() {
      setProfileLoading(true);
      setErrorMessage("");

      try {
        const remoteProfile = await fetchSupabaseProfile(supabase, session.user);

        if (isMounted) {
          setProfile(remoteProfile);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || "Could not load your profile.");
        }
      } finally {
        if (isMounted) {
          setProfileLoading(false);
        }
      }
    }

    loadRemoteProfile();

    return () => {
      isMounted = false;
    };
  }, [usingSupabase, session]);

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

  useEffect(() => {
    if (!profile || !room || room.phase !== "GAME_OVER" || !yourPlayerId) {
      return;
    }

    const recordKey = getGameRecordKey(profile.id, room.roomCode);

    if (window.localStorage.getItem(recordKey)) {
      return;
    }

    const rankedPlayers = [...room.players].sort((a, b) => b.totalScore - a.totalScore);
    const winner = rankedPlayers[0];
    const didWin = winner?.id === yourPlayerId;

    const updatedProfile = recordCompletedGame(profile, didWin);

    async function saveCompletedGame() {
      try {
        if (usingSupabase && session?.user) {
          const remoteProfile = await saveSupabaseProfile(supabase, session.user, updatedProfile);
          setProfile(remoteProfile);
        } else {
          saveProfile(updatedProfile);
          setProfile(updatedProfile);
        }

        window.localStorage.setItem(recordKey, "true");
      } catch (error) {
        setErrorMessage(error.message || "Could not save game stats.");
      }
    }

    saveCompletedGame();
  }, [room, yourPlayerId, profile, usingSupabase, session]);

  async function handleSaveProfile(updatedProfile) {
    setErrorMessage("");

    try {
      if (usingSupabase && session?.user) {
        const remoteProfile = await saveSupabaseProfile(supabase, session.user, updatedProfile);
        setProfile(remoteProfile);
      } else {
        saveProfile(updatedProfile);
        setProfile(updatedProfile);
      }

      setEditingProfile(false);
    } catch (error) {
      setErrorMessage(error.message || "Could not save your profile.");
    }
  }

  async function handleLogout() {
    if (usingSupabase) {
      await supabase.auth.signOut();
    } else {
      clearProfile();
    }

    setProfile(null);
    setEditingProfile(false);
    setRoom(null);
    setYourPlayerId(null);
    setYourHand([]);
    setErrorMessage("");
  }

  function createRoom() {
    if (!profile) return;
    socket.emit("createRoom", { playerName: profile.name, playerAvatar: profile.avatar });
  }

  function joinRoom(roomCode) {
    if (!profile) return;
    socket.emit("joinRoom", { playerName: profile.name, roomCode, playerAvatar: profile.avatar });
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

  if (!isSupabaseConfigured && !useLocalMode) {
    return <SupabaseSetupMissing onUseLocalMode={() => setUseLocalMode(true)} />;
  }

  if (isSupabaseConfigured && !useLocalMode && !authReady) {
    return (
      <main className="app">
        <section className="card-panel auth-panel">
          <h1>MillarZard</h1>
          <p className="subtitle">Loading account...</p>
        </section>
      </main>
    );
  }

  if (usingSupabase && !session) {
    return <AuthGate />;
  }

  if (profileLoading) {
    return (
      <main className="app">
        <section className="card-panel auth-panel">
          <h1>MillarZard</h1>
          <p className="subtitle">Loading your profile...</p>
        </section>
      </main>
    );
  }

  if (!profile || editingProfile) {
    return (
      <main className="app">
        <ProfileLogin
          existingProfile={editingProfile ? profile : null}
          onSaveProfile={handleSaveProfile}
          onCancelEdit={editingProfile ? () => setEditingProfile(false) : null}
        />
      </main>
    );
  }

  if (!room) {
    return (
      <main className="app">
        <Home
          profile={profile}
          onCreateRoom={createRoom}
          onJoinRoom={joinRoom}
          onEditProfile={() => setEditingProfile(true)}
          onLogout={handleLogout}
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
