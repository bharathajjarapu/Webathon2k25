import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";
import { useSearch } from "@/context/SearchContext";
import ProductCard from "@/components/ProductCard";

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { products, isLoading } = useSupabaseProducts();
  const { searchTerm, setSearchTerm, searchResults, performSearch } = useSearch();

  // Extract search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");

    if (query) {
      setSearchTerm(query);
    }
  }, [location.search, setSearchTerm]);

  // Perform search when products load
  useEffect(() => {
    if (products && searchTerm) {
      performSearch(products);
    }
  }, [products, searchTerm, performSearch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
          <p className="text-gray-500">Please wait while we search for products.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-gray-500 mb-8">
        {searchResults.length} results for "{searchTerm}"
      </p>

      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">
            We couldn't find any matches for "{searchTerm}".
            Please try different keywords or browse our categories.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Browse All Products
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
