import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrowsingHistory } from '@/context/BrowsingHistoryContext';
import ProductCard from './ProductCard';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';

const BrowsingHistory: React.FC = () => {
  const { history, clearHistory, isLoading } = useBrowsingHistory();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-600 mb-4">
            You haven't viewed any products yet.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate('/products')}
          >
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Recently Viewed</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearHistory}
          className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear History
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {history.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BrowsingHistory;