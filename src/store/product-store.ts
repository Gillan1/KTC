'use client'

import { create } from 'zustand'
import {
  fetchProducts as sbFetchProducts,
  fetchBranches as sbFetchBranches,
  insertProduct as sbInsertProduct,
  updateProduct as sbUpdateProduct,
  deleteProduct as sbDeleteProduct,
  deleteAllProducts as sbDeleteAllProducts,
  insertBranch as sbInsertBranch,
  deleteBranch as sbDeleteBranch,
  uploadProductImage,
  type DbProduct,
  type DbBranch
} from '@/lib/supabase'

// ============ أنواع المنتجات ============
export type Category = 'solar' | 'generators' | 'pumps' | 'mills' | 'equipment'

export const categories: { id: Category; nameAr: string; nameEn: string; icon: string; desc: string }[] = [
  { id: 'solar', nameAr: 'الطاقة الشمسية', nameEn: 'Solar Energy', icon: '☀️', desc: 'ألواح طاقة شمسية، Inverters، بطاريات ليثيوم' },
  { id: 'generators', nameAr: 'المولدات الكهربائية', nameEn: 'Generators', icon: '⚡', desc: 'مولدات كهربائية بقدرات مختلفة' },
  { id: 'pumps', nameAr: 'البابورات الزراعية', nameEn: 'Water Pumps', icon: '💧', desc: 'مضخات مياه للري الزراعي' },
  { id: 'mills', nameAr: 'المطاحن', nameEn: 'Grain Mills', icon: '🌾', desc: 'مطاحن حبوب وتوابل' },
  { id: 'equipment', nameAr: 'معدات أخرى', nameEn: 'Equipment', icon: '🔧', desc: 'مضخات هواء، دراجات كهربائية وأخرى' },
]

// ============ ولايات السودان ============
export const sudanStates: { id: string; nameAr: string; nameEn: string }[] = [
  { id: 'الخرطوم', nameAr: 'الخرطوم', nameEn: 'Khartoum' },
  { id: 'الولاية الشمالية', nameAr: 'الولاية الشمالية', nameEn: 'Northern State' },
  { id: 'الشرقية', nameAr: 'الشرقية', nameEn: 'Eastern State' },
  { id: 'القضارف', nameAr: 'القضارف', nameEn: 'Gedaref' },
  { id: 'الجزيرة', nameAr: 'الجزيرة', nameEn: 'Al Jazirah' },
  { id: 'النيل الأبيض', nameAr: 'النيل الأبيض', nameEn: 'White Nile' },
  { id: 'النيل الأزرق', nameAr: 'النيل الأزرق', nameEn: 'Blue Nile' },
  { id: 'سنار', nameAr: 'سنار', nameEn: 'Sennar' },
  { id: 'كردفان', nameAr: 'كردفان', nameEn: 'Kordofan' },
  { id: 'دارفور', nameAr: 'دارفور', nameEn: 'Darfur' },
  { id: 'غرب دارفور', nameAr: 'غرب دارفور', nameEn: 'West Darfur' },
  { id: 'شمال دارفور', nameAr: 'شمال دارفور', nameEn: 'North Darfur' },
  { id: 'جنوب دارفور', nameAr: 'جنوب دارفور', nameEn: 'South Darfur' },
  { id: 'شرق دارفور', nameAr: 'شرق دارفور', nameEn: 'East Darfur' },
  { id: 'الوسطى', nameAr: 'الوسطى', nameEn: 'Central' },
  { id: 'الغربية', nameAr: 'الغربية', nameEn: 'Western' },
]

export interface Product {
  id: string
  nameAr: string
  nameEn: string
  price: number | null
  image: string
  category: Category
  brand?: string
  state?: string | null
  descriptionAr?: string
  descriptionEn?: string
}

export interface Branch {
  id: string
  nameAr: string
  state: string
  addressAr?: string
  phone?: string
  manager?: string
}

// ============ تحويلات ============
function dbToProduct(p: DbProduct): Product {
  return {
    id: String(p.id),
    nameAr: p.name_ar,
    nameEn: p.name_en || p.name_ar,
    price: p.price !== null ? Number(p.price) : null,
    image: p.image_url,
    category: p.category as Category,
    brand: p.brand || undefined,
    state: p.state,
    descriptionAr: p.description_ar || undefined,
    descriptionEn: p.description_en || undefined,
  }
}

function dbToBranch(b: DbBranch): Branch {
  return {
    id: String(b.id),
    nameAr: b.name_ar,
    state: b.state,
    addressAr: b.address_ar || undefined,
    phone: b.phone || undefined,
    manager: b.manager || undefined,
  }
}

// ============ Zustand Store ============
interface ProductState {
  products: Product[]
  branches: Branch[]
  isLoading: boolean
  error: string | null
  lastFetch: number
  selectedState: string
  setSelectedState: (state: string) => void
  fetchProducts: (force?: boolean) => Promise<void>
  fetchBranches: (force?: boolean) => Promise<void>
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product | null>
  deleteProduct: (id: string) => Promise<boolean>
  deleteMultipleProducts: (ids: string[]) => Promise<{ success: number; failed: number }>
  deleteAllProducts: () => Promise<boolean>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>
  addBranch: (branch: Omit<Branch, 'id'>) => Promise<Branch | null>
  deleteBranch: (id: string) => Promise<boolean>
  uploadImage: (file: File) => Promise<string | null>
}

