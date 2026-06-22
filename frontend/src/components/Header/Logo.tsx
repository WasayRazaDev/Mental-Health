import { Stethoscope } from 'lucide-react'

export default function Logo() {
  return (
    <div className="flex items-center gap-2 text-primary font-semibold text-lg">
      <Stethoscope size={22} />
      <span>MindCare Pakistan</span>
    </div>
  )
}
