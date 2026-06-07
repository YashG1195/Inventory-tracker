import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { uid } from '../utils/helpers';

const EMPTY = {
  name: '', sku: '', category: '', quantity: '', minStock: '10',
  price: '', unit: 'pcs', supplier: '', location: '', reorder: '5',
  notes: '', description: '',
};

export default function AddProduct() {
  const { products, categories, addProduct, updateProduct, showToast } = useInventory();
  const navigate = useNavigate();
  const { id } = useParams();   // present on /edit/:id route

  const isEdit = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (isEdit) {
      const p = products.find(pr => pr.id === id);
      if (!p) { navigate('/inventory'); return; }
      setForm({
        name: p.name, sku: p.sku, category: p.category,
        quantity: String(p.quantity), minStock: String(p.minStock || 10),
        price: String(p.price), unit: p.unit || 'pcs',
        supplier: p.supplier || '', location: p.location || '',
        reorder: String(p.reorder || 5), notes: p.notes || '',
        description: p.description || '',
      });
    }
  }, [id, isEdit]);

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim())     errs.name = 'Product name is required';
    if (!form.sku.trim())      errs.sku  = 'SKU is required';
    if (!form.category)        errs.category = 'Select a category';
    if (form.quantity === '' || isNaN(Number(form.quantity))) errs.quantity = 'Enter a valid quantity';
    if (form.price === ''     || isNaN(Number(form.price)))   errs.price    = 'Enter a valid price';
    return errs;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast('Please fix the errors before saving.', 'error');
      return;
    }

    const data = {
      id: isEdit ? id : uid(),
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category,
      quantity: parseInt(form.quantity),
      minStock: parseInt(form.minStock) || 10,
      price: parseFloat(form.price),
      unit: form.unit,
      supplier: form.supplier.trim(),
      location: form.location.trim(),
      reorder: parseInt(form.reorder) || 5,
      notes: form.notes.trim(),
      description: form.description.trim(),
    };

    if (isEdit) {
      updateProduct(data);
    } else {
      addProduct(data);
    }
    navigate('/inventory');
  }

  function Field({ id, label, required, error, children }) {
    return (
      <div className="form-group">
        <label htmlFor={id}>{label} {required && <span className="required">*</span>}</label>
        {children}
        {error && <span style={{ color: 'var(--red)', fontSize: '0.75rem' }}>{error}</span>}
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
          <p className="page-subtitle">Fill in the product details below</p>
        </div>
        <button className="btn-ghost" onClick={() => navigate('/inventory')}>← Back to Inventory</button>
      </div>

      <div className="form-grid">
        {/* Product Info */}
        <div className="form-card wide">
          <h3 className="form-section-title">Product Information</h3>
          <div className="form-row">
            <Field id="f-name" label="Product Name" required error={errors.name}>
              <input id="f-name" type="text" className={`form-input${errors.name ? ' error' : ''}`} placeholder="e.g. Wireless Mouse" value={form.name} onChange={e => set('name', e.target.value)} />
            </Field>
            <Field id="f-sku" label="SKU Code" required error={errors.sku}>
              <input id="f-sku" type="text" className="form-input" placeholder="e.g. WM-1042" value={form.sku} onChange={e => set('sku', e.target.value)} />
            </Field>
          </div>
          <div className="form-row">
            <Field id="f-category" label="Category" required error={errors.category}>
              <select id="f-category" className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                <option value="">Select a category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
              </select>
            </Field>
            <Field id="f-supplier" label="Supplier">
              <input id="f-supplier" type="text" className="form-input" placeholder="e.g. TechCorp Ltd." value={form.supplier} onChange={e => set('supplier', e.target.value)} />
            </Field>
          </div>
          <Field id="f-description" label="Description">
            <textarea id="f-description" className="form-input" rows="3" placeholder="Brief product description..." value={form.description} onChange={e => set('description', e.target.value)} />
          </Field>
        </div>

        {/* Stock & Pricing */}
        <div className="form-card">
          <h3 className="form-section-title">Stock & Pricing</h3>
          <Field id="f-qty" label="Current Quantity" required error={errors.quantity}>
            <input id="f-qty" type="number" className="form-input" placeholder="0" min="0" value={form.quantity} onChange={e => set('quantity', e.target.value)} />
          </Field>
          <Field id="f-min" label="Minimum Stock Threshold">
            <input id="f-min" type="number" className="form-input" placeholder="10" min="0" value={form.minStock} onChange={e => set('minStock', e.target.value)} />
          </Field>
          <Field id="f-price" label="Unit Price ($)" required error={errors.price}>
            <input id="f-price" type="number" className="form-input" placeholder="0.00" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} />
          </Field>
          <Field id="f-unit" label="Unit of Measure">
            <select id="f-unit" className="form-input" value={form.unit} onChange={e => set('unit', e.target.value)}>
              {['pcs','kg','lbs','L','m','box','pack'].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </Field>
        </div>

        {/* Location */}
        <div className="form-card">
          <h3 className="form-section-title">Location & Notes</h3>
          <Field id="f-loc" label="Warehouse Location">
            <input id="f-loc" type="text" className="form-input" placeholder="e.g. Shelf A-12" value={form.location} onChange={e => set('location', e.target.value)} />
          </Field>
          <Field id="f-reorder" label="Reorder Point">
            <input id="f-reorder" type="number" className="form-input" placeholder="5" min="0" value={form.reorder} onChange={e => set('reorder', e.target.value)} />
          </Field>
          <Field id="f-notes" label="Internal Notes">
            <textarea id="f-notes" className="form-input" rows="3" placeholder="Special handling, notes..." value={form.notes} onChange={e => set('notes', e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-ghost" onClick={() => setForm(EMPTY)}>Reset Form</button>
        <button className="btn-primary" onClick={handleSave}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          {isEdit ? 'Update Product' : 'Save Product'}
        </button>
      </div>
    </div>
  );
}
