
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {ArrowRight, Clock, Star, Truck, Shield} from 'lucide-react'

const Home: React.FC = () => {
  const combosDestaque = [
    {
      id: 1,
      name: "Combo Sushi Premium",
      originalPrice: 120.00,
      price: 89.90,
      image: "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg",
      description: "30 peças variadas + hot roll",
      prepTime: "25 min"
    },
    {
      id: 2,
      name: "Combo Burger Gourmet",
      originalPrice: 65.00,
      price: 45.90,
      image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
      description: "Burger 200g + batata + refri",
      prepTime: "20 min"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10" />
        
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Conteúdo */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-flex items-center space-x-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold"
                >
                  <Truck size={16} />
                  <span>Frete Grátis SP • Pedidos R$50+</span>
                </motion.div>

                <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                  Combos
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    {" "}Deliciosos
                  </span>
                  <br />
                  na sua Mesa!
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Sushi premium, hambúrgueres gourmet e muito mais. 
                  Entrega rápida em São Paulo com os melhores preços!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/cardapio">
                  <motion.button
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Peça Agora</span>
                    <ArrowRight size={20} />
                  </motion.button>
                </Link>

                <motion.button
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-orange-500 hover:text-orange-500 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Ver Cardápio
                </motion.button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">50+</div>
                  <div className="text-sm text-gray-600">Pratos Únicos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">4.9</div>
                  <div className="text-sm text-gray-600">Avaliação</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">30min</div>
                  <div className="text-sm text-gray-600">Entrega Média</div>
                </div>
              </div>
            </motion.div>

            {/* Imagem */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
                  alt="Deliciosos combos de comida"
                  className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl" />
              </div>

              {/* Card Flutuante */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield size={24} className="text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Qualidade Garantida</div>
                    <div className="text-sm text-gray-600">Ingredientes frescos</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Combos em Destaque */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Combos em <span className="text-orange-500">Promoção</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Aproveite nossas ofertas especiais com desconto de até 25%!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {combosDestaque.map((combo, index) => (
              <motion.div
                key={combo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative">
                  <img
                    src={combo.image}
                    alt={combo.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    -{Math.round((1 - combo.price / combo.originalPrice) * 100)}%
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{combo.prepTime}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{combo.name}</h3>
                  <p className="text-gray-600 mb-4">{combo.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-orange-500">
                          R$ {combo.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          R$ {combo.originalPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">4.8 (127 avaliações)</span>
                      </div>
                    </div>

                    <Link to="/cardapio">
                      <motion.button
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Pedir
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/cardapio">
              <motion.button
                className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Ver Cardápio Completo
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Por que Escolher o <span className="text-orange-500">FoodCombo</span>?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Truck size={32} />,
                title: "Entrega Rápida",
                description: "Entregamos em até 30 minutos na região de São Paulo"
              },
              {
                icon: <Star size={32} />,
                title: "Qualidade Premium",
                description: "Ingredientes frescos e selecionados diariamente"
              },
              {
                icon: <Shield size={32} />,
                title: "Pagamento Seguro",
                description: "PIX instantâneo com total segurança e praticidade"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
