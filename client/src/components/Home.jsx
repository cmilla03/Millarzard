
import React, { useState } from "react";
import AvatarDisplay from "./AvatarDisplay";

const DEFAULT_AVATAR = {
  kind: "custom",
  style: "neutral",
  skin: "#d89a6a",
  faceShape: "oval",
  hair: "sidePart",
  hairColor: "#2b1b12",
  eyes: "almond",
  eyeColor: "#3b2416",
  brows: "soft",
  nose: "medium",
  mouth: "smile",
  lipColor: "#9b3f46",
  accessory: "none",
  bg: "#f3c969"
};

const SKIN_TONES = ["#f8d9bd", "#efc39a", "#d89a6a", "#c17f52", "#a9653e", "#8d5524", "#5c3724"];
const HAIR_COLORS = ["#15110d", "#2b1b12", "#5b3420", "#8a4f24", "#c7833c", "#d9c2a3", "#d7d7d7", "#7b3f98", "#2f6f9f", "#b22f4f"];
const EYE_COLORS = ["#2b1b12", "#4b78a8", "#3e8c5f", "#7a5732", "#8a8a8a", "#5f3c95"];
const LIP_COLORS = ["#8f3a3f", "#b95862", "#7b2e35", "#c4757e", "#aa5c67", "#6f2b31"];
const BG_COLORS = ["#f3c969", "#bde5ff", "#9dffbf", "#ffb3c7", "#d7c2ff", "#ffffff", "#30336b", "#f8f3e7"];

