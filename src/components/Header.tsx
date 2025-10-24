import React from 'react'
import {ShoppingCart, Phone, Clock} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

interface HeaderProps {
  cartItemsCount: number
  onCartClick: () => void
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const isCartPage = location.pathname === '/cart'
  const isCheckoutPage = location.pathname === '/checkout'

  return (
    <header className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl">
              🍔
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FoodCombos</h1>
              <p className="text-xs text-gray-600">Sabor que conquista</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>(11) 99999-9999</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Seg-Dom: 18h-23h</span>
            </div>
          </div>

          {/* Cart Actions */}
          <div className="flex items-center space-x-3">
            {!isCartPage && !isCheckoutPage && (
              <button
                onClick={() => navigate('/cart')}
                className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors"
                aria-label="Ver carrinho"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            )}

            {(isCartPage || isCheckoutPage) && (
              <button
                onClick={() => navigate('/')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Continuar Comprando
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
