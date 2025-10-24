
import React from 'react'
import {Star, Plus, Thermometer, Wine} from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { DrinkItem } from '../types'

interface DrinkCardProps {
  drink: DrinkItem
  onAddToCart: (item: Omit<DrinkItem, 'quantity'>) => void
}

const DrinkCard: React.FC<DrinkCardProps> = ({ drink, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(drink)
    toast.success(`${drink.name} adicionado ao carrinho!`)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'refrigerante':
        return 'bg-blue-100 text-blue-800'
      case 'suco':
        return 'bg-orange-100 text-orange-800'
      case 'cerveja':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'refrigerante':
        return 'Refrigerante'
      case 'suco':
        return 'Suco'
      case 'cerveja':
        return 'Cerveja'
      default:
        return category
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative">
        <img
          src={drink.image}
          alt={drink.name}
          className="w-full h-40 object-cover"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${getCategoryColor(drink.category)}`}>
            {getCategoryLabel(drink.category)}
          </span>
          {drink.badge && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {drink.badge}
            </span>
          )}
        </div>

        {/* Limited quantity */}
        {drink.isLimited && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            Apenas {drink.limitedQuantity} restantes
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Rating */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900 leading-tight">
            {drink.name}
          </h3>
          <div className="flex items-center ml-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">
              {drink.rating} ({drink.reviewCount})
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3">
          {drink.description}
        </p>

        {/* Drink Info */}
        <div className="flex items-center space-x-4 mb-3 text-xs text-gray-500">
          {drink.size && (
            <span className="flex items-center">
              <span className="w-2 h-2 bg-gray-400 rounded-full mr-1"></span>
              {drink.size}
            </span>
          )}
          <span className="flex items-center">
            <Thermometer className="w-3 h-3 mr-1" />
            {drink.temperature === 'gelado' ? 'Gelado' : 'Natural'}
          </span>
          {drink.alcoholContent && (
            <span className="flex items-center">
              <Wine className="w-3 h-3 mr-1" />
              {drink.alcoholContent}% vol
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-green-600">
            R$ {drink.price.toFixed(2)}
          </span>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
          aria-label={`Adicionar ${drink.name} ao carrinho`}
        >
          <Plus className="w-5 h-5" />
          <span>Adicionar</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default DrinkCard
