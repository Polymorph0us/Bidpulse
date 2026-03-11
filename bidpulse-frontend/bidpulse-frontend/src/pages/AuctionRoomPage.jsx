import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { toast } from 'react-toastify';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import CountdownTimer from '../components/CountdownTimer';

function AuctionRoomPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // We need to know who WE are to check if we got outbid!
  const userRef = useRef(user);
  useEffect(() => { userRef.current = user; }, [user]); // Keeps user data fresh without restarting websockets!
  const [auction, setAuction] = useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [bidAmount, setBidAmount] = useState('');
  const [logs, setLogs] = useState([]);
  
  // Future Prep: We will wire this to a WebSocket presence channel later
  const [liveUsers, setLiveUsers] = useState(1); 

  // Now replace your main WebSocket useEffect with this:
  useEffect(() => {
    // 1. Fetch Auction details
    apiClient.get(`/auctions/${id}`)
      .then(res => {
        setAuction(res.data);
        setCurrentBid(res.data.highestBidAmount || res.data.startingPrice);
      })
      .catch(err => toast.error("Could not load auction"));

    // 2. Setup exactly ONE WebSocket connection
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);
    stompClient.debug = () => {}; 

    stompClient.connect({}, () => {
      setLogs(prev => [`🟢 Connected to live room #${id}`, ...prev]);
      
      stompClient.subscribe(`/topic/auction.${id}`, (message) => {
        const payload = JSON.parse(message.body);
        const newBidAmount = payload.highestBidAmount || payload.amount;
        const winningBidderId = payload.highestBidderId || payload.bidderId;

        if (newBidAmount) {
          setCurrentBid(newBidAmount);
          setLogs(prev => [`💰 Bid placed: $${newBidAmount}`, ...prev]);

          // Use the Ref so we don't trigger re-renders!
          const currentUser = userRef.current;
          
          if (currentUser && String(winningBidderId) !== String(currentUser.id)) {
            toast.error(`⚠️ You've been outbid! New price: $${newBidAmount}`);
          } else if (currentUser && String(winningBidderId) === String(currentUser.id)) {
            toast.success(`🎉 You are the highest bidder!`);
          }
        }
      });
    });

    // 3. Clean up the connection when you leave the page
    return () => {
      if (stompClient.connected) stompClient.disconnect();
    };
  }, [id]); // <-- Notice 'user' is REMOVED from this array!

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post(`/auctions/${id}/bids`, { amount: Number(bidAmount) });
      setBidAmount('');
    } catch (err) {
      toast.error(err.response?.data?.message || "Bid failed. Check your wallet balance!");
    }
  };

  if (!auction) return <div>Loading radar...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', background: 'transparent', border: '1px solid #334155' }}>
        ← Back to Dashboard
      </button>

      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: '0 0 10px 0', color: 'var(--primary)' }}>{auction.title}</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>{auction.description}</p>
          {/* NEW TIMER COMPONENT HERE */}
          <CountdownTimer 
             startTime={auction.startTime} 
             endTime={auction.endTime} 
             status={auction.status} 
          />
        </div>
        
        {/* The Live User Count Badge */}
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ height: '10px', width: '10px', background: 'var(--success)', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
          {liveUsers} Watching
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px' }}>Current Highest Bid</p>
        <h1 style={{ fontSize: '64px', margin: '10px 0', color: 'var(--success)' }}>${currentBid.toLocaleString()}</h1>
        
        <form onSubmit={handlePlaceBid} style={{ display: 'flex', gap: '10px', maxWidth: '400px', margin: '30px auto 0' }}>
          <input 
            type="number" 
            value={bidAmount} 
            onChange={(e) => setBidAmount(e.target.value)} 
            placeholder={`Next bid must be > $${currentBid}`} 
            required 
          />
          <button type="submit" className="success">Drop Bid</button>
        </form>
      </div>

      <div className="card" style={{ marginTop: '20px', background: '#000', border: '1px solid #333' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px' }}>LIVE RADAR LOG</h3>
        <div style={{ height: '150px', overflowY: 'auto', fontFamily: 'monospace', color: '#10b981', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {logs.map((log, index) => (
            <div key={index} style={{ opacity: 1 - (index * 0.15) }}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AuctionRoomPage;