import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, BarChart3, Settings,
  ChevronLeft, ChevronRight, Zap
} from 'lucide-react';
import './Sidebar.css';

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

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
          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=admin" alt="User" />
          {!collapsed && (
            <div className="user-info">
              <span className="user-name">Admin</span>
              <span className="user-role">Super Admin</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
