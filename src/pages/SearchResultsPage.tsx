import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";
import { useSearch } from "@/context/SearchContext";
import ProductCard from "@/components/ProductCard";
import AdvancedFilters from "@/components/AdvancedFilters";
import { Product } from "@/types/product";

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { products, isLoading: productsLoading } = useSupabaseProducts();
  const { searchTerm, setSearchTerm, searchResults, performSearch } = useSearch();

  const [filteredResults, setFilteredResults] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [sort, setSort] = useState<string>("default");

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

  // Apply filters and sorting to search results
  useEffect(() => {
    if (!searchResults) return;

    let filtered = [...searchResults];

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    // Filter by price
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by rating
    if (selectedRating > 0) {
      filtered = filtered.filter(product =>
        product.rating.rate >= selectedRating
      );
    }

    // Apply sorting
    switch (sort) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        filtered.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case "newest":
        // Assuming products have a date field
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      default:
        // Keep default order
        break;
    }

    setFilteredResults(filtered);
  }, [searchResults, selectedCategories, priceRange, selectedRating, sort]);

  if (productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
          <p className="text-gray-500">Please wait while we search for products.</p>
        </div>
      </div>
    );
  }

  // Get unique categories from search results
  const categories = Array.from(new Set(searchResults?.map(p => p.category) || []));

  // Find max price for the slider
  const maxPrice = Math.max(...(searchResults?.map(p => p.price) || [0]), 1000);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-gray-500 mb-8">
        {searchResults?.length || 0} results for "{searchTerm}"
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="w-full md:w-1/4">
          <AdvancedFilters
            onPriceChange={setPriceRange}
            onCategoryChange={setSelectedCategories}
            onRatingChange={setSelectedRating}
            onSortChange={setSort}
            categories={categories}
            priceRange={[0, maxPrice]}
          />
        </div>

        {/* Results */}
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-500">
              Showing {filteredResults.length} products
            </div>
          </div>

          {filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredResults.map(product => (
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
      </div>
    </div>
  );
};

export default SearchResultsPage;
