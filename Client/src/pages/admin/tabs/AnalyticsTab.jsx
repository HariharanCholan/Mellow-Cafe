import React, { useEffect, useRef, useState } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineController, LineElement, PointElement } from 'chart.js';
import API_BASE_URL, { authFetch } from '@/config/api';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineController, LineElement, PointElement);

const AnalyticsTab = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const barRef = useRef(null);
  const lineRef = useRef(null);
  const barChart = useRef(null);
  const lineChart = useRef(null);

  useEffect(() => {
    authFetch(`${API_BASE_URL}/api/admin/stats`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Analytics fetch error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!stats) return;

    // Destroy old charts before redrawing
    if (barChart.current) { barChart.current.destroy(); barChart.current = null; }
    if (lineChart.current) { lineChart.current.destroy(); lineChart.current = null; }

    // Top items bar chart
    if (barRef.current && stats.topItems?.length > 0) {
      const labels = stats.topItems.map((i) => i.name);
      const data   = stats.topItems.map((i) => i.count);
      barChart.current = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Units Sold',
            data,
            backgroundColor: 'rgba(146,64,14,0.75)',
            borderColor: '#92400e',
            borderWidth: 1,
            borderRadius: 5,
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
        },
      });
    }

    // Revenue by day line chart
    if (lineRef.current && stats.revenueByDay && Object.keys(stats.revenueByDay).length > 0) {
      const sortedDays = Object.keys(stats.revenueByDay).sort();
      const revData    = sortedDays.map((d) => stats.revenueByDay[d]);
      lineChart.current = new Chart(lineRef.current, {
        type: 'line',
        data: {
          labels: sortedDays,
          datasets: [{
            label: 'Revenue (₹)',
            data: revData,
            borderColor: '#92400e',
            backgroundColor: 'rgba(146,64,14,0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 3,
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } },
        },
      });
    }
  }, [stats]);

  if (loading) return <div className="admin-loading">Loading analytics…</div>;
  if (error)   return <div className="admin-empty">⚠️ Could not load analytics: {error}</div>;

  return (
    <div>
      {/* Stat cards */}
      <div className="stat-grid">
        {[
          { icon: '📦', label: 'Total Orders',  value: stats.totalOrders ?? 0 },
          { icon: '💰', label: 'Total Revenue', value: `₹${(stats.totalRevenue ?? 0).toLocaleString('en-IN')}` },
          { icon: '📅', label: 'Today',         value: stats.todayOrders ?? 0 },
          { icon: '📆', label: 'This Week',     value: stats.weekOrders ?? 0 },
          { icon: '🗓️', label: 'This Month',    value: stats.monthOrders ?? 0 },
        ].map(({ icon, label, value }) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-label">{label}</div>
            <div className="stat-value">{value}</div>
          </div>
        ))}
      </div>

      {/* Top items chart */}
      <div className="section-card">
        <h2>🏆 Top Selling Items</h2>
        {stats.topItems?.length > 0
          ? <div className="chart-wrap"><canvas ref={barRef} /></div>
          : <div className="admin-empty">No order data yet.</div>
        }
      </div>

      {/* Revenue trend */}
      <div className="section-card">
        <h2>📈 Revenue Trend (Last 30 Days)</h2>
        {stats.revenueByDay && Object.keys(stats.revenueByDay).length > 0
          ? <div className="chart-wrap"><canvas ref={lineRef} /></div>
          : <div className="admin-empty">No revenue data yet.</div>
        }
      </div>
    </div>
  );
};

export default AnalyticsTab;
