
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {ArrowLeft, MapPin, Phone, User, MessageSquare} from 'lucide-react'
import { useCart } from '../App'
import toast from 'react-hot-toast'

interface CustomerData {
  name: string
  phone: string
  address: string
  number: string
  neighborhood: string
  city: string
  zipCode: string
  observations: string
}

const Checkout: React.FC = () => {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    phone: '',
    address: '',
    number: '',
    neighborhood: '',
    city: 'São Paulo',
    zipCode: '',
    observations: ''
  })

  const freeShippingThreshold = 50
  const hasFreeShipping = total >= freeShippingThreshold
  const deliveryFee = hasFreeShipping ? 0 : 8.90
  const finalTotal = total + deliveryFee

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = (): boolean => {
    const requiredFields = ['name', 'phone', 'address', 'number', 'neighborhood', 'zipCode']
    
    for (const field of requiredFields) {
      if (!customerData[field as keyof CustomerData].trim()) {
        toast.error(`Por favor, preencha o campo ${getFieldLabel(field)}`)
        return false
      }
    }

    if (customerData.phone.length < 10) {
      toast.error('Por favor, insira um telefone válido')
      return false
    }

    if (customerData.zipCode.length !== 8) {
      toast.error('Por favor, insira um CEP válido (8 dígitos)')
      return false
    }

    return true
  }

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      name: 'Nome',
      phone: 'Telefone',
      address: 'Endereço',
      number: 'Número',
      neighborhood: 'Bairro',
      zipCode: 'CEP'
    }
    return labels[field] || field
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    if (items.length === 0) {
      toast.error('Seu carrinho está vazio!')
      navigate('/cardapio')
      return
    }

    setIsLoading(true)

    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Gerar número do pedido
      const orderNumber = Math.floor(Math.random() * 10000) + 1000

      // Navegar para página de confirmação com dados do pedido
      navigate('/pedido-confirmado', {
        state: {
          orderNumber,
          customerData,
          items,
          total: finalTotal,
          hasFreeShipping
        }
      })

      // Limpar carrinho
      clearCart()
      
      toast.success('Pedido realizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao processar pedido. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    navigate('/cardapio')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <button
              onClick={() => navigate('/carrinho')}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Finalizar Pedido</h1>
              <p className="opacity-90">Estamos quase lá! 🎉</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <User className="text-red-600" size={24} />
                Seus Dados
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dados Pessoais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={customerData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Telefone/WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={customerData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                      maxLength={11}
                    />
                  </div>
                </div>

                {/* Endereço */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="text-red-600" size={20} />
                    Endereço de Entrega
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="md:col-span-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Rua/Avenida *
                      </label>
                      <input
                        type="text"
                        value={customerData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Nome da rua/avenida"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Número *
                      </label>
                      <input
                        type="text"
                        value={customerData.number}
                        onChange={(e) => handleInputChange('number', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="123"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bairro *
                      </label>
                      <input
                        type="text"
                        value={customerData.neighborhood}
                        onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Nome do bairro"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        value={customerData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="São Paulo"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CEP *
                      </label>
                      <input
                        type="text"
                        value={customerData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="00000000"
                        maxLength={8}
                      />
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div className="border-t pt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MessageSquare className="text-red-600" size={16} />
                    Observações (opcional)
                  </label>
                  <textarea
                    value={customerData.observations}
                    onChange={(e) => handleInputChange('observations', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Ponto de referência, complemento, observações especiais..."
                  />
                </div>
              </form>
            </motion.div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-4"
            >
              <h3 className="font-bold text-xl mb-6">Resumo do Pedido</h3>
              
              {/* Itens */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-gray-500 text-xs">Qtd: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-sm">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de entrega</span>
                  <span className={hasFreeShipping ? 'text-green-600 font-semibold' : ''}>
                    {hasFreeShipping ? 'GRÁTIS' : `R$ ${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-red-600">R$ {finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full py-4 rounded-full font-bold text-white transition-all transform hover:scale-105 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processando...
                  </div>
                ) : (
                  'Confirmar Pedido 🚀'
                )}
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                💳 Pagamento via PIX na próxima etapa
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
