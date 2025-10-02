
import { cpf } from 'cpf-cnpj-validator'

export const validateCPF = (cpfNumber: string): boolean => {
  return cpf.isValid(cpfNumber)
}

export const formatCPF = (cpfNumber: string): string => {
  return cpf.format(cpfNumber)
}

export const cleanCPF = (cpfNumber: string): string => {
  return cpfNumber.replace(/\D/g, '')
}

export const hashCPF = async (cpfNumber: string): Promise<string> => {
  const cleanedCPF = cleanCPF(cpfNumber)
  const salt = 'foodcombo_salt_2025' // Em produção, usar variável de ambiente
  const data = new TextEncoder().encode(cleanedCPF + salt)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `FC${timestamp}${random}`.toUpperCase()
}
