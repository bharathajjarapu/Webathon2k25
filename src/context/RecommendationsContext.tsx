import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';
import { useBrowsingHistory } from './BrowsingHistoryContext';

interface RecommendationsContextType {
  recommendations: Product[];
  isLoading: boolean;
  error: string | null;
  refreshRecommendations: () => Promise<void>;
}

const RecommendationsContext = createContext<RecommendationsContextType | undefined>(undefined);

// Fallback recommendations in case the database query fails
const FALLBACK_RECOMMENDATIONS: Product[] = [
  {
    id: 1,
    title: "Classic T-Shirt",
    price: 29.99,
    description: "A comfortable and stylish t-shirt for everyday wear.",
    category: "Clothing",
    image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    rating: { rate: 4.5, count: 120 },
    brand: "FashionBrand",
    featured: true,
    topSeller: true
  },
  {
    id: 2,
    title: "Wireless Headphones",
    price: 99.99,
    description: "High-quality wireless headphones with noise cancellation.",
    category: "Electronics",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    rating: { rate: 4.7, count: 85 },
    brand: "TechGear",
    featured: true,
    topSeller: true
  },
  {
    id: 3,
    title: "Leather Wallet",
    price: 49.99,
    description: "Genuine leather wallet with multiple card slots.",
    category: "Accessories",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    rating: { rate: 4.3, count: 65 },
    brand: "LeatherCraft",
    featured: true,
    topSeller: false
  },
  {
    id: 4,
    title: "Smart Watch",
    price: 199.99,
    description: "Feature-rich smartwatch with health tracking capabilities.",
    category: "Electronics",
    image: "https://fakestoreapi.com/img/61sbMiSnoL._AC_UL640_QL65_ML3_.jpg",
    rating: { rate: 4.6, count: 95 },
    brand: "TechGear",
    featured: true,
    topSeller: true
  }
];

export const RecommendationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { history } = useBrowsingHistory();

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // If there's no browsing history, fetch featured products as recommendations
      if (history.length === 0) {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('featured', true)
            .limit(10);

          if (error) throw error;

          // Fetch ratings for these products
          const productIds = data.map(p => p.id);
          const { data: ratingsData, error: ratingsError } = await supabase
            .from('product_ratings')
            .select('*')
            .in('product_id', productIds);

          if (ratingsError) throw ratingsError;

          // Combine products with their ratings
          const combinedProducts = data.map(product => {
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

          setRecommendations(combinedProducts);
        } catch (dbError) {
          console.error('Error fetching featured products:', dbError);
          // Use fallback recommendations if database query fails
          setRecommendations(FALLBACK_RECOMMENDATIONS);
        }
        return;
      }

      // Get categories from browsing history
      const categories = [...new Set(history.map(item => item.category))];

      try {
        // Fetch products from the same categories
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('category', categories)
          .not('id', 'in', history.map(item => item.id))
          .limit(10);

        if (error) throw error;

        // Fetch ratings for these products
        const productIds = data.map(p => p.id);
        const { data: ratingsData, error: ratingsError } = await supabase
          .from('product_ratings')
          .select('*')
          .in('product_id', productIds);

        if (ratingsError) throw ratingsError;

        // Combine products with their ratings
        const combinedProducts = data.map(product => {
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

        setRecommendations(combinedProducts);
      } catch (dbError) {
        console.error('Error fetching category-based recommendations:', dbError);
        // Use fallback recommendations if database query fails
        setRecommendations(FALLBACK_RECOMMENDATIONS);
      }
    } catch (err) {
      console.error('Error in recommendations system:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      // Use fallback recommendations if there's an error
      setRecommendations(FALLBACK_RECOMMENDATIONS);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch recommendations when browsing history changes
  useEffect(() => {
    fetchRecommendations();
  }, [history]);

  return (
    <RecommendationsContext.Provider
      value={{
        recommendations,
        isLoading,
        error,
        refreshRecommendations: fetchRecommendations
      }}
    >
      {children}
    </RecommendationsContext.Provider>
  );
};

export const useRecommendations = () => {
  const context = useContext(RecommendationsContext);
  if (context === undefined) {
    throw new Error('useRecommendations must be used within a RecommendationsProvider');
  }
  return context;
};