
import { useState, useEffect, useCallback } from 'react'
import { lumi } from '../lib/lumi'
import { hashCPF } from '../utils/cpfUtils'
import toast from 'react-hot-toast'

interface CartItem {
  _id?: string
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
  addItem: (item: Omit<CartItem, '_id'>) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  syncCart: (cpf: string) => Promise<void>
  subtotal: number
  itemCount: number
}

export const useCart = (): UseCartReturn => {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [currentCpfHash, setCurrentCpfHash] = useState<string | null>(null)

  // Sincronizar carrinho com CPF
  const syncCart = useCallback(async (cpf: string) => {
    try {
      setLoading(true)
      const cpfHash = await hashCPF(cpf)
      setCurrentCpfHash(cpfHash)

      const { list: cartItems } = await lumi.entities.cart_items.list({
        filter: { cpfHash },
        sort: { createdAt: -1 }
      })

      setItems(cartItems || [])
    } catch (error) {
      console.error('Erro ao sincronizar carrinho:', error)
      toast.error('Erro ao carregar carrinho')
    } finally {
      setLoading(false)
    }
  }, [])

  // Adicionar item ao carrinho
  const addItem = useCallback(async (newItem: Omit<CartItem, '_id'>) => {
    if (!currentCpfHash) {
      toast.error('CPF necessário para adicionar itens')
      return
    }

    try {
      // Verificar se item já existe no carrinho
      const existingItem = items.find(item => 
        item.itemId === newItem.itemId && 
        item.selectedSize === newItem.selectedSize &&
        JSON.stringify(item.selectedExtras) === JSON.stringify(newItem.selectedExtras)
      )

      if (existingItem) {
        // Atualizar quantidade
        await updateQuantity(existingItem._id!, existingItem.quantity + newItem.quantity)
      } else {
        // Criar novo item
        const cartItem = await lumi.entities.cart_items.create({
          cpfHash: currentCpfHash,
          ...newItem,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          creator: 'customer'
        })

        setItems(prev => [...prev, cartItem])
        toast.success('Item adicionado ao carrinho!')
      }
    } catch (error) {
      console.error('Erro ao adicionar item:', error)
      toast.error('Erro ao adicionar item ao carrinho')
    }
  }, [currentCpfHash, items])

  // Atualizar quantidade
  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId)
      return
    }

    try {
      await lumi.entities.cart_items.update(itemId, {
        quantity,
        updatedAt: new Date().toISOString()
      })

      setItems(prev => prev.map(item => 
        item._id === itemId ? { ...item, quantity } : item
      ))
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error)
      toast.error('Erro ao atualizar quantidade')
    }
  }, [])

  // Remover item
  const removeItem = useCallback(async (itemId: string) => {
    try {
      await lumi.entities.cart_items.delete(itemId)
      setItems(prev => prev.filter(item => item._id !== itemId))
      toast.success('Item removido do carrinho')
    } catch (error) {
      console.error('Erro ao remover item:', error)
      toast.error('Erro ao remover item')
    }
  }, [])

  // Limpar carrinho
  const clearCart = useCallback(async () => {
    if (!currentCpfHash) return

    try {
      const itemIds = items.map(item => item._id!).filter(Boolean)
      if (itemIds.length > 0) {
        await lumi.entities.cart_items.deleteMany(itemIds)
      }
      setItems([])
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error)
      toast.error('Erro ao limpar carrinho')
    }
  }, [currentCpfHash, items])

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
    syncCart,
    subtotal,
    itemCount
  }
}
