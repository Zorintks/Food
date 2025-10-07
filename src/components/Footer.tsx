
import React from 'react'
import {MapPin, Phone, Clock} from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e Descrição */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🍔</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Combos SP</h3>
                <p className="text-sm text-gray-400">Delivery Rápido</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Os melhores combos de comida e bebidas de São Paulo, 
              entregues rapidamente na sua casa!
            </p>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-red-500" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-red-500" />
                <span>São Paulo - SP</span>
              </div>
            </div>
          </div>

          {/* Horários */}
          <div>
            <h4 className="font-semibold mb-4">Horário de Funcionamento</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-yellow-500" />
                <div>
                  <p>Segunda a Sexta: 18h às 23h</p>
                  <p>Sábado e Domingo: 17h às 00h</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-400">
                💳 Aceitamos PIX, Cartão e Dinheiro
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Combos SP. Todos os direitos reservados.</p>
          <p className="mt-2">
            🚚 Entrega grátis para pedidos acima de R$ 50,00 em São Paulo e região metropolitana
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
