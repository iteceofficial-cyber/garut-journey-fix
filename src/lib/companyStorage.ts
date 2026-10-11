import { useEffect, useState } from 'react'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'
import { db, logFirestoreError, OperationType } from '@/lib/firebase'
import { COMPANY_PROFILE, type CompanyProfileData } from '@/data/company'
import { safeLocalStorageSet } from '@/lib/mediaStorage'

const COMPANY_PROFILE_KEY = 'garut_journey_company_profile_v1'
const COMPANY_PROFILE_EVENT = 'garut_company_profile_updated'

export type { CompanyProfileData }

export function getStoredCompanyProfile(): CompanyProfileData {
  if (typeof window === 'undefined') return COMPANY_PROFILE
  try {
    const raw = localStorage.getItem(COMPANY_PROFILE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        ...COMPANY_PROFILE,
        ...parsed,
        stats: {
          ...COMPANY_PROFILE.stats,
          ...(parsed.stats || {}),
        },
        bankAccounts: parsed.bankAccounts && Array.isArray(parsed.bankAccounts)
          ? parsed.bankAccounts
          : COMPANY_PROFILE.bankAccounts,
        mission: parsed.mission && Array.isArray(parsed.mission)
          ? parsed.mission
          : COMPANY_PROFILE.mission,
        pillars: parsed.pillars && Array.isArray(parsed.pillars)
          ? parsed.pillars
          : COMPANY_PROFILE.pillars,
        customLegalDocs: parsed.customLegalDocs && Array.isArray(parsed.customLegalDocs)
          ? parsed.customLegalDocs
          : COMPANY_PROFILE.customLegalDocs,
      }
    }
  } catch (err) {
    console.error('Failed to parse company profile:', err)
  }
  return COMPANY_PROFILE
}

export function saveLocalCompanyProfile(profile: CompanyProfileData) {
  if (typeof window === 'undefined') return
  safeLocalStorageSet(COMPANY_PROFILE_KEY, profile, COMPANY_PROFILE_EVENT, profile)
}

export async function saveCompanyProfile(profileUpdates: Partial<CompanyProfileData>): Promise<boolean> {
  const current = getStoredCompanyProfile()
  const updated: CompanyProfileData = {
    ...current,
    ...profileUpdates,
    stats: {
      ...current.stats,
      ...(profileUpdates.stats || {}),
    },
    bankAccounts: profileUpdates.bankAccounts || current.bankAccounts,
    mission: profileUpdates.mission || current.mission,
    pillars: profileUpdates.pillars || current.pillars,
    customLegalDocs: profileUpdates.customLegalDocs || current.customLegalDocs,
  }

  saveLocalCompanyProfile(updated)

  try {
    await setDoc(doc(db, 'settings', 'companyProfile'), {
      ...updated,
      updatedAt: new Date().toISOString(),
    })
    return true
  } catch (err) {
    logFirestoreError(err, OperationType.WRITE, 'settings/companyProfile')
    return true
  }
}

export function useCompanyProfile() {
  const [profile, setProfile] = useState<CompanyProfileData>(COMPANY_PROFILE)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Synchronize client-stored company profile after hydration
    setProfile(getStoredCompanyProfile())

    const handler = () => setProfile(getStoredCompanyProfile())
    window.addEventListener(COMPANY_PROFILE_EVENT, handler)
    window.addEventListener('storage', handler)

    const unsub = onSnapshot(
      doc(db, 'settings', 'companyProfile'),
      (docSnap) => {
        if (docSnap.exists()) {
          const remote = docSnap.data() as Partial<CompanyProfileData>
          const merged: CompanyProfileData = {
            ...COMPANY_PROFILE,
            ...remote,
            stats: {
              ...COMPANY_PROFILE.stats,
              ...(remote.stats || {}),
            },
            bankAccounts: remote.bankAccounts && Array.isArray(remote.bankAccounts)
              ? remote.bankAccounts
              : COMPANY_PROFILE.bankAccounts,
            mission: remote.mission && Array.isArray(remote.mission)
              ? remote.mission
              : COMPANY_PROFILE.mission,
            pillars: remote.pillars && Array.isArray(remote.pillars)
              ? remote.pillars
              : COMPANY_PROFILE.pillars,
          }
          setProfile(merged)
          saveLocalCompanyProfile(merged)
        }
      },
      (error) => {
        logFirestoreError(error, OperationType.GET, 'settings/companyProfile')
      }
    )

    return () => {
      window.removeEventListener(COMPANY_PROFILE_EVENT, handler)
      window.removeEventListener('storage', handler)
      unsub()
    }
  }, [])

  const updateProfile = async (updates: Partial<CompanyProfileData>) => {
    setLoading(true)
    try {
      const ok = await saveCompanyProfile(updates)
      return ok
    } finally {
      setLoading(false)
    }
  }

  return { profile, saveCompanyProfile: updateProfile, loading }
}
