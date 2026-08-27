import React, { useEffect, useRef, useState } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, DoughnutController, ArcElement, LineController, LineElement, PointElement } from 'chart.js';
import API_BASE_URL from '@/config/api';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, DoughnutController, ArcElement, LineController, LineElement, PointElement);

const AnalyticsTab = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const barRef = useRef(null);
  const lineRef = useRef(null);
  const barChart = useRef(null);
  const lineChart = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!stats) return;

    // Top items bar chart
    if (barRef.current) {
      if (barChart.current) barChart.current.destroy();
      const labels = (stats.topItems || []).map((i) => i.name);
      const data = (stats.topItems || []).map((i) => i.count);
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
    if (lineRef.current && stats.revenueByDay) {
      if (lineChart.current) lineChart.current.destroy();
      const sortedDays = Object.keys(stats.revenueByDay).sort();
      const revData = sortedDays.map((d) => stats.revenueByDay[d]);
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
  if (!stats) return <div className="admin-empty">Could not load analytics data.</div>;

  return (
    <div>
      {/* Stat cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{stats.totalOrders ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">₹{(stats.totalRevenue ?? 0).toLocaleString('en-IN')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-label">Today</div>
          <div className="stat-value">{stats.todayOrders ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📆</div>
          <div className="stat-label">This Week</div>
          <div className="stat-value">{stats.weekOrders ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🗓️</div>
          <div className="stat-label">This Month</div>
          <div className="stat-value">{stats.monthOrders ?? 0}</div>
        </div>
      </div>

      {/* Top items chart */}
      <div className="section-card">
        <h2>🏆 Top Selling Items</h2>
        {stats.topItems && stats.topItems.length > 0 ? (
          <div className="chart-wrap">
            <canvas ref={barRef} />
          </div>
        ) : (
          <div className="admin-empty">No order data yet.</div>
        )}
      </div>

      {/* Revenue trend chart */}
      <div className="section-card">
        <h2>📈 Revenue Trend (Last 30 Days)</h2>
        {stats.revenueByDay && Object.keys(stats.revenueByDay).length > 0 ? (
          <div className="chart-wrap">
            <canvas ref={lineRef} />
          </div>
        ) : (
          <div className="admin-empty">No revenue data yet.</div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsTab;
