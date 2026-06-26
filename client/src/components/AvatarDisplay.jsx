
import React from "react";

function isCustomAvatar(avatar) {
  return avatar && typeof avatar === "object" && avatar.kind === "custom";
}

function isAvaturnAvatar(avatar) {
  return avatar && typeof avatar === "object" && avatar.kind === "avaturn" && avatar.url;
}

function AvatarDisplay({ avatar, size = "medium", seated = false }) {
  if (isAvaturnAvatar(avatar)) {
    return (
      <div
        className={`custom-avatar avaturn-avatar avatar-${size} ${seated ? "avatar-seated" : ""}`}
        style={{ "--avatar-bg": avatar.bg || "#9dffbf" }}
      >
        <model-viewer
          src={avatar.url}
          interaction-prompt="none"
          exposure="1"
          shadow-intensity="0.25"
          camera-orbit={seated ? "0deg 82deg 1.35m" : "0deg 80deg 2.2m"}
          camera-target={seated ? "0m 1.48m 0m" : "0m 1m 0m"}
          field-of-view={seated ? "22deg" : "25deg"}
          className="avaturn-model-viewer"
        />
      </div>
    );
  }

  if (!isCustomAvatar(avatar)) {
    return <div className={`custom-avatar emoji-avatar avatar-${size} ${seated ? "avatar-seated" : ""}`}>{avatar || "🙂"}</div>;
  }

  const {
    skin = "#d89a6a",
    faceShape = "oval",
    style = "neutral",
    hair = "sidePart",
    hairColor = "#2b1b12",
    eyes = "almond",
    eyeColor = "#3b2416",
    brows = "soft",
    nose = "medium",
    mouth = "smile",
    lipColor = "#9b3f46",
    accessory = "none",
    bg = "#f3c969"
  } = avatar;

  const showGlasses = accessory === "glasses";
  const showHat = accessory === "hat";
  const showCrown = accessory === "crown";
  const showMustache = accessory === "mustache";
  const showBeard = accessory === "beard";
  const showEarrings = accessory === "earrings";
  const showHeadband = accessory === "headband";

  return (
    <div
      className={`custom-avatar avatar-${size} avatar-style-${style} ${seated ? "avatar-seated" : ""}`}
      style={{
        "--avatar-bg": bg,
        "--skin": skin,
        "--hair": hairColor,
        "--eye-color": eyeColor,
        "--lip": lipColor
      }}
    >
      <div className="avatar-neck" />
      <div className={`avatar-head avatar-face-${faceShape}`}>
        {hair !== "bald" && <div className={`avatar-hair avatar-hair-${hair}`} />}
        <div className={`avatar-brows avatar-brows-${brows}`}>
          <span />
          <span />
        </div>
        <div className={`avatar-eyes avatar-eyes-${eyes}`}>
          <span className="avatar-eye" />
          <span className="avatar-eye" />
        </div>
        <div className={`avatar-nose avatar-nose-${nose}`} />
        <div className={`avatar-mouth avatar-mouth-${mouth}`} />
        {style === "feminine" && (
          <div className="avatar-cheeks">
            <span />
            <span />
          </div>
        )}
        {showGlasses && <div className="avatar-glasses" />}
        {showMustache && <div className="avatar-mustache" />}
        {showBeard && <div className="avatar-beard" />}
        {showEarrings && <div className="avatar-earrings"><span /><span /></div>}
      </div>
      {showHat && <div className="avatar-hat" />}
      {showCrown && <div className="avatar-crown">♛</div>}
      {showHeadband && <div className="avatar-headband" />}
    </div>
  );
}

export default AvatarDisplay;
