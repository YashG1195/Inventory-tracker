import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STRENGTH = [
  { label: 'Weak',   color: '#ef4444', minScore: 0 },
  { label: 'Fair',   color: '#f59e0b', minScore: 2 },
  { label: 'Good',   color: '#3b82f6', minScore: 3 },
  { label: 'Strong', color: '#10b981', minScore: 4 },
];

function passwordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8)              score++;
  if (/[A-Z]/.test(pwd))           score++;
  if (/[0-9]/.test(pwd))           score++;
  if (/[^A-Za-z0-9]/.test(pwd))   score++;
  if (pwd.length >= 12)            score++;
  return Math.min(score, 4);
}

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const strength = passwordStrength(form.password);
  const strengthInfo = form.password ? STRENGTH[Math.min(strength, 3)] : null;

  function set(field, val) {
    setForm(p => ({ ...p, [field]: val }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields.'); return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.'); return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const result = register(form);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    navigate('/');
  }

  return (
    <div className="auth-page">
      {/* Left branding panel */}
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <div className="auth-logo">
            <div className="logo-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="3" width="7" height="7"/><rect x="15" y="3" width="7" height="7"/>
                <rect x="2" y="14" width="7" height="7"/><rect x="15" y="14" width="7" height="7"/>
              </svg>
            </div>
            <span className="auth-logo-text">StockSense</span>
          </div>

          <div className="auth-brand-content">
            <h1>Start Managing Inventory<br /><span className="brand-accent">For Free.</span></h1>
            <p>Join businesses using StockSense to eliminate stockouts and streamline operations.</p>
          </div>

          <ul className="auth-features">
            {[
              ['✅', 'Free forever — no credit card'],
              ['🔒', 'Your data is private & secure'],
              ['⚡', 'Set up in under 2 minutes'],
              ['📱', 'Works on all devices'],
            ].map(([icon, text]) => (
              <li key={text}><span>{icon}</span>{text}</li>
            ))}
          </ul>

          <div className="auth-brand-footer">
            Start with 12 demo products pre-loaded
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h2>Create your account</h2>
            <p>Get started with StockSense for free</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {error && (
              <div className="auth-error">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Full Name */}
            <div className="auth-field">
              <label>Full Name</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <input type="text" className="auth-input" placeholder="Your full name"
                  value={form.name} onChange={e => set('name', e.target.value)} autoComplete="name" autoFocus />
              </div>
            </div>

            {/* Email */}
            <div className="auth-field">
              <label>Email address</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input type="email" className="auth-input" placeholder="you@example.com"
                  value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" />
              </div>
            </div>

            {/* Password */}
            <div className="auth-field">
              <label>Password</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input type={showPwd ? 'text' : 'password'} className="auth-input" placeholder="Min. 6 characters"
                  value={form.password} onChange={e => set('password', e.target.value)} autoComplete="new-password" />
                <button type="button" className="auth-eye" onClick={() => setShowPwd(p => !p)} tabIndex={-1}>
                  {showPwd
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <div className="pwd-strength">
                  <div className="pwd-bars">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="pwd-bar"
                        style={{ background: i <= strength ? strengthInfo.color : 'var(--bg-elevated)' }} />
                    ))}
                  </div>
                  <span style={{ color: strengthInfo.color, fontSize: '0.72rem', fontWeight: 600 }}>
                    {strengthInfo.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="auth-field">
              <label>Confirm Password</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <input type={showPwd ? 'text' : 'password'} className="auth-input" placeholder="Repeat your password"
                  value={form.confirm} onChange={e => set('confirm', e.target.value)} autoComplete="new-password"
                  style={{ borderColor: form.confirm && form.confirm !== form.password ? 'var(--red)' : undefined }} />
                {form.confirm && form.confirm === form.password && (
                  <span style={{ color: 'var(--green)', position: 'absolute', right: 12 }}>✓</span>
                )}
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading
                ? <span className="auth-spinner" />
                : <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <line x1="19" y1="8" x2="19" y2="14"/>
                      <line x1="22" y1="11" x2="16" y2="11"/>
                    </svg>
                    Create Account
                  </>
              }
            </button>
          </form>

          <div className="auth-switch">
            Already have an account?{' '}
            <Link to="/login">Sign in →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
