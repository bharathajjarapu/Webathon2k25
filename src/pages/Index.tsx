import React from "react";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import TopProducts from "@/components/TopProducts";
import ShopCategories from "@/components/ShopCategories";
import PersonalizedRecommendations from "@/components/PersonalizedRecommendations";

const Index = () => {
  const { products, isLoading, error } = useSupabaseProducts();

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
    <div className="min-h-screen">
      <Hero />
      <FeaturedProducts products={products} />
      <PersonalizedRecommendations />
      <TopProducts products={products} />
      <ShopCategories />
    </div>
  );
};

export default Index;
