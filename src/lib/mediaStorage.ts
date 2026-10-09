/**
 * Resilient client-side media and data persistence layer.
 * Uses IndexedDB as a permanent storage vault (hundreds of MBs capacity)
 * with graceful in-memory caching and quota-safe LocalStorage fallbacks.
 */

const DB_NAME = 'garut_journey_media_vault_v1'
const STORE_NAME = 'media'
const DB_VERSION = 1

let dbInstance: IDBDatabase | null = null
const memoryCache = new Map<string, string>()

function openMediaDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null)
  }
  if (dbInstance) {
    return Promise.resolve(dbInstance)
  }

  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        }
      }

      request.onsuccess = () => {
        dbInstance = request.result
        resolve(dbInstance)
      }

      request.onerror = () => {
        console.warn('Could not open IndexedDB media vault, falling back to in-memory/localStorage.')
        resolve(null)
      }
    } catch {
      resolve(null)
    }
  })
}

/** Store a media base64 string or blob URL in IndexedDB & memory cache */
export async function persistMedia(id: string, dataUrl: string): Promise<void> {
  if (!id || !dataUrl) return
  memoryCache.set(id, dataUrl)

  try {
    const db = await openMediaDB()
    if (!db) return
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.put({ id, dataUrl, timestamp: Date.now() })
  } catch (err) {
    console.warn('Failed to persist media to IndexedDB:', err)
  }
}

/** Synchronous check of the in-memory media cache */
export function getMediaFromMemory(id: string): string | null {
  if (!id) return null
  return memoryCache.get(id) || null
}

/** Retrieve a media data URL by id from memory cache or IndexedDB */
export async function getPersistedMedia(id: string): Promise<string | null> {
  if (!id) return null
  if (memoryCache.has(id)) {
    return memoryCache.get(id) || null
  }

  try {
    const db = await openMediaDB()
    if (!db) return null
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const req = store.get(id)
      req.onsuccess = () => {
        if (req.result && req.result.dataUrl) {
          memoryCache.set(id, req.result.dataUrl)
          resolve(req.result.dataUrl)
        } else {
          resolve(null)
        }
      }
      req.onerror = () => resolve(null)
    })
  } catch {
    return null
  }
}

/**
 * Quota-safe LocalStorage helper.
 * If quota is exceeded, handles gracefully, maintains memory state,
 * and still triggers custom events so the UI updates seamlessly.
 */
export function safeLocalStorageSet(key: string, value: unknown, eventName?: string, eventDetail?: unknown): boolean {
  if (typeof window === 'undefined') return false

  let serialized: string
  try {
    serialized = typeof value === 'string' ? value : JSON.stringify(value)
  } catch {
    return false
  }

  let saved = false
  try {
    window.localStorage.setItem(key, serialized)
    saved = true
  } catch (err: unknown) {
    console.warn(`LocalStorage quota exceeded or blocked for ${key}. Falling back to memory & IndexedDB.`, err)

    // Attempt clean up of old temporary storage items if quota exceeded
    try {
      const tempKeys = ['gj:temp', 'debug', 'tmp_']
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i)
        if (k && tempKeys.some((prefix) => k.startsWith(prefix))) {
          window.localStorage.removeItem(k)
        }
      }
      // Retry once after pruning
      window.localStorage.setItem(key, serialized)
      saved = true
    } catch {
      // Continue with memory cache
    }
  }

  // Always dispatch the custom event so active pages re-render immediately
  if (eventName) {
    try {
      window.dispatchEvent(new CustomEvent(eventName, { detail: eventDetail ?? value }))
    } catch {
      // ignore
    }
  }

  return saved
}
