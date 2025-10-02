
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {Clock, ChefHat, Truck, CheckCircle, X, Eye} from 'lucide-react'
import { lumi } from '../lib/lumi'
import { hashCPF } from '../utils/cpfUtils'
import CPFModal from '../components/CPFModal'
import toast from 'react-hot-toast'

interface Order {
  _id: string
  orderNumber: string
  items: any[]
  subtotal: number
  shippingFee: number
  total: number
  status: string
  createdAt: string
  estimatedDelivery: string
  address: any
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [showCPFModal, setShowCPFModal] = useState(true)
  const [currentCPF, setCurrentCPF] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState('todos')

  const statusMap = {
    'pendente': { label: 'Pendente', icon: Clock, color: 'text-yellow-600 bg-yellow-100' },
    'pagamento_confirmado': { label: 'Pago', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
    'em_preparo': { label: 'Preparando', icon: ChefHat, color: 'text-orange-600 bg-orange-100' },
    'saiu_entrega': { label: 'Entrega', icon: Truck, color: 'text-blue-600 bg-blue-100' },
    'entregue': { label: 'Entregue', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
    'cancelado': { label: 'Cancelado', icon: X, color: 'text-red-600 bg-red-100' }
  }

  const fetchOrders = async (cpf: string) => {
    try {
      setLoading(true)
      const cpfHash = await hashCPF(cpf)
      
      const { list } = await lumi.entities.orders.list({
        filter: { cpfHash },
        sort: { createdAt: -1 }
      })

      setOrders(list || [])
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
      toast.error('Erro ao carregar histórico de pedidos')
    } finally {
      setLoading(false)
    }
  }

  const handleCPFConfirm = async (cpf: string) => {
    setCurrentCPF(cpf)
    setShowCPFModal(false)
    await fetchOrders(cpf)
  }

  const filteredOrders = statusFilter === 'todos' 
    ? orders 
    : orders.filter(order => order.status === statusFilter)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!currentCPF) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <CPFModal
          isOpen={showCPFModal}
          onClose={() => setShowCPFModal(false)}
          onConfirm={handleCPFConfirm}
          title="Consultar Pedidos"
          description="Digite seu CPF para ver seu histórico"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Meus <span className="text-orange-500">Pedidos</span>
          </h1>
          <p className="text-gray-600">
            Acompanhe o status dos seus pedidos
          </p>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          <button
            onClick={() => setStatusFilter('todos')}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              statusFilter === 'todos'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Todos
          </button>
          {Object.entries(statusMap).map(([status, config]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full font-semibold transition-all ${
                statusFilter === status
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {config.label}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {statusFilter === 'todos' ? 'Nenhum pedido encontrado' : `Nenhum pedido ${statusMap[statusFilter as keyof typeof statusMap]?.label.toLowerCase()}`}
            </h2>
            <p className="text-gray-600 mb-8">
              {statusFilter === 'todos' 
                ? 'Que tal fazer seu primeiro pedido?' 
                : 'Experimente outros filtros ou faça um novo pedido'
              }
            </p>
            <button
              onClick={() => setStatusFilter('todos')}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors mr-4"
            >
              Ver Todos
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {filteredOrders.map((order, index) => {
                const statusConfig = statusMap[order.status as keyof typeof statusMap]
                const StatusIcon = statusConfig?.icon || Clock

                return (
                  <motion.div
                    key={order._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          Pedido #{order.orderNumber}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1 rounded-full flex items-center space-x-2 ${statusConfig?.color}`}>
                          <StatusIcon size={16} />
                          <span className="font-semibold text-sm">
                            {statusConfig?.label}
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Eye size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Itens:</h4>
                        <div className="space-y-1">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <p key={idx} className="text-gray-600 text-sm">
                              {item.quantity}x {item.itemName}
                            </p>
                          ))}
                          {order.items.length > 3 && (
                            <p className="text-gray-500 text-sm">
                              +{order.items.length - 3} itens...
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="space-y-1">
                          <p className="text-gray-600 text-sm">
                            Subtotal: R$ {order.subtotal.toFixed(2)}
                          </p>
                          <p className="text-gray-600 text-sm">
                            Entrega: {order.shippingFee === 0 ? 'GRÁTIS' : `R$ ${order.shippingFee.toFixed(2)}`}
                          </p>
                          <p className="text-xl font-bold text-orange-500">
                            Total: R$ {order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal de Detalhes do Pedido */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
            />

            <motion.div
              className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Pedido #{selectedOrder.orderNumber}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Status */}
                <div className="mb-6">
                  <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${statusMap[selectedOrder.status as keyof typeof statusMap]?.color}`}>
                    {React.createElement(statusMap[selectedOrder.status as keyof typeof statusMap]?.icon || Clock, { size: 16 })}
                    <span className="font-semibold">
                      {statusMap[selectedOrder.status as keyof typeof statusMap]?.label}
                    </span>
                  </div>
                </div>

                {/* Itens */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Itens do Pedido:</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{item.quantity}x {item.itemName}</p>
                          {item.selectedSize && (
                            <p className="text-sm text-gray-600">Tamanho: {item.selectedSize}</p>
                          )}
                          {item.selectedExtras && item.selectedExtras.length > 0 && (
                            <p className="text-sm text-gray-600">
                              Adicionais: {item.selectedExtras.join(', ')}
                            </p>
                          )}
                          {item.observations && (
                            <p className="text-sm text-gray-600">Obs: {item.observations}</p>
                          )}
                        </div>
                        <span className="font-semibold">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Endereço */}
                {selectedOrder.address && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">Endereço de Entrega:</h3>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">
                        {selectedOrder.address.street}, {selectedOrder.address.number}
                        {selectedOrder.address.complement && `, ${selectedOrder.address.complement}`}
                      </p>
                      <p className="text-gray-700">
                        {selectedOrder.address.neighborhood} - {selectedOrder.address.city}, {selectedOrder.address.state}
                      </p>
                      <p className="text-gray-700">CEP: {selectedOrder.address.zipCode}</p>
                    </div>
                  </div>
                )}

                {/* Resumo Financeiro */}
                <div className="border-t pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>R$ {selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxa de Entrega</span>
                      <span className={selectedOrder.shippingFee === 0 ? 'text-green-600 font-semibold' : ''}>
                        {selectedOrder.shippingFee === 0 ? 'GRÁTIS' : `R$ ${selectedOrder.shippingFee.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-2 border-t">
                      <span>Total</span>
                      <span className="text-orange-500">R$ {selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Informações Adicionais */}
                <div className="mt-6 pt-6 border-t text-sm text-gray-500">
                  <p>Pedido realizado em: {formatDate(selectedOrder.createdAt)}</p>
                  {selectedOrder.estimatedDelivery && (
                    <p>Entrega estimada: {formatDate(selectedOrder.estimatedDelivery)}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Orders
