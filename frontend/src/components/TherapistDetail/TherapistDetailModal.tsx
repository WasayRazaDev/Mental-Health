import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { User, MapPin, Mail, Phone, Link, GraduationCap, Briefcase, ChevronDown } from 'lucide-react'
import { formatFee } from '@/utils/helpers'

type CollapsibleProps = {
  title: React.ReactNode
  initialOpen?: boolean
  children: React.ReactNode
}

function CollapsibleSection({ title, initialOpen = false, children }: CollapsibleProps) {
  const [open, setOpen] = useState(initialOpen)
  return (
    <section className="pt-3 border-t border-gray-200 dark:border-gray-700">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</span>
        <ChevronDown size={18} className={open ? 'transition-transform rotate-180 text-gray-500' : 'transition-transform text-gray-500'} />
      </button>
      {open && <div className="mt-1">{children}</div>}
    </section>
  )
}

export default function TherapistDetailModal({ open, onClose, data }: any) {
  if (!data) return null
  const phoneHref = data.phone ? `tel:${String(data.phone).replace(/[^+\d]/g, '')}` : null
  
  const getGmailUrl = () => {
    if (!data.email) return null
    const subject = `Inquiry for therapy services`
    const body = `Hello ${data.name},\n\nI would like to inquire about your therapy services.\n\nBest regards,`
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(data.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const gmailHref = getGmailUrl()

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 grid place-items-center p-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg max-w-3xl w-full p-5">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Therapist Details</h3>
            <button onClick={onClose} className="text-sm text-primary">Close</button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {/* Left sidebar */}
            <aside className="md:col-span-1 flex flex-col justify-between">
              {/* Top: avatar, name, city, visit profile link */}
              <div className="flex items-center gap-3 md:block md:text-center">
                <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 mx-auto">
                  <User size={28} />
                </div>
                <div className="mt-2">
                  <div className="text-base font-semibold">{data.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1 md:justify-center">
                    <MapPin size={14} /> {data.city || '—'}
                  </div>
                  <div className="text-sm text-gray-800 dark:text-gray-100 flex items-center gap-1 md:justify-center mt-1">
                    <span>💰</span> <span>{formatFee(data.fee_amount)}</span>
                  </div>
                </div>
                {data.profile_url && (
                  <div className="mt-3 md:mt-4 md:text-center">
                    <a
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4"
                      href={data.profile_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Link size={16} /> View Profile
                    </a>
                  </div>
                )}
              </div>

              {/* Bottom-left: call & email quick actions on one line */}
              <div className="mt-6 flex items-center gap-2">
                {phoneHref && (
                  <a
                    href={phoneHref}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                    aria-label="Call therapist"
                  >
                    <Phone size={16} /> Call
                  </a>
                )}
                {gmailHref && (
                  <a
                    href={gmailHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                    aria-label="Email therapist via Gmail"
                  >
                    <Mail size={16} /> Email
                  </a>
                )}
              </div>
            </aside>

            {/* Right content */}
            <main className="md:col-span-2 space-y-4">
              {/* About stays expanded */}
              <section>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">About</h4>
                <p className="mt-1 text-sm text-gray-800 dark:text-gray-100 whitespace-pre-line">{data.about || '—'}</p>
              </section>

              {/* Collapsible sections */}
              <CollapsibleSection
                title={
                  <span className="inline-flex items-center gap-2"><Briefcase size={16} /> Experience</span>
                }
                initialOpen={false}
              >
                <p className="mt-1 text-sm text-gray-800 dark:text-gray-100">{data.experience_years != null ? `${data.experience_years} years` : '—'}</p>
                {data.experience && (
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line">{data.experience}</p>
                )}
              </CollapsibleSection>

              <CollapsibleSection
                title={
                  <span className="inline-flex items-center gap-2"><GraduationCap size={16} /> Education</span>
                }
                initialOpen={false}
              >
                <p className="mt-1 text-sm text-gray-800 dark:text-gray-100 whitespace-pre-line">{data.education || '—'}</p>
              </CollapsibleSection>

              <CollapsibleSection title="Expertise" initialOpen={false}>
                <p className="mt-1 text-sm text-gray-800 dark:text-gray-100 whitespace-pre-line">{data.expertise || '—'}</p>
              </CollapsibleSection>

              <CollapsibleSection title="Contact" initialOpen={false}>
                <div className="mt-1 text-sm text-gray-800 dark:text-gray-100 space-y-1">
                  <p><strong>Phone:</strong> {data.phone || '—'}</p>
                  <p><strong>Email:</strong> {data.email || '—'}</p>
                </div>
              </CollapsibleSection>
            </main>
          </div>
        </div>
      </div>
    </Dialog>
  )
}