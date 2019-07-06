import {useState, useEffect} from 'react'

const useSessionStorage = (key, {updateFrequency}) => {
  const [value, setValue] = useState()

  const readFromSessionStorage = () => {
    const oldValue = value
    const newValue = sessionStorage.getItem(key)
    if (newValue !== oldValue) {
      setValue(newValue)
    }
  }

  const writeToSessionStorage = newValue => {
    if (newValue !== undefined) {
      sessionStorage.setItem(key, newValue)
    }
    else {
      sessionStorage.removeItem(key)
    }
    setValue(newValue)
  }

  useEffect(() => {
    let readSessionStorageIntervalId
    if (window.sessionStorage) {
      readFromSessionStorage()
      readSessionStorageIntervalId = setInterval(
        readFromSessionStorage,
        updateFrequency
      )
    }
    return () => {
      if (window.sessionStorage) {
        clearInterval(readSessionStorageIntervalId)
      }
    }
  }, [])

  return [value, writeToSessionStorage]
}

export default useSessionStorage
