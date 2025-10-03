
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {MapPin, CreditCard, Clock, Copy, Check, ArrowLeft, Smartphone} from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { lumi } from '../lib/lumi'
import { generatePixPayload, generatePixQRCode, getPixData } from '../utils/pixUtils'
import toast from 'react-hot-toast'

interface OrderData {
  orderNumber: string
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
  const navigate = useNavigate()
  const { items, subtotal, clearCart } = useCart()
  const [step, setStep] = useState(1) // 1: Endereço, 2: Pagamento, 3: Confirmação
  const [loading, setLoading] = useState(false)
  const [pixQrCode, setPixQrCode] = useState('')
  const [pixPayload, setPixPayload] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [copied, setCopied] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const SHIPPING_FEE = 8.90
  const FREE_SHIPPING_THRESHOLD = 50.00
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const total = subtotal + shippingFee

  // Estados do formulário
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: 'São Paulo',
    state: 'SP',
    zipCode: ''
  })

  // Detectar dispositivo móvel
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (items.length === 0) {
      navigate('/carrinho')
    }
  }, [items, navigate])

  const generateOrderNumber = () => {
    return 'FC' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase()
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!address.name || !address.phone || !address.street || !address.number || !address.neighborhood || !address.zipCode) {
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
      const estimatedDelivery = new Date(Date.now() + 45 * 60 * 1000).toISOString() // 45 min

      const orderData: Omit<OrderData, '_id'> = {
        orderNumber: orderNum,
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
        clearCart()
        
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

  // Configurações de animação baseadas no dispositivo
  const animationConfig = isMobile ? {} : {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  }

  const slideConfig = isMobile ? {} : {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4 }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header Mobile */}
      <div className="lg:hidden bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/carrinho')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-lg">
            {step === 1 && 'Dados de Entrega'}
            {step === 2 && 'Pagamento'}
            {step === 3 && 'PIX Gerado'}
          </h1>
          <div className="w-8" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 lg:py-8 max-w-6xl">
        {/* Progress Bar - Desktop */}
        <motion.div
          {...(isMobile ? {} : animationConfig)}
          className="mb-6 lg:mb-8 hidden lg:block"
        >
          <div className="flex items-center justify-center space-x-4 mb-6">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                  step >= num 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-110' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {num}
                </div>
                {num < 3 && (
                  <div className={`w-16 h-2 mx-3 rounded-full transition-all duration-500 ${
                    step > num ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              {step === 1 && 'Dados de Entrega'}
              {step === 2 && 'Método de Pagamento'}
              {step === 3 && 'Finalizando Pedido'}
            </h1>
            <p className="text-gray-600">
              {step === 1 && 'Informe onde devemos entregar seu pedido'}
              {step === 2 && 'Escolha como deseja pagar'}
              {step === 3 && 'Escaneie o QR Code para pagar'}
            </p>
          </div>
        </motion.div>

        {/* Progress Bar Mobile */}
        <div className="lg:hidden mb-4">
          <div className="flex space-x-2">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  step >= num 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            Etapa {step} de 3
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2">
            {/* Step 1: Dados de Entrega */}
            {step === 1 && (
              <motion.div
                {...slideConfig}
                className="bg-white rounded-2xl lg:rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8"
              >
                <div className="flex items-center space-x-3 mb-6 lg:mb-8">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                      Dados de Entrega
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Informe o endereço para a entrega
                    </p>
                  </div>
                </div>

                <form onSubmit={handleAddressSubmit} className="space-y-4 lg:space-y-6">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        value={address.name}
                        onChange={(e) => setAddress({...address, name: e.target.value})}
                        placeholder="Seu nome completo"
                        className="w-full px-4 py-3 lg:py-4 border border-gray-300 rounded-xl lg:rounded-2xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        value={address.phone}
                        onChange={(e) => setAddress({...address, phone: e.target.value})}
                        placeholder="(11) 99999-9999"
                        className="w-full px-4 py-3 lg:py-4 border border-gray-300 rounded-xl lg:rounded-2xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CEP *
                      </label>
                      <input
                        type="text"
                        value={address.zipCode}
                        onChange={(e) => setAddress({...address, zipCode: e.target.value})}
                        placeholder="00000-000"
                        className="w-full px-4 py-3 lg:py-4 border border-gray-300 rounded-xl lg:rounded-2xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-base"
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
                        className="w-full px-4 py-3 lg:py-4 border border-gray-300 rounded-xl lg:rounded-2xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Rua *
                      </label>
                      <input
                        type="text"
                        value={address.street}
                        onChange={(e) => setAddress({...address, street: e.target.value})}
                        placeholder="Nome da rua"
                        className="w-full px-4 py-3 lg:py-4 border border-gray-300 rounded-xl lg:rounded-2xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-base"
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
                        className="w-full px-4 py-3 lg:py-4 border border-gray-300 rounded-xl lg:rounded-2xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-base"
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
                      className="w-full px-4 py-3 lg:py-4 border border-gray-300 rounded-xl lg:rounded-2xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-base"
                    />
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cidade
                      </label>
                      <input
                        type="text"
                        value={address.city}
                        readOnly
                        className="w-full px-4 py-3 lg:py-4 border border-gray-300 rounded-xl lg:rounded-2xl bg-gray-50 text-gray-600 text-base"
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
                        className="w-full px-4 py-3 lg:py-4 border border-gray-300 rounded-xl lg:rounded-2xl bg-gray-50 text-gray-600 text-base"
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 lg:py-5 rounded-xl lg:rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                    {...(isMobile ? {} : {
                      whileHover: { scale: 1.02 },
                      whileTap: { scale: 0.98 }
                    })}
                  >
                    Continuar para Pagamento
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* Step 2: Pagamento */}
            {step === 2 && (
              <motion.div
                {...slideConfig}
                className="bg-white rounded-2xl lg:rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8"
              >
                <div className="flex items-center space-x-3 mb-6 lg:mb-8">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                    <CreditCard size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                      Método de Pagamento
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Escolha como deseja pagar
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl lg:rounded-3xl p-6 lg:p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-gray-800 text-lg">PIX</span>
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            INSTANTÂNEO
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          Pagamento rápido e seguro via PIX
                        </p>
                      </div>
                      <div className="hidden lg:block">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                          <Smartphone className="text-white" size={32} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/80 rounded-xl p-4 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Aprovação</span>
                        <span className="font-semibold text-green-600">Instantânea</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-600">Taxa</span>
                        <span className="font-semibold text-green-600">R$ 0,00</span>
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={handlePayment}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 lg:py-5 rounded-xl lg:rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      {...(isMobile ? {} : {
                        whileHover: { scale: loading ? 1 : 1.02 },
                        whileTap: { scale: loading ? 1 : 0.98 }
                      })}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Gerando PIX...</span>
                        </div>
                      ) : (
                        'Gerar PIX'
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: QR Code PIX */}
            {step === 3 && (
              <motion.div
                {...slideConfig}
                className="bg-white rounded-2xl lg:rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8 text-center"
              >
                <div className="mb-6 lg:mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="text-white" size={40} />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                    Pague com PIX
                  </h2>
                  <p className="text-gray-600">
                    Escaneie o QR Code ou copie o código PIX
                  </p>
                </div>

                {pixQrCode && (
                  <div className="mb-6 lg:mb-8">
                    <div className="bg-white p-4 lg:p-6 rounded-2xl border-2 border-gray-100 inline-block shadow-lg">
                      <img src={pixQrCode} alt="QR Code PIX" className="w-48 h-48 lg:w-64 lg:h-64" />
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      Abra seu app do banco e escaneie o código
                    </p>
                  </div>
                )}

                <div className="mb-6 lg:mb-8">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Ou copie o código PIX:</p>
                  <div className="flex flex-col lg:flex-row items-stretch lg:items-center space-y-2 lg:space-y-0 lg:space-x-3">
                    <input
                      type="text"
                      value={pixPayload}
                      readOnly
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-sm font-mono text-center lg:text-left"
                    />
                    <button
                      onClick={copyPixCode}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center justify-center space-x-2 font-semibold"
                    >
                      {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                      <span className="text-sm">{copied ? 'Copiado!' : 'Copiar Código'}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 lg:p-6 mb-6 lg:mb-8">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                    <span className="font-bold text-blue-800">Pedido #{orderNumber}</span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    Aguardando confirmação do pagamento...
                  </p>
                </div>

                {/* Botão para simular pagamento (desenvolvimento) */}
                <motion.button
                  onClick={simulatePayment}
                  disabled={loading}
                  className="w-full bg-green-500 text-white py-4 lg:py-5 rounded-xl lg:rounded-2xl font-bold text-lg hover:bg-green-600 transition-all disabled:opacity-50 mb-4 shadow-lg"
                  {...(isMobile ? {} : {
                    whileHover: { scale: loading ? 1 : 1.02 },
                    whileTap: { scale: loading ? 1 : 0.98 }
                  })}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processando...</span>
                    </div>
                  ) : (
                    '✅ Simular Pagamento (Desenvolvimento)'
                  )}
                </motion.button>

                <p className="text-xs text-gray-500">
                  Em produção, o pagamento será detectado automaticamente
                </p>
              </motion.div>
            )}
          </div>

          {/* Resumo do Pedido */}
          <motion.div
            {...(isMobile ? {} : animationConfig)}
            className="bg-white rounded-2xl lg:rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8 h-fit sticky top-4"
          >
            <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6">
              Resumo do Pedido
            </h3>

            <div className="space-y-3 lg:space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1 pr-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {item.quantity}
                      </span>
                      <span className="font-semibold text-gray-800 text-sm">{item.itemName}</span>
                    </div>
                    {item.selectedSize && (
                      <p className="text-gray-500 text-xs ml-8">{item.selectedSize}</p>
                    )}
                    {item.selectedExtras && item.selectedExtras.length > 0 && (
                      <p className="text-gray-500 text-xs ml-8">
                        + {item.selectedExtras.join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-bold text-gray-800">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Entrega</span>
                <span className={shippingFee === 0 ? 'text-green-600 font-bold' : 'font-semibold'}>
                  {shippingFee === 0 ? 'GRÁTIS' : `R$ ${shippingFee.toFixed(2)}`}
                </span>
              </div>
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                  Faltam R$ {(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} para frete grátis
                </div>
              )}
              <div className="flex justify-between text-xl font-bold pt-3 border-t">
                <span>Total</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                  R$ {total.toFixed(2)}
                </span>
              </div>
            </div>

            {step >= 2 && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center space-x-3 text-gray-600 mb-3">
                  <Clock size={18} />
                  <span className="text-sm font-semibold">Tempo estimado: 30-45 min</span>
                </div>
                {step === 1 && address.neighborhood && (
                  <div className="flex items-center space-x-3 text-gray-600">
                    <MapPin size={18} />
                    <span className="text-sm">Entrega em {address.neighborhood}</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
