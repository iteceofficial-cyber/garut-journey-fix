import { useEffect, useState } from 'react'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'
import { db, logFirestoreError, OperationType } from '@/lib/firebase'

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

export type ReceiptTemplateStyle = 'classic-forest' | 'royal-ember' | 'modern-minimal' | 'corporate-navy'

export interface ReceiptFormatConfig {
  templateStyle: ReceiptTemplateStyle
  receiptPrefix: string
  headerBrandTitle: string
  headerSubtitle: string
  documentTitleLunas: string
  documentTitleDp: string
  documentSubtitle: string
  labelReceivedFrom: string
  labelAmount: string
  labelPaymentFor: string
  labelSchedule: string
  labelNotes: string
  showWatermark: boolean
  watermarkTextLunas: string
  watermarkTextDp: string
  showQrValidation: boolean
  qrTitle: string
  qrDescription: string
  stampText: string
  signatureCity: string
  signerName: string
  signerRole: string
  footerNote: string
  customTermsNote: string
  showScheduleRow: boolean
  showCustomerContact: boolean
}

export const DEFAULT_RECEIPT_FORMAT: ReceiptFormatConfig = {
  templateStyle: 'classic-forest',
  receiptPrefix: 'KW-',
  headerBrandTitle: 'GARUT JOURNEY',
  headerSubtitle: 'RESMI & TERVERIFIKASI',
  documentTitleLunas: 'KWITANSI PEMBAYARAN LUNAS',
  documentTitleDp: 'KWITANSI DOWN PAYMENT (DP)',
  documentSubtitle: 'Official Payment Receipt • Garut City Tour',
  labelReceivedFrom: 'Telah Diterima Dari',
  labelAmount: 'Uang Sejumlah',
  labelPaymentFor: 'Untuk Pembayaran',
  labelSchedule: 'Tanggal Pelaksanaan',
  labelNotes: 'Catatan Khusus',
  showWatermark: true,
  watermarkTextLunas: 'LUNAS',
  watermarkTextDp: 'DP SAH',
  showQrValidation: true,
  qrTitle: 'Validasi QR',
  qrDescription: 'Scan untuk memverifikasi keaslian kwitansi di sistem online Garut Journey.',
  stampText: 'VERIFIED DIGITAL SIGNATURE',
  signatureCity: 'Garut',
  signerName: 'Bagian Keuangan & Kasir',
  signerRole: 'Finance Directorate Garut Journey',
  footerNote:
    'Dokumen ini diterbitkan secara sah dan otomatis oleh sistem reservasi Garut Journey. Tidak memerlukan stempel fisik tambahan.',
  customTermsNote:
    'Harap simpan dan tunjukkan kwitansi resmi ini (digital/cetak) kepada pemandu wisata saat penjemputan di titik kumpul.',
  showScheduleRow: true,
  showCustomerContact: true,
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
  receiptFormat?: ReceiptFormatConfig
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
  receiptFormat: DEFAULT_RECEIPT_FORMAT,
}

export function getReceiptFormat(config?: Partial<PaymentGatewayConfig> | null): ReceiptFormatConfig {
  return {
    ...DEFAULT_RECEIPT_FORMAT,
    ...(config?.receiptFormat || {}),
  }
}

const STORAGE_KEY = 'garut_journey_payment_config_v1'
const EVENT_NAME = 'garut_payment_config_updated'

export function getStoredPaymentConfig(): PaymentGatewayConfig {
  if (typeof window === 'undefined') return DEFAULT_PAYMENT_CONFIG
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        ...DEFAULT_PAYMENT_CONFIG,
        ...parsed,
        receiptFormat: {
          ...DEFAULT_RECEIPT_FORMAT,
          ...(parsed.receiptFormat || {}),
        },
      }
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
  const normalized: PaymentGatewayConfig = {
    ...config,
    receiptFormat: {
      ...DEFAULT_RECEIPT_FORMAT,
      ...(config.receiptFormat || {}),
    },
  }
  saveLocalPaymentConfig(normalized)

  try {
    await setDoc(doc(db, 'payments', 'default'), {
      ...normalized,
      updatedAt: new Date().toISOString(),
    })
    return true
  } catch (err) {
    logFirestoreError(err, OperationType.WRITE, 'payments/default')
    return true
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
          const merged: PaymentGatewayConfig = {
            ...DEFAULT_PAYMENT_CONFIG,
            ...remote,
            receiptFormat: {
              ...DEFAULT_RECEIPT_FORMAT,
              ...(remote.receiptFormat || {}),
            },
          }
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
    receiptFormat: getReceiptFormat(config),
    saveConfig: savePaymentConfig,
    resetToDefault: resetPaymentConfigToDefault,
  }
}
