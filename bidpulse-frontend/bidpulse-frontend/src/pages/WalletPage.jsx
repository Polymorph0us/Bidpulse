import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [reserved, setReserved] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const fetchWallet = async () => {
    try {
      const res = await apiClient.get('/wallets/me');
      setBalance(res.data.balance);
      setReserved(res.data.reserved);
    } catch (err) {
      console.error("Failed to fetch wallet", err);
    }
  };

  // Fetch the balance as soon as the page loads
  useEffect(() => {
    fetchWallet();
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    setStatus('Printing money... 🖨️');
    try {
      // Axios sends the amount as a query parameter (?amount=X)
      await apiClient.post(`/wallets/deposit?amount=${depositAmount}`);
      setStatus(`✅ $${depositAmount} added to your account!`);
      setDepositAmount('');
      fetchWallet(); // Instantly update the big number on screen
    } catch (err) {
      console.error(err);
      setStatus('❌ Deposit failed.');
    }
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px' }}>
        ← Back to Dashboard
      </button>

      <div style={{ background: '#27ae60', color: 'white', padding: '30px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2>My Digital Wallet</h2>
        <h1 style={{ fontSize: '48px', margin: '10px 0' }}>${balance.toFixed(2)}</h1>
        <p>Available to Bid</p>
        
        {reserved > 0 && (
          <div style={{ marginTop: '15px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
            🔒 ${reserved.toFixed(2)} reserved for active bids
          </div>
        )}
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Add Funds (Paper Trading)</h3>
        <form onSubmit={handleDeposit} style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <input 
            type="number" 
            value={depositAmount} 
            onChange={(e) => setDepositAmount(e.target.value)} 
            placeholder="Amount to deposit" 
            min="1"
            required 
            style={{ flex: 1, padding: '10px' }}
          />
          <button type="submit" style={{ padding: '10px 20px', background: '#2980b9', color: 'white', border: 'none', cursor: 'pointer' }}>
            Deposit
          </button>
        </form>
        {status && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{status}</p>}
      </div>
    </div>
  );
}

export default WalletPage;