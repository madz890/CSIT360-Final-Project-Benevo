import { supabase, isSupabaseConfigured } from "./supabase";

export async function loadUserProfile(userId) {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function upsertUserProfile(userId, email, role = "donor") {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase.from("profiles").upsert({
    id: userId,
    email,
    role,
    created_at: new Date().toISOString(),
  });

  if (error) {
    throw error;
  }

  return data;
}
