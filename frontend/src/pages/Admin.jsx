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

const PillIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.5 1.5l-8.5 8.5a4.95 4.95 0 1 0 7 7l8.5-8.5a4.95 4.95 0 0 0-7-7Z" />
    <line x1="6" y1="12" x2="12" y2="6" />
  </svg>
);

const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

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
    { id: 'medicines', label: 'All Medicines', icon: PillIcon },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileIcon },
    { id: 'add', label: 'Add Medicine', icon: PlusIcon },
  ];

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Manage medicines, prescriptions, and inventory</p>
        </div>
      </div>

      <nav className="admin-tabs" aria-label="Dashboard sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`admin-tab ${activeTab === tab.id ? 'admin-tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon /> {tab.label}
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
