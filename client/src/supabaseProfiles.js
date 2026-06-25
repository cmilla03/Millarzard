function dbProfileToAppProfile(row) {
  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatar: row.avatar,
    wins: row.wins || 0,
    gamesPlayed: row.games_played || 0,
    createdAt: row.created_at,
    lastUpdated: row.updated_at
  };
}

function appProfileToDbProfile(user, profile) {
  return {
    id: user.id,
    email: user.email,
    name: profile.name,
    avatar: profile.avatar,
    wins: profile.wins || 0,
    games_played: profile.gamesPlayed || 0,
    updated_at: new Date().toISOString()
  };
}

export async function fetchSupabaseProfile(supabase, user) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,name,avatar,wins,games_played,created_at,updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return dbProfileToAppProfile(data);
}

export async function saveSupabaseProfile(supabase, user, profile) {
  const payload = appProfileToDbProfile(user, profile);

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select("id,email,name,avatar,wins,games_played,created_at,updated_at")
    .single();

  if (error) {
    throw error;
  }

  return dbProfileToAppProfile(data);
}
