// ─── Unique ID ────────────────────────────────────────────────────────────────
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ─── Currency ─────────────────────────────────────────────────────────────────
export function formatCurrency(n) {
  return '$' + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ─── Stock Status ─────────────────────────────────────────────────────────────
export function getStatus(product) {
  if (product.quantity === 0) return 'out-of-stock';
  if (product.quantity <= (product.minStock || 10)) return 'low-stock';
  return 'in-stock';
}

export const STATUS_LABELS = {
  'in-stock':    'In Stock',
  'low-stock':   'Low Stock',
  'out-of-stock':'Out of Stock',
};

// ─── Time ago ────────────────────────────────────────────────────────────────
export function timeSince(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

// ─── Category helper ─────────────────────────────────────────────────────────
export function getCategoryById(categories, id) {
  return categories.find(c => c.id === id) || { name: id, color: '#94a3b8', emoji: '📦' };
}
