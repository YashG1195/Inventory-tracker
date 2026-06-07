import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { DEFAULT_CATEGORIES, DEMO_PRODUCTS } from '../data/defaults';
import { uid } from '../utils/helpers';

// ─── Initial State ────────────────────────────────────────────────────────────
function loadInitial() {
  try {
    return {
      products:   JSON.parse(localStorage.getItem('ss_products'))   || [...DEMO_PRODUCTS],
      categories: JSON.parse(localStorage.getItem('ss_categories')) || [...DEFAULT_CATEGORIES],
      activity:   JSON.parse(localStorage.getItem('ss_activity'))   || [],
      toasts:     [],
    };
  } catch {
    return { products: [...DEMO_PRODUCTS], categories: [...DEFAULT_CATEGORIES], activity: [], toasts: [] };
  }
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    case 'ADD_PRODUCT':
      return { ...state, products: [action.payload, ...state.products] };

    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p),
      };

    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.payload) };

    case 'UPDATE_STOCK': {
      const { id, adjustment, type } = action.payload;
      return {
        ...state,
        products: state.products.map(p => {
          if (p.id !== id) return p;
          let qty = p.quantity;
          if (type === 'set')    qty = adjustment;
          if (type === 'add')    qty = qty + adjustment;
          if (type === 'remove') qty = Math.max(0, qty - adjustment);
          return { ...p, quantity: qty };
        }),
      };
    }

    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };

    case 'DELETE_CATEGORY':
      return { ...state, categories: state.categories.filter(c => c.id !== action.payload) };

    case 'LOG_ACTIVITY':
      return {
        ...state,
        activity: [action.payload, ...state.activity].slice(0, 50),
      };

    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };

    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadInitial);

  // Sync to localStorage whenever products/categories/activity change
  useEffect(() => {
    localStorage.setItem('ss_products',   JSON.stringify(state.products));
    localStorage.setItem('ss_categories', JSON.stringify(state.categories));
    localStorage.setItem('ss_activity',   JSON.stringify(state.activity));
  }, [state.products, state.categories, state.activity]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const addProduct = useCallback((data) => {
    const product = { ...data, id: uid(), createdAt: Date.now() };
    dispatch({ type: 'ADD_PRODUCT', payload: product });
    dispatch({ type: 'LOG_ACTIVITY', payload: { text: `<strong>${data.name}</strong> added to inventory (qty: ${data.quantity})`, color: '#10b981', ts: Date.now() } });
    showToast(`"${data.name}" added to inventory!`, 'success');
  }, []);

  const updateProduct = useCallback((data) => {
    dispatch({ type: 'UPDATE_PRODUCT', payload: { ...data, updatedAt: Date.now() } });
    dispatch({ type: 'LOG_ACTIVITY', payload: { text: `<strong>${data.name}</strong> was updated`, color: '#3b82f6', ts: Date.now() } });
    showToast(`"${data.name}" updated successfully!`, 'success');
  }, []);

  const deleteProduct = useCallback((id, name) => {
    dispatch({ type: 'DELETE_PRODUCT', payload: id });
    dispatch({ type: 'LOG_ACTIVITY', payload: { text: `<strong>${name}</strong> was removed from inventory`, color: '#ef4444', ts: Date.now() } });
    showToast(`"${name}" deleted.`, 'error');
  }, []);

  const updateStock = useCallback((id, adjustment, type, productName, unit, reason) => {
    dispatch({ type: 'UPDATE_STOCK', payload: { id, adjustment, type } });
    const product = state.products.find(p => p.id === id);
    const oldQty = product ? product.quantity : 0;
    let newQty = oldQty;
    if (type === 'set')    newQty = adjustment;
    if (type === 'add')    newQty = oldQty + adjustment;
    if (type === 'remove') newQty = Math.max(0, oldQty - adjustment);
    const diff = newQty - oldQty;
    const diffStr = (diff >= 0 ? '+' : '') + diff;
    dispatch({ type: 'LOG_ACTIVITY', payload: { text: `<strong>${productName}</strong> stock updated: ${diffStr} → ${newQty} ${unit}${reason ? ' (' + reason + ')' : ''}`, color: diff >= 0 ? '#10b981' : '#f59e0b', ts: Date.now() } });
    showToast(`Stock updated: ${productName} → ${newQty} ${unit}`, diff >= 0 ? 'success' : 'warning');
  }, [state.products]);

  const addCategory = useCallback((cat) => {
    dispatch({ type: 'ADD_CATEGORY', payload: cat });
    showToast(`Category "${cat.name}" added!`, 'success');
  }, []);

  const deleteCategory = useCallback((id, name) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
    showToast(`Category "${name}" deleted.`, 'success');
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    const id = uid();
    dispatch({ type: 'ADD_TOAST', payload: { id, message, type } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 4000);
  }, []);

  return (
    <InventoryContext.Provider value={{
      ...state,
      addProduct,
      updateProduct,
      deleteProduct,
      updateStock,
      addCategory,
      deleteCategory,
      showToast,
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used inside InventoryProvider');
  return ctx;
}
