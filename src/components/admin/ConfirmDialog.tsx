import { AlertCircle, Check } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  isDestructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-lift border border-ink/10 space-y-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`grid h-11 w-11 place-items-center rounded-2xl shrink-0 ${
              isDestructive ? 'bg-rose-100 text-rose-600' : 'bg-forest/10 text-forest'
            }`}
          >
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
            <p className="mt-1 text-xs sm:text-sm text-ink/70 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-ink/10">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-4 py-2 text-xs font-semibold text-ink/70 hover:bg-ink/5 transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold text-white shadow-soft transition ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-forest hover:bg-forest-700'
            }`}
          >
            <Check className="h-3.5 w-3.5" />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
