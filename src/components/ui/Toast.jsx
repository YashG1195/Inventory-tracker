import React, { useEffect } from 'react';
import { useInventory } from '../../context/InventoryContext';

const ICONS = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };

export default function ToastContainer() {
  const { toasts } = useInventory();

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>
  );
}

function Toast({ toast }) {
  return (
    <div className={`toast ${toast.type}`}>
      <span className="toast-icon">{ICONS[toast.type]}</span>
      <span className="toast-text">{toast.message}</span>
    </div>
  );
}
