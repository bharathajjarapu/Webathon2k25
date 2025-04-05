
import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

interface TopProductsProps {
  products: Product[];
}

const TopProducts: React.FC<TopProductsProps> = ({ products }) => {
  // Filter top seller products or use highest rated products
  const topProducts = products
    .filter(product => product.topSeller || product.rating.rate > 4.2)
    .sort((a, b) => b.rating.rate - a.rating.rate)
    .slice(0, 4);

  return (
    <section className="py-12 bg-shop-gray">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-baseline mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Top Products</h2>
          <a href="/products" className="text-sm font-medium hover:underline">
            View All
          </a>
        </div>
        
        {topProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {topProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No top products available
          </div>
        )}
      </div>
    </section>
  );
};

export default TopProducts;
