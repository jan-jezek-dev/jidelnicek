'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { MealPlan } from '@/lib/types'

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

function parseIngredients(raw: string): string[] {
  // Rozdělí ingredience na čárky nebo nové řádky, ořeže whitespace, odstraní prázdné
  return raw
    .split(/,|\n/)
    .map(item => item.trim())
    .filter(item => item.length > 0)
}

// Klíč pro localStorage: nakupni-seznam-<YYYY-MM-DD pondělí aktuálního týdne>
function getLocalStorageKey(): string {
  const weekDates = getWeekDates()
  return `nakupni-seznam-${formatDate(weekDates[0])}`
}

function loadCheckedFromStorage(): Set<string> {
  try {
    const key = getLocalStorageKey()
    const raw = localStorage.getItem(key)
    if (!raw) return new Set()
    const arr = JSON.parse(raw)
    if (Array.isArray(arr)) return new Set<string>(arr)
  } catch {
    // localStorage nedostupný (SSR, private mode) nebo nevalidní JSON
  }
  return new Set()
}

function saveCheckedToStorage(checked: Set<string>): void {
  try {
    const key = getLocalStorageKey()
    localStorage.setItem(key, JSON.stringify(Array.from(checked)))
  } catch {
    // localStorage nedostupný — tiše ignorujeme
  }
}

export default function NakupniSeznam() {
  const supabase = createClient()
  const weekDates = getWeekDates()

  const [ingredients, setIngredients] = useState<string[]>([])
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [empty, setEmpty] = useState(false)
  const hasLoaded = useRef(false)

  // Načti checked stav z localStorage při mount
  useEffect(() => {
    setChecked(loadCheckedFromStorage())
    hasLoaded.current = true
  }, [])

  // Ulož checked stav do localStorage při každé změně — ale ne před načtením
  useEffect(() => {
    if (!hasLoaded.current) return
    saveCheckedToStorage(checked)
  }, [checked])

  useEffect(() => {
    async function loadData() {
      const { data, error: fetchError } = await supabase
        .from('meal_plan')
        .select('*, meal:meals(*)')
        .gte('planned_date', formatDate(weekDates[0]))
        .lte('planned_date', formatDate(weekDates[6]))

      if (fetchError) {
        setError(true)
        setLoading(false)
        return
      }

      const plans: MealPlan[] = data || []

      if (plans.length === 0) {
        setEmpty(true)
        setLoading(false)
        return
      }

      // Sloučíme všechny ingredience ze všech jídel
      const allIngredients: string[] = []
      for (const plan of plans) {
        if (plan.meal?.ingredients) {
          const items = parseIngredients(plan.meal.ingredients)
          allIngredients.push(...items)
        }
      }

      // Abecední řazení, bez duplicit (case-insensitive deduplicate)
      const unique = Array.from(
        new Map(allIngredients.map(i => [i.toLowerCase(), i])).values()
      ).sort((a, b) => a.localeCompare(b, 'cs'))

      if (unique.length === 0) {
        setEmpty(true)
      } else {
        setIngredients(unique)
      }

      setLoading(false)
    }

    loadData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleChecked = (item: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(item)) {
        next.delete(item)
      } else {
        next.add(item)
      }
      return next
    })
  }

  if (loading) {
    return <p className="text-gray-500">Načítám nákupní seznam…</p>
  }

  if (error) {
    return <p className="text-red-500">Nepodařilo se načíst data. Zkus to znovu.</p>
  }

  const unchecked = ingredients.filter(i => !checked.has(i))
  const checkedItems = ingredients.filter(i => checked.has(i))

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Nákupní seznam</h1>
      <p className="text-sm text-gray-500 mb-6">Ingredience z jídel naplánovaných tento týden</p>

      {empty ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Tento týden nemáš žádná naplánovaná jídla.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {/* Nezaškrtnuté položky */}
          {unchecked.map(item => (
            <label
              key={item}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={false}
                onChange={() => toggleChecked(item)}
                className="w-5 h-5 rounded border-gray-300 accent-green-600 cursor-pointer"
              />
              <span className="text-gray-800 text-sm">{item}</span>
            </label>
          ))}

          {/* Zaškrtnuté položky */}
          {checkedItems.map(item => (
            <label
              key={item}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={true}
                onChange={() => toggleChecked(item)}
                className="w-5 h-5 rounded border-gray-300 accent-green-600 cursor-pointer"
              />
              <span className="text-gray-400 text-sm line-through">{item}</span>
            </label>
          ))}
        </div>
      )}

      {!empty && checked.size > 0 && (
        <p className="mt-4 text-xs text-gray-400 text-right">
          {checked.size} z {ingredients.length} položek koupeno
        </p>
      )}
    </div>
  )
}
