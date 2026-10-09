import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore'
import { db, logFirestoreError, OperationType } from '@/lib/firebase'
import { articles as defaultArticles, type Article } from '@/data/articles'
import { safeLocalStorageSet, persistMedia } from '@/lib/mediaStorage'

const STORAGE_KEY = 'garut_journey_articles_v2'
const CHANGE_EVENT = 'garut_articles_updated'

/** Safe retrieval of articles list (SSR friendly) */
export function getStoredArticles(): Article[] {
  if (typeof window === 'undefined') {
    return defaultArticles
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return defaultArticles
    }
    const parsed = JSON.parse(raw) as Article[]
    if (Array.isArray(parsed) && parsed.length > 0) {
      const map = new Map<string, Article>()
      defaultArticles.forEach((a) => map.set(a.slug, a))
      parsed.forEach((a) => map.set(a.slug, a))
      return Array.from(map.values())
    }
  } catch (err) {
    console.error('Failed to load articles from storage:', err)
  }
  return defaultArticles
}

export function saveLocalArticles(articles: Article[]) {
  if (typeof window === 'undefined') return
  safeLocalStorageSet(STORAGE_KEY, articles, CHANGE_EVENT, articles)
}

/** Get single article by slug from storage or fallback */
export function getArticleFromStorage(slug: string): Article | undefined {
  const all = getStoredArticles()
  return all.find((a) => a.slug === slug)
}

/** Save or update article in Firestore and localStorage */
export async function saveArticleToStorage(article: Article): Promise<boolean> {
  const current = getStoredArticles()
  const cleanSlug = article.slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || `art-${Date.now()}`

  const normalized: Article = { ...article, slug: cleanSlug }

  if (normalized.image && normalized.image.startsWith('data:')) {
    persistMedia(`art-${cleanSlug}`, normalized.image)
  }

  const index = current.findIndex((a) => a.slug === cleanSlug)
  let updated: Article[]
  if (index >= 0) {
    updated = [...current]
    updated[index] = normalized
  } else {
    updated = [normalized, ...current]
  }
  saveLocalArticles(updated)

  try {
    await setDoc(doc(db, 'articles', cleanSlug), normalized)
    return true
  } catch (err) {
    logFirestoreError(err, OperationType.WRITE, `articles/${cleanSlug}`)
    return true
  }
}

/** Delete an article by slug */
export async function deleteArticleFromStorage(slug: string): Promise<boolean> {
  const current = getStoredArticles()
  const updated = current.filter((a) => a.slug !== slug)
  saveLocalArticles(updated)

  try {
    await deleteDoc(doc(db, 'articles', slug))
    return true
  } catch (err) {
    logFirestoreError(err, OperationType.DELETE, `articles/${slug}`)
    return false
  }
}

/** Reset articles to initial default dataset */
export function resetArticlesStorage(): void {
  if (typeof window === 'undefined') return
  saveLocalArticles(defaultArticles)
}

/** React hook for live articles state */
export function useArticles() {
  const [items, setItems] = useState<Article[]>(() => getStoredArticles())
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (typeof window === 'undefined') return

    const handleUpdate = () => {
      setItems(getStoredArticles())
    }

    window.addEventListener(CHANGE_EVENT, handleUpdate)
    window.addEventListener('storage', handleUpdate)

    const unsub = onSnapshot(
      collection(db, 'articles'),
      (snapshot) => {
        if (!snapshot.empty) {
          const map = new Map<string, Article>()
          defaultArticles.forEach((a) => map.set(a.slug, a))
          snapshot.forEach((snap) => {
            const data = snap.data() as Article
            if (data && data.slug) {
              map.set(data.slug, data)
            }
          })
          const merged = Array.from(map.values())
          setItems(merged)
          saveLocalArticles(merged)
        }
      },
      (error) => {
        logFirestoreError(error, OperationType.GET, 'articles')
      }
    )

    return () => {
      window.removeEventListener(CHANGE_EVENT, handleUpdate)
      window.removeEventListener('storage', handleUpdate)
      unsub()
    }
  }, [])

  return {
    articles: items,
    isClient,
    saveArticle: saveArticleToStorage,
    deleteArticle: deleteArticleFromStorage,
    resetToDefault: resetArticlesStorage,
  }
}
