import { createContext, useContext, useMemo, useState } from 'react'

export type Filters = {
  search?: string
  cities?: string[]
  genders?: string[]
  modes?: string[]
  feeRange?: string | null
  experienceRange?: string | null
}

type FiltersCtx = {
  filters: Filters
  setFilters: (f: Filters) => void
  clearAll: () => void
}

const Ctx = createContext<FiltersCtx | null>(null)

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<Filters>({})
  const value = useMemo(() => ({
    filters,
    setFilters,
    clearAll: () => setFilters({})
  }), [filters])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useFilters() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useFilters must be used within FiltersProvider')
  return ctx
}
