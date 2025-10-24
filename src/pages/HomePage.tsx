
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {ShoppingBag, Star, Users, Clock, Shield, Filter} from 'lucide-react'
import ComboCard from '../components/ComboCard'
import DrinkCard from '../components/DrinkCard'
import { ComboItem, DrinkItem } from '../types'

interface HomePageProps {
  onAddToCart: (item: Omit<ComboItem, 'quantity'>) => void
  onAddDrinkToCart: (item: Omit<DrinkItem, 'quantity'>) => void
  onCartClick: () => void
}

const combos: ComboItem[] = [
  {
    id: '1',
    name: 'Combo Clássico',
    description: 'Hambúrguer artesanal, batata frita crocante e refrigerante gelado. O favorito de sempre!',
    originalPrice: 32.90,
    price: 24.90,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500',
    badge: 'Mais Pedido',
    rating: 4.8,
    reviewCount: 324,
    hasCountdown: true
  },
  {
    id: '2',
    name: 'Combo Bacon Supreme',
    description: 'Hambúrguer duplo com bacon crocante, queijo cheddar, batata rústica e milkshake.',
    originalPrice: 45.90,
    price: 35.90,
    image: 'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=500',
    badge: 'Promo Relâmpago',
    rating: 4.9,
    reviewCount: 189,
    isLimited: true,
    limitedQuantity: 3
  },
  {
    id: '3',
    name: 'Combo Vegetariano',
    description: 'Hambúrguer de grão-de-bico, batata doce assada, suco natural e sobremesa vegana.',
    originalPrice: 28.90,
    price: 22.90,
    image: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.7,
    reviewCount: 156
  },
  {
    id: '4',
    name: 'Combo Frango Crocante',
    description: 'Frango empanado especial, batata temperada, molho barbecue e refrigerante.',
    originalPrice: 29.90,
    price: 25.90,
    image: 'https://images.pexels.com/photos/2233348/pexels-photo-2233348.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.6,
    reviewCount: 201,
    hasCountdown: true
  },
  {
    id: '5',
    name: 'Combo Família',
    description: '2 hambúrguers, 2 porções de batata, 2 refrigerantes e sobremesa para compartilhar.',
    originalPrice: 75.90,
    price: 59.90,
    image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=500',
    badge: 'Oferta Especial',
    rating: 4.8,
    reviewCount: 98,
    isLimited: true,
    limitedQuantity: 5
  },
  {
    id: '6',
    name: 'Combo Light',
    description: 'Hambúrguer grelhado, salada fresca, batata assada e água com gás saborizada.',
    originalPrice: 26.90,
    price: 21.90,
    image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.5,
    reviewCount: 143
  }
]

const drinks: DrinkItem[] = [
  // Refrigerantes
  {
    id: 'drink-1',
    name: 'Coca-Cola Original',
    description: 'O clássico refrigerante que todo mundo ama, gelado e refrescante.',
    price: 4.90,
    image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'refrigerante',
    size: '350ml',
    temperature: 'gelado',
    rating: 4.9,
    reviewCount: 1250,
    badge: 'Favorito'
  },
  {
    id: 'drink-2',
    name: 'Guaraná Antarctica',
    description: 'Sabor único e brasileiro, feito com extrato da fruta guaraná.',
    price: 4.50,
    image: 'https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'refrigerante',
    size: '350ml',
    temperature: 'gelado',
    rating: 4.7,
    reviewCount: 890
  },
  {
    id: 'drink-3',
    name: 'Sprite Limão',
    description: 'Refrescante sabor limão, perfeito para acompanhar qualquer refeição.',
    price: 4.90,
    image: 'https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'refrigerante',
    size: '350ml',
    temperature: 'gelado',
    rating: 4.6,
    reviewCount: 720
  },
  
  // Sucos
  {
    id: 'drink-4',
    name: 'Suco de Laranja Natural',
    description: 'Feito na hora com laranjas selecionadas, rico em vitamina C.',
    price: 7.90,
    image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'suco',
    size: '300ml',
    temperature: 'natural',
    rating: 4.8,
    reviewCount: 456,
    badge: 'Natural'
  },
  {
    id: 'drink-5',
    name: 'Suco Verde Detox',
    description: 'Couve, maçã, limão e gengibre. Perfeito para quem busca saúde.',
    price: 9.90,
    image: 'https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'suco',
    size: '300ml',
    temperature: 'gelado',
    rating: 4.5,
    reviewCount: 234,
    badge: 'Detox'
  },
  {
    id: 'drink-6',
    name: 'Suco de Manga',
    description: 'Cremoso e doce, feito com mangas maduras e gelado.',
    price: 8.50,
    image: 'https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'suco',
    size: '300ml',
    temperature: 'gelado',
    rating: 4.7,
    reviewCount: 345
  },
  
  // Cervejas
  {
    id: 'drink-7',
    name: 'Heineken Long Neck',
    description: 'Cerveja premium holandesa, sabor equilibrado e refrescante.',
    price: 8.90,
    image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'cerveja',
    size: '330ml',
    temperature: 'gelado',
    alcoholContent: 5.0,
    rating: 4.6,
    reviewCount: 678
  },
  {
    id: 'drink-8',
    name: 'Brahma Duplo Malte',
    description: 'Cerveja brasileira encorpada, com sabor marcante e tradição.',
    price: 6.90,
    image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'cerveja',
    size: '350ml',
    temperature: 'gelado',
    alcoholContent: 4.8,
    rating: 4.4,
    reviewCount: 523,
    badge: 'Nacional'
  },
  {
    id: 'drink-9',
    name: 'Stella Artois',
    description: 'Cerveja belga premium, elegante e sofisticada.',
    price: 9.90,
    image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'cerveja',
    size: '330ml',
    temperature: 'gelado',
    alcoholContent: 5.2,
    rating: 4.7,
    reviewCount: 412,
    isLimited: true,
    limitedQuantity: 8
  }
]

