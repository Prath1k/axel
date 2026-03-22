import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';

export default function SplashPage() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        navigate(user ? '/home' : '/login', { replace: true });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="z-10 flex border border-primary/50 shadow-[0_0_30px_rgba(233,69,96,0.3)] rounded-xl p-8 glass"
      >
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary via-secondary to-primary drop-shadow-[0_0_15px_var(--primary)] tracking-tighter">
          AXEL
        </h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 text-primary tracking-[0.3em] font-mono text-sm z-10 neon-glow px-4 py-1 border border-primary/30 rounded-full"
      >
        RETRO_SYNTH_PLAYER_OS
      </motion.p>
    </div>
  );
}
