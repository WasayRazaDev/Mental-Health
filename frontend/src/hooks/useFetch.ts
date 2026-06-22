import { useEffect, useState } from 'react'

export function useFetch<T>(fn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    fn()
      .then((res) => { if (!ignore) setData(res) })
      .catch((e) => { if (!ignore) setError(e) })
      .finally(() => { if (!ignore) setLoading(false) })
    return () => { ignore = true }
  }, deps)

  return { data, loading, error }
}
