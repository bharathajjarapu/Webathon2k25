
import React, { createContext, useContext, useState } from "react";
import { Product } from "../types/product";
import Fuse from "fuse.js";

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: Product[];
  performSearch: (products: Product[]) => void;
  isSearching: boolean;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = (products: Product[]) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Configure Fuse for fuzzy search
    const fuse = new Fuse(products, {
      keys: ["title", "category", "description", "brand"],
      includeScore: true,
      threshold: 0.4, // Lower threshold means more strict matching
    });
    
    const results = fuse.search(searchTerm);
    setSearchResults(results.map(result => result.item));
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <SearchContext.Provider value={{ 
      searchTerm, 
      setSearchTerm, 
      searchResults, 
      performSearch,
      isSearching,
      clearSearch
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
