
import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

interface CartItem {
  id: string
  itemId: string
  itemName: string
  quantity: number
  price: number
  selectedSize?: string
  selectedExtras?: string[]
  observations?: string
  image?: string
}

interface UseCartReturn {
  items: CartItem[]
  loading: boolean
  addItem: (item: Omit<CartItem, 'id'>) => void
  updateQuantity: (itemId: string, quantity: number) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
  subtotal: number
  itemCount: number
}

export const useCart = (): UseCartReturn => {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  // Carregar carrinho do localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('foodcombo_cart')
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error)
    }
  }, [])

  // Salvar carrinho no localStorage
  const saveCart = useCallback((cartItems: CartItem[]) => {
    try {
      localStorage.setItem('foodcombo_cart', JSON.stringify(cartItems))
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error)
    }
  }, [])

  // Adicionar item ao carrinho
  const addItem = useCallback((newItem: Omit<CartItem, 'id'>) => {
    setItems(prev => {
      // Verificar se item já existe no carrinho
      const existingItem = prev.find(item => 
        item.itemId === newItem.itemId && 
        item.selectedSize === newItem.selectedSize &&
        JSON.stringify(item.selectedExtras) === JSON.stringify(newItem.selectedExtras)
      )

      let updatedItems: CartItem[]

      if (existingItem) {
        // Atualizar quantidade
        updatedItems = prev.map(item => 
          item.id === existingItem.id 
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        )
        toast.success('Quantidade atualizada no carrinho!')
      } else {
        // Criar novo item
        const cartItem: CartItem = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          ...newItem
        }
        updatedItems = [...prev, cartItem]
        toast.success('Item adicionado ao carrinho!')
      }

      saveCart(updatedItems)
      return updatedItems
    })
  }, [saveCart])

  // Atualizar quantidade
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }

    setItems(prev => {
      const updatedItems = prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
      saveCart(updatedItems)
      return updatedItems
    })
  }, [saveCart])

  // Remover item
  const removeItem = useCallback((itemId: string) => {
    setItems(prev => {
      const updatedItems = prev.filter(item => item.id !== itemId)
      saveCart(updatedItems)
      toast.success('Item removido do carrinho')
      return updatedItems
    })
  }, [saveCart])

  // Limpar carrinho
  const clearCart = useCallback(() => {
    setItems([])
    localStorage.removeItem('foodcombo_cart')
  }, [])

  // Calcular subtotal
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0)
  
  // Contar itens
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return {
    items,
    loading,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    itemCount
  }
}
