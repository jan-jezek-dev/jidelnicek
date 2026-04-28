'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Meal, MealType } from '@/lib/types'

const MEAL_TYPES: MealType[] = ['snídaně', 'oběd', 'večeře']

export default function EditJidloPage() {
  const supabase = createClient()
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)

  const [form, setForm] = useState<Partial<Meal>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('meals').select('*').eq('id', id).single().then(({ data }) => {
      if (data) setForm(data)
      setLoading(false)
    })
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error: err } = await supabase.from('meals').update({
      name: form.name,
      type: form.type,
      ingredients: form.ingredients,
      instructions: form.instructions,
    }).eq('id', id)
    if (err) { setError(err.message); setSaving(false); return }
    router.push('/jidla')
  }

  const handleDelete = async () => {
    if (!confirm('Opravdu smazat toto jídlo?')) return
    await supabase.from('meals').delete().eq('id', id)
    router.push('/jidla')
  }

  if (loading) return <p className="text-gray-500">Načítám…</p>

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Upravit jídlo</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Název jídla</label>
          <input
            type="text"
            value={form.name || ''}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
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
            value={form.ingredients || ''}
            onChange={e => setForm(f => ({ ...f, ingredients: e.target.value }))}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Postup přípravy</label>
          <textarea
            value={form.instructions || ''}
            onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))}
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 border border-red-200 text-red-500 rounded-lg py-2 text-sm hover:bg-red-50"
          >Smazat</button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 border border-gray-200 rounded-lg py-2 text-sm hover:bg-gray-50"
          >Zrušit</button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-green-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >{saving ? 'Ukládám…' : 'Uložit'}</button>
        </div>
      </form>
    </div>
  )
}
