import { useState, useEffect, useCallback } from "react";

const isString = (variable) =>
  typeof variable == "string" || variable instanceof String;

const clearObjectValues = (object) =>
  Object.fromEntries(Object.entries(object).map(([key]) => [key, null]));

const safeObjectValues = (object) =>
  Object.fromEntries(
    Object.entries(object).map(([key, value]) => [
      key,
      [undefined, null].includes(value) ? null : `${value}`,
    ])
  );

const updateObjectFromSessionStorage = (object) => {
  let newValues = {};
  let hasSomethingChanged = false;
  for (const [key] of Object.entries(object)) {
    const oldValue = object[key];
    const newValue = sessionStorage?.getItem?.(key);
    if (newValue !== oldValue) {
      newValues = { ...newValues, [key]: sessionStorage?.getItem?.(key) };
      hasSomethingChanged = true;
    }
  }

  if (!hasSomethingChanged) {
    return false;
  }

  return newValues;
};

const useSessionStorage = (keys, { syncFrequency = 0 } = {}) => {
  const isUsingMultipleKeys = !isString(keys);
  const initialValue = isUsingMultipleKeys ? clearObjectValues(keys) : null;
  const [value, setValue] = useState(initialValue);

  const readFromSessionStorage = useCallback(() => {
    if (isUsingMultipleKeys) {
      const newValues = updateObjectFromSessionStorage(value);
      if (newValues) {
        setValue({ ...value, ...newValues });
        return { ...value, ...newValues };
      }
      return value;
    } else {
      const oldValue = value;
      const newValue = sessionStorage?.getItem?.(keys);
      if (newValue !== oldValue) {
        setValue(newValue);
      }
      return newValue;
    }
  }, [isUsingMultipleKeys, keys, value]);

  const writeToSessionStorage = useCallback(
    (newValue) => {
      if (isUsingMultipleKeys) {
        for (const [updatedKey, updatedValue] of Object.entries(newValue)) {
          let safeUpdatedValue;
          if ([undefined, null].includes(updatedValue)) {
            safeUpdatedValue = null;
            sessionStorage?.removeItem?.(updatedKey);
          } else {
            safeUpdatedValue = `${updatedValue}`;
            sessionStorage?.setItem?.(updatedKey, safeUpdatedValue);
          }
        }
        setValue((previousValue) => {
          return { ...previousValue, ...safeObjectValues(newValue) };
        });
      } else {
        let safeUpdatedValue;
        if ([undefined, null].includes(newValue)) {
          safeUpdatedValue = null;
          sessionStorage?.removeItem?.(keys);
        } else {
          safeUpdatedValue = `${newValue}`;
          sessionStorage?.setItem?.(keys, safeUpdatedValue);
        }
        setValue(safeUpdatedValue);
      }
    },
    [isUsingMultipleKeys, keys]
  );

  useEffect(() => {
    const readSingleKeyFromSessionStorage = () => {
      const oldValue = value;
      const newValue = sessionStorage?.getItem?.(keys);
      if (newValue !== oldValue) {
        setValue(newValue);
      }
    };

    const readMultipleKeysFromSessionStorage = () => {
      const newValues = updateObjectFromSessionStorage(value);
      if (newValues) {
        setValue({ ...value, ...newValues });
      }
    };

    const readFromSessionStorage = isUsingMultipleKeys
      ? readMultipleKeysFromSessionStorage
      : readSingleKeyFromSessionStorage;

    let readSessionStorageIntervalId;
    readFromSessionStorage();
    if (syncFrequency > 0) {
      readSessionStorageIntervalId = setInterval(
        readFromSessionStorage,
        syncFrequency
      );
    }
    return () => {
      if (syncFrequency > 0) {
        clearInterval(readSessionStorageIntervalId);
      }
    };
  }, [keys, value, isUsingMultipleKeys, syncFrequency]);

  if (syncFrequency > 0) {
    return [readFromSessionStorage, writeToSessionStorage];
  }

  return [value, writeToSessionStorage];
};

export default useSessionStorage;
