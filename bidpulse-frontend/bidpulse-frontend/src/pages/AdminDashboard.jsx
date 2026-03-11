import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif', background: '#ffebee', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#c62828' }}>👑 Admin Headquarters</h1>
        <button onClick={handleLogout} style={{ padding: '10px', background: '#c62828', color: 'white', border: 'none', cursor: 'pointer' }}>Logout</button>
      </div>
      
      <p>Welcome back, Administrator <strong>{user?.name}</strong>!</p>
      
      <div style={{ marginTop: '30px', background: 'white', padding: '20px', borderRadius: '8px' }}>
        <h3>Super Secret Admin Actions:</h3>
        <ul>
          <li>View all users (Coming soon)</li>
          <li>Force close auctions (Coming soon)</li>
          <li>Assign roles (Coming soon)</li>
        </ul>
        
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{ marginTop: '20px', padding: '10px', cursor: 'pointer' }}
        >
          Go to Standard Live Auctions View
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;