const STYLE_OPTIONS = [["neutral", "Neutral"], ["feminine", "Feminine"], ["masculine", "Masculine"]];
const FACE_SHAPES = [["oval", "Oval"], ["round", "Round"], ["square", "Square"], ["heart", "Heart"], ["long", "Long"]];
const HAIR_STYLES = [
  ["bald", "Bald"],
  ["buzz", "Buzz"],
  ["pixie", "Pixie"],
  ["short", "Short"],
  ["sidePart", "Side Part"],
  ["spiky", "Spiky"],
  ["curly", "Curly"],
  ["wavy", "Wavy"],
  ["bob", "Bob"],
  ["long", "Long"],
  ["bangs", "Bangs"],
  ["bun", "Bun"],
  ["ponytail", "Ponytail"],
  ["locs", "Locs"],
  ["fade", "Fade"],
  ["quiff", "Quiff"]
];
const EYE_STYLES = [["round", "Round"], ["almond", "Almond"], ["happy", "Happy"], ["sleepy", "Sleepy"], ["cat", "Cat Eye"]];
const BROW_STYLES = [["soft", "Soft"], ["straight", "Straight"], ["arched", "Arched"], ["thick", "Thick"]];
const NOSE_STYLES = [["small", "Small"], ["medium", "Medium"], ["wide", "Wide"], ["long", "Long"], ["button", "Button"]];
const MOUTH_STYLES = [["smile", "Smile"], ["neutral", "Neutral"], ["open", "Open"], ["full", "Full Lips"], ["grin", "Grin"]];
const ACCESSORIES = [["none", "None"], ["glasses", "Glasses"], ["headband", "Headband"], ["hat", "Hat"], ["crown", "Crown"], ["mustache", "Mustache"], ["beard", "Beard"], ["earrings", "Earrings"]];

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function ColorSwatches({ label, value, options, onChange }) {
  return (
    <div className="builder-section">
      <h3>{label}</h3>
      <div className="swatch-row">
        {options.map((color) => (
          <button
            type="button"
            key={color}
            className={`color-swatch ${value === color ? "swatch-selected" : ""}`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
          />
        ))}
      </div>
    </div>
  );
}

function IconChoiceGrid({ label, value, options, onChange, iconType }) {
  return (
    <div className="builder-section">
      <h3>{label}</h3>
      <div className="visual-grid">
        {options.map(([optionValue, optionLabel]) => (
          <button
            type="button"
            key={optionValue}
            className={`visual-choice ${value === optionValue ? "visual-choice-selected" : ""}`}
            onClick={() => onChange(optionValue)}
          >
            <span className={`visual-preview ${iconType} ${iconType}-${optionValue}`} />
            <span className="visual-label">{optionLabel}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TextChoiceGrid({ label, value, options, onChange }) {
  return (
    <div className="builder-section">
      <h3>{label}</h3>
      <div className="choice-row">
        {options.map(([optionValue, optionLabel]) => (
          <button
            type="button"
            key={optionValue}
            className={`builder-choice ${value === optionValue ? "builder-choice-selected" : ""}`}
            onClick={() => onChange(optionValue)}
          >
            {optionLabel}
          </button>
        ))}
      </div>
    </div>
  );
}

function Home({ onCreateRoom, onJoinRoom, errorMessage }) {
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [playerAvatar, setPlayerAvatar] = useState(DEFAULT_AVATAR);
  const [activeTab, setActiveTab] = useState("Face");

  function updateAvatar(key, value) {
    setPlayerAvatar((current) => ({ ...current, [key]: value }));
  }

  function randomizeAvatar() {
    setPlayerAvatar({
      kind: "custom",
      style: randomItem(STYLE_OPTIONS)[0],
      skin: randomItem(SKIN_TONES),
      faceShape: randomItem(FACE_SHAPES)[0],
      hair: randomItem(HAIR_STYLES)[0],
      hairColor: randomItem(HAIR_COLORS),
      eyes: randomItem(EYE_STYLES)[0],
      eyeColor: randomItem(EYE_COLORS),
      brows: randomItem(BROW_STYLES)[0],
      nose: randomItem(NOSE_STYLES)[0],
      mouth: randomItem(MOUTH_STYLES)[0],
      lipColor: randomItem(LIP_COLORS),
      accessory: randomItem(ACCESSORIES)[0],
      bg: randomItem(BG_COLORS)
    });
  }

  function handleCreateRoom(event) {
    event.preventDefault();
    onCreateRoom(playerName, playerAvatar);
  }

  function handleJoinRoom(event) {
    event.preventDefault();
    onJoinRoom(playerName, roomCode, playerAvatar);
  }

  return (
    <section className="card-panel home-panel polished-home-panel">
      <h1>Wizard Table</h1>
      <p className="subtitle">Private rooms for 3–12 players.</p>

      {errorMessage && <p className="error">{errorMessage}</p>}

      <label>
        Your name
        <input
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
          placeholder="Enter your name"
        />
      </label>

      <section className="avatar-builder deluxe-builder polished-builder">
        <div className="builder-main-layout">
          <aside className="builder-preview-panel">
            <div className="preview-card">
              <AvatarDisplay avatar={playerAvatar} size="large" />
              <div>
                <h2>Face Avatar</h2>
                <p className="subtitle">Original face-only character creator with more polished controls.</p>
              </div>
            </div>
            <div className="preview-actions">
              <button type="button" className="small-button" onClick={randomizeAvatar}>
                Randomize
              </button>
            </div>
          </aside>

          <div className="builder-controls-panel">
            <div className="avatar-tabs polished-tabs">
              {["Face", "Hair", "Eyes", "Nose", "Mouth", "Accessories", "Background"].map((tab) => (
                <button
                  type="button"
                  key={tab}
                  className={`avatar-tab ${activeTab === tab ? "avatar-tab-active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="builder-tab-panel">
              {activeTab === "Face" && (
                <>
                  <TextChoiceGrid label="Style" value={playerAvatar.style} options={STYLE_OPTIONS} onChange={(value) => updateAvatar("style", value)} />
                  <IconChoiceGrid label="Face Shape" value={playerAvatar.faceShape} options={FACE_SHAPES} onChange={(value) => updateAvatar("faceShape", value)} iconType="face-thumb" />
                  <ColorSwatches label="Skin Tone" value={playerAvatar.skin} options={SKIN_TONES} onChange={(value) => updateAvatar("skin", value)} />
                </>
              )}

              {activeTab === "Hair" && (
                <>
                  <IconChoiceGrid label="Hairstyle" value={playerAvatar.hair} options={HAIR_STYLES} onChange={(value) => updateAvatar("hair", value)} iconType="hair-thumb" />
                  <ColorSwatches label="Hair Color" value={playerAvatar.hairColor} options={HAIR_COLORS} onChange={(value) => updateAvatar("hairColor", value)} />
                </>
              )}

              {activeTab === "Eyes" && (
                <>
                  <IconChoiceGrid label="Eyes" value={playerAvatar.eyes} options={EYE_STYLES} onChange={(value) => updateAvatar("eyes", value)} iconType="eyes-thumb" />
                  <TextChoiceGrid label="Eyebrows" value={playerAvatar.brows} options={BROW_STYLES} onChange={(value) => updateAvatar("brows", value)} />
                  <ColorSwatches label="Eye Color" value={playerAvatar.eyeColor} options={EYE_COLORS} onChange={(value) => updateAvatar("eyeColor", value)} />
                </>
              )}

              {activeTab === "Nose" && (
                <IconChoiceGrid label="Nose" value={playerAvatar.nose} options={NOSE_STYLES} onChange={(value) => updateAvatar("nose", value)} iconType="nose-thumb" />
              )}

              {activeTab === "Mouth" && (
                <>
                  <IconChoiceGrid label="Mouth" value={playerAvatar.mouth} options={MOUTH_STYLES} onChange={(value) => updateAvatar("mouth", value)} iconType="mouth-thumb" />
                  <ColorSwatches label="Lip Color" value={playerAvatar.lipColor} options={LIP_COLORS} onChange={(value) => updateAvatar("lipColor", value)} />
                </>
              )}

              {activeTab === "Accessories" && (
                <IconChoiceGrid label="Accessories" value={playerAvatar.accessory} options={ACCESSORIES} onChange={(value) => updateAvatar("accessory", value)} iconType="accessory-thumb" />
              )}

              {activeTab === "Background" && (
                <ColorSwatches label="Background" value={playerAvatar.bg} options={BG_COLORS} onChange={(value) => updateAvatar("bg", value)} />
              )}
            </div>
          </div>
        </div>
      </section>

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
  );
}

export default Home;
