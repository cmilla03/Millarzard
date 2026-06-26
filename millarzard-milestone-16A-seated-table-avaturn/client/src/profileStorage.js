const PROFILE_KEY = "millarzard-profile-v1";

export function createProfileId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `profile-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function loadProfile() {
  try {
    const saved = window.localStorage.getItem(PROFILE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile) {
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
}

export function clearProfile() {
  window.localStorage.removeItem(PROFILE_KEY);
}

export function buildProfile({ existingProfile, name, avatar }) {
  const now = new Date().toISOString();

  return {
    id: existingProfile?.id || createProfileId(),
    name: name.trim(),
    avatar,
    wins: existingProfile?.wins || 0,
    gamesPlayed: existingProfile?.gamesPlayed || 0,
    lastUpdated: now,
    createdAt: existingProfile?.createdAt || now
  };
}

export function recordCompletedGame(profile, didWin) {
  if (!profile) return profile;

  return {
    ...profile,
    wins: profile.wins + (didWin ? 1 : 0),
    gamesPlayed: profile.gamesPlayed + 1,
    lastUpdated: new Date().toISOString()
  };
}
