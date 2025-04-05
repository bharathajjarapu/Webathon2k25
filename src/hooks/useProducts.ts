
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://fakestoreapi.com/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        let data = await response.json();
        
        // Add additional fields to the products
        data = data.map((product: Product, index: number) => ({
          ...product,
          featured: index % 5 === 0 || index % 7 === 0, // Arbitrarily mark some products as featured
          topSeller: index % 4 === 0 || index % 6 === 0, // Arbitrarily mark some products as top sellers
          brand: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour'][Math.floor(Math.random() * 5)],
        }));
        
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return { products, isLoading, error };
};
