
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';

export const useSupabaseProduct = (id: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        // Fetch product
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', parseInt(id))
          .single();
        
        if (productError) {
          throw new Error(productError.message);
        }
        
        // Fetch rating
        const { data: ratingData, error: ratingError } = await supabase
          .from('product_ratings')
          .select('*')
          .eq('product_id', parseInt(id))
          .single();
        
        if (ratingError && ratingError.code !== 'PGRST116') { // Not found is OK
          throw new Error(ratingError.message);
        }

        if (!productData) {
          throw new Error('Product not found');
        }

        // Combine product with its rating
        const combinedProduct: Product = {
          id: productData.id,
          title: productData.title,
          price: productData.price,
          description: productData.description,
          category: productData.category,
          image: productData.image,
          brand: productData.brand,
          featured: productData.featured,
          topSeller: productData.top_seller,
          rating: {
            rate: ratingData ? ratingData.rate : 0,
            count: ratingData ? ratingData.count : 0
          }
        };
        
        setProduct(combinedProduct);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  return { product, loading, error };
};
