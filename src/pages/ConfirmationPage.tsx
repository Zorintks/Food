import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {CheckCircle, Clock, Home, Phone, MapPin} from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { OrderData } from '../types'

const ConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [orderData, setOrderData] = useState<(OrderData & { orderId: string }) | null>(null)
  const [estimatedTime, setEstimatedTime] = useState(25)

  useEffect(() => {
    // Retrieve order data from session storage
    const savedOrderData = sessionStorage.getItem('orderData')
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData))
    }

    // Simulate countdown for estimated time
    const timer = setInterval(() => {
      setEstimatedTime(prev => Math.max(0, prev - 1))
    }, 60000) // Decrease by 1 minute every minute

    return () => clearInterval(timer)
  }, [])

  if (!orderData || !orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pedido não encontrado</h1>
          <p className="text-gray-600 mb-6">Não foi possível encontrar os dados do seu pedido.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            Fazer Novo Pedido
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="text-center mb-8"
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pedido Confirmado!
          </h1>
          <p className="text-lg text-gray-600">
            Pedido #{orderId}
          </p>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="text-center">
            <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Estamos preparando seu pedido!
            </h2>
            <p className="text-gray-600 mb-4">
              Seus combos deliciosos estão sendo preparados com todo carinho.
            </p>
            
            {orderData.deliveryType === 'delivery' ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium">
                  🚚 Tempo estimado para entrega: <strong>{estimatedTime} minutos</strong>
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  Você receberá uma notificação quando o pedido sair para entrega
                </p>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  🏪 Tempo estimado para retirada: <strong>{estimatedTime} minutos</strong>
                </p>
                <p className="text-green-600 text-sm mt-1">
                  Você receberá uma notificação quando estiver pronto
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Detalhes do Pedido</h3>
          
          {/* Items */}
          <div className="space-y-3 mb-6">
            {orderData.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-medium">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>R$ {orderData.subtotal.toFixed(2)}</span>
            </div>
            
            {orderData.deliveryType === 'delivery' && orderData.deliveryFee > 0 && (
              <div className="flex justify-between">
                <span>Taxa de entrega</span>
                <span>R$ {orderData.deliveryFee.toFixed(2)}</span>
              </div>
            )}

            {orderData.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Desconto</span>
                <span>-R$ {orderData.discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>R$ {orderData.total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Customer Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Informações do Cliente</h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 rounded-full p-2">
                <Phone className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{orderData.customer.name}</p>
                <p className="text-sm text-gray-600">{orderData.customer.phone}</p>
              </div>
            </div>

            {orderData.deliveryType === 'delivery' && (
              <div className="flex items-start space-x-3">
                <div className="bg-gray-100 rounded-full p-2 mt-1">
                  <MapPin className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Endereço de entrega</p>
                  <p className="text-sm text-gray-600">
                    {orderData.customer.address.street}, {orderData.customer.address.number}
                    {orderData.customer.address.complement && `, ${orderData.customer.address.complement}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {orderData.customer.address.neighborhood} - CEP: {orderData.customer.address.zipCode}
                  </p>
                </div>
              </div>
            )}

            {orderData.deliveryType === 'pickup' && (
              <div className="flex items-start space-x-3">
                <div className="bg-gray-100 rounded-full p-2 mt-1">
                  <Home className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Retirada no local</p>
                  <p className="text-sm text-gray-600">
                    Rua dos Combos, 123 - Centro<br />
                    São Paulo, SP - CEP: 01234-567
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center space-y-4"
        >
          <p className="text-gray-600">
            Alguma dúvida sobre seu pedido? Entre em contato conosco!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Fazer Novo Pedido
            </button>
            
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-block"
            >
              Falar no WhatsApp
            </a>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <p className="text-yellow-800 text-sm">
              💡 <strong>Dica:</strong> Salve nosso número (11) 99999-9999 para receber atualizações sobre seu pedido!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ConfirmationPage