import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import ProtectedRoute from './components/ui/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import ToastContainer from './components/ui/Toast';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AddProduct from './pages/AddProduct';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Categories from './pages/Categories';
import Login from './pages/Login';
import Register from './pages/Register';

// Inner shell — only rendered when authenticated
function AppShell() {
  const { isAuthenticated } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*"         element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
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
              <Route path="/"           element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/inventory"  element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
              <Route path="/add"        element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
              <Route path="/edit/:id"   element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
              <Route path="/alerts"     element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
              <Route path="/reports"    element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
              <Route path="/login"      element={<Navigate to="/" replace />} />
              <Route path="/register"   element={<Navigate to="/" replace />} />
              <Route path="*"           element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
      <ToastContainer />
    </InventoryProvider>
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
