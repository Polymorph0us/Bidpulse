import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  const navigate = useNavigate();
  const { user, fetchCurrentUser, loginAsDemo } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.roles?.includes('ADMIN')) navigate('/admin');
      else if (user.roles?.includes('SELLER')) navigate('/seller');
      else navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setStatusMessage('Connecting to authentication server...');

    const slowTimer = setTimeout(() => {
      setStatusMessage('Cloud server is waking up (may take a moment on first boot)...');
    }, 3000);
    
    try {
      const res = await apiClient.post('/auth/token', { email, password });
      clearTimeout(slowTimer);
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      localStorage.removeItem('bidpulse_demo_user');
      
      const userData = await fetchCurrentUser(); 

      if (userData?.roles?.includes('ADMIN')) navigate('/admin');
      else if (userData?.roles?.includes('SELLER')) navigate('/seller');
      else navigate('/dashboard');

    } catch (err) {
      clearTimeout(slowTimer);
      console.error('Login error:', err);
      const serverMsg = err.response?.data?.message || err.response?.data?.error;
      if (serverMsg) {
        setError(`Access Denied: ${serverMsg}`);
      } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout') || err.message?.includes('Network Error')) {
        setError('Server connection timed out. You can use the Quick Demo access below to enter immediately.');
      } else {
        setError('Invalid credentials. Please verify your email and password, or use Demo Access.');
      }
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  };

  const handleDemoLogin = (role) => {
    setError('');
    const demoUser = loginAsDemo(role);
    if (demoUser.roles?.includes('ADMIN')) navigate('/admin');
    else if (demoUser.roles?.includes('SELLER')) navigate('/seller');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative py-12">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neonPurple/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-neonCyan/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-white transition-colors mb-8 group uppercase tracking-widest"
        >
          <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span>
          Return to Portal
        </Link>

        <div className="glass-card p-8 border-t-4 border-t-neonPurple">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-xl mx-auto flex items-center justify-center text-xl font-black mb-4 shadow-[0_0_15px_rgba(139,92,246,0.4)]">
              B
            </div>
            <h1 className="text-3xl font-black text-white font-display">System <span className="text-gradient">Access</span></h1>
            <p className="text-gray-400 text-sm mt-2">Enter credentials or select an instant demo profile.</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-rose-500/20 border border-rose-500/30 text-rose-300 text-sm rounded-xl font-bold" role="alert">
              {error}
            </div>
          )}

          {statusMessage && (
            <div className="mb-6 p-4 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs rounded-xl font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              {statusMessage}
            </div>
          )}

          {/* Quick Demo Access Bar */}
          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center justify-between">
              <span>⚡ 1-Click Instant Demo Access</span>
              <span className="text-[10px] text-neonCyan font-mono">Bypass</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('USER')}
                className="py-2 px-1 text-xs font-bold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all hover:scale-[1.02] text-center"
              >
                Operative
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('SELLER')}
                className="py-2 px-1 text-xs font-bold rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all hover:scale-[1.02] text-center"
              >
                Seller
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('ADMIN')}
                className="py-2 px-1 text-xs font-bold rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all hover:scale-[1.02] text-center"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <span className="relative px-4 text-[10px] font-black tracking-widest uppercase bg-[#0f0f15] text-gray-500">Or Standard Login</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="label-cyber">Access Identity (Email)</label>
              <input 
                id="email" 
                name="email"
                type="email" 
                required 
                className="input-field" 
                placeholder="agent@bidpulse.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="label-cyber">Secure Pass-Key</label>
              <input 
                id="password" 
                name="password"
                type="password" 
                required 
                className="input-field" 
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                autoComplete="current-password"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full btn-primary py-3.5"
              disabled={isLoading}
            >
              {isLoading ? 'AUTHENTICATING...' : 'INITIALIZE ACCESS'}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-gray-400">
              New operative? <Link to="/register" className="text-neonPurple hover:text-white font-bold transition-colors">Register for identity</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
