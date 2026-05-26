import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { adminEmailDefault, saveAdminSession } from "@/lib/admin-session";

export async function saveCodOrder(order) {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body?.error || body?.message || "Không thể lưu đơn hàng.");
  }

  return body;
}

export async function signInAdmin(email, password) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message || "Không thể đăng nhập admin.");
  }

  if (String(data?.user?.email || "").toLowerCase() !== adminEmailDefault.toLowerCase()) {
    await supabase.auth.signOut();
    throw new Error("Email này không có quyền admin.");
  }

  return normalizeAuthSession(data.session, data.user);
}

export async function signUpCustomer(email, password) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message || "Không thể đăng ký tài khoản.");
  }

  if (!data.session) {
    throw new Error("Đăng ký thành công. Vui lòng kiểm tra email để xác nhận tài khoản.");
  }

  return normalizeAuthSession(data.session, data.user);
}

export async function signInCustomer(email, password) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message || "Không thể đăng nhập tài khoản.");
  }

  return normalizeAuthSession(data.session, data.user);
}

export async function listOrders(idToken) {
  return fetchAdminJson("/api/admin/orders", idToken);
}

export async function listAdminProducts(idToken) {
  return fetchAdminJson("/api/admin/products", idToken);
}

export async function listAdminCategories(idToken) {
  return fetchAdminJson("/api/admin/categories", idToken);
}

export async function createAdminCategory(idToken, category) {
  return fetchAdminJson("/api/admin/categories", idToken, {
    method: "POST",
    body: category,
  });
}

export async function updateAdminCategory(idToken, category) {
  return fetchAdminJson("/api/admin/categories", idToken, {
    method: "PATCH",
    body: category,
  });
}

export async function deleteAdminCategory(idToken, categoryId) {
  const headers = await authHeaders(idToken);
  const response = await fetch("/api/admin/categories", {
    method: "DELETE",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: categoryId }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || body?.message || "Không thể xóa chuyên mục.");
  }
}

export async function createAdminProduct(idToken, product) {
  return fetchAdminJson("/api/admin/products", idToken, {
    method: "POST",
    body: product,
  });
}

export async function updateAdminProduct(idToken, productId, patch) {
  return fetchAdminJson(`/api/admin/products/${encodeURIComponent(productId)}`, idToken, {
    method: "PATCH",
    body: patch,
  });
}

export async function deleteAdminProduct(idToken, productId) {
  const headers = await authHeaders(idToken);
  const response = await fetch(`/api/admin/products/${encodeURIComponent(productId)}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || body?.message || "Không thể xóa sản phẩm.");
  }
}

export async function updateOrderStatus(idToken, orderId, status) {
  return fetchAdminJson(`/api/admin/orders/${encodeURIComponent(orderId)}`, idToken, {
    method: "PATCH",
    body: { status },
  });
}

export async function deleteOrder(idToken, orderId) {
  const headers = await authHeaders(idToken);
  const response = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || body?.message || "Không thể xóa đơn hàng.");
  }
}

function normalizeAuthSession(session, user) {
  return {
    email: user?.email || session?.user?.email || "",
    idToken: session?.access_token || "",
    refreshToken: session?.refresh_token || "",
    localId: user?.id || session?.user?.id || "",
    expiresAt: session?.expires_at ? session.expires_at * 1000 : Date.now() + 3600 * 1000,
  };
}

async function fetchAdminJson(path, idToken, options = {}) {
  const headers = await authHeaders(idToken);
  const response = await fetch(path, {
    method: options.method || "GET",
    headers: {
      ...headers,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body?.error || body?.message || "Không thể xử lý yêu cầu.");
  }

  return body;
}

async function authHeaders(idToken) {
  const freshToken = await getFreshAdminToken(idToken);
  return {
    Authorization: `Bearer ${freshToken}`,
  };
}

async function getFreshAdminToken(fallbackToken) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.getSession();
  let session = data?.session || null;

  if (!error && session?.access_token && session.expires_at * 1000 <= Date.now() + 60_000) {
    const refreshed = await supabase.auth.refreshSession();
    session = refreshed.data?.session || session;
  }

  const email = session?.user?.email || "";
  if (session?.access_token && email.toLowerCase() === adminEmailDefault.toLowerCase()) {
    saveAdminSession(normalizeAuthSession(session, session.user));
    return session.access_token;
  }

  return fallbackToken || "";
}
