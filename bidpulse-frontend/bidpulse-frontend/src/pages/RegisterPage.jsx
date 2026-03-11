import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatus('Creating account...');
    
    try {
      // Hit the backend register endpoint
      await apiClient.post('/users', { name, email, password });
      
      setStatus('✅ Account created successfully! Redirecting to login...');
      
      // Send them to the login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error(err);
      setStatus('❌ Registration failed. Email might already exist.');
    }
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Create a BidPulse Account</h2>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Full Name" 
          required 
        />
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email Address" 
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
        />
        <button type="submit" style={{ padding: '10px', background: '#2ecc71', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Register
        </button>
      </form>
      
      <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{status}</p>
      
      <p style={{ marginTop: '20px' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default RegisterPage;