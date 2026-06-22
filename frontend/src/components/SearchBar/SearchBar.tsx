import { useEffect, useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

export default function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [q, setQ] = useState('')
  const dq = useDebounce(q, 300)
  useEffect(() => { onSearch(dq) }, [dq])
  return (
    <div className="w-full">
      <input
        className="w-full border rounded-md px-4 py-2 bg-white text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
        placeholder="Search therapists, cities, expertise..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
    </div>
  )
}
