
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Truck} from 'lucide-react'
import { useCart } from '../App'

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, total, itemCount } = useCart()

  const freeShippingThreshold = 50
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - total)
  const hasFreeShipping = total >= freeShippingThreshold

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-600 mb-8">
              Que tal dar uma olhada no nosso delicioso cardápio?
            </p>
            <Link
              to="/cardapio"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-4 rounded-full font-bold hover:from-red-700 hover:to-orange-600 transition-all transform hover:scale-105"
            >
              <ShoppingBag size={20} />
              Ver Cardápio
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <Link
              to="/cardapio"
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Seu Carrinho</h1>
              <p className="opacity-90">
                {itemCount} {itemCount === 1 ? 'item' : 'itens'} selecionado{itemCount !== 1 ? 's' : ''}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Itens */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                      
                      {/* Mostrar personalizações */}
                      {item.customizations && (
                        <div className="mb-3 text-sm text-gray-600 space-y-1">
                          {item.customizations.removedIngredients?.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-red-500">🚫</span>
                              <span>Sem: {item.customizations.removedIngredients.join(', ')}</span>
                            </div>
                          )}
                          {item.customizations.selectedOptionals?.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-green-500">➕</span>
                              <span>Extras: {item.customizations.selectedOptionals.map((opt: any) => opt.name).join(', ')}</span>
                            </div>
                          )}
                          {item.customizations.observations && (
                            <div className="flex items-center gap-1">
                              <span>📝</span>
                              <span className="italic">{item.customizations.observations}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {item.description && !item.customizations && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-semibold text-lg w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-lg text-red-600">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-4"
            >
              <h3 className="font-bold text-xl mb-6">Resumo do Pedido</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'itens'})</span>
                  <span className="font-semibold">R$ {total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Taxa de entrega</span>
                  <span className={`font-semibold ${hasFreeShipping ? 'text-green-600' : ''}`}>
                    {hasFreeShipping ? 'GRÁTIS' : 'R$ 8,90'}
                  </span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-red-600">
                      R$ {(total + (hasFreeShipping ? 0 : 8.90)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Frete Grátis */}
              {!hasFreeShipping && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-yellow-700 mb-2">
                    <Truck size={18} />
                    <span className="font-semibold">Frete Grátis</span>
                  </div>
                  <p className="text-sm text-yellow-600">
                    Faltam apenas <strong>R$ {remainingForFreeShipping.toFixed(2)}</strong> para ganhar frete grátis!
                  </p>
                  <div className="w-full bg-yellow-200 rounded-full h-2 mt-3">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(total / freeShippingThreshold) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {hasFreeShipping && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-green-700">
                    <Truck size={18} />
                    <span className="font-semibold">🎉 Você ganhou frete grátis!</span>
                  </div>
                </div>
              )}

              <Link
                to="/checkout"
                className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-4 rounded-full font-bold text-center block hover:from-red-700 hover:to-orange-600 transition-all transform hover:scale-105"
              >
                Finalizar Pedido 🚀
              </Link>
              
              <Link
                to="/cardapio"
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-full font-semibold text-center block mt-3 hover:bg-gray-200 transition-colors"
              >
                Continuar Comprando
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
