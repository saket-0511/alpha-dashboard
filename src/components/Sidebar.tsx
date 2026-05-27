import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, BarChart3, Settings, ChevronLeft, ChevronRight, Zap, LogOut, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const ADMIN_NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const USER_NAV = [
  { to: '/products', icon: Package, label: 'Products' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const NAV = user?.role === 'admin' ? ADMIN_NAV : USER_NAV;

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <Zap size={20} className="logo-icon" />
          {!collapsed && <span className="logo-text">Alpha</span>}
        </div>
        <button className="collapse-btn" onClick={() => setCollapsed(c => !c)}>
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {!collapsed && (
        <div className="role-badge-wrap">
          <div className={`role-badge ${user?.role}`}>
            {user?.role === 'admin' ? <Shield size={11} /> : <User size={11} />}
            {user?.role === 'admin' ? 'Admin' : 'User'} View
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            {!collapsed && <span>{label}</span>}
            {collapsed && <span className="tooltip">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-avatar">
          <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.username}`} alt="User" />
          {!collapsed && (
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role === 'admin' ? 'Super Admin' : 'Standard User'}</span>
            </div>
          )}
        </div>
        <button className="logout-btn" onClick={logout} title="Logout">
          <LogOut size={15} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
