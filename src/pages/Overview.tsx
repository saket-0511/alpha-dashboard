import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Star, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import StatCard from '../components/StatCard';
import { useProducts } from '../hooks/useProducts';
import './Overview.css';

const COLORS = ['#7c6af5','#3ecf8e','#f6c90e','#f56565','#38bdf8','#fb923c','#a78bfa'];

export default function Overview() {
  const { allProducts, loading } = useProducts();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    if (!allProducts.length) return null;
    const total = allProducts.length;
    const avgRating = allProducts.reduce((s, p) => s + p.rating, 0) / total;
    const totalValue = allProducts.reduce((s, p) => s + p.price * p.stock, 0);
    const byCategory = allProducts.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const catData = Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count], i) => ({ name, count, fill: COLORS[i % COLORS.length] }));

    const topRated = [...allProducts].sort((a, b) => b.rating - a.rating).slice(0, 5);
    return { total, avgRating, totalValue, catData, topRated };
  }, [allProducts]);

  if (loading) return (
    <div className="page-loading">
      <div className="spinner" />
      <span>Loading dashboard…</span>
    </div>
  );

  return (
    <div className="overview-page">
      <div className="page-header">
        <div>
          <h1>Overview</h1>
          <p className="page-subtitle">Your product ecosystem at a glance</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/products')}>
          View Products <ArrowRight size={14} />
        </button>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Products" value={stats?.total ?? 0} icon={<Package size={20} />} color="accent" delay={0} />
        <StatCard title="Avg Rating" value={stats ? stats.avgRating.toFixed(2) : '—'} sub="out of 5.0" icon={<Star size={20} />} color="yellow" delay={60} />
        <StatCard title="Inventory Value" value={stats ? `$${(stats.totalValue / 1000).toFixed(1)}k` : '—'} sub="Total stock × price" icon={<DollarSign size={20} />} color="green" delay={120} />
        <StatCard title="Categories" value={stats?.catData.length ?? 0} sub="Distinct categories" icon={<TrendingUp size={20} />} color="red" delay={180} />
      </div>

      <div className="charts-row">
        <div className="chart-card" style={{ animationDelay: '200ms' }}>
          <div className="chart-header">
            <h3>Products by Category</h3>
            <span className="chart-badge">{stats?.catData.length} categories</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats?.catData} margin={{ top: 0, right: 0, left: -20, bottom: 40 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#5a5a6a' }} angle={-35} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize: 11, fill: '#5a5a6a' }} />
              <Tooltip
                contentStyle={{ background: '#18181f', border: '1px solid #2a2a35', borderRadius: 8, fontSize: 12 }}
                cursor={{ fill: 'rgba(124,106,245,0.06)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {stats?.catData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card" style={{ animationDelay: '260ms' }}>
          <div className="chart-header">
            <h3>Category Distribution</h3>
          </div>
          <div className="pie-wrapper">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={stats?.catData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} paddingAngle={2}>
                  {stats?.catData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#18181f', border: '1px solid #2a2a35', borderRadius: 8, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {stats?.catData.slice(0, 6).map((c, i) => (
                <div key={i} className="legend-item">
                  <span className="legend-dot" style={{ background: c.fill }} />
                  <span>{c.name}</span>
                  <span className="legend-count">{c.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="top-products-card" style={{ animationDelay: '320ms' }}>
        <div className="chart-header">
          <h3>Top Rated Products</h3>
          <button className="link-btn" onClick={() => navigate('/products')}>See all →</button>
        </div>
        <div className="top-products-list">
          {stats?.topRated.map((p, i) => (
            <div key={p.id} className="top-product-row" onClick={() => navigate(`/products/${p.id}`)}>
              <span className="rank mono">#{i + 1}</span>
              <img src={p.thumbnail} alt={p.title} />
              <div className="tp-info">
                <span className="tp-title">{p.title}</span>
                <span className="tp-cat">{p.category}</span>
              </div>
              <div className="tp-right">
                <span className="tp-price">${p.price}</span>
                <span className="tp-rating">★ {p.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
