import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectToken } from '../store/slices/authSlice';
import { getPrescriptions, approvePrescription, rejectPrescription } from '../api/prescriptions';
import { getMedicines } from '../api/medicines';
import AdminAllMedicines from '../components/admin/AdminAllMedicines';
import AdminPrescriptions from '../components/admin/AdminPrescriptions';
import AdminAddMedicine from '../components/admin/AdminAddMedicine';
import './Admin.css';

function Admin() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionsLoading, setPrescriptionsLoading] = useState(true);
  const [prescriptionsError, setPrescriptionsError] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [medicinesLoading, setMedicinesLoading] = useState(true);
  const [medicinesError, setMedicinesError] = useState(null);
  const [activeTab, setActiveTab] = useState('medicines');

  const isAdmin = user?.role === 'ADMIN';

  function loadMedicines() {
    setMedicinesLoading(true);
    getMedicines()
      .then(setMedicines)
      .catch((e) => setMedicinesError(e.message))
      .finally(() => setMedicinesLoading(false));
  }

  useEffect(() => {
    if (!token || !isAdmin) {
      navigate('/', { replace: true });
      return;
    }
    getPrescriptions(token)
      .then(setPrescriptions)
      .catch((e) => setPrescriptionsError(e.message))
      .finally(() => setPrescriptionsLoading(false));
  }, [token, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    loadMedicines();
  }, [isAdmin]);

  const handleApprove = async (id) => {
    try {
      const updated = await approvePrescription(token, id);
      setPrescriptions((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (e) {
      setPrescriptionsError(e.message);
    }
  };

  const handleReject = async (id) => {
    try {
      const updated = await rejectPrescription(token, id);
      setPrescriptions((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (e) {
      setPrescriptionsError(e.message);
    }
  };

  if (!token) return null;
  if (!isAdmin) return null;

  const tabs = [
    { id: 'medicines', label: 'All Medicines' },
    { id: 'prescriptions', label: 'Prescriptions' },
    { id: 'add', label: 'Add Medicine' },
  ];

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
      </div>

      <nav className="admin-tabs" aria-label="Dashboard sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`admin-tab ${activeTab === tab.id ? 'admin-tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="admin-tab-panel">
        {activeTab === 'medicines' && (
          <AdminAllMedicines
            medicines={medicines}
            loading={medicinesLoading}
            error={medicinesError}
          />
        )}
        {activeTab === 'prescriptions' && (
          <AdminPrescriptions
            prescriptions={prescriptions}
            loading={prescriptionsLoading}
            error={prescriptionsError}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
        {activeTab === 'add' && (
          <AdminAddMedicine token={token} onSuccess={loadMedicines} />
        )}
      </div>
    </div>
  );
}

export default Admin;
