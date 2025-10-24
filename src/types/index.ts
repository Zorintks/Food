
export interface ComboItem {
  id: string
  name: string
  description: string
  originalPrice: number
  price: number
  image: string
  badge?: string
  rating: number
  reviewCount: number
  isLimited?: boolean
  limitedQuantity?: number
  hasCountdown?: boolean
}

export interface DrinkItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: 'refrigerante' | 'suco' | 'cerveja'
  size?: string
  alcoholContent?: number
  temperature: 'gelado' | 'natural'
  rating: number
  reviewCount: number
  badge?: string
  isLimited?: boolean
  limitedQuantity?: number
}

export interface CartItem extends ComboItem {
  quantity: number
}

export interface DrinkCartItem extends DrinkItem {
  quantity: number
}

export interface PromoCode {
  code: string
  discount: number // percentage
  freeDelivery: boolean
  isValid: boolean
  description: string
}

export interface OrderData {
  items: CartItem[]
  drinks: DrinkCartItem[]
  customer: {
    name: string
    phone: string
    address: {
      street: string
      number: string
      complement?: string
      neighborhood: string
      zipCode: string
    }
  }
  deliveryType: 'delivery' | 'pickup'
  total: number
  subtotal: number
  deliveryFee: number
  discount: number
  promoCode?: string
}
