import React, { useState } from "react";
import AvatarDisplay from "./AvatarDisplay";

function Home({ profile, demoMode = false, onCreateRoom, onJoinRoom, onEditProfile, onLogout, errorMessage }) {
  const [roomCode, setRoomCode] = useState("");

  function handleCreateRoom(event) {
    event.preventDefault();
    onCreateRoom();
  }

  function handleJoinRoom(event) {
    event.preventDefault();
    onJoinRoom(roomCode);
  }

  return (
    <section className="card-panel home-panel clean-home-panel">
      <div className="brand-header">
        <h1>MillarZard</h1>
        <p className="subtitle">Private rooms for 3–12 players.</p>
      </div>

      {errorMessage && <p className="error">{errorMessage}</p>}

      {demoMode && (
        <div className="demo-mode-banner">
          <strong>Demo Mode</strong>
          <span>No login or Supabase account is being used. Each new tab gets a temporary player.</span>
        </div>
      )}

      <section className="saved-profile-card">
        <AvatarDisplay avatar={profile.avatar} size="medium" />
        <div className="saved-profile-info">
          <p className="profile-kicker">{demoMode ? "Testing as" : "Signed in as"}</p>
          <h2>{profile.name}</h2>

          <div className="profile-stat-row">
            <span><strong>{profile.wins}</strong> wins</span>
            <span><strong>{profile.gamesPlayed}</strong> games</span>
          </div>
        </div>

        <div className="saved-profile-actions">
          <button type="button" className="secondary-button" onClick={onEditProfile}>
            Edit Profile
          </button>
          <button type="button" className="text-button" onClick={onLogout}>
            {demoMode ? "New Demo Player" : "Sign out"}
          </button>
        </div>
      </section>

      <section className="room-action-card">
        <h2>Start Playing</h2>
        <p className="subtitle">Create a new family room or join one with a code.</p>

        <div className="button-row">
          <button onClick={handleCreateRoom}>Create Room</button>
        </div>

        <div className="join-box">
          <label>
            Room code
            <input
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value)}
              placeholder="Example: X7K2Q"
            />
          </label>

          <button onClick={handleJoinRoom}>Join Room</button>
        </div>
      </section>
    </section>
  );
}

export default Home;
