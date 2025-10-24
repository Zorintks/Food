import React from 'react'
import { motion } from 'framer-motion'
import {ShoppingBag, Star, Users, Clock, Shield} from 'lucide-react'
import ComboCard from '../components/ComboCard'
import { ComboItem } from '../types'
import { useNavigate } from 'react-router-dom'

interface HomePageProps {
  onAddToCart: (item: Omit<ComboItem, 'quantity'>) => void
  onCartClick: () => void
  cartItemsCount: number
}

const combos: ComboItem[] = [
  {
    id: '1',
    name: 'Combo Hambúrgueres',
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
    name: 'Combo Fritas',
    description: 'Fritas com bacon crocante, queijo cheddar, batata rústica e molho.',
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
    name: 'Combo Pizza',
    description: 'Combo inclui pizza grande sabor de sua escolha, 4 fatias de pão de alho e 2 refrigerantes de 350ml.',
    originalPrice: 28.90,
    price: 22.90,
    image: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.7,
    reviewCount: 156
  },
  {
    id: '4',
    name: 'Combo Salgados fritos',
    description: 'Coxinha, kibe, risoles presentes em lanchonetes e padarias.',
    originalPrice: 29.90,
    price: 25.90,
    image: 'https://images.pexels.com/photos/2233348/pexels-photo-2233348.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.6,
    reviewCount: 201,
    hasCountdown: true
  },
  {
    id: '5',
    name: 'Combo Refreesh',
    description: 'Combo inclui 1 açaí 750ml, 1 smoothie de morango 550ml, 250g de frutas e adicional de leite Ninho.',
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
    description: 'Pão integral, frango, salada, molhos rápidos',
    originalPrice: 26.90,
    price: 21.90,
    image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.5,
    reviewCount: 143
  }
]

const HomePage: React.FC<HomePageProps> = ({ onAddToCart, onCartClick, cartItemsCount }) => {
  const navigate = useNavigate()

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
  onClick={() => {
    if (cartItemsCount > 0) {
      navigate('/cart') // leva para a página CartPage se houver itens
    } else {
      onCartClick() // abre menu lateral se estiver vazio
    }
  }}
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
