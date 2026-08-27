import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import './adminDashboard.css';
import AnalyticsTab from './tabs/AnalyticsTab';
import StockMenuTab from './tabs/StockMenuTab';
import OrdersTab from './tabs/OrdersTab';
import AccessRequestsTab from './tabs/AccessRequestsTab';

const tabs = [
  { id: 'analytics', label: '📊 Analytics' },
  { id: 'stock',     label: '🛒 Stock & Menu' },
  { id: 'orders',    label: '📦 Orders' },
  { id: 'access',    label: '🔐 Access Requests' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'analytics': return <AnalyticsTab />;
      case 'stock':     return <StockMenuTab />;
      case 'orders':    return <OrdersTab />;
      case 'access':    return <AccessRequestsTab />;
      default:          return null;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="brand">
          <div className="brand-logo">☕</div>
          <div>
            <div className="brand-name">Mellow Cafe</div>
            <div className="brand-sub">Admin Dashboard</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {user && (
            <span style={{ fontSize: '.8rem', color: 'var(--admin-muted)' }}>
              Signed in as <strong style={{ color: 'var(--admin-text)' }}>{user.name || user.email}</strong>{' '}
              <span style={{ background: 'var(--admin-accent-light)', color: 'var(--admin-accent)', borderRadius: 999, padding: '1px 8px', fontSize: '.7rem', fontWeight: 600 }}>
                {user.role}
              </span>
            </span>
          )}
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="tab-content">{renderTab()}</div>
    </div>
  );
};

export default AdminDashboard;
