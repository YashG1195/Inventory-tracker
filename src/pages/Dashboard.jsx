import React, { useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import { getStatus, formatCurrency, timeSince } from '../utils/helpers';
import DonutChart from '../components/charts/DonutChart';
import StockBarChart from '../components/charts/StockBarChart';

function StatCard({ icon, value, label, trend, trendType, accentColor }) {
  return (
    <div className="stat-card" style={{ '--accent': accentColor }}>
      <div className="stat-icon" style={{ background: `${accentColor}22` }}>
        {icon}
      </div>
      <div className="stat-body">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
      <div className={`stat-trend${trendType ? ' ' + trendType : ''}`}>{trend}</div>
    </div>
  );
}

export default function Dashboard() {
  const { products, activity } = useInventory();

  const stats = useMemo(() => {
    const total   = products.length;
    const inStock  = products.filter(p => getStatus(p) === 'in-stock').length;
    const lowStock = products.filter(p => getStatus(p) === 'low-stock').length;
    const outStock = products.filter(p => getStatus(p) === 'out-of-stock').length;
    const inStockPct = total > 0 ? Math.round(inStock / total * 100) : 0;
    return { total, inStock, lowStock, outStock, inStockPct };
  }, [products]);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Real-time overview of your inventory</p>
        </div>
        <span className="live-indicator">
          <span className="live-dot" />
          Live
        </span>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard
          accentColor="#7c3aed"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>}
          value={stats.total}
          label="Total Products"
          trend={`${stats.total} SKUs`}
        />
        <StatCard
          accentColor="#10b981"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
          value={stats.inStock}
          label="In Stock"
          trend={`${stats.inStockPct}%`}
          trendType="up"
        />
        <StatCard
          accentColor="#f59e0b"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
          value={stats.lowStock}
          label="Low Stock"
          trend="Alert"
        />
        <StatCard
          accentColor="#ef4444"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
          value={stats.outStock}
          label="Out of Stock"
          trend="Critical"
          trendType="down"
        />
      </div>

      {/* Charts */}
      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Stock by Category</h3>
          </div>
          <DonutChart />
        </div>

        <div className="chart-card wide">
          <div className="chart-header">
            <h3>Stock Level Overview</h3>
            <span className="chart-subtitle">Top 12 products by quantity</span>
          </div>
          <StockBarChart />
          <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: '0.72rem' }}>
            {[['#10b981','In Stock'],['#f59e0b','Low Stock'],['#ef4444','Out of Stock']].map(([color, label]) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: 'inline-block' }} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="section-card">
        <div className="section-header">
          <h3>Recent Activity</h3>
          <span className="badge-count">{activity.length} actions</span>
        </div>
        <div className="activity-list">
          {activity.length === 0 ? (
            <div className="empty-state-small">No activity yet. Add your first product!</div>
          ) : (
            activity.slice(0, 10).map((a, i) => (
              <div key={i} className="activity-item">
                <div className="activity-dot" style={{ background: a.color }} />
                <div className="activity-text" dangerouslySetInnerHTML={{ __html: a.text }} />
                <div className="activity-time">{timeSince(a.ts)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
