import { createClient } from "@supabase/supabase-js";
import { adminEmailDefault } from "@/lib/admin-session";

export async function requireAdmin(request) {
  const token = getBearerToken(request);
  if (!token) {
    return { error: "Missing admin token.", status: 401 };
  }

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return { error: "Unauthorized.", status: 401 };
  }

  if (String(data.user.email || "").toLowerCase() !== adminEmailDefault.toLowerCase()) {
    return { error: "Forbidden.", status: 403 };
  }

  return { user: data.user };
}

export function getBearerToken(request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || "";
}

export function createPublicSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase public credentials.");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
