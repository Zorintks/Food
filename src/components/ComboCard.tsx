import React, { useState, useEffect } from 'react'
import {Star, Clock, AlertCircle, Plus} from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { ComboItem } from '../types'

interface ComboCardProps {
  combo: ComboItem
  onAddToCart: (item: Omit<ComboItem, 'quantity'>) => void
}

const ComboCard: React.FC<ComboCardProps> = ({ combo, onAddToCart }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 14,
    seconds: 23
  })

  // Countdown timer
  useEffect(() => {
    if (!combo.hasCountdown) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        }

        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [combo.hasCountdown])

  const handleAddToCart = () => {
    onAddToCart(combo)
    toast.success(`${combo.name} adicionado ao carrinho!`)
  }

  const discountPercentage = Math.round(((combo.originalPrice - combo.price) / combo.originalPrice) * 100)

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
          src={combo.image}
          alt={combo.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {combo.badge && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {combo.badge}
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Limited quantity */}
        {combo.isLimited && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            Apenas {combo.limitedQuantity} restantes
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Rating */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900 leading-tight">
            {combo.name}
          </h3>
          <div className="flex items-center ml-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">
              {combo.rating} ({combo.reviewCount})
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {combo.description}
        </p>

        {/* Countdown */}
        {combo.hasCountdown && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-red-700 text-xs font-medium flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Promoção termina em:
              </span>
              <span className="text-red-700 font-bold text-sm">
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {combo.originalPrice > combo.price && (
              <span className="text-gray-400 text-sm line-through">
                R$ {combo.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-2xl font-bold text-green-600">
              R$ {combo.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
          aria-label={`Adicionar ${combo.name} ao carrinho`}
        >
          <Plus className="w-5 h-5" />
          <span>Adicionar ao Carrinho</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default ComboCard