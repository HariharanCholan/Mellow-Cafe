import React, { useEffect, useState } from 'react';
import API_BASE_URL from '@/config/api';

const VALID_ROLES = ['worker', 'staff', 'admin', 'super_admin'];

const AccessRequestsTab = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleMap, setRoleMap] = useState({});
  const [working, setWorking] = useState({});

  const token = localStorage.getItem('token');

  const fetchRequests = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/requests`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setRequests(data.requests || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id, action) => {
    setWorking((prev) => ({ ...prev, [id]: true }));
    try {
      const body = action === 'approve' ? { role: roleMap[id] || 'staff' } : {};
      const res = await fetch(`${API_BASE_URL}/api/admin/requests/${id}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) fetchRequests();
    } finally {
      setWorking((prev) => ({ ...prev, [id]: false }));
    }
  };

  const fmt = (ts) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  };

  if (loading) return <div className="admin-loading">Loading requests…</div>;

  const pending = requests.filter((r) => r.status === 'pending');
  const others = requests.filter((r) => r.status !== 'pending');

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>
          Access Requests{' '}
          {pending.length > 0 && (
            <span style={{ background: '#92400e', color: '#fff', borderRadius: 999, fontSize: '.7rem', padding: '2px 8px', marginLeft: 6 }}>
              {pending.length} pending
            </span>
          )}
        </h1>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="section-card">
          <h2>⏳ Pending Requests</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Reason</th>
                <th>Requested</th>
                <th>Assign Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((req) => (
                <tr key={req._id}>
                  <td style={{ fontWeight: 500 }}>{req.name}</td>
                  <td style={{ fontSize: '.78rem', color: 'var(--admin-muted)' }}>{req.email}</td>
                  <td style={{ fontSize: '.78rem', color: 'var(--admin-muted)', maxWidth: 200 }}>{req.reason || '—'}</td>
                  <td style={{ fontSize: '.75rem', color: 'var(--admin-muted)' }}>{fmt(req.createdAt)}</td>
                  <td>
                    <select
                      value={roleMap[req._id] || 'staff'}
                      onChange={(e) => setRoleMap((prev) => ({ ...prev, [req._id]: e.target.value }))}
                      style={{
                        padding: '4px 8px',
                        border: '1px solid var(--admin-border)',
                        borderRadius: 5,
                        fontSize: '.8rem',
                        background: 'var(--admin-bg)',
                        color: 'var(--admin-text)',
                      }}
                    >
                      {VALID_ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="btn-primary"
                        disabled={working[req._id]}
                        onClick={() => handleAction(req._id, 'approve')}
                      >
                        {working[req._id] ? '…' : 'Approve'}
                      </button>
                      <button
                        className="btn-danger"
                        disabled={working[req._id]}
                        onClick={() => handleAction(req._id, 'reject')}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* History */}
      <div className="section-card">
        <h2>📋 Request History</h2>
        {others.length === 0 ? (
          <div className="admin-empty">No past requests.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Assigned Role</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {others.map((req) => (
                <tr key={req._id}>
                  <td style={{ fontWeight: 500 }}>{req.name}</td>
                  <td style={{ fontSize: '.78rem', color: 'var(--admin-muted)' }}>{req.email}</td>
                  <td>
                    <span className={`badge badge-${req.status}`}>{req.status}</span>
                  </td>
                  <td style={{ fontSize: '.78rem' }}>{req.assignedRole || '—'}</td>
                  <td style={{ fontSize: '.75rem', color: 'var(--admin-muted)' }}>{fmt(req.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AccessRequestsTab;
