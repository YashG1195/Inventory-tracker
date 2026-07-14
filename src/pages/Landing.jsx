import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ── tiny hook: count-up animation ───────────────────────────── */
function useCountUp(target, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

const FEATURES = [
  {
    icon: '📊',
    title: 'Live Dashboard',
    desc: 'Real-time KPI cards, animated donut charts by category, bar charts for stock levels, and a live activity feed.',
    color: '#7c3aed',
  },
  {
    icon: '📦',
    title: 'Smart Inventory',
    desc: 'Full product table with search, filter, sort, inline stock updates, edit and delete — all without page reloads.',
    color: '#3b82f6',
  },
  {
    icon: '🔔',
    title: 'Instant Alerts',
    desc: 'Automatically detect low-stock and out-of-stock products. One-click restock from the Alerts page.',
    color: '#f59e0b',
  },
  {
    icon: '📈',
    title: 'Reports & CSV Export',
    desc: 'Total inventory value, category breakdown, top products, and one-click CSV download for offline analysis.',
    color: '#10b981',
  },
  {
    icon: '🔐',
    title: 'User Authentication',
    desc: 'Secure register & login system. Every user gets their own isolated inventory — no data mixing.',
    color: '#ec4899',
  },
  {
    icon: '🏷️',
    title: 'Custom Categories',
    desc: 'Create custom product categories with your own colors and emojis to keep inventory organised your way.',
    color: '#06b6d4',
  },
];

const STEPS = [
  { num: '01', title: 'Create Your Account', desc: 'Sign up free in seconds — no credit card required.' },
  { num: '02', title: 'Add Your Products',   desc: 'Enter product details, set thresholds, and assign categories.' },
  { num: '03', title: 'Track & Manage',      desc: 'Monitor stock, get alerts, export reports — all in real-time.' },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const statsRef  = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  // If already logged in, offer shortcut to dashboard
  const ctaHref = isAuthenticated ? '/dashboard' : '/register';
  const ctaLabel = isAuthenticated ? 'Go to Dashboard →' : 'Get Started Free →';

  // Trigger count-up when stats section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const s1 = useCountUp(500,  1600, statsVisible);
  const s2 = useCountUp(12,   1200, statsVisible);
  const s3 = useCountUp(99,   2000, statsVisible);
  const s4 = useCountUp(100,  1400, statsVisible);

  return (
    <div className="landing">

      {/* ── NAV ───────────────────────────────────────────────── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo">
            <div className="logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="3" width="7" height="7"/><rect x="15" y="3" width="7" height="7"/>
                <rect x="2" y="14" width="7" height="7"/><rect x="15" y="14" width="7" height="7"/>
              </svg>
            </div>
            <span className="landing-logo-text">StockSense</span>
          </div>
          <div className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
          </div>
          <div className="landing-nav-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary sm">Dashboard →</Link>
            ) : (
              <>
                <Link to="/login"    className="landing-nav-login">Sign in</Link>
                <Link to="/register" className="btn-primary sm">Get started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg-orb orb1" />
        <div className="hero-bg-orb orb2" />
        <div className="hero-bg-orb orb3" />

        <div className="hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Real-time inventory tracking
          </div>

          <h1 className="hero-title">
            Manage Inventory<br />
            <span className="hero-gradient-text">Smarter &amp; Faster</span>
          </h1>

          <p className="hero-subtitle">
            StockSense gives your business real-time visibility into stock levels,
            instant alerts for low inventory, and powerful analytics — all in one
            beautiful dashboard.
          </p>

          <div className="hero-cta">
            <Link to={ctaHref} className="btn-primary hero-cta-primary">
              {ctaLabel}
            </Link>
            {!isAuthenticated && (
              <Link to="/login" className="hero-cta-secondary">
                Sign in
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            )}
          </div>

          {/* Mini feature pills */}
          <div className="hero-pills">
            {['✓ Free forever', '✓ No credit card', '✓ Setup in 2 min', '✓ Data stays private'].map(t => (
              <span key={t} className="hero-pill">{t}</span>
            ))}
          </div>
        </div>

        {/* Floating dashboard preview card */}
        <div className="hero-preview">
          <div className="preview-card">
            <div className="preview-header">
              <div className="preview-title">📊 Dashboard Overview</div>
              <span className="preview-live"><span className="live-dot" />Live</span>
            </div>
            <div className="preview-stats">
              {[
                { label: 'Total Products', value: '284', color: '#7c3aed' },
                { label: 'In Stock',       value: '231', color: '#10b981' },
                { label: 'Low Stock',      value: '38',  color: '#f59e0b' },
                { label: 'Out of Stock',   value: '15',  color: '#ef4444' },
              ].map(s => (
                <div key={s.label} className="preview-stat">
                  <div className="preview-stat-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="preview-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="preview-bars">
              {[
                { label: 'Electronics', pct: 72, color: '#7c3aed' },
                { label: 'Clothing',    pct: 55, color: '#3b82f6' },
                { label: 'Food',        pct: 88, color: '#10b981' },
                { label: 'Furniture',   pct: 34, color: '#f59e0b' },
              ].map(b => (
                <div key={b.label} className="preview-bar-row">
                  <span className="preview-bar-label">{b.label}</span>
                  <div className="preview-bar-track">
                    <div className="preview-bar-fill" style={{ width: `${b.pct}%`, background: b.color }} />
                  </div>
                  <span className="preview-bar-pct">{b.pct}%</span>
                </div>
              ))}
            </div>
            <div className="preview-alert">
              <span>🔔</span>
              <span>3 products need restocking</span>
              <span className="preview-alert-badge">View Alerts</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="landing-stats" ref={statsRef}>
        <div className="landing-container">
          <div className="stats-row">
            {[
              { value: s1, suffix: '+', label: 'Products Trackable' },
              { value: s2, suffix: '+', label: 'Smart Categories' },
              { value: s3, suffix: '%',  label: 'Uptime Reliability' },
              { value: s4, suffix: '%',  label: 'Free to Use' },
            ].map((s, i) => (
              <div key={i} className="landing-stat-item">
                <div className="landing-stat-value">{s.value}{s.suffix}</div>
                <div className="landing-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section className="landing-features" id="features">
        <div className="landing-container">
          <div className="section-header-text">
            <div className="section-tag">Features</div>
            <h2>Everything You Need to<br /><span className="hero-gradient-text">Control Your Stock</span></h2>
            <p>From real-time tracking to smart alerts — StockSense has every tool your business needs.</p>
          </div>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card" style={{ '--fc': f.color }}>
                <div className="feature-icon" style={{ background: `${f.color}18`, color: f.color }}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="landing-how" id="how-it-works">
        <div className="landing-container">
          <div className="section-header-text">
            <div className="section-tag">How it works</div>
            <h2>Up and Running in<br /><span className="hero-gradient-text">3 Simple Steps</span></h2>
          </div>
          <div className="steps-row">
            {STEPS.map((s, i) => (
              <div key={i} className="step-card">
                <div className="step-number">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < STEPS.length - 1 && <div className="step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="landing-cta-section">
        <div className="cta-card">
          <div className="cta-orb" />
          <h2>Ready to Take Control of<br /><span className="hero-gradient-text">Your Inventory?</span></h2>
          <p>Join businesses using StockSense to eliminate stockouts and streamline operations.</p>
          <div className="cta-actions">
            <Link to={ctaHref} className="btn-primary hero-cta-primary">{ctaLabel}</Link>
            {!isAuthenticated && <Link to="/login" className="btn-ghost">Sign in instead</Link>}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-inner">
            <div className="footer-brand">
              <div className="landing-logo">
                <div className="logo-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="2" y="3" width="7" height="7"/><rect x="15" y="3" width="7" height="7"/>
                    <rect x="2" y="14" width="7" height="7"/><rect x="15" y="14" width="7" height="7"/>
                  </svg>
                </div>
                <span className="landing-logo-text">StockSense</span>
              </div>
              <p>Real-time inventory management for modern businesses.</p>
            </div>
            <div className="footer-links">
              <a href="#features">Features</a>
              <a href="#how-it-works">How it works</a>
              <Link to="/login">Sign in</Link>
              <Link to="/register">Register</Link>
              <a href="https://github.com/YashG1195/Inventory-tracker" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2025 StockSense. Built with ❤️ using React + Vite</span>
            <span>
              <a href="https://stocksenseims.netlify.app" target="_blank" rel="noopener noreferrer">
                🌐 stocksenseims.netlify.app
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
