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
    let readSessionStorageInterval
    if (window.sessionStorage) {
      readFromSessionStorage()
      readSessionStorageInterval = setInterval(
        readFromSessionStorage,
        updateFrequency
      ) 
    }
    return () => {
      if (window.sessionStorage) {
        clearInterval(readSessionStorageInterval)
      }
    }
  }, [])

  return [value, writeToSessionStorage]
}

export default useSessionStorage