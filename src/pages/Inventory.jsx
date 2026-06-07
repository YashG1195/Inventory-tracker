import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { getStatus, getCategoryById, formatCurrency } from '../utils/helpers';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';

export default function Inventory() {
  const { products, categories, deleteProduct, updateStock } = useInventory();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [catFilter, setCatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Stock update modal state
  const [stockModal, setStockModal] = useState({ show: false, product: null });
  const [adjType, setAdjType] = useState('set');
  const [adjQty, setAdjQty] = useState('');
  const [adjReason, setAdjReason] = useState('');

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ show: false, product: null });

  // Update search from URL param
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearch(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let prods = [...products];
    if (search)       prods = prods.filter(p => `${p.name} ${p.sku} ${p.category} ${p.supplier}`.toLowerCase().includes(search.toLowerCase()));
    if (catFilter)    prods = prods.filter(p => p.category === catFilter);
    if (statusFilter) prods = prods.filter(p => getStatus(p) === statusFilter);
    prods.sort((a, b) => {
      if (sortBy === 'name')     return a.name.localeCompare(b.name);
      if (sortBy === 'quantity') return b.quantity - a.quantity;
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      if (sortBy === 'price')    return b.price - a.price;
      return 0;
    });
    return prods;
  }, [products, search, catFilter, statusFilter, sortBy]);

  const totalValue = filtered.reduce((s, p) => s + p.quantity * p.price, 0);

  function openStockModal(product) {
    setStockModal({ show: true, product });
    setAdjType('set');
    setAdjQty('');
    setAdjReason('');
  }

  function applyStockUpdate() {
    const qty = parseInt(adjQty);
    if (isNaN(qty) || qty < 0) return;
    const { product } = stockModal;
    updateStock(product.id, qty, adjType, product.name, product.unit, adjReason);
    setStockModal({ show: false, product: null });
  }

  function handleDelete() {
    deleteProduct(deleteModal.product.id, deleteModal.product.name);
    setDeleteModal({ show: false, product: null });
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory</h1>
          <p className="page-subtitle">Manage and monitor all products</p>
        </div>
        <div className="page-header-actions">
          <div className="filter-group">
            <select className="select-input" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
            </select>
            <select className="select-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
          <button className="btn-primary" onClick={() => navigate('/add')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Product
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="table-controls">
        <div className="search-bar inline">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Search by name, SKU, supplier..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem' }} onClick={() => setSearch('')}>✕</button>}
        </div>
        <div className="sort-group">
          <span>Sort by:</span>
          <select className="select-input sm" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="name">Name</option>
            <option value="quantity">Quantity</option>
            <option value="category">Category</option>
            <option value="price">Price</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        {filtered.length === 0 ? (
          <div className="table-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            <p>No products found</p>
            <button className="btn-primary sm" onClick={() => navigate('/add')}>Add Product</button>
          </div>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const cat = getCategoryById(categories, p.category);
                const status = getStatus(p);
                const qtyColor = status === 'out-of-stock' ? 'var(--red)' : status === 'low-stock' ? 'var(--yellow)' : 'var(--text-primary)';
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="product-cell">
                        <div className="product-avatar" style={{ background: `${cat.color}22` }}>{cat.emoji || '📦'}</div>
                        <div>
                          <div className="product-name">{p.name}</div>
                          <div className="product-sku-small">{p.supplier || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td><code style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{p.sku}</code></td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${cat.color}18`, color: cat.color, padding: '3px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 600 }}>
                        {cat.emoji} {cat.name}
                      </span>
                    </td>
                    <td>
                      <span className="qty-cell" style={{ color: qtyColor }}>
                        {p.quantity} <span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--text-muted)' }}>{p.unit}</span>
                      </span>
                    </td>
                    <td>{formatCurrency(p.price)}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(p.quantity * p.price)}</td>
                    <td><StatusBadge status={status} /></td>
                    <td>
                      <div className="action-btns">
                        <button className="action-btn" title="Update Stock" onClick={() => openStockModal(p)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.73"/></svg>
                        </button>
                        <button className="action-btn edit-nav" title="Edit" onClick={() => navigate(`/edit/${p.id}`)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button className="action-btn danger" title="Delete" onClick={() => setDeleteModal({ show: true, product: p })}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {filtered.length > 0 && (
        <div className="table-footer">
          <span>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</span>
          <span>Total Value: {formatCurrency(totalValue)}</span>
        </div>
      )}

      {/* Stock Update Modal */}
      <Modal
        show={stockModal.show}
        onClose={() => setStockModal({ show: false, product: null })}
        title="Update Stock Quantity"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setStockModal({ show: false, product: null })}>Cancel</button>
            <button className="btn-primary" onClick={applyStockUpdate}>Update Stock</button>
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
                    <input type="radio" name="adj" checked={adjType === val} onChange={() => setAdjType(val)} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input type="number" className="form-input" min="0" value={adjQty} onChange={e => setAdjQty(e.target.value)} placeholder="Enter quantity" />
            </div>
            <div className="form-group">
              <label>Reason (optional)</label>
              <input type="text" className="form-input" value={adjReason} onChange={e => setAdjReason(e.target.value)} placeholder="e.g. New shipment received" />
            </div>
          </>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        show={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, product: null })}
        title="Delete Product"
        size="sm"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setDeleteModal({ show: false, product: null })}>Cancel</button>
            <button className="btn-danger" onClick={handleDelete}>Delete</button>
          </>
        }
      >
        {deleteModal.product && (
          <p>Are you sure you want to delete <strong>{deleteModal.product.name}</strong>? This action cannot be undone.</p>
        )}
      </Modal>
    </div>
  );
}
