export const adminSessionKey = "sprayway-admin-session-v1";
export const adminEmailDefault = "khan.paddyrice@gmail.com";

export function readAdminSession() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem(adminSessionKey) || "null");
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
