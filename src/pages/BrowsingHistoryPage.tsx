import React from 'react';
import BrowsingHistory from '@/components/BrowsingHistory';

const BrowsingHistoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Browsing History</h1>
        <BrowsingHistory />
      </div>
    </div>
  );
};

export default BrowsingHistoryPage;