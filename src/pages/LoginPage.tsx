import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '../supabase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center p-4">
      <div className="glass p-8 w-full max-w-md rounded-xl border border-primary/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        <h2 className="text-3xl font-bold text-center text-primary text-neon-glow mb-6 tracking-wider">LOGIN_OS</h2>
        
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm font-mono">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs text-primary mb-1 uppercase font-mono tracking-wider">Email Override</label>
            <input 
              type="email" 
              required
              className="w-full bg-black/50 border border-white/20 p-3 rounded text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors font-mono"
              value={email} onChange={e => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-xs text-primary mb-1 uppercase font-mono tracking-wider">Access Code</label>
            <input 
              type="password" 
              required
              className="w-full bg-black/50 border border-white/20 p-3 rounded text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors font-mono"
              value={password} onChange={e => setPassword(e.target.value)} 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/80 text-white font-bold py-3 px-4 rounded transition-all neon-glow uppercase tracking-widest mt-4"
          >
            {loading ? 'Processing...' : 'Initialize'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-text/70">
          New user? <Link to="/register" className="text-secondary font-bold hover:text-primary transition-colors">Link terminal here</Link>
        </div>
      </div>
    </div>
  );
}
