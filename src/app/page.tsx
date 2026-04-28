'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { Meal, MealPlan, MealType } from '@/lib/types'

const MEAL_TYPES: MealType[] = ['snídaně', 'oběd', 'večeře']

function getWeekDates(): Date[] {
  const today = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString('cs-CZ', { weekday: 'short', day: 'numeric', month: 'numeric' })
}

export default function Home() {
  const supabase = createClient()
  const weekDates = getWeekDates()

  const [mealPlan, setMealPlan] = useState<MealPlan[]>([])
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [adding, setAdding] = useState<{ date: string; mealType: MealType } | null>(null)
  const [selectedMealId, setSelectedMealId] = useState<number | ''>('')

  const loadData = useCallback(async () => {
    const [{ data: planData, error: planErr }, { data: mealsData, error: mealsErr }] = await Promise.all([
      supabase
        .from('meal_plan')
        .select('*, meal:meals(*)')
        .gte('planned_date', formatDate(weekDates[0]))
        .lte('planned_date', formatDate(weekDates[6])),
      supabase.from('meals').select('*').order('name'),
    ])
    if (planErr || mealsErr) { setLoadError(true); setLoading(false); return }
    setMealPlan(planData || [])
    setMeals(mealsData || [])
    setLoading(false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { loadData() }, [loadData])

  const getMealForSlot = (date: Date, mealType: MealType) =>
    mealPlan.find(p => p.planned_date === formatDate(date) && p.meal_type === mealType)

  const handleAddMeal = async () => {
    if (!adding || !selectedMealId) return
    await supabase.from('meal_plan').insert({
      meal_id: selectedMealId,
      planned_date: adding.date,
      meal_type: adding.mealType,
    })
    setAdding(null)
    setSelectedMealId('')
    loadData()
  }

  const handleRemove = async (id: number) => {
    await supabase.from('meal_plan').delete().eq('id', id)
    loadData()
  }

  if (loading) return <p className="text-gray-500">Načítám jídelníček…</p>
  if (loadError) return <p className="text-red-500">Nepodařilo se načíst data. Zkus to znovu.</p>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Týdenní jídelníček</h1>

      {/* Desktop tabulka */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-24 text-left p-2 text-sm font-medium text-gray-500"></th>
              {weekDates.map(d => (
                <th key={formatDate(d)} className="text-center p-2 text-sm font-medium text-gray-600 min-w-[120px]">
                  {formatDayLabel(d)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MEAL_TYPES.map(mealType => (
              <tr key={mealType} className="border-t border-gray-100">
                <td className="p-2 text-sm font-semibold text-gray-500 capitalize">{mealType}</td>
                {weekDates.map(date => {
                  const slot = getMealForSlot(date, mealType)
                  return (
                    <td key={formatDate(date)} className="p-1.5 align-top">
                      {slot ? (
                        <div className="bg-white rounded-lg border border-green-200 p-2 text-sm group relative">
                          <p className="font-medium text-gray-800 leading-tight">{slot.meal?.name}</p>
                          <button
                            onClick={() => handleRemove(slot.id)}
                            className="absolute top-1 right-1 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 text-xs"
                          >✕</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setAdding({ date: formatDate(date), mealType }); setSelectedMealId('') }}
                          className="w-full h-14 border-2 border-dashed border-gray-200 rounded-lg text-gray-300 hover:border-green-400 hover:text-green-500 text-xl transition-colors"
                        >+</button>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobilní karty */}
      <div className="md:hidden space-y-4">
        {weekDates.map(date => (
          <div key={formatDate(date)} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-green-50 px-4 py-2 border-b border-gray-100">
              <p className="font-semibold text-gray-700">{formatDayLabel(date)}</p>
            </div>
            <div className="divide-y divide-gray-50">
              {MEAL_TYPES.map(mealType => {
                const slot = getMealForSlot(date, mealType)
                return (
                  <div key={mealType} className="px-4 py-3 flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-16 capitalize shrink-0">{mealType}</span>
                    {slot ? (
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800">{slot.meal?.name}</span>
                        <button onClick={() => handleRemove(slot.id)} className="text-gray-300 hover:text-red-400 text-xs ml-2">✕</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setAdding({ date: formatDate(date), mealType }); setSelectedMealId('') }}
                        className="text-sm text-green-600 hover:underline"
                      >+ Přidat</button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Modal pro výběr jídla */}
      {adding && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="font-bold text-gray-800 mb-1">Vybrat jídlo</h2>
            <p className="text-sm text-gray-500 mb-4 capitalize">{adding.mealType}</p>
            <select
              value={selectedMealId}
              onChange={e => setSelectedMealId(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">— vyber jídlo —</option>
              {meals
                .filter(m => m.type === adding.mealType)
                .map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleAddMeal}
                disabled={!selectedMealId}
                className="flex-1 bg-green-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-40"
              >Přidat</button>
              <button
                onClick={() => setAdding(null)}
                className="flex-1 border border-gray-200 rounded-lg py-2 text-sm hover:bg-gray-50"
              >Zrušit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
