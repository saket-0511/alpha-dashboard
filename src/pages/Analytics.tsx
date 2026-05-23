import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Package, Star, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import StatCard from '../components/StatCard';
import { useProducts } from '../hooks/useProducts';
import './Analytics.css';

const COLORS = ['#7c6af5','#3ecf8e','#f6c90e','#f56565','#38bdf8','#fb923c','#a78bfa','#34d399','#fbbf24','#f87171'];

export default function Analytics() {
  const { allProducts, loading } = useProducts();

  const data = useMemo(() => {
    if (!allProducts.length) return null;

    const total = allProducts.length;
    const avgRating = allProducts.reduce((s, p) => s + p.rating, 0) / total;
    const totalValue = allProducts.reduce((s, p) => s + p.price * p.stock, 0);
    const outOfStock = allProducts.filter(p => p.stock === 0).length;

    const byCategory = allProducts.reduce((acc, p) => {
      if (!acc[p.category]) acc[p.category] = { count: 0, totalRating: 0, totalValue: 0, totalStock: 0 };
      acc[p.category].count++;
      acc[p.category].totalRating += p.rating;
      acc[p.category].totalValue += p.price * p.stock;
      acc[p.category].totalStock += p.stock;
      return acc;
    }, {} as Record<string, any>);

    const catData = Object.entries(byCategory)
      .map(([name, v]: any, i) => ({
        name,
        count: v.count,
        avgRating: +(v.totalRating / v.count).toFixed(2),
        inventoryValue: Math.round(v.totalValue),
        avgStock: Math.round(v.totalStock / v.count),
        fill: COLORS[i % COLORS.length]
      }))
      .sort((a, b) => b.count - a.count);

    // Price distribution buckets
    const buckets = [
      { range: '$0–25', min: 0, max: 25 },
      { range: '$25–50', min: 25, max: 50 },
      { range: '$50–100', min: 50, max: 100 },
      { range: '$100–250', min: 100, max: 250 },
      { range: '$250–500', min: 250, max: 500 },
      { range: '$500+', min: 500, max: Infinity },
    ];
    const priceData = buckets.map(b => ({
      range: b.range,
      count: allProducts.filter(p => p.price >= b.min && p.price < b.max).length
    }));

    // Rating distribution
    const ratingData = [1,2,3,4,5].map(r => ({
      rating: `${r}★`,
      count: allProducts.filter(p => Math.round(p.rating) === r).length
    }));

    // Top 5 categories by inventory value
    const topValueCats = [...catData].sort((a, b) => b.inventoryValue - a.inventoryValue).slice(0, 5);

    // Radar data for top 6 categories
    const radarData = catData.slice(0, 6).map(c => ({
      category: c.name,
      Products: c.count,
      Rating: +(c.avgRating * 20).toFixed(0),
      'Avg Stock': Math.min(c.avgStock, 100),
    }));

    return { total, avgRating, totalValue, outOfStock, catData, priceData, ratingData, topValueCats, radarData };
  }, [allProducts]);

  if (loading) return <div className="page-loading"><div className="spinner" /><span>Loading analytics…</span></div>;

  return (
    <div className="analytics-page">
      <div className="page-header" style={{ animationDelay: '0ms' }}>
        <div>
          <h1>Analytics</h1>
          <p className="page-subtitle">Deep dive into your product data</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Products" value={data?.total ?? 0} icon={<Package size={20} />} color="accent" delay={0} />
        <StatCard title="Average Rating" value={data ? data.avgRating.toFixed(2) : '—'} sub="across all products" icon={<Star size={20} />} color="yellow" delay={60} />
        <StatCard title="Total Inventory Value" value={data ? `$${(data.totalValue / 1000).toFixed(1)}k` : '—'} sub="stock × price" icon={<DollarSign size={20} />} color="green" delay={120} />
        <StatCard title="Out of Stock" value={data?.outOfStock ?? 0} sub="products" icon={<AlertTriangle size={20} />} color="red" delay={180} />
      </div>

      <div className="analytics-grid">
        {/* Bar: category count */}
        <div className="chart-card wide" style={{ animationDelay: '200ms' }}>
          <div className="chart-header">
            <h3>Products per Category</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.catData} margin={{ left: -10, bottom: 50, right: 8 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#5a5a6a' }} angle={-35} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize: 11, fill: '#5a5a6a' }} />
              <Tooltip contentStyle={{ background: '#18181f', border: '1px solid #2a2a35', borderRadius: 8, fontSize: 12 }} cursor={{ fill: 'rgba(124,106,245,0.06)' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data?.catData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Rating distribution */}
        <div className="chart-card" style={{ animationDelay: '240ms' }}>
          <div className="chart-header"><h3>Rating Distribution</h3></div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data?.ratingData} margin={{ left: -10 }}>
              <XAxis dataKey="rating" tick={{ fontSize: 12, fill: '#5a5a6a' }} />
              <YAxis tick={{ fontSize: 11, fill: '#5a5a6a' }} />
              <Tooltip contentStyle={{ background: '#18181f', border: '1px solid #2a2a35', borderRadius: 8, fontSize: 12 }} cursor={{ fill: 'rgba(246,201,14,0.06)' }} />
              <Bar dataKey="count" fill="#f6c90e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Price distribution */}
        <div className="chart-card" style={{ animationDelay: '280ms' }}>
          <div className="chart-header"><h3>Price Distribution</h3></div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data?.priceData} margin={{ left: -10 }}>
              <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#5a5a6a' }} />
              <YAxis tick={{ fontSize: 11, fill: '#5a5a6a' }} />
              <Tooltip contentStyle={{ background: '#18181f', border: '1px solid #2a2a35', borderRadius: 8, fontSize: 12 }} cursor={{ fill: 'rgba(62,207,142,0.06)' }} />
              <Bar dataKey="count" fill="#3ecf8e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Avg Stock */}
        <div className="chart-card" style={{ animationDelay: '320ms' }}>
          <div className="chart-header"><h3>Avg Stock per Category</h3></div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data?.catData.slice(0,8)} margin={{ left: -10, bottom: 45 }}>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#5a5a6a' }} angle={-35} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize: 11, fill: '#5a5a6a' }} />
              <Tooltip contentStyle={{ background: '#18181f', border: '1px solid #2a2a35', borderRadius: 8, fontSize: 12 }} cursor={{ fill: 'rgba(56,189,248,0.06)' }} />
              <Bar dataKey="avgStock" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top by inventory value */}
        <div className="chart-card wide" style={{ animationDelay: '360ms' }}>
          <div className="chart-header"><h3>Top Categories by Inventory Value</h3></div>
          <div className="inv-table">
            {data?.topValueCats.map((c, i) => (
              <div key={c.name} className="inv-row">
                <span className="inv-rank mono">#{i + 1}</span>
                <div className="inv-bar-wrap">
                  <div className="inv-name">{c.name}</div>
                  <div className="inv-bar-bg">
                    <div
                      className="inv-bar-fill"
                      style={{
                        width: `${(c.inventoryValue / data.topValueCats[0].inventoryValue) * 100}%`,
                        background: c.fill
                      }}
                    />
                  </div>
                </div>
                <span className="inv-val mono">${(c.inventoryValue / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
