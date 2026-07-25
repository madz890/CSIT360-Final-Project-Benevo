import { supabase, isSupabaseConfigured } from "./supabase";

const fallbackCampaigns = [
  {
    id: "demo-1",
    title: "Clean Water for Rural Schools",
    description:
      "Provide safe drinking water and sanitation to students in underserved communities.",
    goal_amount: 12000,
    current_amount: 5400,
    category: "Education",
    status: "approved",
    image_url:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "demo-2",
    title: "Emergency Food Relief",
    description:
      "Support local families with food parcels and mobile distribution during crises.",
    goal_amount: 8000,
    current_amount: 3200,
    category: "Humanitarian",
    status: "approved",
    image_url:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80",
  },
];

export async function fetchCampaigns() {
  if (!isSupabaseConfigured || !supabase) {
    return fallbackCampaigns;
  }

  const { data, error } = await supabase
    .from("campaigns")
    .select("*, profiles:organizer_id (id, organization_name, full_name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return fallbackCampaigns;
  }

  return data ?? [];
}

export async function fetchCampaignById(id) {
  if (!isSupabaseConfigured || !supabase) {
    return fallbackCampaigns.find((campaign) => campaign.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("campaigns")
    .select("*, profiles:organizer_id (id, organization_name, full_name)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function createCampaign(payload, userId) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      data: {
        ...payload,
        id: `demo-${Date.now()}`,
        organizer_id: userId,
        current_amount: 0,
        status: "draft",
      },
    };
  }

  const { data, error } = await supabase
    .from("campaigns")
    .insert({
      organizer_id: userId,
      title: payload.title,
      description: payload.description,
      goal_amount: payload.goalAmount,
      category: payload.category,
      image_url: payload.imageUrl,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return { data };
}

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
