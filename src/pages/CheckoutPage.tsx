
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {ArrowLeft, MapPin, Phone, User, Home, Truck, CreditCard, Tag} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CartItem, OrderData, PromoCode } from '../types'

interface CheckoutPageProps {
  cartItems: CartItem[]
  cartTotal: number
  appliedPromoCode?: PromoCode | null
  onClearCart: () => void
}

interface FormData {
  name: string
  phone: string
  street: string
  number: string
  complement: string
  neighborhood: string
  zipCode: string
  deliveryType: 'delivery' | 'pickup'
}

interface FormErrors {
  [key: string]: string
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ 
  cartItems, 
  cartTotal, 
  appliedPromoCode,
  onClearCart 
}) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    zipCode: '',
    deliveryType: 'delivery'
  })

  const [errors, setErrors] = useState<FormErrors>({})

  // Calcular totais com promo code
  const promoDiscount = appliedPromoCode ? (cartTotal * 15 / 100) : 0
  const subtotalAfterPromo = cartTotal - promoDiscount
  const deliveryFee = appliedPromoCode?.freeDelivery ? 0 : (formData.deliveryType === 'delivery' ? (subtotalAfterPromo >= 50 ? 0 : 8.99) : 0)
  const finalTotal = subtotalAfterPromo + deliveryFee

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome completo é obrigatório'
    } else if (formData.name.trim().split(' ').length < 2) {
      newErrors.name = 'Digite seu nome completo'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório'
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Formato: (11) 99999-9999'
    }

    if (formData.deliveryType === 'delivery') {
      if (!formData.street.trim()) {
        newErrors.street = 'Rua é obrigatória'
      }
      if (!formData.number.trim()) {
        newErrors.number = 'Número é obrigatório'
      }
      if (!formData.neighborhood.trim()) {
        newErrors.neighborhood = 'Bairro é obrigatório'
      }
      if (!formData.zipCode.trim()) {
        newErrors.zipCode = 'CEP é obrigatório'
      } else if (!/^\d{5}-?\d{3}$/.test(formData.zipCode)) {
        newErrors.zipCode = 'Formato: 12345-678'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  const formatZipCode = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2')
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    let formattedValue = value

    if (field === 'phone') {
      formattedValue = formatPhone(value)
    } else if (field === 'zipCode') {
      formattedValue = formatZipCode(value)
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os campos destacados')
      return
    }

    if (cartItems.length === 0) {
      toast.error('Seu carrinho está vazio')
      return
    }

    setIsLoading(true)

    try {
      // Prepare order data
      const orderData: OrderData = {
        items: cartItems,
        customer: {
          name: formData.name,
          phone: formData.phone,
          address: {
            street: formData.street,
            number: formData.number,
            complement: formData.complement,
            neighborhood: formData.neighborhood,
            zipCode: formData.zipCode
          }
        },
        deliveryType: formData.deliveryType,
        total: finalTotal,
        subtotal: cartTotal,
        deliveryFee: formData.deliveryType === 'delivery' ? deliveryFee : 0,
        discount: promoDiscount,
        promoCode: appliedPromoCode?.code
      }

      // Generate order ID
      const orderId = `PED${Date.now()}`

      // Store order data for confirmation page
      sessionStorage.setItem('orderData', JSON.stringify({ ...orderData, orderId }))

      // Create form for POST request to payment gateway
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = 'https://seu-gateway-teste.example/checkout'
      form.target = '_blank'

      // Add form fields
      const fields = {
        order_id: orderId,
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_address: formData.deliveryType === 'delivery' 
          ? `${formData.street}, ${formData.number}${formData.complement ? `, ${formData.complement}` : ''}, ${formData.neighborhood}, CEP: ${formData.zipCode}`
          : 'Retirada no local',
        delivery_type: formData.deliveryType,
        items: JSON.stringify(cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))),
        subtotal: cartTotal.toFixed(2),
        delivery_fee: (formData.deliveryType === 'delivery' ? deliveryFee : 0).toFixed(2),
        promo_code: appliedPromoCode?.code || '',
        promo_discount: promoDiscount.toFixed(2),
        total: finalTotal.toFixed(2)
      }

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = String(value)
        form.appendChild(input)
      })

      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)

      // Clear cart and redirect to confirmation
      onClearCart()
      navigate(`/confirmation/${orderId}`)
      
      toast.success('Redirecionando para pagamento...')
    } catch (error) {
      console.error('Erro ao processar pedido:', error)
      toast.error('Erro ao processar pedido. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Carrinho Vazio</h1>
          <p className="text-gray-600 mb-6">Adicione alguns combos antes de finalizar o pedido.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            Ver Combos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="mr-4 p-2 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Finalizar Pedido</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Seus Dados</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Seu nome completo"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="(11) 99999-9999"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Delivery Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de Entrega
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('deliveryType', 'delivery')}
                    className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                      formData.deliveryType === 'delivery'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Truck className="w-5 h-5" />
                    <span>Entrega</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('deliveryType', 'pickup')}
                    className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                      formData.deliveryType === 'pickup'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Home className="w-5 h-5" />
                    <span>Retirada</span>
                  </button>
                </div>
              </div>

              {/* Address (only for delivery) */}
              {formData.deliveryType === 'delivery' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Endereço de Entrega
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={formData.street}
                        onChange={(e) => handleInputChange('street', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.street ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nome da rua *"
                      />
                      {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        value={formData.number}
                        onChange={(e) => handleInputChange('number', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.number ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Número *"
                      />
                      {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
                    </div>
                  </div>

                  <input
                    type="text"
                    value={formData.complement}
                    onChange={(e) => handleInputChange('complement', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Complemento (opcional)"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        value={formData.neighborhood}
                        onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.neighborhood ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Bairro *"
                      />
                      {errors.neighborhood && <p className="text-red-500 text-sm mt-1">{errors.neighborhood}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.zipCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="CEP *"
                      />
                      {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>
                  {isLoading ? 'Processando...' : `Confirmar Pedido — R$ ${finalTotal.toFixed(2)}`}
                </span>
              </motion.button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 h-fit"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Resumo do Pedido</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.quantity}x R$ {item.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-medium">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ {cartTotal.toFixed(2)}</span>
              </div>

              {appliedPromoCode && promoDiscount > 0 && (
                <div className="flex justify-between text-green-600 bg-green-50 px-2 py-1 rounded">
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    <span>Desconto ({appliedPromoCode.code})</span>
                  </div>
                  <span>-R$ {promoDiscount.toFixed(2)}</span>
                </div>
              )}
              
              {formData.deliveryType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Taxa de entrega</span>
                  <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                    {deliveryFee === 0 ? 'GRÁTIS' : `R$ ${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
              )}

              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>R$ {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Applied Promo Code Display */}
            {appliedPromoCode && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-4">
                <div className="flex items-center">
                  <Tag className="w-4 h-4 text-purple-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">
                      Código {appliedPromoCode.code} aplicado!
                    </p>
                    <p className="text-xs text-purple-600">{appliedPromoCode.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Guarantee */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-6">
              <p className="text-sm text-green-700 text-center">
                ✅ Satisfação garantida ou seu pedido refeito
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
