const OPTIONS = ['Male', 'Female']

export default function GenderFilter({ value = [], onChange, showTitle = true }: { value?: string[], onChange: (v: string[]) => void, showTitle?: boolean }) {
  return (
    <div>
      {showTitle && <h4 className="font-semibold mb-2">Gender</h4>}
      <div className="space-y-1">
        {OPTIONS.map(g => (
          <label key={g} className="flex items-center gap-2 text-sm px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
            <input
              type="radio"
              name="gender"
              className="accent-primary"
              checked={value.includes(g)}
              onChange={() => onChange([g])}
            />
            <span>{g}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
