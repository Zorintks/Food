
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {MapPin, CreditCard, Clock, Copy, Check} from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { lumi } from '../lib/lumi'
import { generateOrderNumber, hashCPF } from '../utils/cpfUtils'
import { generatePixPayload, generatePixQRCode, getPixData } from '../utils/pixUtils'
import toast from 'react-hot-toast'

interface OrderData {
  orderNumber: string
  cpfHash: string
  items: any[]
  subtotal: number
  shippingFee: number
  total: number
  address: any
  status: string
  paymentMethod: string
  pixQrCode: string
  pixPayload: string
  estimatedDelivery: string
  createdAt: string
  updatedAt: string
  creator: string
}

const Checkout: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { items, subtotal, clearCart } = useCart()
  const [step, setStep] = useState(1) // 1: Endereço, 2: Pagamento, 3: Confirmação
  const [loading, setLoading] = useState(false)
  const [pixQrCode, setPixQrCode] = useState('')
  const [pixPayload, setPixPayload] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [copied, setCopied] = useState(false)

  const cpf = location.state?.cpf
  const SHIPPING_FEE = 8.90
  const FREE_SHIPPING_THRESHOLD = 50.00
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const total = subtotal + shippingFee

  // Estados do formulário
  const [address, setAddress] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: 'São Paulo',
    state: 'SP',
    zipCode: ''
  })

  useEffect(() => {
    if (!cpf || items.length === 0) {
      navigate('/carrinho')
    }
  }, [cpf, items, navigate])

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!address.street || !address.number || !address.neighborhood || !address.zipCode) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }
    setStep(2)
  }

  const handlePayment = async () => {
    try {
      setLoading(true)
      
      // Gerar dados do PIX
      const pixData = getPixData()
      pixData.amount = total
      pixData.description = `Pedido FoodCombo`

      // Gerar payload e QR Code
      const payload = generatePixPayload(pixData)
      const qrCode = await generatePixQRCode(payload)
      
      setPixPayload(payload)
      setPixQrCode(qrCode)

      // Gerar número do pedido
      const orderNum = generateOrderNumber()
      setOrderNumber(orderNum)

      // Criar pedido no banco
      const cpfHash = await hashCPF(cpf)
      const estimatedDelivery = new Date(Date.now() + 45 * 60 * 1000).toISOString() // 45 min

      const orderData: Omit<OrderData, '_id'> = {
        orderNumber: orderNum,
        cpfHash,
        items: items.map(item => ({
          itemId: item.itemId,
          itemName: item.itemName,
          quantity: item.quantity,
          price: item.price,
          selectedSize: item.selectedSize,
          selectedExtras: item.selectedExtras,
          observations: item.observations
        })),
        subtotal,
        shippingFee,
        total,
        address,
        status: 'pendente',
        paymentMethod: 'pix',
        pixQrCode: qrCode,
        pixPayload: payload,
        estimatedDelivery,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        creator: 'customer'
      }

      await lumi.entities.orders.create(orderData)
      
      setStep(3)
      toast.success('Pedido criado! Aguardando pagamento...')
      
    } catch (error) {
      console.error('Erro ao processar pagamento:', error)
      toast.error('Erro ao processar pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixPayload)
    setCopied(true)
    toast.success('Código PIX copiado!')
    setTimeout(() => setCopied(false), 2000)
  }

  const simulatePayment = async () => {
    try {
      setLoading(true)
      
      // Simular confirmação de pagamento
      const { list: orders } = await lumi.entities.orders.list({
        filter: { orderNumber },
        limit: 1
      })

      if (orders && orders.length > 0) {
        await lumi.entities.orders.update(orders[0]._id, {
          status: 'em_preparo',
          updatedAt: new Date().toISOString()
        })

        // Limpar carrinho
        await clearCart()
        
        // Redirecionar para status do pedido
        navigate('/pedido-confirmado', { 
          state: { 
            orderNumber,
            estimatedTime: 45
          }
        })
      }
      
    } catch (error) {
      console.error('Erro ao simular pagamento:', error)
      toast.error('Erro ao confirmar pagamento')
    } finally {
      setLoading(false)
    }
  }

  if (!cpf || items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-4 mb-6">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= num 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {num}
                </div>
                {num < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > num ? 'bg-orange-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {step === 1 && 'Endereço de Entrega'}
              {step === 2 && 'Pagamento'}
              {step === 3 && 'Confirmação'}
            </h1>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2">
            {/* Step 1: Endereço */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <MapPin size={24} className="text-orange-500" />
                  <h2 className="text-xl font-bold text-gray-800">
                    Endereço de Entrega
                  </h2>
                </div>

                <form onSubmit={handleAddressSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CEP *
                      </label>
                      <input
                        type="text"
                        value={address.zipCode}
                        onChange={(e) => setAddress({...address, zipCode: e.target.value})}
                        placeholder="00000-000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bairro *
                      </label>
                      <input
                        type="text"
                        value={address.neighborhood}
                        onChange={(e) => setAddress({...address, neighborhood: e.target.value})}
                        placeholder="Nome do bairro"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Rua *
                      </label>
                      <input
                        type="text"
                        value={address.street}
                        onChange={(e) => setAddress({...address, street: e.target.value})}
                        placeholder="Nome da rua"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Número *
                      </label>
                      <input
                        type="text"
                        value={address.number}
                        onChange={(e) => setAddress({...address, number: e.target.value})}
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={address.complement}
                      onChange={(e) => setAddress({...address, complement: e.target.value})}
                      placeholder="Apartamento, bloco, etc."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cidade
                      </label>
                      <input
                        type="text"
                        value={address.city}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Estado
                      </label>
                      <input
                        type="text"
                        value={address.state}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-600"
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continuar para Pagamento
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* Step 2: Pagamento */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <CreditCard size={24} className="text-orange-500" />
                  <h2 className="text-xl font-bold text-gray-800">
                    Método de Pagamento
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="border border-orange-200 bg-orange-50 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      <span className="font-semibold text-gray-800">PIX</span>
                      <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold">
                        Instantâneo
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Pagamento rápido e seguro via PIX. Aprovação instantânea.
                    </p>
                    
                    <motion.button
                      onClick={handlePayment}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50"
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                    >
                      {loading ? 'Gerando PIX...' : 'Gerar PIX'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: QR Code PIX */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8 text-center"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Pague com PIX
                  </h2>
                  <p className="text-gray-600">
                    Escaneie o QR Code ou copie o código PIX
                  </p>
                </div>

                {pixQrCode && (
                  <div className="mb-8">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 inline-block">
                      <img src={pixQrCode} alt="QR Code PIX" className="w-64 h-64" />
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Ou copie o código PIX:</p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={pixPayload}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    />
                    <button
                      onClick={copyPixCode}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      <span className="text-sm">{copied ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <p className="text-blue-800 text-sm">
                    <strong>Pedido #{orderNumber}</strong><br />
                    Aguardando confirmação do pagamento...
                  </p>
                </div>

                {/* Botão para simular pagamento (desenvolvimento) */}
                <motion.button
                  onClick={simulatePayment}
                  disabled={loading}
                  className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-all disabled:opacity-50 mb-4"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? 'Processando...' : '✅ Simular Pagamento (Desenvolvimento)'}
                </motion.button>

                <p className="text-xs text-gray-500">
                  Em produção, o pagamento será detectado automaticamente
                </p>
              </motion.div>
            )}
          </div>

          {/* Resumo do Pedido */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-8"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Resumo do Pedido
            </h3>

            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <div className="flex-1">
                    <span className="font-medium">{item.quantity}x {item.itemName}</span>
                    {item.selectedSize && (
                      <p className="text-gray-500 text-xs">{item.selectedSize}</p>
                    )}
                  </div>
                  <span className="font-semibold">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Entrega</span>
                <span className={shippingFee === 0 ? 'text-green-600 font-semibold' : ''}>
                  {shippingFee === 0 ? 'GRÁTIS' : `R$ ${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-orange-500">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            {step >= 2 && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock size={16} />
                  <span className="text-sm">Tempo estimado: 30-45 min</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
