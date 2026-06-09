import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  function set(field, val) {
    setForm(p => ({ ...p, [field]: val }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    // Small artificial delay for UX polish
    await new Promise(r => setTimeout(r, 600));
    const result = login(form);
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
            <h1>Manage Your Inventory<br /><span className="brand-accent">Smarter.</span></h1>
            <p>Real-time stock tracking, intelligent alerts, and powerful analytics — all in one place.</p>
          </div>

          <ul className="auth-features">
            {[
              ['📦', 'Track stock levels in real-time'],
              ['🔔', 'Instant low-stock alerts'],
              ['📊', 'Visual reports & analytics'],
              ['📥', 'CSV export & reporting'],
            ].map(([icon, text]) => (
              <li key={text}><span>{icon}</span>{text}</li>
            ))}
          </ul>

          <div className="auth-brand-footer">
            Trusted for inventory management
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h2>Welcome back</h2>
            <p>Sign in to your StockSense account</p>
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

            <div className="auth-field">
              <label>Email address</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Password</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  autoComplete="current-password"
                />
                <button type="button" className="auth-eye" onClick={() => setShowPwd(p => !p)} tabIndex={-1}>
                  {showPwd
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading
                ? <span className="auth-spinner" />
                : <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                    </svg>
                    Sign In
                  </>
              }
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account?{' '}
            <Link to="/register">Create one free →</Link>
          </div>

          {/* Demo account hint */}
          <div className="auth-demo-hint">
            <strong>New here?</strong> Register to get started with 12 demo products pre-loaded.
          </div>
        </div>
      </div>
    </div>
  );
}
