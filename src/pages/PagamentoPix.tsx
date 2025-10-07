import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import QRCode from 'react-qr-code'
import { ArrowLeft, Copy } from 'lucide-react'
import toast from 'react-hot-toast'
import { Pix } from 'pix-payload'

const PagamentoPix: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { total, orderNumber } = location.state || {}

  const chavePix = 'zorotks@gmail.com'
  const nomeRecebedor = 'Combos SP'
  const cidadeRecebedor = 'Sao Paulo'

  if (!total) {
    navigate('/')
    return null
  }

  // Cria o payload Pix usando a biblioteca pix-payload
  const pix = new Pix({
    chave: chavePix,
    nome: nomeRecebedor,
    cidade: cidadeRecebedor,
    valor: total
  })
  const payload = pix.getPayload() // Payload Pix válido

  const copiarCodigoPix = async () => {
    await navigator.clipboard.writeText(payload)
    toast.success('Código Pix copiado!')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center relative">
        <button
          onClick={() => navigate('/')}
          className="absolute left-6 top-6 p-2 hover:bg-gray-200 rounded-full transition"
        >
          <ArrowLeft size={24} />
        </button>

        <h1 className="text-2xl font-bold text-red-600 mb-2">
          Pagamento via PIX
        </h1>
        <p className="text-gray-600 mb-6">Pedido #{orderNumber}</p>

        <div className="flex justify-center mb-6">
          <QRCode value={payload} size={180} />
        </div>

        <p className="text-lg font-semibold mb-4">
          Valor: <span className="text-red-600">R$ {total.toFixed(2)}</span>
        </p>

        <button
          onClick={copiarCodigoPix}
          className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-full font-bold flex items-center justify-center gap-2 hover:scale-105 transition"
        >
          <Copy size={18} /> Copiar código Pix
        </button>

        <p className="text-xs text-gray-500 mt-4">
          Após o pagamento, seu pedido será confirmado automaticamente.
        </p>
      </div>
    </div>
  )
}

export default PagamentoPix
