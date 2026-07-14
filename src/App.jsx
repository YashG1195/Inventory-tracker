import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import ProtectedRoute from './components/ui/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import ToastContainer from './components/ui/Toast';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AddProduct from './pages/AddProduct';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Categories from './pages/Categories';
import Login from './pages/Login';
import Register from './pages/Register';

// App shell — sidebar + topbar layout for authenticated pages
function AppShell() {
  const { isAuthenticated } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Routes>
      {/* ── Public routes (no shell) ─────────────────────────── */}
      <Route path="/"         element={<Landing />} />
      <Route path="/login"    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />

      {/* ── Protected routes (with sidebar + topbar shell) ───── */}
      <Route path="/*" element={
        isAuthenticated ? (
          <InventoryProvider>
            <div className="app-shell">
              <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(p => !p)}
              />
              <div className={`main-content${sidebarCollapsed ? ' expanded' : ''}`}>
                <Topbar onMenuClick={() => setSidebarCollapsed(p => !p)} />
                <div className="page-container">
                  <Routes>
                    <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/inventory"  element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
                    <Route path="/add"        element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
                    <Route path="/edit/:id"   element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
                    <Route path="/alerts"     element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
                    <Route path="/reports"    element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                    <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
                    <Route path="*"           element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </div>
              </div>
            </div>
            <ToastContainer />
          </InventoryProvider>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}
