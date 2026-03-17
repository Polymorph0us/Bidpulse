import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');
    
    try {
      await apiClient.post('/users', { name, email, password, role });
      setStatus('✅ Identity verified! Redirecting to secure login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed. Check your connection or email.';
      setStatus(`❌ ${errorMsg}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neonPurple/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neonCyan/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-white transition-colors mb-8 group uppercase tracking-widest"
        >
          <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span>
          Return to Landing
        </Link>

        <div className="glass-card p-8 border-t-4 border-t-neonCyan relative z-10">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 text-white rounded-xl mx-auto flex items-center justify-center text-xl font-black mb-4 shadow-[0_0_15px_rgba(6,182,212,0.4)]">B</div>
            <h1 className="text-3xl font-black text-white">Project <span className="text-gradient">Identity</span></h1>
            <p className="text-gray-400 text-sm mt-2">Initialize your operative profile for the marketplace.</p>
          </div>
          
          {status && (
            <div className={`mb-6 p-4 text-sm rounded-xl font-bold ${status.includes('✅') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`} role="alert">
              {status}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label htmlFor="name" className="label-cyber">Operative Name</label>
              <input 
                id="name"
                name="name"
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="John Doe" 
                autoComplete="name"
                required 
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="email" className="label-cyber">Email Address</label>
              <input 
                id="email"
                name="email"
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="agent@bidpulse.com" 
                autoComplete="email"
                required 
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="password" className="label-cyber">Secure Password</label>
              <input 
                id="password"
                name="password"
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
                className="input-field"
              />
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Required: 8+ Characters, 1 Numeric</p>
            </div>

            <div>
              <label htmlFor="role" className="label-cyber">Account Type</label>
              <select 
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-field appearance-none bg-darkBg text-white focus:outline-none focus:ring-2 focus:ring-neonCyan"
              >
                <option value="USER">Buyer (Operative)</option>
                <option value="SELLER">Seller (Vendor)</option>
              </select>
            </div>
            <div className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-white/10 bg-black/40 text-neonCyan focus:ring-neonCyan transition-all" />
              <p className="text-[10px] text-gray-500 leading-tight uppercase tracking-wider">
                I agree to the <span className="text-neonCyan cursor-pointer">Protocol Terms</span> and <span className="text-neonCyan cursor-pointer">Privacy Encryptions</span>.
              </p>
            </div>
            
            <button type="submit" className="w-full btn-primary" disabled={isLoading}>
              {isLoading ? 'ENCRYPTING...' : 'INITIALIZE ACCOUNT'}
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-sm text-gray-400">
              Already authorized? <Link to="/login" className="text-neonCyan hover:text-white font-bold transition-colors">Login to terminal</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}