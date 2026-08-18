// src/pages/student/ClientPortal.jsx
import CentralizedUserDashboard from '../../components/CentralizedUserDashboard';
import '../../pages.css';

export default function ClientPortal() {
  return (
    <div className="client-portal-page page-container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      <CentralizedUserDashboard />
    </div>
  );
}

