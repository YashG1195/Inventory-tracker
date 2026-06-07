import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { uid } from '../utils/helpers';

const RANDOM_EMOJIS = ['🗂️','📁','🏷️','🛒','📦','🔖','🎁','💼','🧩','🪴'];

export default function Categories() {
  const { products, categories, addCategory, deleteCategory } = useInventory();
  const [name, setName]   = useState('');
  const [color, setColor] = useState('#7c3aed');

  const countMap = {};
  products.forEach(p => { countMap[p.category] = (countMap[p.category] || 0) + 1; });

  function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = trimmed.toLowerCase().replace(/\s+/g, '-');
    if (categories.find(c => c.id === id)) return;
    addCategory({
      id,
      name: trimmed,
      color,
      emoji: RANDOM_EMOJIS[Math.floor(Math.random() * RANDOM_EMOJIS.length)],
    });
    setName('');
  }

  function handleDelete(cat) {
    if (countMap[cat.id] > 0) return; // Guard: has products
    deleteCategory(cat.id, cat.name);
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">Manage product categories</p>
        </div>
      </div>

      <div className="cat-add-row">
        <input
          type="text"
          className="form-input"
          placeholder="New category name..."
          style={{ maxWidth: 300 }}
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <input
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
          title="Pick category color"
          style={{ width: 40, height: 40, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 6 }}
        />
        <button className="btn-primary" onClick={handleAdd}>Add Category</button>
      </div>

      <div className="categories-grid">
        {categories.map(cat => {
          const count = countMap[cat.id] || 0;
          const canDelete = count === 0;
          return (
            <div key={cat.id} className="category-card" style={{ borderLeft: `3px solid ${cat.color}` }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: cat.color, flexShrink: 0 }} />
              <div style={{ fontSize: '1.2rem' }}>{cat.emoji || '📦'}</div>
              <div style={{ flex: 1 }}>
                <div className="cat-card-name">{cat.name}</div>
                <div className="cat-card-count">{count} product{count !== 1 ? 's' : ''}</div>
              </div>
              <button
                className="cat-delete"
                title={canDelete ? 'Delete category' : 'Cannot delete: has products'}
                onClick={() => handleDelete(cat)}
                style={{ opacity: canDelete ? 1 : 0.3, cursor: canDelete ? 'pointer' : 'not-allowed' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.5"><path d="M4 6h16M4 12h8M4 18h6"/></svg>
          <h3>No categories</h3>
          <p>Add a category above to get started.</p>
        </div>
      )}
    </div>
  );
}
