export default function EmptyState({ title = 'No results', subtitle = 'Try changing filters or search.' }: { title?: string, subtitle?: string }) {
  return (
    <div className="text-center text-sm text-gray-600 py-10">
      <p className="font-medium text-gray-800">{title}</p>
      <p>{subtitle}</p>
    </div>
  )
}
