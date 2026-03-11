import { useState } from 'react';

import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('seller@test.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { fetchCurrentUser } = useAuth(); // Tap into the global Loudspeaker!

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Get the tokens
      const res = await apiClient.post('/auth/token', { email, password });
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      
      // 2. Fetch the user details using our Context
      const userData = await fetchCurrentUser(); 

      // 3. The Traffic Cop: Send them to the right page based on their database roles!
      if (userData && userData.roles.includes('ADMIN')) {
        navigate('/admin');
      } else if (userData && userData.roles.includes('SELLER')) {
        navigate('/seller');
      } else {
        navigate('/dashboard'); // Normal user
      }

    } catch (err) {
      console.error(err);
      setError('Login failed. Check your credentials.');
    }
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Login to BidPulse</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" style={{ padding: '10px', background: '#3498db', color: '#fff', border: 'none', cursor: 'pointer' }}>Login</button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      <p style={{ marginTop: '20px' }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default LoginPage;