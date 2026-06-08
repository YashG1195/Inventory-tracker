import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useInventory } from '../../context/InventoryContext';
import { getCategoryById } from '../../utils/helpers';

export default function DonutChart() {
  const { products, categories } = useInventory();

  const data = useMemo(() => {
    const catMap = {};
    products.forEach(p => {
      if (!catMap[p.category]) catMap[p.category] = 0;
      catMap[p.category] += p.quantity;
    });
    return Object.entries(catMap)
      .filter(([, v]) => v > 0)
      .map(([catId, value]) => {
        const cat = getCategoryById(categories, catId);
        return { name: `${cat.emoji || ''} ${cat.name}`.trim(), value, color: cat.color };
      });
  }, [products, categories]);

  const total = data.reduce((s, d) => s + d.value, 0);

  if (data.length === 0) {
    return (
      <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        No data yet
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Donut Chart — no inline labels to avoid center overlap */}
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={68}
            outerRadius={100}
            dataKey="value"
            labelLine={false}
            label={false}
            strokeWidth={2.5}
            stroke="#131620"
            animationBegin={0}
            animationDuration={700}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#1e2235',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              fontSize: 12,
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}
            itemStyle={{ color: '#f1f5f9' }}
            formatter={(value, name) => [
              `${value} units (${total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)`,
              name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Clean center label — no overlap */}
      <div style={{
        position: 'absolute',
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{ fontSize: '1.65rem', fontWeight: 800, lineHeight: 1, color: 'var(--text-primary)' }}>
          {total.toLocaleString()}
        </div>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 3, letterSpacing: '0.04em' }}>
          Total Units
        </div>
      </div>

      {/* Legend with percentage shown per item */}
      <div className="chart-legend">
        {data.map((d, i) => {
          const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : 0;
          return (
            <div key={i} className="legend-item">
              <span className="legend-dot" style={{ background: d.color }} />
              <span className="legend-label">{d.name}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginRight: 6 }}>
                {pct}%
              </span>
              <span className="legend-value">{d.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
