// src/pages/Dashboard.jsx
import CentralizedUserDashboard from '../components/CentralizedUserDashboard';
import '../pages.css';

export default function Dashboard() {
  return (
    <div className="dashboard-page page-container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <CentralizedUserDashboard />
    </div>
  );
}




