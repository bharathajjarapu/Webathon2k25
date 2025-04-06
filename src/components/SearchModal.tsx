import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Search } from "lucide-react";
import { useSearch } from "@/context/SearchContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { searchTerm, setSearchTerm, searchResults, performSearch, clearSearch } = useSearch();
  const { products, isLoading } = useSupabaseProducts();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }

    // Close on escape key
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  // Perform search when searchTerm changes
  useEffect(() => {
    if (products) {
      performSearch(products);
    }
  }, [searchTerm, products, performSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && searchResults.length > 0) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      onClose();
    }
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-16 px-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="pl-10"
              />
            </div>
          </form>
        </div>

        <div className="overflow-y-auto flex-1 p-4">
          {isLoading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : searchTerm && searchResults.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {searchResults.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-16 h-16 object-contain"
                  />
                  <div>
                    <h3 className="font-medium text-sm">{product.title}</h3>
                    <p className="text-gray-600 text-sm">₹{product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
              {searchResults.length > 5 && (
                <div className="text-center pt-2">
                  <Button
                    variant="outline"
                    onClick={handleSearch}
                  >
                    View all {searchResults.length} results
                  </Button>
                </div>
              )}
            </div>
          ) : searchTerm ? (
            <div className="text-center py-8">
              No products found for "{searchTerm}"
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Start typing to search products
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
