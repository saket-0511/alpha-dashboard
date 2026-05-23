import React, { useState } from 'react';
import { User, Bell, Palette, Shield } from 'lucide-react';
import './Settings.css';

export default function Settings() {
  const [name, setName] = useState('Admin User');
  const [email, setEmail] = useState('admin@alpha.io');
  const [notifications, setNotifications] = useState({ email: true, push: false, weekly: true });
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="page-subtitle">Manage your account and preferences</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <div className="settings-section-header">
            <User size={16} />
            <span>Profile</span>
          </div>
          <div className="settings-avatar-row">
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=admin" alt="Avatar" className="settings-avatar" />
            <div>
              <div className="settings-avatar-name">{name}</div>
              <div className="settings-avatar-role">Super Admin</div>
            </div>
          </div>
          <div className="field-group">
            <label>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="field-group">
            <label>Email Address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="field-group">
            <label>Role</label>
            <input value="Super Admin" readOnly />
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-section-header">
            <Bell size={16} />
            <span>Notifications</span>
          </div>
          {([
            ['email', 'Email Notifications', 'Receive updates via email'],
            ['push', 'Push Notifications', 'Browser push alerts'],
            ['weekly', 'Weekly Report', 'Summary every Monday'],
          ] as [keyof typeof notifications, string, string][]).map(([key, label, desc]) => (
            <div key={key} className="toggle-row">
              <div>
                <div className="toggle-label">{label}</div>
                <div className="toggle-desc">{desc}</div>
              </div>
              <button
                className={`toggle-switch ${notifications[key] ? 'on' : ''}`}
                onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
              >
                <span className="toggle-knob" />
              </button>
            </div>
          ))}
        </div>

        <div className="settings-card">
          <div className="settings-section-header">
            <Palette size={16} />
            <span>Appearance</span>
          </div>
          <div className="appearance-options">
            {['Dark', 'Light', 'System'].map(t => (
              <button key={t} className={`theme-btn ${t === 'Dark' ? 'active' : ''}`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-section-header">
            <Shield size={16} />
            <span>Security</span>
          </div>
          <div className="field-group">
            <label>Current Password</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <div className="field-group">
            <label>New Password</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <div className="field-group">
            <label>Confirm Password</label>
            <input type="password" placeholder="••••••••" />
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn-primary" onClick={save}>
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
        <button className="btn-secondary">Cancel</button>
      </div>
    </div>
  );
}
