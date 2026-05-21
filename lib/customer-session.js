export const customerSessionKey = "sprayway-customer-session-v1";

export function readCustomerSession() {
  if (typeof window === "undefined") return null;
  try {
    const session = JSON.parse(window.localStorage.getItem(customerSessionKey) || "null");
    if (!session?.idToken || !session?.email) return null;
    if (session.expiresAt && Number(session.expiresAt) < Date.now()) {
      clearCustomerSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveCustomerSession(session) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(customerSessionKey, JSON.stringify(session));
  window.dispatchEvent(new Event("customer-session-changed"));
}

export function clearCustomerSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(customerSessionKey);
  window.dispatchEvent(new Event("customer-session-changed"));
}
