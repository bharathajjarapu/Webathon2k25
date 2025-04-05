
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';

export const useSupabaseProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*');
        
        if (productsError) {
          throw new Error(productsError.message);
        }

        // Fetch ratings
        const { data: ratingsData, error: ratingsError } = await supabase
          .from('product_ratings')
          .select('*');
        
        if (ratingsError) {
          throw new Error(ratingsError.message);
        }

        // Combine products with their ratings
        const combinedProducts = productsData.map(product => {
          const productRating = ratingsData.find(rating => rating.product_id === product.id);
          return {
            id: product.id,
            title: product.title,
            price: product.price,
            description: product.description,
            category: product.category,
            image: product.image,
            brand: product.brand,
            featured: product.featured,
            topSeller: product.top_seller,
            rating: {
              rate: productRating ? productRating.rate : 0,
              count: productRating ? productRating.count : 0
            }
          } as Product;
        });
        
        setProducts(combinedProducts);
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
