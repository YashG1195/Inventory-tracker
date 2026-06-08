import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useInventory } from '../../context/InventoryContext';
import { getCategoryById } from '../../utils/helpers';

const CHART_HEIGHT = 220; // fixed chart area height in px

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
      <div style={{
        height: CHART_HEIGHT,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-muted)', fontSize: '0.85rem',
      }}>
        No data yet — add products to see the chart
      </div>
    );
  }

  return (
    <div>
      {/* ── Chart area: fixed height, center label is relative to THIS div only ── */}
      <div style={{ position: 'relative', height: CHART_HEIGHT }}>

        {/* Recharts donut — no inline labels */}
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
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
                `${value} units  (${total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/*
          Center label — positioned relative to the fixed-height chart div,
          NOT the full wrapper (which includes legend). This guarantees
          it always sits precisely in the donut hole regardless of legend size.
        */}
        <div style={{
          position: 'absolute',
          top:  CHART_HEIGHT / 2,   // exact pixel midpoint of chart
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 10,
        }}>
          <div style={{
            fontSize: '1.7rem', fontWeight: 800,
            lineHeight: 1, color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>
            {total.toLocaleString()}
          </div>
          <div style={{
            fontSize: '0.63rem', color: 'var(--text-muted)',
            marginTop: 4, letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            Total Units
          </div>
        </div>
      </div>

      {/* ── Legend: sits below the chart, not inside the positioned wrapper ── */}
      <div className="chart-legend" style={{ marginTop: 10 }}>
        {data.map((d, i) => {
          const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : '0.0';
          return (
            <div key={i} className="legend-item">
              <span className="legend-dot" style={{ background: d.color }} />
              <span className="legend-label">{d.name}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginRight: 8 }}>
                {pct}%
              </span>
              <span className="legend-value">{d.value.toLocaleString()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
