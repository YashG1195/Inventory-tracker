import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InventoryProvider } from './context/InventoryContext';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import ToastContainer from './components/ui/Toast';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AddProduct from './pages/AddProduct';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Categories from './pages/Categories';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <InventoryProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(p => !p)}
          />
          <div className={`main-content${sidebarCollapsed ? ' expanded' : ''}`}>
            <Topbar onMenuClick={() => setSidebarCollapsed(p => !p)} />
            <div className="page-container">
              <Routes>
                <Route path="/"            element={<Dashboard />} />
                <Route path="/inventory"   element={<Inventory />} />
                <Route path="/add"         element={<AddProduct />} />
                <Route path="/edit/:id"    element={<AddProduct />} />
                <Route path="/alerts"      element={<Alerts />} />
                <Route path="/reports"     element={<Reports />} />
                <Route path="/categories"  element={<Categories />} />
              </Routes>
            </div>
          </div>
        </div>
        <ToastContainer />
      </BrowserRouter>
    </InventoryProvider>
  );
}
