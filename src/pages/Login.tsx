import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap, Eye, EyeOff, Shield, User } from 'lucide-react';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulate request
    const ok = login(username, password);
    if (!ok) {
      setError('Invalid username or password.');
    }
    setLoading(false);
  };

  const fillDemo = (role: 'admin' | 'user') => {
    if (role === 'admin') { setUsername('admin'); setPassword('admin123'); }
    else { setUsername('user'); setPassword('user123'); }
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-blob blob1" />
        <div className="login-blob blob2" />
      </div>

      <div className="login-card">
        <div className="login-logo">
          <Zap size={24} />
          <span>Alpha</span>
        </div>

        <div className="login-header">
          <h1>Welcome back</h1>
          <p>Sign in to your dashboard</p>
        </div>

        <div className="demo-accounts">
          <button className="demo-btn admin-demo" onClick={() => fillDemo('admin')}>
            <Shield size={13} />
            Admin Demo
          </button>
          <button className="demo-btn user-demo" onClick={() => fillDemo('user')}>
            <User size={13} />
            User Demo
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label>Username</label>
            <input
              type="text"
              placeholder="admin or user"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="login-field">
            <label>Password</label>
            <div className="password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button type="button" className="eye-btn" onClick={() => setShowPassword(s => !s)}>
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : 'Sign In'}
          </button>
        </form>

        <div className="login-roles">
          <div className="role-info">
            <Shield size={12} />
            <div>
              <strong>Admin</strong> — Full access, analytics, publish/hide products
            </div>
          </div>
          <div className="role-info">
            <User size={12} />
            <div>
              <strong>User</strong> — Products & detail pages only (published only)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
