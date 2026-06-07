import React, { useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import { getStatus, getCategoryById, formatCurrency } from '../utils/helpers';

export default function Reports() {
  const { products, categories } = useInventory();

  const stats = useMemo(() => {
    const totalValue = products.reduce((s, p) => s + p.quantity * p.price, 0);
    const avgStock   = products.length ? Math.round(products.reduce((s, p) => s + p.quantity, 0) / products.length) : 0;
    const catSet     = new Set(products.map(p => p.category));
    const inStockPct = products.length ? Math.round(products.filter(p => getStatus(p) === 'in-stock').length / products.length * 100) : 100;

    // Category breakdown
    const catMap = {};
    products.forEach(p => {
      if (!catMap[p.category]) catMap[p.category] = { count: 0, value: 0, qty: 0 };
      catMap[p.category].count++;
      catMap[p.category].value += p.quantity * p.price;
      catMap[p.category].qty   += p.quantity;
    });

    const catBreakdown = Object.entries(catMap)
      .sort(([, a], [, b]) => b.value - a.value)
      .map(([catId, data]) => ({ ...data, cat: getCategoryById(categories, catId) }));

    // Top 5 by total value
    const topProducts = [...products]
      .sort((a, b) => (b.quantity * b.price) - (a.quantity * a.price))
      .slice(0, 5);

    return { totalValue, avgStock, catCount: catSet.size, inStockPct, catBreakdown, topProducts };
  }, [products, categories]);

  function exportCSV() {
    const headers = ['Name','SKU','Category','Quantity','Unit','Price','Total Value','Status','Supplier','Location'];
    const rows = products.map(p => [
      `"${p.name}"`, `"${p.sku}"`, `"${getCategoryById(categories, p.category).name}"`,
      p.quantity, `"${p.unit}"`, p.price.toFixed(2),
      (p.quantity * p.price).toFixed(2),
      `"${getStatus(p) === 'in-stock' ? 'In Stock' : getStatus(p) === 'low-stock' ? 'Low Stock' : 'Out of Stock'}"`,
      `"${p.supplier || ''}"`, `"${p.location || ''}"`
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `stocksense-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Analytics and inventory insights</p>
        </div>
        <button className="btn-primary" onClick={exportCSV}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="reports-grid">
        {[
          { label: 'Inventory Value',   value: formatCurrency(stats.totalValue), sub: 'Total Stock Worth' },
          { label: 'Avg. Stock Level',  value: stats.avgStock,                   sub: 'Units per Product' },
          { label: 'Categories',        value: stats.catCount,                   sub: 'Active Categories' },
          { label: 'Stock Health',      value: stats.inStockPct + '%',           sub: 'Products In Stock' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="report-card">
            <h3>{label}</h3>
            <div className="report-value">{value}</div>
            <div className="report-label">{sub}</div>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      <div className="section-card" style={{ marginTop: 24 }}>
        <div className="section-header"><h3>Category Breakdown</h3></div>
        {stats.catBreakdown.length === 0 ? (
          <div style={{ padding: '20px', color: 'var(--text-muted)' }}>No data available.</div>
        ) : stats.catBreakdown.map(({ cat, count, qty, value }) => (
          <div key={cat.id || cat.name} className="cat-report-row">
            <span className="cat-dot" style={{ background: cat.color }} />
            <span style={{ fontSize: '1rem', marginRight: 4 }}>{cat.emoji}</span>
            <span className="cat-name">{cat.name}</span>
            <span className="cat-count">{count} item{count !== 1 ? 's' : ''}</span>
            <span className="cat-count">{qty} units</span>
            <span className="cat-val">{formatCurrency(value)}</span>
          </div>
        ))}
      </div>

      {/* Top Products */}
      <div className="section-card" style={{ marginTop: 24 }}>
        <div className="section-header"><h3>Top Valued Products</h3></div>
        {stats.topProducts.length === 0 ? (
          <div style={{ padding: '20px', color: 'var(--text-muted)' }}>No products yet.</div>
        ) : stats.topProducts.map((p, i) => (
          <div key={p.id} className="top-product-row">
            <span className="top-rank">#{i + 1}</span>
            <span style={{ fontSize: '1rem', marginRight: 6 }}>{getCategoryById(categories, p.category).emoji}</span>
            <span className="top-name">{p.name}</span>
            <span className="top-qty">{p.quantity} {p.unit}</span>
            <span className="top-val">{formatCurrency(p.quantity * p.price)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
