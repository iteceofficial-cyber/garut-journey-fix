import { getMediaFromMemory } from '@/lib/mediaStorage'

export const DEFAULT_FALLBACK_IMAGE = '/img/hero.png'

/** Inline SVG placeholder in case no image can be loaded */
export const SVG_FALLBACK_PLACEHOLDER =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#17231D"/><path d="M120 480L340 260L460 380L580 220L720 480Z" fill="#1F5D42" opacity="0.6"/><circle cx="280" cy="180" r="40" fill="#D8893B"/><text x="400" y="520" font-family="sans-serif" font-size="20" fill="#F5EFE3" opacity="0.7" text-anchor="middle">Garut Journey</text></svg>'
  )

/**
 * Serve images from /img directory, external URLs, or uploaded data URLs safely.
 */
export function img(file?: string | null, _width = 1200) {
  if (!file || typeof file !== 'string' || !file.trim()) {
    return DEFAULT_FALLBACK_IMAGE
  }
  const trimmed = file.trim()
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed
  }

  // Check in-memory media cache for custom uploaded keys
  const cachedMedia = getMediaFromMemory(trimmed)
  if (cachedMedia) {
    return cachedMedia
  }

  const clean = trimmed.replace(/^\/+/, '').replace(/^img\/+/, '')
  return `/img/${clean}`
}

/**
 * A responsive srcSet for images.
 * Only generates distinct widths if the URL is an Unsplash image that supports `&w=`.
 * For local static images and data URLs, returns undefined.
 */
export function srcSet(file?: string | null, widths: number[] = [480, 800, 1200]): string | undefined {
  if (!file || file.startsWith('data:') || file.startsWith('blob:')) {
    return undefined
  }
  if (file.includes('images.unsplash.com')) {
    const cleanUrl = file.split('?')[0]
    return widths.map((w) => `${cleanUrl}?auto=format&fit=crop&w=${w}&q=80 ${w}w`).join(', ')
  }
  return undefined
}

/**
 * Compress and resize an uploaded image File into a lightweight, clean JPEG data URL (~30KB-65KB)
 * Ultra-compatible across iPhone Safari, Android, and Desktop browsers.
 * Safe for LocalStorage (5MB quota), Firestore (1MB limit), and IndexedDB.
 */
export function readAndCompressImage(file: File, maxWidth = 860, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('File tidak ditemukan.'))
      return
    }

    // Try object URL first (fastest, lowest memory footprint for mobile)
    let objectUrl = ''
    try {
      objectUrl = URL.createObjectURL(file)
    } catch {
      objectUrl = ''
    }

    const processImageSource = (src: string, isObjectUrl: boolean) => {
      const img = new Image()

      img.onload = () => {
        if (isObjectUrl) {
          try {
            URL.revokeObjectURL(src)
          } catch {
            // ignore
          }
        }

        try {
          let origWidth = img.naturalWidth || img.width || 800
          let origHeight = img.naturalHeight || img.height || 600

          let targetWidth = origWidth
          let targetHeight = origHeight

          if (origWidth > maxWidth || origHeight > maxWidth) {
            const ratio = Math.min(maxWidth / origWidth, maxWidth / origHeight)
            targetWidth = Math.max(1, Math.round(origWidth * ratio))
            targetHeight = Math.max(1, Math.round(origHeight * ratio))
          }

          const canvas = document.createElement('canvas')
          canvas.width = targetWidth
          canvas.height = targetHeight
          const ctx = canvas.getContext('2d')

          if (!ctx) {
            resolve(src)
            return
          }

          // Draw white background in case source has transparent regions
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, targetWidth, targetHeight)

          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

          let outputDataUrl = canvas.toDataURL('image/jpeg', quality)

          // If output exceeds 85KB, perform quick second-pass compression to stay quota-safe
          if (outputDataUrl.length > 85000) {
            const canvas2 = document.createElement('canvas')
            const scale2 = 0.8
            canvas2.width = Math.max(1, Math.round(targetWidth * scale2))
            canvas2.height = Math.max(1, Math.round(targetHeight * scale2))
            const ctx2 = canvas2.getContext('2d')
            if (ctx2) {
              ctx2.fillStyle = '#FFFFFF'
              ctx2.fillRect(0, 0, canvas2.width, canvas2.height)
              ctx2.imageSmoothingEnabled = true
              ctx2.imageSmoothingQuality = 'medium'
              ctx2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height)
              outputDataUrl = canvas2.toDataURL('image/jpeg', 0.65)
            }
          }

          resolve(outputDataUrl)
        } catch {
          resolve(src)
        }
      }

      img.onerror = () => {
        if (isObjectUrl) {
          try {
            URL.revokeObjectURL(src)
          } catch {
            // ignore
          }
          // Fallback to FileReader if objectURL failed
          fallbackToFileReader()
        } else {
          resolve(src)
        }
      }

      img.src = src
    }

    const fallbackToFileReader = () => {
      const reader = new FileReader()
      reader.onerror = () => reject(new Error('Gagal membaca file gambar.'))
      reader.onload = () => {
        const result = String(reader.result || '')
        if (result.startsWith('data:image')) {
          processImageSource(result, false)
        } else {
          resolve(result)
        }
      }
      reader.readAsDataURL(file)
    }

    if (objectUrl) {
      processImageSource(objectUrl, true)
    } else {
      fallbackToFileReader()
    }
  })
}
