import React, { useEffect, useRef, useState } from "react";
import { AvaturnSDK } from "@avaturn/sdk";

const AVATURN_URL = "https://millarzard.avaturn.dev";

function AvaturnAvatarModal({ onSaveAvatar, onClose }) {
  const containerRef = useRef(null);
  const sdkRef = useRef(null);
  const [status, setStatus] = useState("Loading Avaturn...");
  const [error, setError] = useState("");
  const [exportedAvatar, setExportedAvatar] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAvaturn() {
      try {
        const sdk = new AvaturnSDK();
        sdkRef.current = sdk;

        await sdk.init(containerRef.current, {
          url: AVATURN_URL,
          iframeClassName: "avaturn-sdk-iframe"
        });

        if (cancelled) return;

        setStatus("Selfie avatar creation is optional. Use Avaturn only if you are comfortable, then click Next/Export inside Avaturn.");

        sdk.on("export", (data) => {
          const avatar = {
            kind: "avaturn",
            provider: "Avaturn",
            avatarId: data.avatarId,
            bodyId: data.bodyId,
            gender: data.gender,
            url: data.url,
            urlType: data.urlType,
            sessionId: data.sessionId,
            bg: "#9dffbf"
          };

          setExportedAvatar(avatar);
          setStatus("Avatar exported. Click Save Avaturn Avatar to use it in MillarZard.");
        });
      } catch (err) {
        setError(err?.message || "Could not load Avaturn.");
        setStatus("");
      }
    }

    loadAvaturn();

    return () => {
      cancelled = true;
      if (sdkRef.current) {
        sdkRef.current.destroy();
      }
    };
  }, []);

  function handleSave() {
    if (exportedAvatar) {
      onSaveAvatar(exportedAvatar);
    }
  }

  return (
    <div className="avatar-modal-backdrop">
      <section className="avatar-modal-card">
        <div className="avatar-modal-header">
          <div>
            <h2>Optional Selfie Avatar</h2>
            <p>Only continue if you are comfortable using Avaturn. You can close this and use the standard builder instead.</p>
          </div>
          <button type="button" className="secondary-button" onClick={onClose}>Close</button>
        </div>

        {status && <p className="avaturn-status">{status}</p>}
        {error && <p className="error">{error}</p>}

        <div ref={containerRef} className="avaturn-sdk-container" />

        <div className="avaturn-actions">
          <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
          <button type="button" onClick={handleSave} disabled={!exportedAvatar}>
            Save Avaturn Avatar
          </button>
        </div>
      </section>
    </div>
  );
}

export default AvaturnAvatarModal;
