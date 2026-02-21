
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { HistoryItem } from '../types';
import { supabase } from '../services/supabase';
import { useAuth } from './AuthContext';

interface HistoryContextType {
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => Promise<void>;
  removeFromHistory: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  loading: boolean;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load history from Supabase when user changes
  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setHistory([]);
    }
  }, [user]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('history')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      
      const mappedData: HistoryItem[] = (data || []).map(item => ({
        id: item.id,
        type: item.type as any,
        prompt: item.prompt,
        result: item.result,
        timestamp: new Date(item.timestamp).getTime(),
      }));

      setHistory(mappedData);
    } catch (e) {
      console.error("Failed to fetch history", e);
    } finally {
      setLoading(false);
    }
  };

  const addToHistory = async (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('history')
        .insert([{
          user_id: user.id,
          type: item.type,
          prompt: item.prompt,
          result: item.result,
        }])
        .select()
        .single();

      if (error) throw error;

      const newItem: HistoryItem = {
        id: data.id,
        type: data.type as any,
        prompt: data.prompt,
        result: data.result,
        timestamp: new Date(data.timestamp).getTime(),
      };
      
      setHistory(prev => [newItem, ...prev]);
    } catch (e) {
      console.error("Failed to add to history", e);
    }
  };

  const removeFromHistory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('history')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (e) {
      console.error("Failed to remove from history", e);
    }
  };

  const clearHistory = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('history')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setHistory([]);
    } catch (e) {
      console.error("Failed to clear history", e);
    }
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory, removeFromHistory, clearHistory, isOpen, setIsOpen, loading }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
