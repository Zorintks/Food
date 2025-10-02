
import QRCode from 'qrcode'

interface PixData {
  merchantName: string
  merchantCity: string
  pixKey: string
  amount: number
  description: string
}

export const generatePixPayload = (data: PixData): string => {
  const { merchantName, merchantCity, pixKey, amount, description } = data
  
  // Formato EMV simplificado para PIX
  const payload = [
    '00020101', // Payload Format Indicator
    '010212', // Point of Initiation Method
    `26${(pixKey.length + 22).toString().padStart(2, '0')}0014br.gov.bcb.pix01${pixKey.length.toString().padStart(2, '0')}${pixKey}`, // Merchant Account Information
    '52040000', // Merchant Category Code
    '5303986', // Transaction Currency (BRL)
    `54${amount.toFixed(2).length.toString().padStart(2, '0')}${amount.toFixed(2)}`, // Transaction Amount
    '5802BR', // Country Code
    `59${merchantName.length.toString().padStart(2, '0')}${merchantName}`, // Merchant Name
    `60${merchantCity.length.toString().padStart(2, '0')}${merchantCity}`, // Merchant City
    `62${(description.length + 4).toString().padStart(2, '0')}05${description.length.toString().padStart(2, '0')}${description}`, // Additional Data Field
    '6304' // CRC16 placeholder
  ].join('')
  
  // Calcular CRC16 (simplificado)
  const crc = calculateCRC16(payload)
  return payload + crc
}

export const generatePixQRCode = async (pixPayload: string): Promise<string> => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(pixPayload, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    return qrCodeDataURL
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error)
    throw new Error('Falha ao gerar QR Code PIX')
  }
}

// Função simplificada de CRC16 para PIX
function calculateCRC16(data: string): string {
  let crc = 0xFFFF
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021
      } else {
        crc <<= 1
      }
      crc &= 0xFFFF
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

export const getPixData = (): PixData => ({
  merchantName: 'FOODCOMBO LTDA',
  merchantCity: 'SAO PAULO',
  pixKey: 'foodcombo@pix.com.br', // Em produção, usar chave PIX real
  amount: 0, // Será definido dinamicamente
  description: 'Pedido FoodCombo'
})
