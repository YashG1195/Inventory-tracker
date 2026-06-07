import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { useInventory } from '../../context/InventoryContext';
import { getStatus, getCategoryById } from '../../utils/helpers';

const STATUS_COLORS = {
  'in-stock':    '#10b981',
  'low-stock':   '#f59e0b',
  'out-of-stock':'#ef4444',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1e2235', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      <p style={{ color: '#f1f5f9', fontWeight: 600, marginBottom: 4 }}>{label}</p>
      <p style={{ color: payload[0].fill }}>Quantity: <strong>{payload[0].value}</strong></p>
    </div>
  );
};

export default function StockBarChart() {
  const { products, categories } = useInventory();

  const data = useMemo(() => (
    [...products]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 12)
      .map(p => ({
        name: p.name.length > 12 ? p.name.slice(0, 12) + '…' : p.name,
        fullName: p.name,
        quantity: p.quantity,
        status: getStatus(p),
        color: STATUS_COLORS[getStatus(p)],
      }))
  ), [products, categories]);

  if (data.length === 0) {
    return (
      <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        Add products to see the chart
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: '#64748b', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Bar dataKey="quantity" radius={[4, 4, 0, 0]} maxBarSize={36}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
