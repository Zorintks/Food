
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {X, User, Check, AlertCircle} from 'lucide-react'
import { validateCPF, formatCPF, cleanCPF } from '../utils/cpfUtils'

interface CPFModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (cpf: string) => void
  title?: string
  description?: string
}

const CPFModal: React.FC<CPFModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = "Identifique-se",
  description = "Digite seu CPF para continuar"
}) => {
  const [cpf, setCpf] = useState('')
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCpfChange = (value: string) => {
    const cleaned = cleanCPF(value)
    if (cleaned.length <= 11) {
      const formatted = formatCPF(cleaned)
      setCpf(formatted)
      
      if (cleaned.length === 11) {
        setIsValid(validateCPF(cleaned))
      } else {
        setIsValid(null)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValid) return

    setLoading(true)
    try {
      await onConfirm(cleanCPF(cpf))
      setCpf('')
      setIsValid(null)
    } catch (error) {
      console.error('Erro ao processar CPF:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setCpf('')
    setIsValid(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Botão Fechar */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Conteúdo */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
              <p className="text-gray-600">{description}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => handleCpfChange(e.target.value)}
                  placeholder="000.000.000-00"
                  className={`w-full px-4 py-4 text-lg text-center border-2 rounded-xl focus:outline-none transition-colors ${
                    isValid === null 
                      ? 'border-gray-300 focus:border-orange-500' 
                      : isValid 
                        ? 'border-green-500 focus:border-green-500' 
                        : 'border-red-500 focus:border-red-500'
                  }`}
                  maxLength={14}
                />
                
                {/* Ícone de Validação */}
                {isValid !== null && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {isValid ? (
                      <Check size={20} className="text-green-500" />
                    ) : (
                      <AlertCircle size={20} className="text-red-500" />
                    )}
                  </div>
                )}
              </div>

              {/* Feedback de Validação */}
              {isValid === false && (
                <motion.p
                  className="text-red-500 text-sm text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  CPF inválido. Verifique os números digitados.
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={!isValid || loading}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                  isValid && !loading
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                whileHover={isValid && !loading ? { scale: 1.02 } : {}}
                whileTap={isValid && !loading ? { scale: 0.98 } : {}}
              >
                {loading ? 'Processando...' : 'Continuar'}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Seus dados são protegidos conforme a LGPD
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CPFModal
