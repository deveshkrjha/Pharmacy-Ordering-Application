import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectToken } from '../store/slices/authSlice';
import { getAnalytics } from '../api/analytics';
import './ManagerDashboard.css';

function ManagerDashboard() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isManager = user?.role === 'MANAGER';

  useEffect(() => {
    if (!token || !isManager) {
      navigate('/', { replace: true });
      return;
    }
    getAnalytics(token)
      .then(setAnalytics)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token, isManager, navigate]);

  if (!token) return null;
  if (!isManager) return null;

  const formatCurrency = (value) =>
    value != null ? `$${Number(value).toFixed(2)}` : '$0.00';

  return (
    <div className="manager-dashboard">
      <header className="manager-header">
        <h1 className="manager-title">Analytics Dashboard</h1>
        <p className="manager-subtitle">Order and revenue overview</p>
      </header>

      {loading && <p className="manager-loading">Loading analytics…</p>}
      {error && <p className="manager-error">{error}</p>}

      {!loading && !error && analytics && (
        <div className="manager-grid">
          <div className="manager-card manager-card-highlight">
            <h3 className="manager-card-label">Total Revenue</h3>
            <p className="manager-card-value manager-card-value-large">
              {formatCurrency(analytics.totalRevenue)}
            </p>
          </div>
          <div className="manager-card">
            <h3 className="manager-card-label">Today&apos;s Revenue</h3>
            <p className="manager-card-value">{formatCurrency(analytics.todayRevenue)}</p>
          </div>
          <div className="manager-card">
            <h3 className="manager-card-label">Total Orders</h3>
            <p className="manager-card-value">{analytics.totalOrders ?? 0}</p>
          </div>
          <div className="manager-card manager-card-success">
            <h3 className="manager-card-label">Completed Orders</h3>
            <p className="manager-card-value">{analytics.completedOrders ?? 0}</p>
          </div>
          <div className="manager-card manager-card-warning">
            <h3 className="manager-card-label">Pending Orders</h3>
            <p className="manager-card-value">{analytics.pendingOrders ?? 0}</p>
          </div>
          <div className="manager-card manager-card-danger">
            <h3 className="manager-card-label">Cancelled Orders</h3>
            <p className="manager-card-value">{analytics.cancelledOrders ?? 0}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerDashboard;
