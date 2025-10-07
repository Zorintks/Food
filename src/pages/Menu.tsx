
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {Search, Plus, Star, Clock, X} from 'lucide-react'
import { useCart } from '../App'
import toast from 'react-hot-toast'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isPopular?: boolean
  prepTime?: string
  ingredients?: string[]
  optionals?: { name: string; price: number }[]
}

interface CustomizationModalProps {
  item: MenuItem | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (item: MenuItem, customizations: any) => void
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ item, isOpen, onClose, onAddToCart }) => {
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([])
  const [selectedOptionals, setSelectedOptionals] = useState<string[]>([])
  const [observations, setObservations] = useState('')

  if (!item) return null

  const toggleIngredient = (ingredient: string) => {
    setRemovedIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    )
  }

  const toggleOptional = (optionalName: string) => {
    setSelectedOptionals(prev => 
      prev.includes(optionalName) 
        ? prev.filter(o => o !== optionalName)
        : [...prev, optionalName]
    )
  }

  const calculateTotalPrice = () => {
    let total = item.price
    if (item.optionals) {
      selectedOptionals.forEach(optName => {
        const optional = item.optionals?.find(opt => opt.name === optName)
        if (optional) total += optional.price
      })
    }
    return total
  }

  const handleAddToCart = () => {
    const customizations = {
      removedIngredients,
      selectedOptionals: selectedOptionals.map(optName => {
        const optional = item.optionals?.find(opt => opt.name === optName)
        return { name: optName, price: optional?.price || 0 }
      }),
      observations,
      customPrice: calculateTotalPrice()
    }
    
    onAddToCart(item, customizations)
    
    // Reset form
    setRemovedIngredients([])
    setSelectedOptionals([])
    setObservations('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Personalizar Pedido</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Item Info */}
              <div className="flex gap-4 mb-6">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{item.name}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  <p className="text-red-600 font-bold text-lg mt-1">
                    R$ {calculateTotalPrice().toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Ingredients to Remove */}
              {item.ingredients && item.ingredients.length > 0 && (
                <div className="mb-6">
                  <h5 className="font-semibold mb-3">🚫 Retirar ingredientes:</h5>
                  <div className="space-y-2">
                    {item.ingredients.map((ingredient) => (
                      <label
                        key={ingredient}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={removedIngredients.includes(ingredient)}
                          onChange={() => toggleIngredient(ingredient)}
                          className="w-4 h-4 text-red-600 rounded"
                        />
                        <span className={removedIngredients.includes(ingredient) ? 'line-through text-gray-500' : ''}>
                          {ingredient}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Extras */}
              {item.optionals && item.optionals.length > 0 && (
                <div className="mb-6">
                  <h5 className="font-semibold mb-3">➕ Adicionais:</h5>
                  <div className="space-y-2">
                    {item.optionals.map((optional) => (
                      <label
                        key={optional.name}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedOptionals.includes(optional.name)}
                            onChange={() => toggleOptional(optional.name)}
                            className="w-4 h-4 text-red-600 rounded"
                          />
                          <span>{optional.name}</span>
                        </div>
                        <span className="text-red-600 font-semibold">
                          + R$ {optional.price.toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Observations */}
              <div className="mb-6">
                <h5 className="font-semibold mb-3">📝 Observações:</h5>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Ex: sem cebola, bem passado, molho à parte..."
                  className="w-full p-3 border rounded-lg resize-none h-20 focus:outline-none focus:ring-2 focus:ring-red-500"
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {observations.length}/200 caracteres
                </p>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-4 rounded-full font-bold hover:from-red-700 hover:to-orange-600 transition-all transform hover:scale-105"
              >
                Adicionar ao carrinho - R$ {calculateTotalPrice().toFixed(2)}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const Menu: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addToCart } = useCart()

  const categories = [
    { id: 'todos', name: 'Todos', icon: '🍽️' },
    { id: 'combos', name: 'Combos Principais', icon: '🍔' },
    { id: 'pizzas', name: 'Pizzas', icon: '🍕' },
    { id: 'sushi', name: 'Sushi', icon: '🍣' },
    { id: 'churrasco', name: 'Churrasco', icon: '🥩' },
    { id: 'massas', name: 'Massas', icon: '🍝' },
    { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
    { id: 'sobremesas', name: 'Sobremesas', icon: '🍨' }
  ]

  const menuItems: MenuItem[] = [
    // Combos Principais
    {
      id: '1',
      name: 'Combo X-Burguer Especial',
      description: 'Hambúrguer artesanal 180g, queijo, alface, tomate, cebola + batata frita + refrigerante 350ml',
      price: 28.90,
      image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'combos',
      isPopular: true,
      prepTime: '25-30 min',
      ingredients: ['Hambúrguer 180g', 'Queijo', 'Alface', 'Tomate', 'Cebola', 'Maionese'],
      optionals: [
        { name: 'Bacon', price: 4.00 },
        { name: 'Queijo Extra', price: 3.00 },
        { name: 'Ovo', price: 2.00 },
        { name: 'Batata Extra', price: 5.00 }
      ]
    },
    {
      id: '2',
      name: 'Combo X-Bacon Duplo',
      description: 'Dois hambúrgueres, bacon crocante, queijo cheddar + batata + refrigerante 600ml',
      price: 35.90,
      image: 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'combos',
      prepTime: '30-35 min',
      ingredients: ['2 Hambúrgueres', 'Bacon', 'Queijo Cheddar', 'Alface', 'Tomate'],
      optionals: [
        { name: 'Bacon Extra', price: 6.00 },
        { name: 'Cheddar Extra', price: 4.00 },
        { name: 'Cebola Caramelizada', price: 3.00 }
      ]
    },
    {
      id: '3',
      name: 'Combo Vegano Delícia',
      description: 'Hambúrguer de grão-de-bico, salada completa + batata doce + suco natural',
      price: 26.90,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'combos',
      prepTime: '20-25 min',
      ingredients: ['Hambúrguer de Grão-de-bico', 'Alface', 'Tomate', 'Cenoura', 'Molho Vegano'],
      optionals: [
        { name: 'Abacate', price: 3.00 },
        { name: 'Queijo Vegano', price: 5.00 },
        { name: 'Rúcula', price: 2.00 }
      ]
    },

    // Pizzas
    {
      id: '4',
      name: 'Pizza Margherita Média',
      description: 'Molho especial, mussarela, tomate, manjericão + refrigerante 600ml',
      price: 32.90,
      image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'pizzas',
      isPopular: true,
      prepTime: '35-40 min',
      ingredients: ['Molho de Tomate', 'Mussarela', 'Tomate', 'Manjericão', 'Orégano'],
      optionals: [
        { name: 'Borda Recheada', price: 8.00 },
        { name: 'Azeitona', price: 3.00 },
        { name: 'Rúcula', price: 4.00 }
      ]
    },
    {
      id: '5',
      name: 'Pizza Portuguesa Grande',
      description: 'Presunto, ovos, cebola, azeitona, mussarela',
      price: 45.90,
      image: 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'pizzas',
      prepTime: '40-45 min',
      ingredients: ['Molho de Tomate', 'Mussarela', 'Presunto', 'Ovos', 'Cebola', 'Azeitona'],
      optionals: [
        { name: 'Borda Recheada', price: 10.00 },
        { name: 'Presunto Extra', price: 6.00 },
        { name: 'Pimentão', price: 3.00 }
      ]
    },
    {
      id: '6',
      name: 'Pizza Pepperoni',
      description: 'Pepperoni premium, mussarela, molho especial',
      price: 38.90,
      image: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'pizzas',
      prepTime: '35-40 min',
      ingredients: ['Molho Especial', 'Mussarela', 'Pepperoni', 'Orégano'],
      optionals: [
        { name: 'Pepperoni Extra', price: 8.00 },
        { name: 'Pimenta Calabresa', price: 2.00 },
        { name: 'Cebola Roxa', price: 3.00 }
      ]
    },

    // Sushi
    {
      id: '7',
      name: 'Combo Sushi Premium',
      description: '20 peças variadas: salmão, atum, kani + temaki + refrigerante + sobremesa',
      price: 45.90,
      image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'sushi',
      isPopular: true,
      prepTime: '30-35 min',
      ingredients: ['Salmão', 'Atum', 'Kani', 'Arroz', 'Nori', 'Cream Cheese'],
      optionals: [
        { name: 'Salmão Grelhado', price: 8.00 },
        { name: 'Tartar de Salmão', price: 10.00 },
        { name: 'Gergelim', price: 2.00 }
      ]
    },
    {
      id: '8',
      name: 'Temaki Salmão Especial',
      description: 'Temaki grande com salmão grelhado, cream cheese, cebolinha',
      price: 18.90,
      image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'sushi',
      prepTime: '15-20 min',
      ingredients: ['Salmão Grelhado', 'Cream Cheese', 'Cebolinha', 'Arroz', 'Nori'],
      optionals: [
        { name: 'Salmão Extra', price: 6.00 },
        { name: 'Pepino', price: 2.00 },
        { name: 'Molho Especial', price: 3.00 }
      ]
    },

    // Churrasco
    {
      id: '9',
      name: 'Combo Picanha na Brasa',
      description: 'Picanha 300g + farofa + vinagrete + arroz + feijão + refrigerante',
      price: 42.90,
      image: 'https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'churrasco',
      prepTime: '40-45 min',
      ingredients: ['Picanha 300g', 'Farofa', 'Vinagrete', 'Arroz', 'Feijão'],
      optionals: [
        { name: 'Picanha Extra 150g', price: 15.00 },
        { name: 'Mandioca', price: 5.00 },
        { name: 'Pão de Alho', price: 4.00 }
      ]
    },
    {
      id: '10',
      name: 'Espetinho Misto (5 unidades)',
      description: 'Carne, frango, linguiça, queijo coalho + pão de alho',
      price: 28.90,
      image: 'https://images.pexels.com/photos/1410236/pexels-photo-1410236.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'churrasco',
      prepTime: '25-30 min',
      ingredients: ['Carne Bovina', 'Frango', 'Linguiça', 'Queijo Coalho', 'Pão de Alho'],
      optionals: [
        { name: 'Espetinho Extra', price: 6.00 },
        { name: 'Molho Barbecue', price: 3.00 },
        { name: 'Farofa', price: 4.00 }
      ]
    },

    // Massas
    {
      id: '11',
      name: 'Lasanha Bolonhesa',
      description: 'Massa artesanal, molho bolonhesa, queijos especiais + salada',
      price: 24.90,
      image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'massas',
      prepTime: '30-35 min',
      ingredients: ['Massa de Lasanha', 'Molho Bolonhesa', 'Queijo Mussarela', 'Queijo Parmesão'],
      optionals: [
        { name: 'Queijo Extra', price: 5.00 },
        { name: 'Molho Branco', price: 4.00 },
        { name: 'Manjericão', price: 2.00 }
      ]
    },
    {
      id: '12',
      name: 'Spaghetti Carbonara',
      description: 'Massa al dente, bacon, ovos, queijo parmesão, pimenta do reino',
      price: 22.90,
      image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'massas',
      prepTime: '20-25 min',
      ingredients: ['Spaghetti', 'Bacon', 'Ovos', 'Queijo Parmesão', 'Pimenta do Reino'],
      optionals: [
        { name: 'Bacon Extra', price: 6.00 },
        { name: 'Parmesão Extra', price: 4.00 },
        { name: 'Cogumelos', price: 5.00 }
      ]
    },

    // Bebidas
    {
      id: '13',
      name: 'Açaí 500ml Completo',
      description: 'Açaí cremoso + granola + banana + leite condensado + morango',
      price: 16.90,
      image: 'https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'bebidas',
      isPopular: true,
      prepTime: '10-15 min',
      ingredients: ['Açaí', 'Granola', 'Banana', 'Leite Condensado', 'Morango'],
      optionals: [
        { name: 'Paçoca', price: 3.00 },
        { name: 'Leite Ninho', price: 4.00 },
        { name: 'Kiwi', price: 3.00 },
        { name: 'Amendoim', price: 2.00 }
      ]
    },
    {
      id: '14',
      name: 'Milk-shake Ovomaltine',
      description: 'Sorvete de creme, Ovomaltine, chantilly, biscoito',
      price: 14.90,
      image: 'https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'bebidas',
      prepTime: '5-10 min',
      ingredients: ['Sorvete de Creme', 'Ovomaltine', 'Chantilly', 'Biscoito'],
      optionals: [
        { name: 'Chocolate Extra', price: 3.00 },
        { name: 'Morango', price: 4.00 },
        { name: 'Castanhas', price: 5.00 }
      ]
    },
    {
      id: '15',
      name: 'Suco Natural Detox',
      description: 'Couve, limão, gengibre, maçã, água de coco',
      price: 12.90,
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'bebidas',
      prepTime: '5-10 min',
      ingredients: ['Couve', 'Limão', 'Gengibre', 'Maçã', 'Água de Coco'],
      optionals: [
        { name: 'Hortelã', price: 2.00 },
        { name: 'Chia', price: 3.00 },
        { name: 'Mel', price: 2.00 }
      ]
    },

    // Sobremesas
    {
      id: '16',
      name: 'Pudim de Leite Condensado',
      description: 'Pudim cremoso tradicional com calda de caramelo',
      price: 8.90,
      image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'sobremesas',
      prepTime: '5 min',
      ingredients: ['Leite Condensado', 'Ovos', 'Leite', 'Açúcar'],
      optionals: [
        { name: 'Chantilly', price: 3.00 },
        { name: 'Frutas Vermelhas', price: 4.00 }
      ]
    },
    {
      id: '17',
      name: 'Brownie com Sorvete',
      description: 'Brownie de chocolate quente + sorvete de baunilha + calda',
      price: 12.90,
      image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'sobremesas',
      prepTime: '10 min',
      ingredients: ['Brownie de Chocolate', 'Sorvete de Baunilha', 'Calda de Chocolate'],
      optionals: [
        { name: 'Sorvete Extra', price: 5.00 },
        { name: 'Castanhas', price: 4.00 },
        { name: 'Morango', price: 3.00 }
      ]
    }
  ]

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'todos' || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const openCustomizationModal = (item: MenuItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleAddToCart = (item: MenuItem, customizations: any) => {
    const customizedItem = {
      id: `${item.id}_${Date.now()}`, // Unique ID for customized items
      name: item.name,
      price: customizations.customPrice,
      image: item.image,
      description: item.description,
      customizations
    }
    
    addToCart(customizedItem)
    
    let customizationText = ''
    if (customizations.removedIngredients.length > 0) {
      customizationText += ` (sem ${customizations.removedIngredients.join(', ')})`
    }
    if (customizations.selectedOptionals.length > 0) {
      customizationText += ` + ${customizations.selectedOptionals.map((opt: any) => opt.name).join(', ')}`
    }
    
    toast.success(`${item.name}${customizationText} adicionado ao carrinho!`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Cardápio */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🍽️ Nosso Cardápio
            </h1>
            <p className="text-xl opacity-90">
              Sabores incríveis esperando por você!
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Busca */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar pratos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Categorias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-semibold transition-all transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-red-50 border border-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid de Produtos */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory + searchTerm}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  {item.isPopular && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <Star size={16} fill="currentColor" />
                      POPULAR
                    </div>
                  )}
                  {item.prepTime && (
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <Clock size={14} />
                      {item.prepTime}
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-red-600">
                      R$ {item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => openCustomizationModal(item)}
                      className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-3 rounded-full hover:from-red-700 hover:to-orange-600 transition-all transform hover:scale-110 shadow-lg"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum item encontrado
            </h3>
            <p className="text-gray-500">
              Tente buscar por outro termo ou categoria
            </p>
          </motion.div>
        )}
      </div>

      {/* Modal de Personalização */}
      <CustomizationModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}

export default Menu
