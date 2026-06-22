import { useState } from 'react'
import { Menu, Sun, Moon } from 'lucide-react'
import Logo from './Logo'

export default function Header({ onOpenFilters }: { onOpenFilters: () => void }) {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState<string>(() => (document.documentElement.classList.contains('dark') ? 'dark' : 'light'))

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    if (next === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    try { localStorage.setItem('theme', next) } catch {}
  }
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Logo />
        <nav className="hidden md:flex items-center gap-2 text-sm">
          <a href="#home" className="px-3 py-1.5 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition-colors">Home</a>
          <a href="#find" className="px-3 py-1.5 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition-colors">Find Therapist</a>
          <a href="#contact" className="px-3 py-1.5 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition-colors">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <button className="hidden lg:inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="lg:hidden p-2" onClick={() => { setOpen(true); onOpenFilters() }} aria-label="Open filters">
            <Menu />
          </button>
        </div>
      </div>
    </header>
  )
}
