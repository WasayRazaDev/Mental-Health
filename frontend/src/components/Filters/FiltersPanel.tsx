import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import CityFilter from './CityFilter'
import ExperienceFilter from './ExperienceFilter'
import GenderFilter from './GenderFilter'
import FeeFilter from './FeeFilter'
import ModeFilter from './ModeFilter'

function CollapsibleSection({ title, children, initialOpen = true }: { title: string, children: React.ReactNode, initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen)
  return (
    <section className="pt-3 border-t first:pt-0 first:border-t-0 border-gray-200 dark:border-gray-700">
      <button type="button" className="w-full flex items-center justify-between text-left" onClick={() => setOpen(s=>!s)} aria-expanded={open}>
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{title}</h4>
        <ChevronDown size={18} className={open ? 'transition-transform rotate-180 text-gray-500' : 'transition-transform text-gray-500'} />
      </button>
      {open && (
        <div className="mt-2">
          {children}
        </div>
      )}
    </section>
  )
}

export default function FiltersPanel({
  cities, genders, modes,
  values,
  onChange,
  onClear
}: {
  cities: [string, number][],
  genders: [string, number][],
  modes: [string, number][],
  values: any,
  onChange: (key: string, v: any) => void,
  onClear: () => void
}) {
  return (
    <aside className="hidden lg:block w-1/5 pr-4">
      <div className="sticky top-20">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button className="text-sm text-primary hover:underline underline-offset-4" onClick={onClear}>Clear All</button>
          </div>
          <div className="space-y-2">
            <CollapsibleSection title="City" initialOpen>
              <CityFilter items={cities} value={values.cities} onChange={(v) => onChange('cities', v)} showTitle={false} />
            </CollapsibleSection>
            <CollapsibleSection title="Experience" initialOpen>
              <ExperienceFilter value={values.experienceRange} onChange={(v) => onChange('experienceRange', v)} showTitle={false} />
            </CollapsibleSection>
            <CollapsibleSection title="Gender" initialOpen>
              <GenderFilter value={values.genders} onChange={(v) => onChange('genders', v)} showTitle={false} />
            </CollapsibleSection>
            <CollapsibleSection title="Fee Range" initialOpen>
              <FeeFilter value={values.feeRange} onChange={(v) => onChange('feeRange', v)} showTitle={false} />
            </CollapsibleSection>
            <CollapsibleSection title="Consultation Mode" initialOpen>
              <ModeFilter value={values.modes} onChange={(v) => onChange('modes', v)} showTitle={false} />
            </CollapsibleSection>
          </div>
        </div>
      </div>
    </aside>
  )
}