const CACHE_TTL_MS = 5 * 60 * 1000

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  branches: [],
  isLoading: false,
  error: null,
  lastFetch: 0,
  selectedState: 'all',

  setSelectedState: (state) => {
    set({ selectedState: state })
    // إعادة تحميل المنتجات مع الفلتر الجديد
    get().fetchProducts(true)
  },

  fetchProducts: async (force = false) => {
    const { lastFetch, isLoading, selectedState } = get()
    if (!force && isLoading) return
    if (!force && Date.now() - lastFetch < CACHE_TTL_MS && get().products.length > 0) return

    set({ isLoading: true, error: null })
    try {
      const data = await sbFetchProducts(selectedState !== 'all' ? selectedState : undefined)
      set({
        products: data.map(dbToProduct),
        isLoading: false,
        lastFetch: Date.now()
      })
    } catch (e) {
      console.error('fetchProducts error:', e)
      set({
        isLoading: false,
        error: e instanceof Error ? e.message : 'Failed to load products'
      })
    }
  },

  fetchBranches: async (force = false) => {
    if (!force && get().branches.length > 0) return

    try {
      const data = await sbFetchBranches()
      set({ branches: data.map(dbToBranch) })
    } catch (e) {
      console.error('fetchBranches error:', e)
    }
  },

  addProduct: async (product) => {
    try {
      const dbProduct = await sbInsertProduct({
        name_ar: product.nameAr,
        name_en: product.nameEn,
        description_ar: product.descriptionAr || null,
        description_en: product.descriptionEn || null,
        price: product.price,
        image_url: product.image,
        category: product.category,
        brand: product.brand || null,
        state: product.state || null,
      })
      const newProduct = dbToProduct(dbProduct)
      set((state) => ({ products: [newProduct, ...state.products] }))
      return newProduct
    } catch (e) {
      console.error('addProduct error:', e)
      return null
    }
  },

  deleteProduct: async (id) => {
    try {
      await sbDeleteProduct(Number(id))
      set((state) => ({ products: state.products.filter((p) => p.id !== id) }))
      return true
    } catch (e) {
      console.error('deleteProduct error:', e)
      return false
    }
  },

  deleteMultipleProducts: async (ids) => {
    let success = 0
    let failed = 0

    const results = await Promise.allSettled(
      ids.map((id) => sbDeleteProduct(Number(id)))
    )

    const successfulIds: string[] = []
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        success++
        successfulIds.push(ids[index])
      } else {
        failed++
      }
    })

    if (successfulIds.length > 0) {
      set((state) => ({
        products: state.products.filter((p) => !successfulIds.includes(p.id))
      }))
    }

    return { success, failed }
  },

  deleteAllProducts: async () => {
    try {
      await sbDeleteAllProducts()
      set({ products: [] })
      return true
    } catch (e) {
      console.error('deleteAllProducts error:', e)
      return false
    }
  },

  updateProduct: async (id, updates) => {
    try {
      const dbUpdates: Record<string, unknown> = {}
      if (updates.nameAr !== undefined) dbUpdates.name_ar = updates.nameAr
      if (updates.nameEn !== undefined) dbUpdates.name_en = updates.nameEn
      if (updates.descriptionAr !== undefined) dbUpdates.description_ar = updates.descriptionAr
      if (updates.price !== undefined) dbUpdates.price = updates.price
      if (updates.image !== undefined) dbUpdates.image_url = updates.image
      if (updates.category !== undefined) dbUpdates.category = updates.category
      if (updates.brand !== undefined) dbUpdates.brand = updates.brand
      if (updates.state !== undefined) dbUpdates.state = updates.state

      await sbUpdateProduct(Number(id), dbUpdates)
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        )
      }))
      return true
    } catch (e) {
      console.error('updateProduct error:', e)
      return false
    }
  },

  addBranch: async (branch) => {
    try {
      const dbBranch = await sbInsertBranch({
        name_ar: branch.nameAr,
        name_en: null,
        state: branch.state,
        address_ar: branch.addressAr || null,
        address_en: null,
        phone: branch.phone || null,
        manager: branch.manager || null,
      })
      const newBranch = dbToBranch(dbBranch)
      set((state) => ({ branches: [...state.branches, newBranch] }))
      return newBranch
    } catch (e) {
      console.error('addBranch error:', e)
      return null
    }
  },

  deleteBranch: async (id) => {
    try {
      await sbDeleteBranch(Number(id))
      set((state) => ({ branches: state.branches.filter((b) => b.id !== id) }))
      return true
    } catch (e) {
      console.error('deleteBranch error:', e)
      return false
    }
  },

  uploadImage: async (file) => {
    try {
      return await uploadProductImage(file)
    } catch (e) {
      console.error('uploadImage error:', e)
      return null
    }
  }
}))
