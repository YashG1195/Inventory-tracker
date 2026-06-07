import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { getStatus, getCategoryById } from '../utils/helpers';
import Modal from '../components/ui/Modal';

export default function Alerts() {
  const { products, categories, updateStock } = useInventory();
  const [stockModal, setStockModal] = useState({ show: false, product: null });
  const [adjType, setAdjType] = useState('add');
  const [adjQty, setAdjQty] = useState('');
  const [adjReason, setAdjReason] = useState('');

  const alerts = products.filter(p => getStatus(p) !== 'in-stock')
    .sort((a, b) => {
      // Out of stock first, then low stock
      const sa = getStatus(a) === 'out-of-stock' ? 0 : 1;
      const sb = getStatus(b) === 'out-of-stock' ? 0 : 1;
      return sa - sb;
    });

  function openRestock(product) {
    setStockModal({ show: true, product });
    setAdjType('add');
    setAdjQty('');
    setAdjReason('New shipment received');
  }

  function applyRestock() {
    const qty = parseInt(adjQty);
    if (isNaN(qty) || qty < 0) return;
    const { product } = stockModal;
    updateStock(product.id, qty, adjType, product.name, product.unit, adjReason);
    setStockModal({ show: false, product: null });
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Stock Alerts</h1>
          <p className="page-subtitle">Products requiring immediate attention</p>
        </div>
        {alerts.length > 0 && (
          <span style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.25)', padding: '6px 14px', borderRadius: 99, fontSize: '0.82rem', fontWeight: 600 }}>
            {alerts.length} Alert{alerts.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1"><polyline points="20 6 9 17 4 12"/></svg>
          <h3>No Alerts 🎉</h3>
          <p>All products are well-stocked. Great job!</p>
        </div>
      ) : (
        <div>
          {alerts.map(p => {
            const status = getStatus(p);
            const isOut = status === 'out-of-stock';
            const cat = getCategoryById(categories, p.category);
            return (
              <div key={p.id} className={`alert-card ${isOut ? 'critical' : 'warning'}`}>
                <div className={`alert-icon ${isOut ? 'red' : 'yellow'}`}>
                  {isOut ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  )}
                </div>
                <div className="alert-body">
                  <div className="alert-title">
                    {p.name}{' '}
                    <code style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{p.sku}</code>
                    {' '}
                    <span style={{ background: `${cat.color}18`, color: cat.color, padding: '1px 8px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600 }}>
                      {cat.emoji} {cat.name}
                    </span>
                  </div>
                  <div className="alert-desc">
                    {isOut
                      ? '🔴 Out of stock — reorder immediately'
                      : `🟡 Low stock: ${p.quantity} ${p.unit} remaining (minimum: ${p.minStock})`}
                    {p.location ? ` · 📍 ${p.location}` : ''}
                    {p.supplier ? ` · 🏭 ${p.supplier}` : ''}
                  </div>
                </div>
                <button className="btn-primary sm" onClick={() => openRestock(p)}>
                  Restock
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Restock Modal */}
      <Modal
        show={stockModal.show}
        onClose={() => setStockModal({ show: false, product: null })}
        title="Restock Product"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setStockModal({ show: false, product: null })}>Cancel</button>
            <button className="btn-primary" onClick={applyRestock}>Apply Restock</button>
          </>
        }
      >
        {stockModal.product && (
          <>
            <p className="modal-product-name">{stockModal.product.name}</p>
            <div className="modal-stock-info">
              <span>Current: <strong>{stockModal.product.quantity} {stockModal.product.unit}</strong></span>
              <span>Min: <strong>{stockModal.product.minStock} {stockModal.product.unit}</strong></span>
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label>Adjustment Type</label>
              <div className="radio-group">
                {[['set','Set Exact'],['add','Add (+)'],['remove','Remove (−)']].map(([val, label]) => (
                  <label key={val} className="radio-label">
                    <input type="radio" name="adj-alerts" checked={adjType === val} onChange={() => setAdjType(val)} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input type="number" className="form-input" min="0" value={adjQty} onChange={e => setAdjQty(e.target.value)} placeholder="Enter quantity to add" autoFocus />
            </div>
            <div className="form-group">
              <label>Reason</label>
              <input type="text" className="form-input" value={adjReason} onChange={e => setAdjReason(e.target.value)} />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
