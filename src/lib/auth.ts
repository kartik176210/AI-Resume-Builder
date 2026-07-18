// Demo auth: stores users/session in localStorage so the app works as a
// static Vercel deployment with zero external database. Swap this module
// for real backend auth (NextAuth, Supabase, etc.) before going to
// production — passwords here are NOT hashed or secured.

interface StoredUser {
  name: string;
  email: string;
  password: string;
}

const USERS_KEY = 'resumeai_users';
const SESSION_KEY = 'resumeai_session';

function getUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function signup(name: string, email: string, password: string): { ok: boolean; error?: string } {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: 'An account with this email already exists.' };
  }
  users.push({ name, email, password });
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, email);
  return { ok: true };
}

export function login(email: string, password: string): { ok: boolean; error?: string } {
  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    return { ok: false, error: 'Incorrect email or password.' };
  }
  localStorage.setItem(SESSION_KEY, email);
  return { ok: true };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function currentUser(): StoredUser | null {
  const email = localStorage.getItem(SESSION_KEY);
  if (!email) return null;
  return getUsers().find((u) => u.email === email) || null;
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem(SESSION_KEY);
}
