import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore'
import { db, handleFirestoreError, logFirestoreError, OperationType } from '@/lib/firebase'
import { articles as defaultArticles, type Article } from '@/data/articles'

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
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
  } catch (err) {
    console.error('Failed to load articles from storage:', err)
  }
  return defaultArticles
}

export function saveLocalArticles(articles: Article[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: articles }))
  } catch (err) {
    console.error('Failed to save articles to local storage:', err)
  }
}

/** Get single article by slug from storage or fallback */
export function getArticleFromStorage(slug: string): Article | undefined {
  const all = getStoredArticles()
  return all.find((a) => a.slug === slug)
}

/** Save or update article in Firestore and localStorage */
export async function saveArticleToStorage(article: Article): Promise<boolean> {
  const current = getStoredArticles()
  const index = current.findIndex((a) => a.slug === article.slug)
  let updated: Article[]
  if (index >= 0) {
    updated = [...current]
    updated[index] = { ...article }
  } else {
    updated = [{ ...article }, ...current]
  }
  saveLocalArticles(updated)

  try {
    await setDoc(doc(db, 'articles', article.slug), article)
    return true
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `articles/${article.slug}`)
    return false
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
    handleFirestoreError(err, OperationType.DELETE, `articles/${slug}`)
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
          const remoteList: Article[] = []
          snapshot.forEach((snap) => remoteList.push(snap.data() as Article))
          setItems(remoteList)
          saveLocalArticles(remoteList)
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
