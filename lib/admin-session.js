export const adminSessionKey = "sprayway-admin-session-v1";
export const adminEmailDefault = "khan.paddyrice@gmail.com";

export function readAdminSession() {
  if (typeof window === "undefined") return null;
  try {
    const session = JSON.parse(window.localStorage.getItem(adminSessionKey) || "null");
    if (session?.expiresAt && Number(session.expiresAt) <= Date.now()) {
      clearAdminSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveAdminSession(session) {
  window.localStorage.setItem(adminSessionKey, JSON.stringify(session));
}

export function clearAdminSession() {
  window.localStorage.removeItem(adminSessionKey);
}
