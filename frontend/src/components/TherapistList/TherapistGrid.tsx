import TherapistCard from '@/components/TherapistCard/TherapistCard'

export default function TherapistGrid({ items, onView }: { items: any[], onView: (id:number)=>void }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((t) => (
        <TherapistCard key={t.id} t={t} onView={onView} />
      ))}
    </div>
  )
}
