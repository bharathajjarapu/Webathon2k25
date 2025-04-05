
import React, { useState, useEffect } from "react";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";
import { useSupabaseCategories } from "@/hooks/useSupabaseCategories";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ProductsPage = () => {
  const { products, isLoading: productsLoading, error: productsError } = useSupabaseProducts();
  const { categories, isLoading: categoriesLoading } = useSupabaseCategories();
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sort, setSort] = useState<string>("default");

  const isLoading = productsLoading || categoriesLoading;
  const error = productsError;

  // Apply filters and sorting
  useEffect(() => {
    if (!products) return;

    let filtered = [...products];

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

    // Apply sorting
    switch (sort) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      default:
        // Keep default order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategories, priceRange, sort]);

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Handle price range changes
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading products...</h2>
          <p className="text-gray-500">Please wait while we fetch the products.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-500 mb-4">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Find max price for the slider
  const maxPrice = Math.max(...products.map(p => p.price), 1000);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="w-full md:w-1/4 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="font-semibold text-lg mb-4">Filters</h2>
            
            {/* Category filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.name)}
                      onCheckedChange={() => handleCategoryChange(category.name)}
                    />
                    <Label 
                      htmlFor={`category-${category.id}`}
                      className="capitalize cursor-pointer"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Price Range</h3>
              <Slider 
                defaultValue={[0, maxPrice]} 
                max={maxPrice} 
                step={10}
                onValueChange={handlePriceChange}
                className="mb-4"
              />
              <div className="flex justify-between text-sm">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Products grid */}
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-500">
              Showing {filteredProducts.length} products
            </div>
            
            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded-md px-3 py-1.5 text-sm"
            >
              <option value="default">Sort by: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
