import {useState, useEffect} from 'react'

const useSessionStorage = (key, {updateFrequency = 1000} = {}) => {
  const [value, setValue] = useState()

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
    const readFromSessionStorage = () => {
      const oldValue = value
      const newValue = sessionStorage.getItem(key)
      if (newValue !== oldValue) {
        setValue(newValue)
      }
    }

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
  }, [key, value, updateFrequency])

  return [value, writeToSessionStorage]
}

const useSessionStorageNoSync = key => {
  const [value, setValue] = useState()

  const readFromSessionStorage = () => {
    const oldValue = value
    const newValue = sessionStorage.getItem(key)
    if (newValue !== oldValue) {
      setValue(newValue)
    }
    return newValue
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

  return [readFromSessionStorage, writeToSessionStorage]
}

export default useSessionStorage

export {useSessionStorageNoSync}
