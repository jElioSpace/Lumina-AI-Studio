
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Button } from './Button';
import { Input } from './InputControls';

export const AuthScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8fafc] dark:bg-[#0b1120]">
      <div className="w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-indigo-600 dark:bg-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
          <span className="material-icons-round text-4xl text-white">auto_awesome</span>
        </div>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 text-center tracking-tight uppercase">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-10 font-medium">
          Lumina AI Studio for your family
        </p>

        <form onSubmit={handleAuth} className="space-y-6">
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="name@family.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />

          {error && (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl p-3 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
              <span className="material-icons-round text-sm">error_outline</span>
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full !py-4 shadow-xl">
            <span className="font-black uppercase tracking-[0.2em] text-xs">
              {isSignUp ? 'Join Studio' : 'Enter Studio'}
            </span>
          </Button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[10px] font-black uppercase tracking-widest text-indigo-500 dark:text-violet-400 hover:opacity-80 transition-opacity"
          >
            {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
