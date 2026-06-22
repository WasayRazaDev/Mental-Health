const RANGES = [
  { key: '0-2000', label: 'Up to 2,000' },
  { key: '2000-4000', label: '2,000 - 4,000' },
  { key: '4000-6000', label: '4,000 - 6,000' },
  { key: '6000+', label: '6,000+' },
]

export default function FeeFilter({ value, onChange, showTitle = true }: { value?: string | null, onChange: (v: string | null) => void, showTitle?: boolean }) {
  return (
    <div>
      {showTitle && <h4 className="font-semibold mb-2">Fee Range</h4>}
      <div className="space-y-2">
        {RANGES.map(r => (
          <label key={r.key} className="flex items-center gap-2 text-sm px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
            <input className="accent-primary" type="radio" name="fee" checked={value === r.key} onChange={() => onChange(r.key)} />
            <span>{r.label}</span>
          </label>
        ))}
        <button className="text-xs text-primary mt-1" onClick={() => onChange(null)}>Clear</button>
      </div>
    </div>
  )
}
