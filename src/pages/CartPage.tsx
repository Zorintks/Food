
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {ArrowLeft, Plus, Minus, Trash2, Tag, Check, X, ShoppingBag, Truck, Gift} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CartItem, PromoCode } from '../types'

interface CartPageProps {
  cartItems: CartItem[]
  appliedPromoCode: PromoCode | null
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onApplyPromoCode: (code: string) => void
  onRemovePromoCode: () => void
  onClearCart: () => void
}

const CartPage: React.FC<CartPageProps> = ({
  cartItems,
  appliedPromoCode,
  onUpdateQuantity,
  onRemoveItem,
  onApplyPromoCode,
  onRemovePromoCode,
  onClearCart
}) => {
  const navigate = useNavigate()
  const [promoCode, setPromoCode] = useState('')
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const promoDiscount = appliedPromoCode ? (subtotal * 15 / 100) : 0
  const subtotalAfterPromo = subtotal - promoDiscount
  const deliveryFee = appliedPromoCode?.freeDelivery ? 0 : (subtotalAfterPromo >= 50 ? 0 : 8.99)
  const total = subtotalAfterPromo + deliveryFee

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error('Digite um código promocional')
      return
    }

    setIsApplyingPromo(true)
    
    try {
      // Simular delay de validação
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (promoCode.toUpperCase() === 'PROMO3') {
        onApplyPromoCode(promoCode.toUpperCase())
        setPromoCode('')
        toast.success('Código aplicado! 15% de desconto + frete grátis 🎉')
      } else {
        toast.error('Código inválido. Tente PROMO3')
      }
    } finally {
      setIsApplyingPromo(false)
    }
  }

  const handleRemovePromoCode = () => {
    onRemovePromoCode()
    toast.success('Código promocional removido')
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Carrinho Vazio</h1>
          <p className="text-gray-600 mb-6">Adicione alguns combos deliciosos ao seu carrinho!</p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            Ver Combos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="mr-4 p-2 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Meu Carrinho</h1>
          <span className="ml-3 bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Seus Combos</h2>
              
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:border-orange-200 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-orange-600">
                          R$ {item.price.toFixed(2)}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-sm text-gray-500 line-through">
                            R$ {item.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Remover item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Clear Cart Button */}
              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={onClearCart}
                  className="text-red-600 hover:text-red-700 font-medium text-sm"
                >
                  Limpar carrinho
                </button>
              </div>
            </motion.div>

            {/* Promo Code Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 mt-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Gift className="w-5 h-5 text-purple-600 mr-2" />
                Código Promocional
              </h3>

              {!appliedPromoCode ? (
                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Digite seu código"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                        disabled={isApplyingPromo}
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyPromoCode()}
                      />
                    </div>
                    <button
                      onClick={handleApplyPromoCode}
                      disabled={isApplyingPromo || !promoCode.trim()}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {isApplyingPromo ? 'Validando...' : 'Aplicar'}
                    </button>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <Tag className="w-5 h-5 text-purple-600 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-purple-800 mb-1">
                          💡 Dica: Use o código PROMO3
                        </p>
                        <p className="text-xs text-purple-600">
                          Ganhe 15% de desconto + frete grátis!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-green-500 rounded-full p-1 mr-3">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">
                          Código {appliedPromoCode.code} aplicado!
                        </p>
                        <p className="text-sm text-green-600">{15%}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemovePromoCode}
                      className="text-green-600 hover:text-green-700 p-1"
                      aria-label="Remover código promocional"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Resumo do Pedido</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                </div>

                {appliedPromoCode && promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 mr-1" />
                      <span>Desconto ({appliedPromoCode.code})</span>
                    </div>
                    <span className="font-medium">-R$ {promoDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 mr-1 text-gray-600" />
                    <span className="text-gray-600">Entrega</span>
                  </div>
                  <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                    {deliveryFee === 0 ? 'GRÁTIS' : `R$ ${deliveryFee.toFixed(2)}`}
                  </span>
                </div>

                {subtotalAfterPromo >= 50 && !appliedPromoCode?.freeDelivery && (
                  <p className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    🎉 Frete grátis por compras acima de R$ 50!
                  </p>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-orange-600">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors mb-4"
              >
                Finalizar Pedido
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 rounded-lg transition-colors"
              >
                Adicionar Mais Itens
              </button>

              {/* Guarantee */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-orange-700 text-center">
                  ✅ Satisfação garantida ou seu dinheiro de volta
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
