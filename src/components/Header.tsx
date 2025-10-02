
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {ShoppingCart, MapPin, Phone} from 'lucide-react'
import { motion } from 'framer-motion'

interface HeaderProps {
  cartItemCount: number
}

const Header: React.FC<HeaderProps> = ({ cartItemCount }) => {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      {/* Banner de Frete Grátis */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-2">
        <div className="container mx-auto px-4 text-center">
          <motion.p 
            className="text-sm font-semibold flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MapPin size={16} />
            🚚 FRETE GRÁTIS para São Paulo em pedidos acima de R$50!
          </motion.p>
        </div>
      </div>

      {/* Header Principal */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">FC</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">FoodCombo</h1>
              <p className="text-sm text-gray-600">Delivery Gourmet</p>
            </div>
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'text-orange-500' 
                  : 'text-gray-700 hover:text-orange-500'
              }`}
            >
              Início
            </Link>
            <Link 
              to="/cardapio" 
              className={`font-medium transition-colors ${
                location.pathname === '/cardapio' 
                  ? 'text-orange-500' 
                  : 'text-gray-700 hover:text-orange-500'
              }`}
            >
              Cardápio
            </Link>
            <Link 
              to="/pedidos" 
              className={`font-medium transition-colors ${
                location.pathname === '/pedidos' 
                  ? 'text-orange-500' 
                  : 'text-gray-700 hover:text-orange-500'
              }`}
            >
              Meus Pedidos
            </Link>
          </nav>

          {/* Contato e Carrinho */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-2 text-gray-600">
              <Phone size={16} />
              <span className="text-sm">(11) 9999-9999</span>
            </div>

            <Link to="/carrinho" className="relative">
              <motion.div
                className="p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <motion.span
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          </div>
        </div>

        {/* Navegação Mobile */}
        <nav className="md:hidden mt-4 flex justify-center space-x-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/' 
                ? 'text-orange-500' 
                : 'text-gray-700 hover:text-orange-500'
            }`}
          >
            Início
          </Link>
          <Link 
            to="/cardapio" 
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/cardapio' 
                ? 'text-orange-500' 
                : 'text-gray-700 hover:text-orange-500'
            }`}
          >
            Cardápio
          </Link>
          <Link 
            to="/pedidos" 
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/pedidos' 
                ? 'text-orange-500' 
                : 'text-gray-700 hover:text-orange-500'
            }`}
          >
            Pedidos
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
