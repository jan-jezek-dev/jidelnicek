'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { MealType } from '@/lib/types'

const MEAL_TYPES: MealType[] = ['snídaně', 'oběd', 'večeře']

export default function NoveJidloPage() {
  const supabase = createClient()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', type: 'snídaně' as MealType, ingredients: '', instructions: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.ingredients.trim() || !form.instructions.trim()) {
      setError('Vyplň prosím všechna pole.')
      return
    }
    setSaving(true)
    const { error: err } = await supabase.from('meals').insert(form)
    if (err) { setError(err.message); setSaving(false); return }
    router.push('/jidla')
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Přidat nové jídlo</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Název jídla</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="např. Avokádový toast"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Typ jídla</label>
          <div className="flex gap-2">
            {MEAL_TYPES.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setForm(f => ({ ...f, type: t }))}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  form.type === t ? 'bg-green-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >{t}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ingredience</label>
          <textarea
            value={form.ingredients}
            onChange={e => setForm(f => ({ ...f, ingredients: e.target.value }))}
            placeholder="např. 2 vejce, 1 avokádo, 2 krajíce chleba..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Postup přípravy</label>
          <textarea
            value={form.instructions}
            onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))}
            placeholder="Krok za krokem, jak jídlo připravit..."
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 border border-gray-200 rounded-lg py-2 text-sm hover:bg-gray-50"
          >Zrušit</button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-green-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >{saving ? 'Ukládám…' : 'Uložit jídlo'}</button>
        </div>
      </form>
    </div>
  )
}
