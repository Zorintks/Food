
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import ConfirmationPage from './pages/ConfirmationPage'
import { CartItem, DrinkCartItem, ComboItem, DrinkItem, OrderData } from './types'

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [drinkItems, setDrinkItems] = useState<DrinkCartItem[]>([])
  const [currentPage, setCurrentPage] = useState<'home' | 'cart' | 'checkout' | 'confirmation'>('home')
  const [orderData, setOrderData] = useState<OrderData | null>(null)

  const addToCart = (item: Omit<ComboItem, 'quantity'>) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const addDrinkToCart = (item: Omit<DrinkItem, 'quantity'>) => {
    setDrinkItems(prev => {
      const existingItem = prev.find(drinkItem => drinkItem.id === item.id)
      if (existingItem) {
        return prev.map(drinkItem =>
          drinkItem.id === item.id
            ? { ...drinkItem, quantity: drinkItem.quantity + 1 }
            : drinkItem
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const updateCartItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== id))
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      )
    }
  }

  const updateDrinkItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setDrinkItems(prev => prev.filter(item => item.id !== id))
    } else {
      setDrinkItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      )
    }
  }

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const removeDrinkFromCart = (id: string) => {
    setDrinkItems(prev => prev.filter(item => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
    setDrinkItems([])
  }

  const getTotalItems = () => {
    const comboTotal = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const drinkTotal = drinkItems.reduce((sum, item) => sum + item.quantity, 0)
    return comboTotal + drinkTotal
  }

  const getCartTotal = () => {
    const comboTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const drinkTotal = drinkItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    return comboTotal + drinkTotal
  }

  const handleCheckout = (data: OrderData) => {
    setOrderData(data)
    setCurrentPage('confirmation')
    clearCart()
  }

  const navigateToCart = () => setCurrentPage('cart')
  const navigateToHome = () => setCurrentPage('home')
  const navigateToCheckout = () => setCurrentPage('checkout')

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <Header 
        cartItemsCount={getTotalItems()}
        onCartClick={navigateToCart}
        onLogoClick={navigateToHome}
      />

      <main>
        {currentPage === 'home' && (
          <HomePage 
            onAddToCart={addToCart}
            onAddDrinkToCart={addDrinkToCart}
            onCartClick={navigateToCart}
          />
        )}
        
        {currentPage === 'cart' && (
          <CartPage
            cartItems={cartItems}
            drinkItems={drinkItems}
            onUpdateQuantity={updateCartItemQuantity}
            onUpdateDrinkQuantity={updateDrinkItemQuantity}
            onRemoveItem={removeFromCart}
            onRemoveDrink={removeDrinkFromCart}
            onClearCart={clearCart}
            onCheckout={navigateToCheckout}
            onContinueShopping={navigateToHome}
          />
        )}
        
        {currentPage === 'checkout' && (
          <CheckoutPage
            cartItems={cartItems}
            drinkItems={drinkItems}
            total={getCartTotal()}
            onOrderComplete={handleCheckout}
            onBackToCart={() => setCurrentPage('cart')}
          />
        )}
        
        {currentPage === 'confirmation' && orderData && (
          <ConfirmationPage
            orderData={orderData}
            onBackToHome={navigateToHome}
          />
        )}
      </main>
    </div>
  )
}

export default App
