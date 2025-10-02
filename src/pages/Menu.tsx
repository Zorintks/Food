
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {Plus, Clock, Star, X, Minus} from 'lucide-react'
import { lumi } from '../lib/lumi'
import { useCart } from '../hooks/useCart'
import CPFModal from '../components/CPFModal'
import toast from 'react-hot-toast'

interface FoodItem {
  _id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  description: string
  image: string
  available: boolean
  sizes: string[]
  extras: string[]
  isCombo: boolean
  prepTime: number
}

interface CartItem {
  itemId: string
  itemName: string
  quantity: number
  price: number
  selectedSize?: string
  selectedExtras?: string[]
  observations?: string
  image?: string
}

const Menu: React.FC = () => {
  const [items, setItems] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null)
  const [showCPFModal, setShowCPFModal] = useState(false)
  const [currentCPF, setCurrentCPF] = useState<string | null>(null)
  const [pendingCartItem, setPendingCartItem] = useState<CartItem | null>(null)

  // Estados do modal de produto
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [observations, setObservations] = useState('')
  const [quantity, setQuantity] = useState(1)

  const { addItem } = useCart()

  const categories = [
    { id: 'todos', name: 'Todos', emoji: '🍽️' },
    { id: 'sushi', name: 'Sushi', emoji: '🍣' },
    { id: 'hamburger', name: 'Hambúrgueres', emoji: '🍔' },
    { id: 'acompanhamentos', name: 'Acompanhamentos', emoji: '🍟' },
    { id: 'bebidas', name: 'Bebidas', emoji: '🥤' }
  ]

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const { list } = await lumi.entities.food_items.list({
        sort: { isCombo: -1, createdAt: -1 }
      })
      setItems(list || [])
    } catch (error) {
      console.error('Erro ao carregar cardápio:', error)
      toast.error('Erro ao carregar cardápio')
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = selectedCategory === 'todos' 
    ? items 
    : items.filter(item => item.category === selectedCategory)

  const openItemModal = (item: FoodItem) => {
    setSelectedItem(item)
    setSelectedSize(item.sizes[0] || '')
    setSelectedExtras([])
    setObservations('')
    setQuantity(1)
  }

  const closeItemModal = () => {
    setSelectedItem(null)
    setSelectedSize('')
    setSelectedExtras([])
    setObservations('')
    setQuantity(1)
  }

  const handleExtraToggle = (extra: string) => {
    setSelectedExtras(prev => 
      prev.includes(extra) 
        ? prev.filter(e => e !== extra)
        : [...prev, extra]
    )
  }

  const handleAddToCart = () => {
    if (!selectedItem) return

    const cartItem: CartItem = {
      itemId: selectedItem._id,
      itemName: selectedItem.name,
      quantity,
      price: selectedItem.price,
      selectedSize: selectedSize || undefined,
      selectedExtras: selectedExtras.length > 0 ? selectedExtras : undefined,
      observations: observations || undefined,
      image: selectedItem.image
    }

    if (currentCPF) {
      addItem(cartItem)
      closeItemModal()
    } else {
      setPendingCartItem(cartItem)
      setShowCPFModal(true)
    }
  }

  const handleCPFConfirm = async (cpf: string) => {
    setCurrentCPF(cpf)
    setShowCPFModal(false)
    
    if (pendingCartItem) {
      await addItem(pendingCartItem)
      setPendingCartItem(null)
      closeItemModal()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Nosso <span className="text-orange-500">Cardápio</span>
          </h1>
          <p className="text-xl text-gray-600">
            Sabores únicos, ingredientes frescos e preços especiais
          </p>
        </motion.div>

        {/* Filtros de Categoria */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              <span className="mr-2">{category.emoji}</span>
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Grid de Produtos */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                onClick={() => openItemModal(item)}
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {item.isCombo && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Combo
                      </span>
                    )}
                    {item.originalPrice && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{item.prepTime}min</span>
                  </div>

                  {!item.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                        Indisponível
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-orange-500">
                          R$ {item.price.toFixed(2)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            R$ {item.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">4.8</span>
                      </div>
                    </div>

                    <motion.button
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full hover:shadow-lg transition-all disabled:opacity-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!item.available}
                      onClick={(e) => {
                        e.stopPropagation()
                        openItemModal(item)
                      }}
                    >
                      <Plus size={20} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhum item encontrado nesta categoria.
            </p>
          </div>
        )}
      </div>

      {/* Modal de Detalhes do Produto */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeItemModal}
            />

            <motion.div
              className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <button
                onClick={closeItemModal}
                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>

              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-64 object-cover"
              />

              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {selectedItem.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{selectedItem.description}</p>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold text-orange-500">
                        R$ {selectedItem.price.toFixed(2)}
                      </span>
                      {selectedItem.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          R$ {selectedItem.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span className="text-gray-600">{selectedItem.prepTime} min</span>
                    </div>
                  </div>
                </div>

                {/* Tamanhos */}
                {selectedItem.sizes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Tamanho:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            selectedSize === size
                              ? 'border-orange-500 bg-orange-50 text-orange-600'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Adicionais */}
                {selectedItem.extras.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Adicionais:</h3>
                    <div className="space-y-2">
                      {selectedItem.extras.map((extra) => (
                        <label
                          key={extra}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedExtras.includes(extra)}
                            onChange={() => handleExtraToggle(extra)}
                            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <span>{extra}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Observações */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Observações:</h3>
                  <textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Alguma observação especial?"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    rows={3}
                  />
                </div>

                {/* Quantidade e Botão */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-gray-800">Quantidade:</span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-xl font-semibold w-8 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleAddToCart}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Adicionar - R$ {(selectedItem.price * quantity).toFixed(2)}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de CPF */}
      <CPFModal
        isOpen={showCPFModal}
        onClose={() => {
          setShowCPFModal(false)
          setPendingCartItem(null)
        }}
        onConfirm={handleCPFConfirm}
        title="Identifique-se para Continuar"
        description="Digite seu CPF para adicionar itens ao carrinho"
      />
    </div>
  )
}

export default Menu
