
import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

interface FeaturedProductsProps {
  products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  // Filter featured products
  const featuredProducts = products
    .filter(product => product.featured)
    .slice(0, 4);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-baseline mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
          <a href="/products" className="text-sm font-medium hover:underline">
            View All
          </a>
        </div>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No featured products available
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
