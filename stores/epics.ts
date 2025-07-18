import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiService } from '@/services/api'
import type { Epic } from '@/types/api'

const STORAGE_KEY = 'epic_tracker_data'

interface StoredEpicData {
  epicIds: string
  epics: Epic[]
  timestamp: number
}

export const useEpicStore = defineStore('epics', () => {
  const epicIds = ref<string>('')
  const epics = ref<Epic[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isHydrated = ref(false)

  const epicIdsList = computed(() => {
    return epicIds.value
      .split(',')
      .map(id => id.trim())
      .filter(id => id && /^\d+$/.test(id))
      .map(id => parseInt(id, 10))
  })

  const isValidInput = computed(() => {
    return epicIdsList.value.length > 0
  })

  const loadFromStorage = () => {
    if (!process.client) return false
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data: StoredEpicData = JSON.parse(stored)
        epicIds.value = data.epicIds
        epics.value = data.epics
        return true
      }
    } catch (error) {
      console.error('Error loading epic data from localStorage:', error)
    }
    return false
  }

  const saveToStorage = () => {
    if (!process.client) return
    
    try {
      const data: StoredEpicData = {
        epicIds: epicIds.value,
        epics: epics.value,
        timestamp: Date.now()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving epic data to localStorage:', error)
    }
  }

  const loadEpics = async () => {
    if (!isValidInput.value) return
    
    loading.value = true
    error.value = null
    epics.value = []
    
    try {
      const epicPromises = epicIdsList.value.map(id => apiService.getEpicById(id))
      const results = await Promise.allSettled(epicPromises)
      
      const loadedEpics: Epic[] = []
      const failedIds: number[] = []
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          loadedEpics.push(result.value)
        } else {
          failedIds.push(epicIdsList.value[index])
        }
      })
      
      epics.value = loadedEpics
      
      if (failedIds.length > 0) {
        error.value = `Failed to load epics: ${failedIds.join(', ')}`
      }

      // Save to localStorage after successful load
      saveToStorage()
    } catch (err) {
      error.value = 'Failed to load epics'
      console.error('Error loading epics:', err)
    } finally {
      loading.value = false
    }
  }

  const clearEpics = () => {
    epicIds.value = ''
    epics.value = []
    error.value = null
    
    // Clear from localStorage
    if (process.client) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const setEpicIds = (ids: string) => {
    epicIds.value = ids
    // Save epic IDs to localStorage immediately when they change
    saveToStorage()
  }

  const hydrate = () => {
    if (process.client && !isHydrated.value) {
      loadFromStorage()
      isHydrated.value = true
    }
  }

  return {
    epicIds: computed(() => epicIds.value),
    epics: computed(() => epics.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isHydrated: computed(() => isHydrated.value),
    epicIdsList,
    isValidInput,
    loadEpics,
    clearEpics,
    setEpicIds,
    loadFromStorage,
    saveToStorage,
    hydrate
  }
})