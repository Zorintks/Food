
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {X, Minus, Plus, ShoppingBag, Truck, Tag, Check, AlertCircle} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CartItem, PromoCode } from '../types'

interface CartProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  total: number
  appliedPromoCode?: PromoCode | null
  onApplyPromoCode: (promoCode: PromoCode | null) => void
}

const Cart: React.FC<CartProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  total,
  appliedPromoCode,
  onApplyPromoCode
}) => {
  const navigate = useNavigate()
  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState('')
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  
  // Calcular descontos
  const promoDiscount = appliedPromoCode ? (total * 15 / 100) : 0
  const subtotalAfterPromo = total - promoDiscount
  
  const deliveryFee = appliedPromoCode?.freeDelivery ? 0 : (subtotalAfterPromo >= 50 ? 0 : 8.99)
  const finalTotal = subtotalAfterPromo + deliveryFee

  const validatePromoCode = (code: string): PromoCode | null => {
    const upperCode = code.toUpperCase().trim()
    
    if (upperCode === 'PROMO3') {
      return {
        code: upperCode,
        discount: 15,
        freeDelivery: true,
        isValid: true,
        description: '15% de desconto + frete grátis'
      }
    }
    
    return null
  }

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) {
      setPromoError('Digite um código promocional')
      return
    }

    setIsApplyingPromo(true)
    setPromoError('')

    // Simular delay de validação
    await new Promise(resolve => setTimeout(resolve, 800))

    const validPromo = validatePromoCode(promoInput)
    
    if (validPromo) {
      onApplyPromoCode(validPromo)
      setPromoInput('')
      setPromoError('')
    } else {
      setPromoError('Código promocional inválido')
      onApplyPromoCode(null)
    }

    setIsApplyingPromo(false)
  }

  const handleRemovePromo = () => {
    onApplyPromoCode(null)
    setPromoInput('')
    setPromoError('')
  }

  const handleCheckout = () => {
    if (items.length === 0) return
    onClose()
    navigate('/checkout')
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Seu Carrinho ({items.length})
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Fechar carrinho"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-gray-500">
                  <ShoppingBag className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg font-medium">Carrinho vazio</p>
                  <p className="text-sm text-center mt-2">
                    Adicione alguns combos deliciosos para começar!
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">R$ {item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {/* Promo Code Section */}
                  <div className="border-t pt-4 mt-6">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <Tag className="w-5 h-5 text-purple-600 mr-2" />
                        <h3 className="font-medium text-gray-900">Código Promocional</h3>
                      </div>

                      {!appliedPromoCode ? (
                        <div className="space-y-3">
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={promoInput}
                              onChange={(e) => {
                                setPromoInput(e.target.value.toUpperCase())
                                setPromoError('')
                              }}
                              placeholder="Digite seu código"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              disabled={isApplyingPromo}
                            />
                            <button
                              onClick={handleApplyPromo}
                              disabled={isApplyingPromo || !promoInput.trim()}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                              {isApplyingPromo ? '...' : 'Aplicar'}
                            </button>
                          </div>

                          {promoError && (
                            <div className="flex items-center text-red-600 text-sm">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {promoError}
                            </div>
                          )}

                          <p className="text-xs text-gray-500">
                            💡 Dica: Experimente o código "PROMO3" para desconto especial!
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center">
                              <Check className="w-5 h-5 text-green-600 mr-2" />
                              <div>
                                <p className="font-medium text-green-800">{appliedPromoCode.code}</p>
                                <p className="text-sm text-green-600">{appliedPromoCode.description}</p>
                              </div>
                            </div>
                            <button
                              onClick={handleRemovePromo}
                              className="text-green-600 hover:text-green-800 text-sm underline"
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t bg-white p-4 space-y-3">
                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>

                  {appliedPromoCode && promoDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto ({appliedPromoCode.code})</span>
                      <span>-R$ {promoDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Truck className="w-4 h-4 mr-1 text-gray-500" />
                      <span>Taxa de entrega</span>
                    </div>
                    <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                      {deliveryFee === 0 ? 'GRÁTIS' : `R$ ${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>

                  {!appliedPromoCode?.freeDelivery && subtotalAfterPromo < 50 && (
                    <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                      Adicione R$ {(50 - subtotalAfterPromo).toFixed(2)} para frete grátis!
                    </p>
                  )}

                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>R$ {finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Guarantee */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                  <p className="text-xs text-green-700 text-center">
                    ✅ Satisfação garantida ou seu pedido refeito
                  </p>
                </div>

                {/* Checkout Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors"
                >
                  Finalizar Pedido — R$ {finalTotal.toFixed(2)}
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Cart
