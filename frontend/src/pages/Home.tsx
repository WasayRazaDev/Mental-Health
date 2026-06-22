import { useEffect, useMemo, useState } from 'react'
import Header from '@/components/Header/Header'
import SearchBar from '@/components/SearchBar/SearchBar'
import FiltersPanel from '@/components/Filters/FiltersPanel'
import FiltersDrawer from '@/components/Filters/FiltersDrawer'
import TherapistGrid from '@/components/TherapistList/TherapistGrid'
import Pagination from '@/components/Pagination/Pagination'
import LoadingSkeleton from '@/components/UI/LoadingSkeleton'
import EmptyState from '@/components/UI/EmptyState'
import TherapistDetailModal from '@/components/TherapistDetail/TherapistDetailModal'
import { listTherapists, getFilters, getTherapist } from '@/services/api'
import { useDebounce } from '@/hooks/useDebounce'

export default function Home() {
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(12)
  const [search, setSearch] = useState('')
  const dSearch = useDebounce(search, 600)
  const [values, setValues] = useState<any>({ cities: [], genders: [], modes: [], feeRange: null, experienceRange: null })
  const dValues = useDebounce(values, 300)

  const [filtersData, setFiltersData] = useState<any>({ genders: [], cities: [], modes: [] })
  const [items, setItems] = useState<any[]>([])
  const [meta, setMeta] = useState<any>({ total: 0 })
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<any>(null)
  const [sort, setSort] = useState<string>('name')

  const buildParams = () => {
    const params: any = { page, size }
    const q = (dSearch || '').trim()
    if (q.length >= 2) params.search = q
    if (sort) params.sort = sort
    if (values.cities?.length) params.city = values.cities.join(',')
    if (values.genders?.length) params.gender = values.genders[0]
    if (values.modes?.length) params.mode = values.modes[0]
    // map fee range to min/max fee params
    if (values.feeRange) {
      const fr: string = values.feeRange
      if (fr.includes('+')) {
        const min = parseInt(fr.replace('+', ''), 10)
        if (!Number.isNaN(min)) params.min_fee = min
      } else if (fr.includes('-')) {
        const [minS, maxS] = fr.split('-')
        const min = parseInt(minS, 10)
        const max = parseInt(maxS, 10)
        if (!Number.isNaN(min)) params.min_fee = min
        if (!Number.isNaN(max)) params.max_fee = max
      }
    }
    // map experience range to min/max experience params
    if (values.experienceRange) {
      const er: string = values.experienceRange
      if (er.includes('+')) {
        const min = parseFloat(er.replace('+', ''))
        if (!Number.isNaN(min)) params.min_experience = min
      } else if (er.includes('-')) {
        const [minS, maxS] = er.split('-')
        const min = parseFloat(minS)
        const max = parseFloat(maxS)
        if (!Number.isNaN(min)) params.min_experience = min
        if (!Number.isNaN(max)) params.max_experience = max
      }
    }
    return params
  }

  const fetchList = async () => {
    setLoading(true)
    const params = buildParams()
    const res = await listTherapists(params)
    setItems(res.items)
    setMeta(res.meta)
    setLoading(false)
  }

  useEffect(() => { fetchList() }, [dSearch, page, size, dValues, sort])
  useEffect(() => {
    (async () => {
      const params = { ...buildParams() }
      // remove pagination for counts
      delete (params as any).page
      delete (params as any).size
      setFiltersData(await getFilters(params))
    })()
  }, [dSearch, dValues])

  const onChange = (key: string, v: any) => { setPage(1); setValues((s: any) => ({ ...s, [key]: v })) }

  const handlePageChange = (p: number) => {
    setPage(p)
    // On mobile, keep user near the results instead of jumping to top
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      const el = document.querySelector('#find') as HTMLElement | null
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div>
      <Header onOpenFilters={() => setOpen(true)} />

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden scroll-mt-20">
        {/* background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-white to-transparent dark:from-gray-900/60 dark:via-gray-900/40" />
        <div className="max-w-6xl mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-3xl animate-slideUp">
            <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Find a therapist you can trust.
            </h1>
            <p className="mt-3 text-base lg:text-lg text-gray-700 dark:text-gray-300">
              Search Pakistan’s mental health professionals by city, fees, experience, and consultation mode — all in one place.
            </p>
            <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-300 text-sm lg:text-base">
              <li className="flex items-start gap-2"><span>✅</span><span>Filter by city, fee range, gender, experience, and modes</span></li>
              <li className="flex items-start gap-2"><span>🔍</span><span>Fast, live search with smart debouncing</span></li>
              <li className="flex items-start gap-2"><span>🧑‍⚕️</span><span>Rich profiles with education, expertise, and contact</span></li>
            </ul>
            <div className="mt-6 flex items-center gap-3">
              <a href="#find" className="inline-flex items-center px-5 py-2.5 rounded-md bg-primary text-white hover:opacity-90 transition-opacity shadow-sm">Find Therapists</a>
              <a href="#contact" className="inline-flex items-center px-5 py-2.5 rounded-md border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </section>

      {/* Find Therapist Section */}
      <section id="find" className="scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="my-3 lg:hidden">
          <SearchBar onSearch={(q) => { setPage(1); setSearch(q) }} />
          <div className="mt-2 flex justify-end">
            <label htmlFor="sort-mobile" className="sr-only">Sort by</label>
            <select
              id="sort-mobile"
              className="text-sm border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
              value={sort}
              onChange={(e) => { setPage(1); setSort(e.target.value) }}
            >
              <option value="name">Name (A-Z)</option>
              <option value="-name">Name (Z-A)</option>
              <option value="fee">Fee (Low to High)</option>
              <option value="-fee">Fee (High to Low)</option>
              <option value="experience">Experience (Low to High)</option>
              <option value="-experience">Experience (High to Low)</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4">
          <FiltersPanel
            cities={filtersData.cities || []}
            genders={filtersData.genders || []}
            modes={filtersData.modes || []}
            values={values}
            onChange={onChange}
            onClear={() => setValues({ cities: [], genders: [], modes: [], feeRange: null, experienceRange: null })}
          />
          <main className="w-full lg:w-4/5">
            <div className="hidden lg:flex items-center justify-between mb-4">
              <div className="flex-1">
                <SearchBar onSearch={(q) => { setPage(1); setSearch(q) }} />
              </div>
              <div className="ml-3">
                <label htmlFor="sort" className="sr-only">Sort by</label>
                <select
                  id="sort"
                  className="text-sm border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                  value={sort}
                  onChange={(e) => { setPage(1); setSort(e.target.value) }}
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="-name">Name (Z-A)</option>
                  <option value="fee">Fee (Low to High)</option>
                  <option value="-fee">Fee (High to Low)</option>
                  <option value="experience">Experience (Low to High)</option>
                  <option value="-experience">Experience (High to Low)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm mb-3">
              <div>
                Showing {(items.length ? (page - 1) * size + 1 : 0)} - {(page - 1) * size + items.length} of {meta.total} therapists
              </div>
            </div>
            {loading && items.length === 0 ? (
              <LoadingSkeleton rows={6} />
            ) : items.length ? (
              <TherapistGrid items={items} onView={async (id) => { setDetail(await getTherapist(id)) }} />
            ) : (
              <EmptyState />
            )}
            <Pagination page={page} size={size} total={meta.total} onChange={handlePageChange} />
          </main>
        </div>
      </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="border-t border-gray-200 dark:border-gray-800 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contact</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Address */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Address</h3>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">MindCare Pvt. Ltd.</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">2nd Floor, Tech Park</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">F-8 Markaz, Islamabad, Pakistan</p>
            </div>
            {/* Contact */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Contact</h3>
              <ul className="mt-2 space-y-2 text-sm text-gray-800 dark:text-gray-100">
                <li><span className="font-semibold">Phone:</span> <a className="text-primary hover:underline" href="tel:+92511234567">+92 (51) 123-4567</a></li>
                <li><span className="font-semibold">Email:</span> <a className="text-primary hover:underline" href="mailto:hello@mindcare.example">hello@mindcare.example</a></li>
                <li><span className="font-semibold">Support:</span> <a className="text-primary hover:underline" href="mailto:support@mindcare.example">support@mindcare.example</a></li>
              </ul>
            </div>
            {/* Hours & Social */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Hours & Social</h3>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300"><span className="font-semibold">Hours:</span> Mon–Fri, 9:00 AM – 6:00 PM PKT</p>
              <div className="mt-3 flex items-center gap-3 text-sm">
                <a href="#" className="text-primary hover:underline">Facebook</a>
                <a href="#" className="text-primary hover:underline">Twitter</a>
                <a href="#" className="text-primary hover:underline">LinkedIn</a>
                <a href="#" className="text-primary hover:underline">Instagram</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FiltersDrawer open={open} onClose={() => setOpen(false)} cities={filtersData.cities || []} genders={filtersData.genders || []} modes={filtersData.modes || []} values={values} onChange={onChange} onClear={() => setValues({ cities: [], genders: [], modes: [], feeRange: null, experienceRange: null })} />
      <TherapistDetailModal open={!!detail} onClose={() => setDetail(null)} data={detail} />
    </div>
  )
}
