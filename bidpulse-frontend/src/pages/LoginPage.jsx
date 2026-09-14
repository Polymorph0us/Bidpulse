import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { fetchCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await apiClient.post('/auth/token', { email, password });
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      
      const userData = await fetchCurrentUser(); 

      if (userData?.roles.includes('ADMIN')) navigate('/admin');
      else if (userData?.roles.includes('SELLER')) navigate('/seller');
      else navigate('/dashboard');

    } catch (err) {
      setError('Invalid credentials. Please verify your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neonPurple/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-neonCyan/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span>
          BACK TO LANDING
        </Link>

        <div className="glass-card p-8 border-t-4 border-t-neonPurple">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-xl mx-auto flex items-center justify-center text-xl font-black mb-4 shadow-[0_0_15px_rgba(139,92,246,0.4)]">
              B
            </div>
            <h1 className="text-3xl font-black text-white">Project <span className="text-gradient">Access</span></h1>
            <p className="text-gray-400 text-sm mt-2">Enter your authorized credentials for terminal access.</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-rose-500/20 border border-rose-500/30 text-rose-400 text-sm rounded-xl font-bold" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="label-cyber">Access Identity (Email)</label>
              <input 
                id="email" 
                type="email" 
                required 
                className="input-field" 
                placeholder="agent@bidpulse.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div>
              <label htmlFor="password" className="label-cyber">Secure Pass-Key</label>
              <input 
                id="password" 
                type="password" 
                required 
                className="input-field" 
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-black/40 text-neonPurple focus:ring-neonPurple transition-all" />
                <span className="text-xs font-medium text-gray-500 group-hover:text-gray-300 transition-colors">REMEMBER SESSION</span>
              </label>
              <button type="button" className="text-xs font-bold text-neonPurple hover:text-white transition-colors uppercase tracking-widest">RESET ACCESS</button>
            </div>
            
            <button 
              type="submit" 
              className="w-full btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'ESTABLISHING CONNECTION...' : 'INITIALIZE ACCESS'}
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-sm text-gray-400">
              New operative? <Link to="/register" className="text-neonPurple hover:text-white font-bold transition-colors">Register for identity</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
