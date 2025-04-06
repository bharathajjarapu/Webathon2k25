import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';

interface BrowsingHistoryContextType {
  history: Product[];
  addToHistory: (product: Product) => void;
  clearHistory: () => void;
  isLoading: boolean;
}

const BrowsingHistoryContext = createContext<BrowsingHistoryContextType | undefined>(undefined);

export const BrowsingHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load browsing history from localStorage on initial render
  useEffect(() => {
    const loadHistory = () => {
      try {
        const storedHistory = localStorage.getItem('browsingHistory');
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error('Error loading browsing history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  // Save browsing history to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('browsingHistory', JSON.stringify(history));
    }
  }, [history, isLoading]);

  const addToHistory = (product: Product) => {
    setHistory(prevHistory => {
      // Remove the product if it already exists in the history
      const filteredHistory = prevHistory.filter(item => item.id !== product.id);

      // Add the product to the beginning of the history
      return [product, ...filteredHistory].slice(0, 20); // Limit to 20 items
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('browsingHistory');
  };

  return (
    <BrowsingHistoryContext.Provider value={{ history, addToHistory, clearHistory, isLoading }}>
      {children}
    </BrowsingHistoryContext.Provider>
  );
};

export const useBrowsingHistory = () => {
  const context = useContext(BrowsingHistoryContext);
  if (context === undefined) {
    throw new Error('useBrowsingHistory must be used within a BrowsingHistoryProvider');
  }
  return context;
};