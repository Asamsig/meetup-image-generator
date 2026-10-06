import { useEffect, useState } from "react"

const PREFIX = "meetup-image-generator:"

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const storageKey = PREFIX + key
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      return stored === null ? initialValue : (JSON.parse(stored) as T)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value))
    } catch (error) {
      console.error(error)
      alert("Could not save to local storage. It might be full, try removing some custom templates or using smaller logos.")
    }
  }, [storageKey, value])

  return [value, setValue] as const
}
