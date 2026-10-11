import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore'
import { db, logFirestoreError, OperationType } from '@/lib/firebase'
import { GUIDE_TEAM as defaultTeam, type GuideTeamMember } from '@/data/team'
import { safeLocalStorageSet, persistMedia } from '@/lib/mediaStorage'

const TEAM_KEY = 'gj:team_guides:v1'
const TEAM_EVENT = 'gj:team_guides-change'

function slugifyId(raw: string): string {
  const clean = raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return clean || `guide-${Date.now()}`
}

export function getStoredTeam(): GuideTeamMember[] {
  if (typeof window === 'undefined') return defaultTeam
  try {
    const raw = window.localStorage.getItem(TEAM_KEY)
    if (!raw) return defaultTeam
    const parsed = JSON.parse(raw) as GuideTeamMember[]
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultTeam

    const defaultIds = new Set(defaultTeam.map((m) => m.id))
    const customItems: GuideTeamMember[] = []
    const updatedDefaultsMap = new Map<string, GuideTeamMember>()

    parsed.forEach((item) => {
      if (defaultIds.has(item.id)) {
        updatedDefaultsMap.set(item.id, item)
      } else {
        customItems.push(item)
      }
    })

    const finalDefaults = defaultTeam.map((m) => updatedDefaultsMap.get(m.id) || m)
    return [...customItems, ...finalDefaults]
  } catch {
    return defaultTeam
  }
}

export function saveLocalTeam(list: GuideTeamMember[]) {
  if (typeof window === 'undefined') return
  safeLocalStorageSet(TEAM_KEY, list, TEAM_EVENT, list)
}

export async function upsertGuideMember(guide: GuideTeamMember): Promise<GuideTeamMember[]> {
  const current = getStoredTeam()
  const cleanId = slugifyId(guide.id || guide.name)
  const normalized: GuideTeamMember = { ...guide, id: cleanId }

  if (normalized.image && normalized.image.startsWith('data:')) {
    persistMedia(`guide-${cleanId}`, normalized.image)
  }

  const filtered = current.filter((m) => m.id !== cleanId)
  const next = [normalized, ...filtered]
  saveLocalTeam(next)

  try {
    await setDoc(doc(db, 'teamGuides', cleanId), normalized)
  } catch (err) {
    logFirestoreError(err, OperationType.WRITE, `teamGuides/${cleanId}`)
  }

  return next
}

export async function deleteGuideMember(id: string): Promise<GuideTeamMember[]> {
  const current = getStoredTeam()
  const next = current.filter((m) => m.id !== id)
  saveLocalTeam(next)

  try {
    await deleteDoc(doc(db, 'teamGuides', id))
  } catch (err) {
    logFirestoreError(err, OperationType.DELETE, `teamGuides/${id}`)
  }
  return next
}

export function resetTeamToDefault(): GuideTeamMember[] {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(TEAM_KEY)
    window.dispatchEvent(new CustomEvent(TEAM_EVENT))
  }
  return defaultTeam
}

export function useTeamGuides(): GuideTeamMember[] {
  const [list, setList] = useState<GuideTeamMember[]>(defaultTeam)

  useEffect(() => {
    if (typeof window === 'undefined') return

    setList(getStoredTeam())

    const sync = () => setList(getStoredTeam())
    window.addEventListener(TEAM_EVENT, sync)
    window.addEventListener('storage', sync)

    const unsub = onSnapshot(
      collection(db, 'teamGuides'),
      (snapshot) => {
        const defaultIds = new Set(defaultTeam.map((m) => m.id))
        const local = getStoredTeam()
        const localCustoms = local.filter((m) => !defaultIds.has(m.id))

        const remoteMap = new Map<string, GuideTeamMember>()
        snapshot.forEach((snap) => {
          const data = snap.data() as GuideTeamMember
          if (data && data.id) {
            remoteMap.set(data.id, data)
          }
        })

        const customMap = new Map<string, GuideTeamMember>()
        localCustoms.forEach((c) => customMap.set(c.id, c))
        remoteMap.forEach((r, key) => {
          if (!defaultIds.has(key)) {
            if (!customMap.has(key)) {
              customMap.set(key, r)
            }
          }
        })

        const finalDefaults = defaultTeam.map((m) => remoteMap.get(m.id) || m)
        const merged = [...Array.from(customMap.values()), ...finalDefaults]

        setList(merged)
        saveLocalTeam(merged)
      },
      (error) => {
        logFirestoreError(error, OperationType.GET, 'teamGuides')
      }
    )

    return () => {
      window.removeEventListener(TEAM_EVENT, sync)
      window.removeEventListener('storage', sync)
      unsub()
    }
  }, [])

  return list
}
