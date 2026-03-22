import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../supabase/auth';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signUp(email, password, username);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center p-4">
      <div className="glass p-8 w-full max-w-md rounded-xl border border-secondary/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent"></div>
        <h2 className="text-3xl font-bold text-center text-secondary text-neon-glow mb-6 tracking-wider">REGISTER_NODE</h2>
        
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm font-mono">{error}</div>}
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs text-secondary mb-1 uppercase font-mono tracking-wider">Callsign</label>
            <input 
              type="text" 
              required
              className="w-full bg-black/50 border border-white/20 p-3 rounded text-text focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary transition-colors font-mono"
              value={username} onChange={e => setUsername(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-xs text-secondary mb-1 uppercase font-mono tracking-wider">Network Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-black/50 border border-white/20 p-3 rounded text-text focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary transition-colors font-mono"
              value={email} onChange={e => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-xs text-secondary mb-1 uppercase font-mono tracking-wider">Access Code</label>
            <input 
              type="password" 
              required
              minLength={6}
              className="w-full bg-black/50 border border-white/20 p-3 rounded text-text focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary transition-colors font-mono"
              value={password} onChange={e => setPassword(e.target.value)} 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-secondary hover:bg-secondary/80 text-white font-bold py-3 px-4 rounded transition-all neon-glow uppercase tracking-widest mt-4"
          >
            {loading ? 'Establishing...' : 'Connect Node'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-text/70">
          Existing node? <Link to="/login" className="text-primary font-bold hover:text-white transition-colors">Authenticate here</Link>
        </div>
      </div>
    </div>
  );
}