const HomePage: React.FC<HomePageProps> = ({ onAddToCart, onAddDrinkToCart, onCartClick }) => {
  const [selectedDrinkCategory, setSelectedDrinkCategory] = useState<'all' | 'refrigerante' | 'suco' | 'cerveja'>('all')

  const filteredDrinks = selectedDrinkCategory === 'all' 
    ? drinks 
    : drinks.filter(drink => drink.category === selectedDrinkCategory)

  const drinkCategories = [
    { key: 'all', label: 'Todas', count: drinks.length },
    { key: 'refrigerante', label: 'Refrigerantes', count: drinks.filter(d => d.category === 'refrigerante').length },
    { key: 'suco', label: 'Sucos', count: drinks.filter(d => d.category === 'suco').length },
    { key: 'cerveja', label: 'Cervejas', count: drinks.filter(d => d.category === 'cerveja').length }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Combos Irresistíveis
              <br />
              <span className="text-yellow-300">Entrega em 25min</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
            >
              Sabor autêntico, preços que cabem no bolso e a garantia de chegar quentinho na sua mesa!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
            >
              <button
                onClick={onCartClick}
                className="bg-white text-orange-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors flex items-center space-x-2 text-lg"
              >
                <ShoppingBag className="w-6 h-6" />
                <span>Ver Carrinho</span>
              </button>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>Entrega em 25min</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  <span>Garantia total</span>
                </div>
              </div>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm"
            >
              <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                <Star className="w-4 h-4 text-yellow-300 fill-current mr-2" />
                <span>4.8 estrelas • 2.156 avaliações</span>
              </div>
              <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                <span>Mais de 1.200 pedidos entregues este mês</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Combos Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Escolha Seu Combo Favorito
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cada combo é preparado na hora com ingredientes frescos e muito amor. 
              Satisfação garantida ou refaremos seu pedido!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {combos.map((combo, index) => (
              <motion.div
                key={combo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ComboCard combo={combo} onAddToCart={onAddToCart} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Drinks Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bebidas Geladas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Complete seu pedido com nossas bebidas selecionadas. 
              Refrigerantes, sucos naturais e cervejas premium sempre gelados!
            </p>
          </motion.div>

          {/* Drink Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {drinkCategories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedDrinkCategory(category.key as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                  selectedDrinkCategory === category.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>{category.label}</span>
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDrinks.map((drink, index) => (
              <motion.div
                key={drink.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <DrinkCard drink={drink} onAddToCart={onAddDrinkToCart} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para saborear?
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Mais de 10.000 clientes já provaram nossos combos. 
              Junte-se a eles e descubra por que somos a escolha #1 da região!
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-gray-800 rounded-lg p-6">
                <Clock className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Entrega Rápida</h3>
                <p className="text-gray-400 text-sm">Média de 25 minutos para sua casa</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <Shield className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Garantia Total</h3>
                <p className="text-gray-400 text-sm">Não gostou? Refaremos grátis</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Qualidade Premium</h3>
                <p className="text-gray-400 text-sm">Ingredientes selecionados diariamente</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
