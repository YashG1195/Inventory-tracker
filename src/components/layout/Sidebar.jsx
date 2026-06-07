import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';
import { getStatus } from '../../utils/helpers';

const navItems = [
  { path: '/',           label: 'Dashboard',   icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>) },
  { path: '/inventory',  label: 'Inventory',   icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>) },
  { path: '/add',        label: 'Add Product', icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>) },
  { path: '/alerts',     label: 'Alerts',      icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>), hasBadge: true },
  { path: '/reports',    label: 'Reports',     icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>) },
  { path: '/categories', label: 'Categories',  icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h8M4 18h6"/></svg>) },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { products } = useInventory();
  const alertCount = products.filter(p => getStatus(p) !== 'in-stock').length;

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="3" width="7" height="7"/><rect x="15" y="3" width="7" height="7"/><rect x="2" y="14" width="7" height="7"/><rect x="15" y="14" width="7" height="7"/></svg>
        </div>
        {!collapsed && <span className="logo-text">StockSense</span>}
      </div>

      <nav className="sidebar-nav">
        {!collapsed && <div className="nav-section-label">MAIN MENU</div>}
        {navItems.slice(0, 5).map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
            {item.hasBadge && alertCount > 0 && !collapsed && (
              <span className="nav-badge">{alertCount}</span>
            )}
            {item.hasBadge && alertCount > 0 && collapsed && (
              <span className="nav-badge-dot"></span>
            )}
          </NavLink>
        ))}

        {!collapsed && <div className="nav-section-label" style={{ marginTop: '16px' }}>SETTINGS</div>}
        {navItems.slice(5).map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-avatar">Y</div>
        {!collapsed && (
          <div className="user-info">
            <div className="user-name">Yash Admin</div>
            <div className="user-role">Inventory Manager</div>
          </div>
        )}
      </div>
    </aside>
  );
}
