
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";

const CategoryProductsPage = () => {
  const { category } = useParams<{ category: string }>();
  const { products, isLoading, error } = useSupabaseProducts();
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState<string>("default");
  const navigate = useNavigate();

  useEffect(() => {
    if (products && category) {
      // Filter products by the given category
      const filtered = products.filter(
        product => product.category.toLowerCase() === decodeURIComponent(category).toLowerCase()
      );
      setCategoryProducts(filtered);
    }
  }, [products, category]);

  // Apply sorting
  useEffect(() => {
    if (categoryProducts.length === 0) return;

    const sorted = [...categoryProducts];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      default:
        // Keep default order
        break;
    }
    setCategoryProducts(sorted);
  }, [sort]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/categories')}
          className="text-gray-600 hover:text-shop-black transition-colors text-sm"
        >
          &larr; All Categories
        </button>
      </div>
      
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {decodeURIComponent(category || '')}
      </h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-500">
          Showing {categoryProducts.length} products
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
      
      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoryProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">Sorry, no products were found in this category.</p>
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

export default CategoryProductsPage;
