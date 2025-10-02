
import React, { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {CheckCircle, Clock, ChefHat, Truck, MapPin, Phone} from 'lucide-react'

const OrderConfirmed: React.FC = () => {
  const location = useLocation()
  const { orderNumber, estimatedTime } = location.state || {}
  const [timeRemaining, setTimeRemaining] = useState(estimatedTime || 45)

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1))
      }, 60000) // Atualizar a cada minuto

      return () => clearInterval(timer)
    }
  }, [timeRemaining])

  const formatTime = (minutes: number) => {
    if (minutes === 0) return 'Chegando!'
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}min`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={48} className="text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-3xl font-bold text-gray-800 mb-4"
          >
            Pedido Confirmado! 🎉
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-xl text-gray-600"
          >
            Seu pagamento foi aprovado e seu pedido está sendo preparado
          </motion.p>
        </motion.div>

        {/* Order Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Pedido #{orderNumber}
            </h2>
            <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full inline-block">
              <span className="font-semibold">🍳 Em Preparo</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Pagamento Confirmado</p>
                <p className="text-sm text-gray-600">PIX aprovado com sucesso</p>
              </div>
              <span className="text-sm text-gray-500">Agora</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
                <ChefHat size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Preparando seu Pedido</p>
                <p className="text-sm text-gray-600">Nossa equipe está preparando sua comida</p>
              </div>
              <span className="text-sm text-gray-500">Em andamento</span>
            </div>

            <div className="flex items-center space-x-4 opacity-50">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Truck size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Saiu para Entrega</p>
                <p className="text-sm text-gray-600">Seu pedido está a caminho</p>
              </div>
              <span className="text-sm text-gray-500">Em breve</span>
            </div>
          </div>

          {/* Estimated Time */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock size={20} className="text-orange-500" />
              <span className="text-lg font-semibold text-gray-800">
                Tempo Estimado
              </span>
            </div>
            <div className="text-3xl font-bold text-orange-500 mb-2">
              {formatTime(timeRemaining)}
            </div>
            <p className="text-gray-600 text-sm">
              Seu pedido chegará fresquinho e quentinho!
            </p>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Informações de Contato
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Phone size={16} className="text-gray-500" />
              <span className="text-gray-700">(11) 9999-9999</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin size={16} className="text-gray-500" />
              <span className="text-gray-700">Entrega em São Paulo - SP</span>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm">
              💡 <strong>Dica:</strong> Você receberá atualizações sobre seu pedido. 
              Mantenha seu telefone por perto!
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="space-y-4"
        >
          <Link to="/pedidos">
            <motion.button
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Acompanhar Pedido
            </motion.button>
          </Link>
          
          <Link to="/cardapio">
            <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
              Fazer Novo Pedido
            </button>
          </Link>
          
          <Link to="/">
            <button className="w-full text-gray-600 py-3 rounded-xl font-semibold hover:text-gray-800 transition-colors">
              Voltar ao Início
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default OrderConfirmed
