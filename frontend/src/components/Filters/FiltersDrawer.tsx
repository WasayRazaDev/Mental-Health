import { Dialog } from '@headlessui/react'
import CityFilter from './CityFilter'
import ExperienceFilter from './ExperienceFilter'
import GenderFilter from './GenderFilter'
import FeeFilter from './FeeFilter'
import ModeFilter from './ModeFilter'

export default function FiltersDrawer({ open, onClose, cities, genders, modes, values, onChange, onClear }: any) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50 lg:hidden">
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-black/30" onClick={onClose} />
        <div className="fixed inset-y-0 left-0 w-80 p-4 overflow-y-auto">
          <Dialog.Panel className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Filters</h3>
              <div className="flex items-center gap-2">
                <button className="text-sm text-primary hover:underline underline-offset-4" onClick={onClear}>Clear All</button>
                <button className="text-sm text-gray-600 dark:text-gray-300" onClick={onClose} aria-label="Close filters">Close</button>
              </div>
            </div>
            <div className="space-y-5">
              <CityFilter items={cities} value={values.cities} onChange={(v) => onChange('cities', v)} />
              <ExperienceFilter value={values.experienceRange} onChange={(v) => onChange('experienceRange', v)} />
              <GenderFilter value={values.genders} onChange={(v) => onChange('genders', v)} />
              <FeeFilter value={values.feeRange} onChange={(v) => onChange('feeRange', v)} />
              <ModeFilter value={values.modes} onChange={(v) => onChange('modes', v)} />
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}

