const OPTIONS = ['In-person', 'Virtual telephonic', 'Virtual video-based']

export default function ModeFilter({ value = [], onChange, showTitle = true }: { value?: string[], onChange: (v: string[]) => void, showTitle?: boolean }) {
  return (
    <div>
      {showTitle && <h4 className="font-semibold mb-2">Consultation Mode</h4>}
      <div className="space-y-1">
        {OPTIONS.map(m => (
          <label key={m} className="flex items-center gap-2 text-sm px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
            <input className="accent-primary" type="checkbox" checked={value.includes(m)} onChange={(e) => {
              const next = e.target.checked ? [...value, m] : value.filter(x => x !== m)
              onChange(next)
            }} />
            <span>{m}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
