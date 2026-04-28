import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jídelníček',
  description: 'Týdenní plánování zdravých jídel',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body className={`${geist.className} bg-gray-50 min-h-screen`}>
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 flex items-center gap-6 h-14">
            <Link href="/" className="font-semibold text-green-700 text-lg">🥗 Jídelníček</Link>
            <Link href="/" className="text-sm text-gray-600 hover:text-green-700">Týdenní plán</Link>
            <Link href="/jidla" className="text-sm text-gray-600 hover:text-green-700">Jídla</Link>
            <Link href="/nakupni-seznam" className="text-sm text-gray-600 hover:text-green-700">Nákupní seznam</Link>
            <Link href="/jidla/nove" className="ml-auto text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700">+ Přidat jídlo</Link>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}
