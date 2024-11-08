import { useState } from "react";

export default function useLocalStorage<T>(key: string, defaultValue?: unknown): [ T | null | undefined, (value: unknown) => void ] {
  const [storedValue, setStoredValue] = useState<T | undefined | null>(() => {
    try {
      const value = window.localStorage.getItem(key);
      if (value) {
        return JSON.parse(value);
      }

      // Value is empty. Set key with defaultValue if is set
      if (defaultValue) {
        window.localStorage.setItem(key, JSON.stringify(defaultValue));
      }
    } catch {
      return defaultValue;
    }
  });

  function setValue(value: unknown): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch(err) {
      console.error(err);
    }

    setStoredValue(value as T);
  }

  return [storedValue, setValue];
}