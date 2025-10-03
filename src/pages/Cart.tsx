
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {Trash2, Plus, Minus, ShoppingBag, ArrowRight} from 'lucide-react'
import { useCart } from '../hooks/useCart'
import toast from 'react-hot-toast'

const Cart: React.FC = () => {
  const { items, updateQuantity, removeItem, subtotal, itemCount } = useCart()
  const [isMobile, setIsMobile] = useState(false)

  const SHIPPING_FEE = 8.90
  const FREE_SHIPPING_THRESHOLD = 50.00
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const total = subtotal + shippingFee

  // Detectar dispositivo móvel
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Configurações de animação baseadas no dispositivo
  const animationConfig = isMobile ? {} : {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  }

  const itemAnimation = isMobile ? {} : {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.2 }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center px-4">
        <motion.div 
          {...animationConfig}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-32 h-32 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag size={64} className="text-white" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Seu carrinho está vazio
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Que tal dar uma olhada no nosso delicioso cardápio?
          </p>
          <Link
            to="/cardapio"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all"
          >
            <span>Ver Cardápio</span>
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-6xl">
        {/* Header */}
        <motion.div 
          {...animationConfig}
          className="text-center mb-8 lg:mb-12"
        >
          <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Seu Carrinho
          </h1>
          <p className="text-gray-600 text-lg">
            {itemCount} {itemCount === 1 ? 'item' : 'itens'} selecionado{itemCount !== 1 ? 's' : ''}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Lista de Itens */}
          <div className="lg:col-span-2">
            <motion.div 
              {...animationConfig}
              className="bg-white rounded-2xl lg:rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8"
            >
              <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6">
                Itens do Pedido
              </h2>
              
              <AnimatePresence mode="popLayout">
                <div className="space-y-4 lg:space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      {...itemAnimation}
                      layout
                      className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6 p-4 lg:p-6 border border-gray-200 rounded-xl lg:rounded-2xl hover:shadow-md transition-all bg-gray-50/50"
                    >
                      {/* Imagem do Item */}
                      <div className="w-full lg:w-24 h-32 lg:h-24 bg-gradient-to-br from-orange-200 to-red-200 rounded-xl flex items-center justify-center">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.itemName}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <span className="text-orange-600 font-bold text-2xl">
                            {item.itemName.charAt(0)}
                          </span>
                        )}
                      </div>

                      {/* Informações do Item */}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg mb-2">
                          {item.itemName}
                        </h3>
                        
                        {item.selectedSize && (
                          <p className="text-gray-600 text-sm mb-1">
                            <span className="font-semibold">Tamanho:</span> {item.selectedSize}
                          </p>
                        )}
                        
                        {item.selectedExtras && item.selectedExtras.length > 0 && (
                          <p className="text-gray-600 text-sm mb-1">
                            <span className="font-semibold">Extras:</span> {item.selectedExtras.join(', ')}
                          </p>
                        )}
                        
                        {item.observations && (
                          <p className="text-gray-600 text-sm mb-2">
                            <span className="font-semibold">Obs:</span> {item.observations}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-orange-600">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </span>
                          
                          {/* Controles de Quantidade */}
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1 bg-white border border-gray-300 rounded-xl p-1">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-8 text-center font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Resumo do Pedido */}
          <motion.div 
            {...animationConfig}
            className="bg-white rounded-2xl lg:rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8 h-fit sticky top-4"
          >
            <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6">
              Resumo do Pedido
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'itens'})</span>
                <span className="font-semibold">R$ {subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Taxa de entrega</span>
                <span className={shippingFee === 0 ? 'text-green-600 font-bold' : 'font-semibold'}>
                  {shippingFee === 0 ? 'GRÁTIS' : `R$ ${shippingFee.toFixed(2)}`}
                </span>
              </div>

              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <p className="text-orange-700 text-sm font-semibold">
                    Faltam R$ {(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} para frete grátis!
                  </p>
                  <p className="text-orange-600 text-xs mt-1">
                    Adicione mais itens e economize na entrega
                  </p>
                </div>
              )}
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl lg:text-2xl font-bold">
                  <span>Total</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Link
                to="/checkout"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 lg:py-5 rounded-xl lg:rounded-2xl font-bold text-lg text-center block hover:shadow-lg transition-all"
              >
                Finalizar Pedido
              </Link>
              
              <Link
                to="/cardapio"
                className="w-full border-2 border-gray-300 text-gray-700 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-semibold text-center block hover:bg-gray-50 transition-all"
              >
                Adicionar Mais Itens
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-gray-500 text-sm">
                🕒 Tempo estimado de entrega: 30-45 min
              </p>
              <p className="text-gray-500 text-xs mt-1">
                📍 Entregamos em toda São Paulo
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Cart
