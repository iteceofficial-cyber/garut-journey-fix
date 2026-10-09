import { useEffect, useState } from 'react'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'
import { db, handleFirestoreError, logFirestoreError, OperationType } from '@/lib/firebase'

export interface BankAccountConfig {
  bankName: string
  accountNumber: string
  accountHolder: string
  enabled: boolean
}

export interface EWalletConfig {
  walletName: string
  phoneNumber: string
  accountHolder: string
  enabled: boolean
}

export interface QrisConfig {
  qrisName: string
  enabled: boolean
  instructions: string
  customQrUrl?: string
}

export interface PaymentGatewayConfig {
  qris: QrisConfig
  bca: BankAccountConfig
  mandiri: BankAccountConfig
  bri: BankAccountConfig
  dana: EWalletConfig
  gopay: EWalletConfig
  ovo: EWalletConfig
  whatsappAdmin: string
}

export const DEFAULT_PAYMENT_CONFIG: PaymentGatewayConfig = {
  qris: {
    qrisName: 'QRIS Nasional • Garut Journey Official',
    enabled: true,
    instructions: 'Scan dengan GoPay, OVO, Dana, ShopeePay, BCA Mobile, Livin Mandiri, BRImo, dll.',
    customQrUrl: '',
  },
  bca: {
    bankName: 'BCA (Bank Central Asia)',
    accountNumber: '148-092-8819',
    accountHolder: 'Garut Journey Official',
    enabled: true,
  },
  mandiri: {
    bankName: 'Bank Mandiri',
    accountNumber: '131-00-298371-2',
    accountHolder: 'Garut Journey Official',
    enabled: true,
  },
  bri: {
    bankName: 'Bank BRI',
    accountNumber: '0123-01-084729-50-1',
    accountHolder: 'Garut Journey Official',
    enabled: true,
  },
  dana: {
    walletName: 'DANA',
    phoneNumber: '0851-5645-6791',
    accountHolder: 'Admin Garut Journey',
    enabled: true,
  },
  gopay: {
    walletName: 'GoPay',
    phoneNumber: '0851-5645-6791',
    accountHolder: 'Admin Garut Journey',
    enabled: true,
  },
  ovo: {
    walletName: 'OVO',
    phoneNumber: '0851-5645-6791',
    accountHolder: 'Admin Garut Journey',
    enabled: true,
  },
  whatsappAdmin: '085156456791',
}

const STORAGE_KEY = 'garut_journey_payment_config_v1'
const EVENT_NAME = 'garut_payment_config_updated'

export function getStoredPaymentConfig(): PaymentGatewayConfig {
  if (typeof window === 'undefined') return DEFAULT_PAYMENT_CONFIG
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...DEFAULT_PAYMENT_CONFIG, ...parsed }
    }
  } catch (err) {
    console.error('Failed to get stored payment settings:', err)
  }
  return DEFAULT_PAYMENT_CONFIG
}

export function saveLocalPaymentConfig(config: PaymentGatewayConfig) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: config }))
  } catch (err) {
    console.error('Failed to save payment settings locally:', err)
  }
}

export async function savePaymentConfig(config: PaymentGatewayConfig): Promise<boolean> {
  saveLocalPaymentConfig(config)

  try {
    await setDoc(doc(db, 'payments', 'default'), {
      ...config,
      updatedAt: new Date().toISOString(),
    })
    return true
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'payments/default')
    return false
  }
}

export async function resetPaymentConfigToDefault(): Promise<boolean> {
  return savePaymentConfig(DEFAULT_PAYMENT_CONFIG)
}

export function usePaymentSettings() {
  const [config, setConfig] = useState<PaymentGatewayConfig>(() => getStoredPaymentConfig())

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handler = () => setConfig(getStoredPaymentConfig())
    window.addEventListener(EVENT_NAME, handler)
    window.addEventListener('storage', handler)

    const unsub = onSnapshot(
      doc(db, 'payments', 'default'),
      (docSnap) => {
        if (docSnap.exists()) {
          const remote = docSnap.data() as Partial<PaymentGatewayConfig>
          const merged = { ...DEFAULT_PAYMENT_CONFIG, ...remote }
          setConfig(merged)
          saveLocalPaymentConfig(merged)
        }
      },
      (error) => {
        logFirestoreError(error, OperationType.GET, 'payments/default')
      }
    )

    return () => {
      window.removeEventListener(EVENT_NAME, handler)
      window.removeEventListener('storage', handler)
      unsub()
    }
  }, [])

  return {
    config,
    saveConfig: savePaymentConfig,
    resetToDefault: resetPaymentConfigToDefault,
  }
}
