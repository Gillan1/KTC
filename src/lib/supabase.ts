'use client'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config'

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (_client) return _client
  _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'ktc-admin-session'
    }
  })
  return _client
}

// ============ أنواع المنتجات ============
export interface DbProduct {
  id: number
  name_ar: string
  name_en: string | null
  description_ar: string | null
  description_en: string | null
  price: number | null
  image_url: string
  category: string
  brand: string | null
  state: string | null  // الولاية - null يعني متوفر في كل الولايات
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

// ============ أنواع الفروع ============
export interface DbBranch {
  id: number
  name_ar: string
  name_en: string | null
  state: string
  address_ar: string | null
  address_en: string | null
  phone: string | null
  manager: string | null
  is_active: boolean
  sort_order: number
}

// ============ دوال المنتجات ============
export async function fetchProducts(stateFilter?: string): Promise<DbProduct[]> {
  const supabase = getSupabase()
  let query = supabase
    .from('ktc_products')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: false })
    .order('id', { ascending: true })

  if (stateFilter && stateFilter !== 'all') {
    // المنتجات المتوفرة في ولاية معينة + المنتجات العامة (state = null)
    query = query.or(`state.eq.${stateFilter},state.is.null`)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function insertProduct(
  product: Omit<DbProduct, 'id' | 'created_at' | 'updated_at' | 'is_active' | 'sort_order'>
): Promise<DbProduct> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('ktc_products')
    .insert({
      ...product,
      is_active: true,
      sort_order: 0
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateProduct(
  id: number,
  updates: Partial<DbProduct>
): Promise<DbProduct> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('ktc_products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProduct(id: number): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase.from('ktc_products').delete().eq('id', id)
  if (error) throw error
}

export async function deleteAllProducts(): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase.from('ktc_products').delete().neq('id', -1)
  if (error) throw error
}

// ============ دوال الفروع ============
export async function fetchBranches(): Promise<DbBranch[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('ktc_branches')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true })
  if (error) throw error
  return data || []
}

export async function insertBranch(
  branch: Omit<DbBranch, 'id' | 'is_active' | 'sort_order'>
): Promise<DbBranch> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('ktc_branches')
    .insert({
      ...branch,
      is_active: true,
      sort_order: 0
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteBranch(id: number): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase.from('ktc_branches').delete().eq('id', id)
  if (error) throw error
}

// ============ رفع الصور ============
export async function uploadProductImage(file: File): Promise<string> {
  const supabase = getSupabase()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
  const fileName = `ktc-product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('lc-product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    })
  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('lc-product-images').getPublicUrl(fileName)
  return data.publicUrl
}
