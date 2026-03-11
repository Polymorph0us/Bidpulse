import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../api/axiosConfig';

function SellerDashboard() {
  const navigate = useNavigate();
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update your state
  const [imageData, setImageData] = useState('');

  // Add this new function above handleCreateAuction
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result); // Converts the image to a Base64 string!
      };
      reader.readAsDataURL(file);
    }
  };


  const handleCreateAuction = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert HTML local datetime to standard ISO UTC format for Spring Boot
      const payload = {
        title: title,
        description: description,
        startingPrice: Number(startingPrice),
        minIncrement: 1.00, // <-- ADD THIS LINE!
        imageData: imageData,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      };

      const res = await apiClient.post('/auctions', payload);
      
      toast.success(`🚀 Auction "${res.data.title}" created successfully!`);
      
      // Clear the form
      setTitle('');
      setDescription('');
      setStartingPrice('');
      setStartTime('');
      setEndTime('');
      
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create auction. Check your dates!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', background: 'transparent', border: '1px solid #334155' }}>
        ← Back to Live Auctions
      </button>

      <div className="card">
        <h2 style={{ color: 'var(--primary)', marginTop: 0 }}>📦 Launch New Auction</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Fill out the details below to list a new item on the market.</p>

        <form onSubmit={handleCreateAuction} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Item Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g., Vintage Rolex Daytona" 
              required 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Description</label>
            <input 
              type="text" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Describe the item's condition and history..." 
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Upload Item Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange} 
              style={{ background: 'transparent', border: '1px dashed #334155', padding: '20px', cursor: 'pointer' }}
            />
            {/* Show a tiny preview if they selected an image! */}
            {imageData && <img src={imageData} alt="Preview" style={{ marginTop: '10px', height: '100px', borderRadius: '8px', objectFit: 'cover' }} />}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Starting Price ($)</label>
            <input 
              type="number" 
              value={startingPrice} 
              onChange={(e) => setStartingPrice(e.target.value)} 
              placeholder="0.00" 
              min="1"
              required 
            />
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Start Time</label>
              <input 
                type="datetime-local" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)} 
                required 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>End Time</label>
              <input 
                type="datetime-local" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)} 
                required 
              />
            </div>
          </div>

          <button type="submit" className="success" style={{ marginTop: '10px' }} disabled={isSubmitting}>
            {isSubmitting ? 'Launching...' : 'Create Auction'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SellerDashboard;