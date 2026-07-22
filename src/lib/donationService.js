import { supabase, isSupabaseConfigured } from "./supabase";

export async function createDonation(payload, userId) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      data: {
        id: `demo-donation-${Date.now()}`,
        ...payload,
        donor_id: userId,
        created_at: new Date().toISOString(),
      },
    };
  }

  const { data, error } = await supabase
    .from("donations")
    .insert({
      campaign_id: payload.campaignId,
      donor_id: userId,
      amount: payload.amount,
      currency: payload.currency ?? "ADA",
      wallet_address: payload.walletAddress,
      tx_hash: payload.txHash,
      receipt_url: payload.receiptUrl ?? null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return { data };
}

export async function fetchUserDonations(userId) {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("donations")
    .select("*, campaigns(id, title)")
    .eq("donor_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}

export async function updateWalletAddress(userId, walletAddress) {
  if (!isSupabaseConfigured || !supabase) {
    return { success: true };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ wallet_address: walletAddress })
    .eq("id", userId);
  if (error) {
    throw error;
  }

  return { success: true };
}
