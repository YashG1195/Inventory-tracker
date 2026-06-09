import React, { createContext, useContext, useState } from 'react';
import { uid } from '../utils/helpers';

const AuthContext = createContext(null);

// ── Storage helpers ──────────────────────────────────────────────────────────
function loadUsers() {
  try { return JSON.parse(localStorage.getItem('ss_users')) || []; }
  catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem('ss_users', JSON.stringify(users));
}

function loadSession() {
  try { return JSON.parse(localStorage.getItem('ss_session')) || null; }
  catch { return null; }
}

// Simple hash — NOTE: In production always use a backend with bcrypt
function hashPassword(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => loadSession());

  // ── Register ──────────────────────────────────────────────────────────────
  function register({ name, email, password }) {
    const users = loadUsers();
    if (users.find(u => u.email === email.trim().toLowerCase())) {
      return { error: 'An account with this email already exists.' };
    }
    const newUser = {
      id:        uid(),
      name:      name.trim(),
      email:     email.trim().toLowerCase(),
      password:  hashPassword(password),
      avatar:    name.trim()[0].toUpperCase(),
      createdAt: Date.now(),
    };
    saveUsers([...users, newUser]);
    const { password: _, ...session } = newUser;
    localStorage.setItem('ss_session', JSON.stringify(session));
    setCurrentUser(session);
    return { success: true };
  }

  // ── Login ─────────────────────────────────────────────────────────────────
  function login({ email, password }) {
    const users = loadUsers();
    const user  = users.find(
      u => u.email === email.trim().toLowerCase() &&
           u.password === hashPassword(password)
    );
    if (!user) return { error: 'Invalid email or password.' };
    const { password: _, ...session } = user;
    localStorage.setItem('ss_session', JSON.stringify(session));
    setCurrentUser(session);
    return { success: true };
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  function logout() {
    localStorage.removeItem('ss_session');
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated: !!currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
