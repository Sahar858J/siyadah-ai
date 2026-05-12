export interface Session {
  email: string;
  token: string;
}

export function getSession(): Session | null {
  const sessionData = localStorage.getItem("siyadah_session");
  if (!sessionData) return null;
  try {
    return JSON.parse(sessionData);
  } catch {
    return null;
  }
}

export function saveSession(email: string) {
  const session: Session = {
    email,
    token: Math.random().toString(36).substring(2) + Date.now().toString(36),
  };
  localStorage.setItem("siyadah_session", JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem("siyadah_session");
}