import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import QRCode from 'react-qr-code'
import { CheckCircle, ArrowLeft } from 'lucide-react'

interface LocationState {
  orderNumber: number
  total: number
  hasFreeShipping: boolean
  customerData: {
    name: string
    phone: string
    address: string
    number: string
    neighborhood: string
    city: string
    zipCode: string
    observations?: string
  }
}

const PedidoConfirmado: React.FC = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const data = state as LocationState

  // 🔑 SUA CHAVE PIX AQUI:
  const PIX_KEY = 'zorotks@gmail.com'

  if (!data) {
    navigate('/cardapio')
    return null
  }

  // 💰 Gerar o código PIX Copia e Cola (básico)
  const pixCopiaCola = `00020126580014BR.GOV.BCB.PIX0136${PIX_KEY}520400005303986540${data.total
    .toFixed(2)
    .replace('.', '')}5802BR5920Seu Restaurante6009Sao Paulo62070503***6304`

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center"
      >
        <CheckCircle className="text-green-500 mx-auto mb-4" size={60} />
        <h1 className="text-2xl font-bold mb-2">Pedido Confirmado! 🎉</h1>
        <p className="text-gray-600 mb-6">
          Pedido #{data.orderNumber} realizado com sucesso.
        </p>

        <h2 className="text-lg font-semibold mb-2">Valor total:</h2>
        <p className="text-2xl font-bold text-red-600 mb-6">
          R$ {data.total.toFixed(2)}
        </p>

        <h3 className="text-md font-semibold mb-2">Pague via PIX</h3>
        <div className="bg-gray-100 p-4 rounded-lg flex justify-center mb-4">
          <QRCode value={pixCopiaCola} size={180} />
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Escaneie o QR Code ou copie o código abaixo:
        </p>

        <textarea
          readOnly
          value={pixCopiaCola}
          className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-gray-50 text-center resize-none"
          rows={3}
        />

        <button
          onClick={() => navigate('/cardapio')}
          className="mt-6 w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold py-3 rounded-full transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} /> Voltar ao Cardápio
        </button>
      </motion.div>
    </div>
  )
}

export default PedidoConfirmado
