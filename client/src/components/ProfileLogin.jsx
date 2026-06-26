import React, { useState } from "react";
import AvatarDisplay from "./AvatarDisplay";
import AvaturnAvatarModal from "./AvaturnAvatarModal";
import { buildProfile } from "../profileStorage";

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
            aria-label={`${label} ${color}`}
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

function ProfileLogin({ existingProfile, onSaveProfile, onCancelEdit }) {
  const [name, setName] = useState(existingProfile?.name || "");
  const [avatar, setAvatar] = useState(existingProfile?.avatar || DEFAULT_AVATAR);
  const [activeTab, setActiveTab] = useState("Face");
  const [error, setError] = useState("");
  const [showAvaturn, setShowAvaturn] = useState(false);
  const [avatarMode, setAvatarMode] = useState(existingProfile?.avatar?.kind === "avaturn" ? "selfie" : "standard");

  function updateAvatar(key, value) {
    setAvatar((current) => ({ ...current, [key]: value }));
  }

  function randomizeAvatar() {
    setAvatar({
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

  function handleSave(event) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Please enter your profile name.");
      return;
    }

    const profile = buildProfile({
      existingProfile,
      name,
      avatar
    });

    onSaveProfile(profile);
  }

  return (
    <section className="card-panel home-panel polished-home-panel profile-login-panel">
      <div className="brand-header">
        <h1>MillarZard</h1>
        <p className="subtitle">Create a player profile before joining a room.</p>
      </div>

      {error && <p className="error">{error}</p>}

      <section className="avatar-choice-intro">
        <h2>Choose how to make your avatar</h2>
        <p>
          Selfie avatars are completely optional. You can use the standard avatar builder or keep a default avatar without uploading a face photo.
        </p>

        <div className="avatar-choice-cards">
          <button
            type="button"
            className={`avatar-choice-card ${avatarMode === "standard" ? "avatar-choice-card-active" : ""}`}
            onClick={() => {
              setAvatarMode("standard");
              setActiveTab("Face");
            }}
          >
            <span className="avatar-choice-icon">🎨</span>
            <strong>Standard Builder</strong>
            <span>No photo needed. Customize face, hair, eyes, mouth, and background.</span>
          </button>

          <button
            type="button"
            className={`avatar-choice-card ${avatarMode === "selfie" ? "avatar-choice-card-active" : ""}`}
            onClick={() => {
              setAvatarMode("selfie");
              setShowAvaturn(true);
            }}
          >
            <span className="avatar-choice-icon">📷</span>
            <strong>Selfie Avatar</strong>
            <span>Optional Avaturn creator for people who want to use a face photo.</span>
          </button>

          <button
            type="button"
            className={`avatar-choice-card ${avatarMode === "default" ? "avatar-choice-card-active" : ""}`}
            onClick={() => {
              setAvatarMode("default");
              setAvatar({ ...DEFAULT_AVATAR });
            }}
          >
            <span className="avatar-choice-icon">✅</span>
            <strong>Use Default</strong>
            <span>Skip customization for now. You can edit your avatar later.</span>
          </button>
        </div>
      </section>

      <section className="profile-login-layout">
        <aside className="profile-preview-card">
          <AvatarDisplay avatar={avatar} size="large" />
          <label>
            Profile name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
            />
          </label>

          <div className="profile-stat-grid">
            <div>
              <strong>{existingProfile?.wins || 0}</strong>
              <span>Wins</span>
            </div>
            <div>
              <strong>{existingProfile?.gamesPlayed || 0}</strong>
              <span>Games</span>
            </div>
          </div>

          <button type="button" className="small-button" onClick={() => {
            setAvatarMode("standard");
            randomizeAvatar();
          }}>
            Randomize Avatar
          </button>

          <button type="button" className="secondary-button" onClick={() => {
            setAvatarMode("selfie");
            setShowAvaturn(true);
          }}>
            Optional: Create Selfie Avatar
          </button>
        </aside>

        {avatarMode === "standard" ? (
        <div className="profile-builder-card">
          <div className="avatar-mode-label">
            <strong>Standard Avatar Builder</strong>
            <span>No face photo required.</span>
          </div>
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
                <TextChoiceGrid label="Style" value={avatar.style} options={STYLE_OPTIONS} onChange={(value) => updateAvatar("style", value)} />
                <IconChoiceGrid label="Face Shape" value={avatar.faceShape} options={FACE_SHAPES} onChange={(value) => updateAvatar("faceShape", value)} iconType="face-thumb" />
                <ColorSwatches label="Skin Tone" value={avatar.skin} options={SKIN_TONES} onChange={(value) => updateAvatar("skin", value)} />
              </>
            )}

            {activeTab === "Hair" && (
              <>
                <IconChoiceGrid label="Hairstyle" value={avatar.hair} options={HAIR_STYLES} onChange={(value) => updateAvatar("hair", value)} iconType="hair-thumb" />
                <ColorSwatches label="Hair Color" value={avatar.hairColor} options={HAIR_COLORS} onChange={(value) => updateAvatar("hairColor", value)} />
              </>
            )}

            {activeTab === "Eyes" && (
              <>
                <IconChoiceGrid label="Eyes" value={avatar.eyes} options={EYE_STYLES} onChange={(value) => updateAvatar("eyes", value)} iconType="eyes-thumb" />
                <TextChoiceGrid label="Eyebrows" value={avatar.brows} options={BROW_STYLES} onChange={(value) => updateAvatar("brows", value)} />
                <ColorSwatches label="Eye Color" value={avatar.eyeColor} options={EYE_COLORS} onChange={(value) => updateAvatar("eyeColor", value)} />
              </>
            )}

            {activeTab === "Nose" && (
              <IconChoiceGrid label="Nose" value={avatar.nose} options={NOSE_STYLES} onChange={(value) => updateAvatar("nose", value)} iconType="nose-thumb" />
            )}

            {activeTab === "Mouth" && (
              <>
                <IconChoiceGrid label="Mouth" value={avatar.mouth} options={MOUTH_STYLES} onChange={(value) => updateAvatar("mouth", value)} iconType="mouth-thumb" />
                <ColorSwatches label="Lip Color" value={avatar.lipColor} options={LIP_COLORS} onChange={(value) => updateAvatar("lipColor", value)} />
              </>
            )}

            {activeTab === "Accessories" && (
              <IconChoiceGrid label="Accessories" value={avatar.accessory} options={ACCESSORIES} onChange={(value) => updateAvatar("accessory", value)} iconType="accessory-thumb" />
            )}

            {activeTab === "Background" && (
              <ColorSwatches label="Background" value={avatar.bg} options={BG_COLORS} onChange={(value) => updateAvatar("bg", value)} />
            )}
          </div>
        </div>
        ) : (
          <div className="profile-builder-card avatar-mode-message-card">
            {avatarMode === "selfie" ? (
              <>
                <h3>Selfie Avatar Selected</h3>
                <p>Use the optional Avaturn creator, or switch back to the Standard Builder at any time.</p>
                <button type="button" onClick={() => setShowAvaturn(true)}>Open Avaturn</button>
              </>
            ) : (
              <>
                <h3>Default Avatar Selected</h3>
                <p>You can continue with the default avatar now and customize it later.</p>
                <button type="button" onClick={() => setAvatarMode("standard")}>Customize Instead</button>
              </>
            )}
          </div>
        )}
      </section>

      <div className="profile-actions">
        {existingProfile && onCancelEdit && (
          <button type="button" className="secondary-button" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
        <button onClick={handleSave}>
          {existingProfile ? "Save Profile" : "Create Profile"}
        </button>
      </div>

      <p className="profile-note">
        Face-photo avatar creation is optional. The standard builder and default avatar work without uploading any photo.
      </p>

      {showAvaturn && (
        <AvaturnAvatarModal
          onClose={() => setShowAvaturn(false)}
          onSaveAvatar={(newAvatar) => {
            setAvatar(newAvatar);
            setAvatarMode("selfie");
            setShowAvaturn(false);
          }}
        />
      )}
    </section>
  );
}

export default ProfileLogin;
