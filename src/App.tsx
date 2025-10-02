
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useCart } from './hooks/useCart'
import Header from './components/Header'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmed from './pages/OrderConfirmed'
import Orders from './pages/Orders'

function App() {
  const { itemCount } = useCart()

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px'
          },
          success: {
            style: {
              background: '#10b981',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
        }}
      />
      
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header cartItemCount={itemCount} />
          
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cardapio" element={<Menu />} />
              <Route path="/carrinho" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pedido-confirmado" element={<OrderConfirmed />} />
              <Route path="/pedidos" element={<Orders />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-gray-800 text-white py-12 mt-20">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">FC</span>
                    </div>
                    <span className="text-xl font-bold">FoodCombo</span>
                  </div>
                  <p className="text-gray-400">
                    Delivery de combos deliciosos em São Paulo. 
                    Qualidade premium, entrega rápida.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Contato</h3>
                  <div className="space-y-2 text-gray-400">
                    <p>📞 (11) 9999-9999</p>
                    <p>📧 contato@foodcombo.com</p>
                    <p>📍 São Paulo - SP</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Horário de Funcionamento</h3>
                  <div className="space-y-2 text-gray-400">
                    <p>Segunda a Sexta: 11h às 23h</p>
                    <p>Sábado e Domingo: 12h às 23h</p>
                    <p className="text-green-400 font-semibold">🟢 Aberto agora</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2025 FoodCombo. Todos os direitos reservados.</p>
                <p className="text-sm mt-2">
                  Dados protegidos conforme LGPD • Pagamento 100% seguro
                </p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </>
  )
}

export default App
