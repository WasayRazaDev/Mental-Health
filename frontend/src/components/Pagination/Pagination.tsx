import { ChevronLeft, ChevronRight } from 'lucide-react'
export default function Pagination({ page, size, total, onChange }: { page: number, size: number, total: number, onChange: (p:number)=>void }) {
  const pages = Math.ceil(total / size)
  if (pages <= 1) return null
  return (
    <div className="py-4 flex justify-center">
      <div className="inline-flex items-center gap-3 px-3 py-2 rounded-md border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
        <button
          className="p-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          disabled={page<=1}
          aria-label="Previous page"
          onClick={()=>onChange(page-1)}
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-200">
          Page <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium">{page}</span> of {pages}
        </span>
        <button
          className="p-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          disabled={page>=pages}
          aria-label="Next page"
          onClick={()=>onChange(page+1)}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
