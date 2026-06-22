export default function LoadingSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 min-h-44 animate-pulse"
        />
      ))}
    </div>
  )
}
