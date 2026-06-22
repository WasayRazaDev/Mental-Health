import { MapPin, User, Star } from 'lucide-react'
import { formatFee } from '@/utils/helpers'

type Therapist = {
  id: number
  name: string
  city?: string
  fee_amount?: number
  experience_years?: number
}

export default function TherapistCard({ t, onView }: { t: Therapist, onView: (id: number) => void }) {
  const starsFromExperience = (exp?: number) => {
    if (exp == null) return 0
    if (exp < 1) return 1
    if (exp < 3) return 2
    if (exp < 5) return 3
    if (exp < 10) return 4
    return 5
  }
  const stars = starsFromExperience(t.experience_years)
  return (
    <div className="rounded-lg border p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 flex flex-col gap-3 min-h-36 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300 dark:hover:border-gray-600">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
          <User size={20} />
        </div>
        <div>
          <h3 className="font-semibold">{t.name}</h3>
          <div className="flex items-center gap-0.5 mt-0.5" aria-label={stars ? `${stars} star rating` : 'No rating'}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} className={i < stars ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'} />
            ))}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
            <MapPin size={14} /> {t.city || '—'}
          </div>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-sm text-gray-700 dark:text-gray-200">{formatFee(t.fee_amount)}</span>
        <button className="text-primary text-sm" onClick={() => onView(t.id)}>View Details</button>
      </div>
    </div>
  )
}
