import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {Truck, Clock, CreditCard, Star, ArrowRight, Zap} from 'lucide-react'
import { useCart } from '../App'
import toast from 'react-hot-toast'

const Home: React.FC = () => {
  const { addToCart } = useCart()

  const popularCombos = [
    {
      id: '1',
      name: 'Combo X-Burguer Especial',
      description: 'X-Burguer artesanal + Batata + Refrigerante 350ml',
      price: 28.90,
      originalPrice: 35.90,
      image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=500'
    },
    {
      id: '2',
      name: 'Combo Pizza Margherita',
      description: 'Pizza Margherita média + Refrigerante 600ml',
      price: 32.90,
      originalPrice: 42.90,
      image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=500'
    },
    {
      id: '3',
      name: 'Combo Sushi Premium',
      description: '20 peças variadas + Refrigerante + Sobremesa',
      price: 45.90,
      originalPrice: 58.90,
      image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=500'
    }
  ]

  const handleAddToCart = (combo: typeof popularCombos[0]) => {
    addToCart({
      id: combo.id,
      name: combo.name,
      price: combo.price,
      image: combo.image,
      description: combo.description
    })
    toast.success(`${combo.name} adicionado ao carrinho!`)
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Combos
                <span className="block text-yellow-300">Deliciosos</span>
                <span className="block text-2xl md:text-3xl font-normal">
                  direto na sua casa! 🏠
                </span>
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Os melhores sabores de São Paulo com entrega super rápida. 
                Frete grátis acima de R$ 50!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/cardapio"
                  className="bg-yellow-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Ver Cardápio <ArrowRight size={20} />
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <img
                  src="https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Combo delicioso"
                  className="rounded-2xl shadow-2xl w-full max-w-md mx-auto"
                />
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-lg animate-bounce">
                  🔥 PROMOÇÃO!
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-yellow-500/20 rounded-2xl blur-xl"></div>
            </motion.div>
          </div>
        </div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-pulse">🍕</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-20 animate-pulse">🍔</div>
        <div className="absolute top-1/2 left-1/4 text-4xl opacity-10 animate-bounce">🥤</div>
      </section>

      {/* Benefícios */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Truck className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Entrega Grátis</h3>
              <p className="text-gray-600">Frete grátis acima de R$ 50 para toda São Paulo</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Clock className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Entrega Rápida</h3>
              <p className="text-gray-600">Seus combos chegam em 30-45 minutos</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <CreditCard className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Pagamento Fácil</h3>
              <p className="text-gray-600">PIX, cartão ou dinheiro na entrega</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Star className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Qualidade Premium</h3>
              <p className="text-gray-600">Ingredientes frescos e selecionados</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Combos Populares */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              🔥 Combos Mais Pedidos
            </h2>
            <p className="text-gray-600 text-lg">
              Os favoritos dos paulistanos estão aqui!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularCombos.map((combo, index) => (
              <motion.div
                key={combo.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className="relative">
                  <img
                    src={combo.image}
                    alt={combo.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Zap size={16} />
                    POPULAR
                  </div>
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{Math.round(((combo.originalPrice - combo.price) / combo.originalPrice) * 100)}%
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{combo.name}</h3>
                  <p className="text-gray-600 mb-4">{combo.description}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-red-600">
                      R$ {combo.price.toFixed(2)}
                    </span>
                    <span className="text-gray-400 line-through">
                      R$ {combo.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(combo)}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-3 rounded-full font-bold hover:from-red-700 hover:to-orange-600 transition-all transform hover:scale-105"
                  >
                    Adicionar ao Carrinho 🛒
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/cardapio"
              className="inline-flex items-center gap-2 bg-yellow-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105"
            >
              Ver Cardápio Completo <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tá com fome? 🤤
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Faça seu pedido agora e receba em casa rapidinho!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/cardapio"
                className="bg-yellow-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105"
              >
                Fazer Pedido Agora! 🚀
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
