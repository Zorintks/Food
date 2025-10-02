
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {Minus, Plus, Trash2, ShoppingBag, Truck, ArrowRight} from 'lucide-react'
import { useCart } from '../hooks/useCart'
import CPFModal from '../components/CPFModal'

const Cart: React.FC = () => {
  const { items, loading, updateQuantity, removeItem, subtotal, itemCount, syncCart } = useCart()
  const [showCPFModal, setShowCPFModal] = useState(false)
  const [currentCPF, setCurrentCPF] = useState<string | null>(null)

  const SHIPPING_FEE = 8.90
  const FREE_SHIPPING_THRESHOLD = 50.00

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const total = subtotal + shippingFee

  useEffect(() => {
    // Se não há CPF definido e há tentativa de acessar carrinho, solicitar CPF
    if (!currentCPF && !loading) {
      setShowCPFModal(true)
    }
  }, [currentCPF, loading])

  const handleCPFConfirm = async (cpf: string) => {
    setCurrentCPF(cpf)
    setShowCPFModal(false)
    await syncCart(cpf)
  }

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    await updateQuantity(itemId, newQuantity)
  }

  const handleRemoveItem = async (itemId: string) => {
    await removeItem(itemId)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!currentCPF) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <CPFModal
          isOpen={showCPFModal}
          onClose={() => setShowCPFModal(false)}
          onConfirm={handleCPFConfirm}
          title="Acesse seu Carrinho"
          description="Digite seu CPF para visualizar seus itens"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Seu <span className="text-orange-500">Carrinho</span>
          </h1>
          <p className="text-gray-600">
            {itemCount > 0 ? `${itemCount} ${itemCount === 1 ? 'item' : 'itens'} no carrinho` : 'Carrinho vazio'}
          </p>
        </motion.div>

        {items.length === 0 ? (
          /* Carrinho Vazio */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-600 mb-8">
              Que tal explorar nosso delicioso cardápio?
            </p>
            <Link to="/cardapio">
              <motion.button
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Ver Cardápio
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Lista de Itens */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Imagem */}
                      <img
                        src={item.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                        alt={item.itemName}
                        className="w-20 h-20 object-cover rounded-xl"
                      />

                      {/* Detalhes */}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg mb-1">
                          {item.itemName}
                        </h3>
                        
                        {item.selectedSize && (
                          <p className="text-sm text-gray-600 mb-1">
                            Tamanho: {item.selectedSize}
                          </p>
                        )}
                        
                        {item.selectedExtras && item.selectedExtras.length > 0 && (
                          <p className="text-sm text-gray-600 mb-1">
                            Adicionais: {item.selectedExtras.join(', ')}
                          </p>
                        )}
                        
                        {item.observations && (
                          <p className="text-sm text-gray-600 mb-2">
                            Obs: {item.observations}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-orange-500">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </span>
                          
                          <div className="flex items-center space-x-3">
                            {/* Controles de Quantidade */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuantityChange(item._id!, item.quantity - 1)}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="text-lg font-semibold w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item._id!, item.quantity + 1)}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            {/* Botão Remover */}
                            <button
                              onClick={() => handleRemoveItem(item._id!)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Resumo do Pedido */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-8"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Resumo do Pedido
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({itemCount} itens)</span>
                  <span className="font-semibold">R$ {subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Truck size={16} className="text-gray-600" />
                    <span className="text-gray-600">Entrega</span>
                  </div>
                  <div className="text-right">
                    {shippingFee === 0 ? (
                      <div>
                        <span className="font-semibold text-green-600">GRÁTIS</span>
                        <p className="text-xs text-gray-500">Frete grátis SP</p>
                      </div>
                    ) : (
                      <div>
                        <span className="font-semibold">R$ {shippingFee.toFixed(2)}</span>
                        <p className="text-xs text-gray-500">
                          Faltam R$ {(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} para frete grátis
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-orange-500">R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Barra de Progresso Frete Grátis */}
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progresso frete grátis</span>
                    <span>{Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <Link to="/checkout" state={{ cpf: currentCPF }}>
                <motion.button
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Finalizar Pedido</span>
                  <ArrowRight size={20} />
                </motion.button>
              </Link>

              <Link to="/cardapio">
                <button className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                  Adicionar Mais Itens
                </button>
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
