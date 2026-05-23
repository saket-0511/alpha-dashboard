import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, Menu, X } from 'lucide-react';
import './TopBar.css';

const BREADCRUMBS: Record<string, string> = {
  '/': 'Overview',
  '/products': 'Products',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
};

interface TopBarProps {
  onMenuClick?: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const location = useLocation();
  const [time, setTime] = useState(new Date());
  const [hasNotif, setHasNotif] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const pathParts = location.pathname.split('/').filter(Boolean);
  const page = BREADCRUMBS[location.pathname] || pathParts[pathParts.length - 1] || 'Overview';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={18} />
        </button>
        <div className="breadcrumb">
          <span className="breadcrumb-base">Dashboard</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{page}</span>
        </div>
      </div>
      <div className="topbar-right">
        <div className="topbar-time mono">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <button className="notif-btn" onClick={() => setHasNotif(false)}>
          <Bell size={16} />
          {hasNotif && <span className="notif-dot" />}
        </button>
        <div className="topbar-avatar">
          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=admin" alt="User" />
          <div className="online-dot" />
        </div>
      </div>
    </header>
  );
}
