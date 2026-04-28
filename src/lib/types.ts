export type MealType = 'snídaně' | 'oběd' | 'večeře'

export interface Meal {
  id: number
  name: string
  type: MealType
  ingredients: string
  instructions: string
  user_id: string | null
  created_at: string
}

export interface MealPlan {
  id: number
  meal_id: number
  planned_date: string
  meal_type: MealType
  user_id: string | null
  created_at: string
  meal?: Meal
}
