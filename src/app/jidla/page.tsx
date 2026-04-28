'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Meal, MealType } from '@/lib/types'
import Link from 'next/link'

const MEAL_TYPES: MealType[] = ['snídaně', 'oběd', 'večeře']

const TYPE_COLORS: Record<MealType, string> = {
  'snídaně': 'bg-amber-100 text-amber-700',
  'oběd': 'bg-blue-100 text-blue-700',
  'večeře': 'bg-purple-100 text-purple-700',
}

export default function JidlaPage() {
  const supabase = createClient()
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<MealType | 'vše'>('vše')
  const [detail, setDetail] = useState<Meal | null>(null)

  useEffect(() => {
    supabase.from('meals').select('*').order('name').then(({ data }) => {
      setMeals(data || [])
      setLoading(false)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = filter === 'vše' ? meals : meals.filter(m => m.type === filter)

  if (loading) return <p className="text-gray-500">Načítám jídla…</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Jídla</h1>
        <Link href="/jidla/nove" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
          + Přidat jídlo
        </Link>
      </div>

      {/* Filtr */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['vše', ...MEAL_TYPES] as const).map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              filter === t ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >{t}</button>
        ))}
      </div>

      {/* Seznam */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(meal => (
          <button
            key={meal.id}
            onClick={() => setDetail(meal)}
            className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-green-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-800 leading-tight">{meal.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 capitalize ${TYPE_COLORS[meal.type as MealType]}`}>
                {meal.type}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2 line-clamp-2">{meal.ingredients}</p>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-gray-400 text-center py-12">Žádná jídla v této kategorii.</p>
      )}

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 my-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{detail.name}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${TYPE_COLORS[detail.type as MealType]}`}>
                  {detail.type}
                </span>
              </div>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600 text-xl ml-4">✕</button>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Ingredience</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{detail.ingredients}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Postup</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{detail.instructions}</p>
            </div>
            <div className="mt-6 flex gap-2">
              <Link
                href={`/jidla/${detail.id}`}
                className="flex-1 text-center border border-gray-200 rounded-lg py-2 text-sm hover:bg-gray-50"
              >Upravit</Link>
              <button onClick={() => setDetail(null)} className="flex-1 bg-green-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-green-700">
                Zavřít
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
