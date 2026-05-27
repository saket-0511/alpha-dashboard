import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PublishedProvider } from './context/PublishedContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Login from './pages/Login';
import './App.css';

const Overview = lazy(() => import('./pages/Overview'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));

function PageLoader() {
  return <div className="page-loading"><div className="spinner" /><span>Loading…</span></div>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user?.role !== 'admin') return <Navigate to="/products" replace />;
  return <>{children}</>;
}

function AppShell() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return <Login />;

  return (
    <div className="app-shell">
      <Sidebar />
      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}
      <div className="main-area">
        <TopBar onMenuClick={() => setMobileOpen(m => !m)} />
        <main className="main-content">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={
                <AdminRoute><Overview /></AdminRoute>
              } />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/analytics" element={
                <AdminRoute><Analytics /></AdminRoute>
              } />
              <Route path="/settings" element={
                <AdminRoute><Settings /></AdminRoute>
              } />
              <Route path="*" element={<Navigate to="/products" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PublishedProvider>
          <AppShell />
        </PublishedProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
