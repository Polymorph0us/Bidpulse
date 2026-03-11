import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import CountdownTimer from '../components/CountdownTimer';

function DashboardPage() {
  const [auctions, setAuctions] = useState([]);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    // 1. Define the fetch function
    const fetchAuctions = async () => {
      try {
        const response = await apiClient.get('/auctions');
        setAuctions(response.data.content || response.data);
      } catch (error) {
        console.error("Failed to fetch", error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };

    // 2. Fetch immediately when the page loads
    fetchAuctions();

    // 3. Set up the Silent Radar (Fetch every 5 seconds)
    const intervalId = setInterval(() => {
      fetchAuctions();
    }, 5000);

    // 4. Clean up the radar when we leave the dashboard
    return () => clearInterval(intervalId);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: 0, color: 'var(--primary)' }}>Live Auctions</h2>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {user?.roles?.includes('SELLER') && (
            <button onClick={() => navigate('/seller')} style={{ background: '#8e44ad' }}>
              📦 Seller Panel
            </button>
          )}
          
          <button onClick={() => navigate('/wallet')} className="success">
            💰 My Wallet
          </button>
          
          <button onClick={handleLogout} className="danger">
            Logout
          </button>
        </div>
      </div>
      
{/* Replace your <ul> and map function with this modern Grid! */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {auctions.map((auction) => (
          <div key={auction.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
            
            {/* Top Half: The Image */}
            <div style={{ height: '200px', width: '100%', background: '#1e293b', position: 'relative' }}>
              {auction.imageData ? (
                <img src={auction.imageData} alt={auction.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>📦</div>
              )}
              
              {/* Floating Status Badge */}
              <div style={{ position: 'absolute', top: '10px', right: '10px', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', background: 'rgba(0,0,0,0.7)', color: auction.status === 'RUNNING' ? 'var(--success)' : (auction.status === 'ENDED' ? 'var(--danger)' : '#f59e0b') }}>
                {auction.status}
              </div>
            </div>

            {/* Bottom Half: The Details */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3rem', color: 'var(--text-main)' }}>{auction.title}</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', marginBottom: '15px' }}>
                <div>
                  <p style={{ margin: '0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Current Bid</p>
                  <p style={{ margin: '0', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>
                    ${auction.highestBidAmount || auction.startingPrice}
                  </p>
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <CountdownTimer startTime={auction.startTime} endTime={auction.endTime} status={auction.status} />
              </div>
              
              {auction.status !== 'ENDED' ? (
                <button onClick={() => navigate(`/auction/${auction.id}`)} style={{ width: '100%' }}>
                  Enter Auction Room
                </button>
              ) : (
                <button disabled style={{ width: '100%', background: '#334155', cursor: 'not-allowed' }}>
                  Auction Closed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}

export default DashboardPage;