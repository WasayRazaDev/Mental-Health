export default function CityFilter({ items, value = [], onChange, showTitle = true }: { items: [string, number][], value?: string[], onChange: (v: string[]) => void, showTitle?: boolean }) {
  return (
    <div>
      {showTitle && <h4 className="font-semibold mb-2">City</h4>}
      <div className="space-y-1 max-h-48 overflow-auto nice-scroll pr-1">
        {items.map(([city, count]) => (
          <label key={city} className="flex items-center gap-2 text-sm px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
            <input className="accent-primary" type="checkbox" checked={value.includes(city)} onChange={(e) => {
              const next = e.target.checked ? [...value, city] : value.filter(c => c !== city)
              onChange(next)
            }} />
            <span>{city} <span className="text-gray-500">({count})</span></span>
          </label>
        ))}
      </div>
    </div>
  )
}
