
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseCategories } from "@/hooks/useSupabaseCategories";

const CategoriesPage = () => {
  const { categories, isLoading, error } = useSupabaseCategories();
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    navigate(`/category/${encodeURIComponent(category)}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading categories...</h2>
          <p className="text-gray-500">Please wait while we fetch the categories.</p>
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
      <h1 className="text-3xl font-bold mb-8">Shop by Category</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <div 
            key={category.id}
            className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300"
            onClick={() => handleCategoryClick(category.name)}
          >
            <div className="relative h-60 overflow-hidden">
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h2 className="text-white text-2xl font-bold capitalize text-center px-4">
                  {category.name}
                </h2>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  {category.product_count} products
                </span>
                <span className="text-shop-black font-medium">
                  Shop Now &rarr;
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
