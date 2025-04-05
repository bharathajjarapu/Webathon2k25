
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useSupabaseCategories } from "@/hooks/useSupabaseCategories";

const ShopCategories: React.FC = () => {
  const { categories, isLoading } = useSupabaseCategories();
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    navigate(`/category/${encodeURIComponent(category)}`);
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-baseline mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
          </div>
          <div className="text-center py-12 text-gray-500">
            Loading categories...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-baseline mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
          <a href="/categories" className="text-sm font-medium hover:underline flex items-center gap-1">
            All Categories <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((category) => (
              <div 
                key={category.id}
                className="group relative cursor-pointer overflow-hidden rounded-lg h-64 shadow-md"
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300 z-10" />
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="bg-white/90 px-6 py-4 rounded-md shadow-lg">
                    <h3 className="text-lg font-semibold text-center capitalize">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 text-center mt-1">
                      {category.product_count} products
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No categories available
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopCategories;
