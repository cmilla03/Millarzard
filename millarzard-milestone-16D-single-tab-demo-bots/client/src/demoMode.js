const DEMO_PROFILE_KEY = "millarzard-demo-profile-v1";

const DEMO_AVATARS = ["🧙", "🦊", "🐻", "🦉", "🐸", "🦁", "🐼", "🦄"];

function createDemoId() {
  if (window.crypto?.randomUUID) {
    return `demo-${window.crypto.randomUUID()}`;
  }

  return `demo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createDemoProfile() {
  const number = Math.floor(100 + Math.random() * 900);
  const now = new Date().toISOString();

  return {
    id: createDemoId(),
    name: `Demo Player ${number}`,
    avatar: DEMO_AVATARS[Math.floor(Math.random() * DEMO_AVATARS.length)],
    wins: 0,
    gamesPlayed: 0,
    createdAt: now,
    lastUpdated: now,
    isDemo: true
  };
}

export function loadOrCreateDemoProfile() {
  try {
    const saved = window.sessionStorage.getItem(DEMO_PROFILE_KEY);

    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // A fresh in-memory demo profile still lets the site work.
  }

  return saveDemoProfile(createDemoProfile());
}

export function saveDemoProfile(profile) {
  const demoProfile = { ...profile, isDemo: true };

  try {
    window.sessionStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(demoProfile));
  } catch {
    // Ignore storage failures in private/restricted browser modes.
  }

  return demoProfile;
}

export function resetDemoProfile() {
  try {
    window.sessionStorage.removeItem(DEMO_PROFILE_KEY);
  } catch {
    // Ignore storage failures in private/restricted browser modes.
  }

  return loadOrCreateDemoProfile();
}
