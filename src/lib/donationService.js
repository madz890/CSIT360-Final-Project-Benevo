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

export async function getCampaignDonations(campaignId) {
  if (!isSupabaseConfigured || !supabase) {
    return [
      {
        id: "demo-donation-1",
        campaign_id: campaignId,
        amount: 150,
        currency: "ADA",
        tx_hash: "8b3fa2c7d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        profiles: { full_name: "Alex Johnson" },
      },
      {
        id: "demo-donation-2",
        campaign_id: campaignId,
        amount: 75,
        currency: "ADA",
        tx_hash: "1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        profiles: null,
      },
      {
        id: "demo-donation-3",
        campaign_id: campaignId,
        amount: 500,
        currency: "ADA",
        tx_hash: "9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        profiles: { full_name: "Sarah Chen", organization_name: "Green Future Org" },
      },
    ];
  }

  const { data, error } = await supabase
    .from("donations")
    .select("*, profiles:donor_id (id, full_name, organization_name)")
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}

export async function getCampaignsDonationTotals(campaignIds = []) {
  if (!Array.isArray(campaignIds) || campaignIds.length === 0) {
    return {};
  }
  if (!isSupabaseConfigured || !supabase) {
    return {};
  }

  const { data, error } = await supabase
    .from("donations")
    .select("campaign_id, amount")
    .in("campaign_id", campaignIds);

  if (error) {
    console.error(error);
    return {};
  }

  const totals = {};
  for (const row of data ?? []) {
    const id = row.campaign_id;
    if (!id) continue;
    totals[id] = (totals[id] || 0) + (Number(row.amount) || 0);
  }
  return totals;
}
