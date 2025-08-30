import React, { useMemo, useState } from 'react';
import { ArrowLeft, Heart, ShoppingBag, Star, Filter, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateOutfitRecommendations } from '../utils/outfitGenerator';
import { useCart } from '../contexts/CartContext';

const CatalogPage = ({ preferences, prompt, analysisResult, onBack }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [favorites, setFavorites] = useState(new Set());
  const { addToCart } = useCart();

  const outfits = useMemo(() => {
    return generateOutfitRecommendations(preferences, prompt);
  }, [preferences, prompt]);

  const filteredOutfits = useMemo(() => {
    if (selectedFilter === 'all') return outfits;
    return outfits.filter(outfit => 
      outfit.name.toLowerCase().includes(selectedFilter) ||
      outfit.items.some(item => item.category === selectedFilter)
    );
  }, [outfits, selectedFilter]);

  const toggleFavorite = (outfitId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(outfitId)) {
        newFavorites.delete(outfitId);
      } else {
        newFavorites.add(outfitId);
      }
      return newFavorites;
    });
  };

  const handleAddToCart = (outfit) => {
    outfit.items.forEach(item => {
      addToCart(item, item.sizes[0], item.colors[0]);
    });
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div 
        className="bg-white shadow-sm border-b border-gray-200"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </motion.button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <Sparkles className="h-6 w-6 text-yellow-500" />
                  <span>Your Perfect Outfits</span>
                </h1>
                <p className="text-gray-600">Curated just for you • {outfits.length} recommendations</p>
              </div>
            </div>
            
            {/* Analysis Summary */}
            {analysisResult && (
              <motion.div 
                className="bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-sm font-medium text-gray-800">
                  {analysisResult.bodyShape} • {analysisResult.colorTone} tone • {Math.round(analysisResult.confidence)}% confidence
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="bg-white border-b border-gray-200"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by style:</span>
            </div>
            {['all', 'professional', 'casual', 'party', 'elegant'].map((filter, index) => (
              <motion.button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter === filter
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Outfits Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence>
            {filteredOutfits.map((outfit, index) => (
              <motion.div
                key={outfit.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                {/* Image */}
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                  <img
                    src={outfit.imageUrl}
                    alt={outfit.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  
                  {/* Match Score Badge */}
                  <motion.div 
                    className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                  >
                    {outfit.matchScore}% Match
                  </motion.div>
                  
                  {/* Favorite Button */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(outfit.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart 
                      className={`h-5 w-5 transition-colors ${
                        favorites.has(outfit.id) 
                          ? 'text-red-500 fill-current' 
                          : 'text-gray-400'
                      }`} 
                    />
                  </motion.button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title and Rating */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{outfit.name}</h3>
                    <div className="flex items-center space-x-1 text-yellow-500 ml-2">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium text-gray-700">4.8</span>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm mb-4">
                    {outfit.items.length} pieces • Complete look
                  </p>

                  {/* Item List */}
                  <div className="space-y-2 mb-4">
                    {outfit.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 truncate">{item.name}</span>
                        <span className="font-semibold text-gray-900 ml-2">${item.price}</span>
                      </div>
                    ))}
                    {outfit.items.length > 3 && (
                      <div className="text-sm text-gray-500 text-center pt-1 border-t border-gray-100">
                        +{outfit.items.length - 3} more items
                      </div>
                    )}
                  </div>

                  {/* Price and Add to Cart */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        ${outfit.totalPrice}
                      </div>
                      <div className="text-sm text-gray-500">Complete outfit</div>
                    </div>
                    <motion.button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(outfit);
                      }}
                      className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredOutfits.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-gray-400 mb-4">
              <Filter className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No outfits found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more recommendations.</p>
          </motion.div>
        )}
      </div>

      {/* Bottom CTA */}
      <motion.div 
        className="bg-white border-t border-gray-200 py-8"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Love your recommendations?</h3>
          <p className="text-gray-600 mb-4">Share your style journey with friends and get even more personalized suggestions.</p>
          <motion.button
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Share My Style
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CatalogPage;