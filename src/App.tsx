
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import Cart from './components/Cart'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import ConfirmationPage from './pages/ConfirmationPage'
import { CartItem, PromoCode } from './types'

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cartItems')
    return saved ? JSON.parse(saved) : []
  })

  const [isCartOpen, setIsCartOpen] = useState(false)
  
  const [appliedPromoCode, setAppliedPromoCode] = useState<PromoCode | null>(() => {
    const saved = localStorage.getItem('appliedPromoCode')
    return saved ? JSON.parse(saved) : null
  })

  // Save to localStorage whenever cart or promo code changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    if (appliedPromoCode) {
      localStorage.setItem('appliedPromoCode', JSON.stringify(appliedPromoCode))
    } else {
      localStorage.removeItem('appliedPromoCode')
    }
  }, [appliedPromoCode])

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id)
      
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      } else {
        return [...prevItems, { ...item, quantity: 1 }]
      }
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
    setAppliedPromoCode(null)
  }

  const applyPromoCode = (code: string) => {
    // Validate promo code
    if (code === 'PROMO3') {
      const promoCode: PromoCode = {
        code: 'PROMO3',
        discount: 3,
        freeDelivery: true,
        isValid: true,
        description: '3% de desconto + frete grátis'
      }
      setAppliedPromoCode(promoCode)
    }
  }

  const removePromoCode = () => {
    setAppliedPromoCode(null)
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header 
          cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          onCartClick={() => setIsCartOpen(true)}
        />
        
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          appliedPromoCode={appliedPromoCode}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onApplyPromoCode={applyPromoCode}
          onRemovePromoCode={removePromoCode}
          onClearCart={clearCart}
        />

        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                onAddToCart={addToCart}
                onCartClick={() => setIsCartOpen(true)}
              />
            } 
          />
          <Route 
            path="/cart" 
            element={
              <CartPage
                cartItems={cartItems}
                appliedPromoCode={appliedPromoCode}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
                onApplyPromoCode={applyPromoCode}
                onRemovePromoCode={removePromoCode}
                onClearCart={clearCart}
              />
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <CheckoutPage 
                cartItems={cartItems}
                cartTotal={cartTotal}
                appliedPromoCode={appliedPromoCode}
                onClearCart={clearCart}
              />
            } 
          />
          <Route 
            path="/confirmation/:orderId" 
            element={<ConfirmationPage />} 
          />
        </Routes>

        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
