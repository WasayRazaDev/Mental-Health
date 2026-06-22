const RANGES = [
  { key: '0-1', label: '0-1 years' },
  { key: '1-3', label: '1-3 years' },
  { key: '3-5', label: '3-5 years' },
  { key: '5-10', label: '5-10 years' },
  { key: '10+', label: '10+ years' },
]

export default function ExperienceFilter({ value, onChange, showTitle = true }: { value?: string | null, onChange: (v: string | null) => void, showTitle?: boolean }) {
  return (
    <div>
      {showTitle && <h4 className="font-semibold mb-2">Experience</h4>}
      <div className="space-y-2">
        {RANGES.map(r => (
          <label key={r.key} className="flex items-center gap-2 text-sm px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
            <input className="accent-primary" type="radio" name="exp" checked={value === r.key} onChange={() => onChange(r.key)} />
            <span>{r.label}</span>
          </label>
        ))}
        <button className="text-xs text-primary mt-1 hover:underline underline-offset-4" onClick={() => onChange(null)}>Clear</button>
      </div>
    </div>
  )
}
