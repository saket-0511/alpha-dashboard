import React, { memo } from 'react';
import './StatCard.css';

interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color?: 'accent' | 'green' | 'yellow' | 'red';
  delay?: number;
}

const StatCard = memo(({ title, value, sub, icon, color = 'accent', delay = 0 }: StatCardProps) => {
  return (
    <div className={`stat-card stat-card--${color}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-body">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  );
});

export default StatCard;
