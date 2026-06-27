"use client"

import { useState } from "react"
import { useProductStore, categories, sudanStates, type Product, type Category } from "@/store/product-store"
import { useAuthStore } from "@/store/auth-store"
import { useLanguage } from "@/hooks/use-language"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Trash2, Package, Plus, CheckSquare, Square, Loader2, Building2 } from "lucide-react"
import { asset } from "@/lib/utils"

export function SettingsView() {
  const { products, branches, addProduct, deleteProduct, deleteMultipleProducts, deleteAllProducts, fetchBranches, uploadImage } = useProductStore()
  const { isAdmin } = useAuthStore()
  const { t, language } = useLanguage()

  const [nameAr, setNameAr] = useState("")
  const [nameEn, setNameEn] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState("")
  const [category, setCategory] = useState<Category>("solar")
  const [brand, setBrand] = useState("")
  const [state, setState] = useState("all")
  const [descAr, setDescAr] = useState("")
  const [uploading, setUploading] = useState(false)
  const [adding, setAdding] = useState(false)

  // Multi-select
  const [multiSelectMode, setMultiSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [deleteAllOpen, setDeleteAllOpen] = useState(false)

  if (!isAdmin) return null

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      if (url) {
        setImage(url)
        toast.success(t.productUpdated)
      } else {
        toast.error(language === "ar" ? "فشل رفع الصورة" : "Image upload failed")
      }
    } catch {
      toast.error(language === "ar" ? "فشل رفع الصورة" : "Image upload failed")
    }
    setUploading(false)
  }

  const handleAdd = async () => {
    if (!nameAr.trim()) {
      toast.error(language === "ar" ? "أدخل اسم المنتج" : "Enter product name")
      return
    }
    setAdding(true)
    const result = await addProduct({
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim() || nameAr.trim(),
      price: price ? parseFloat(price) : null,
      image: image || "/images/ktc/products/solar-panels-1.jpg",
      category,
      brand: brand.trim() || undefined,
      state: state === "all" ? null : state,
      descriptionAr: descAr.trim() || undefined,
    })
    setAdding(false)
    if (result) {
      toast.success(t.productAdded)
      setNameAr(""); setNameEn(""); setPrice(""); setImage("")
      setBrand(""); setDescAr("")
    } else {
      toast.error(language === "ar" ? "فشل الإضافة" : "Failed to add")
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(products.map((p) => p.id)))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    setBulkDeleting(true)
    const ids = Array.from(selectedIds)
    const result = await deleteMultipleProducts(ids)
    setBulkDeleting(false)
    if (result.failed === 0) {
      toast.success(language === "ar"
        ? `تم حذف ${result.success} منتج`
        : `Deleted ${result.success} products`)
    } else {
      toast.warning(`Deleted ${result.success}, failed ${result.failed}`)
    }
    setSelectedIds(new Set())
    setMultiSelectMode(false)
  }

  const handleDeleteAll = async () => {
    setBulkDeleting(true)
    const success = await deleteAllProducts()
    setBulkDeleting(false)
    setDeleteAllOpen(false)
    if (success) {
      toast.success(language === "ar" ? "تم حذف جميع المنتجات" : "All products deleted")
    } else {
      toast.error(language === "ar" ? "فشل الحذف" : "Failed")
    }
  }

  const allSelected = selectedIds.size === products.length && products.length > 0

  return (
    <div className="space-y-6 p-3 sm:p-4" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Add Product Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Plus className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-bold">{t.addProduct}</h2>
        </div>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>{t.productNameAr}</Label>
                <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} dir="rtl" placeholder="اسم المنتج بالعربي" />
              </div>
              <div className="space-y-1">
                <Label>{t.productNameEn}</Label>
                <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} dir="ltr" placeholder="Product name in English" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label>{t.price}</Label>
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="اتركه فارغ = عند الطلب" />
              </div>
              <div className="space-y-1">
                <Label>{t.category}</Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {language === "ar" ? c.nameAr : c.nameEn}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label>{t.brand}</Label>
                <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Honda, VAXSON..." />
              </div>
              <div className="space-y-1">
                <Label>{t.state}</Label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="all">{language === "ar" ? "كل الولايات" : "All States"}</option>
                  {sudanStates.map((s) => (
                    <option key={s.id} value={s.id}>{language === "ar" ? s.nameAr : s.nameEn}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <Label>{t.descriptionAr}</Label>
              <Input value={descAr} onChange={(e) => setDescAr(e.target.value)} dir="rtl" placeholder="وصف المنتج" />
            </div>

            <div className="space-y-1">
              <Label>{t.image}</Label>
              <div className="flex gap-2 items-center">
                <Input value={image} onChange={(e) => setImage(e.target.value)} dir="ltr" placeholder="/images/ktc/products/..." />
                <Label htmlFor="img-upload" className="cursor-pointer">
                  <Button variant="outline" asChild disabled={uploading}>
                    <span>{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.uploadImage}</span>
                  </Button>
                </Label>
                <input id="img-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            </div>

            <Button onClick={handleAdd} disabled={adding} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              {adding ? <Loader2 className="h-4 w-4 animate-spin me-2" /> : <Plus className="h-4 w-4 me-2" />}
              {t.addProduct}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Products list */}
      <div>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Package className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-bold">{t.products}</h2>
          <span className="text-sm text-muted-foreground">({products.length})</span>
        </div>

        {products.length > 0 && (
          <div className="p-3 rounded-xl bg-muted/30 border flex flex-wrap items-center gap-2 mb-3">
            <Button
              variant={multiSelectMode ? "default" : "outline"}
              size="sm"
              onClick={() => setMultiSelectMode(!multiSelectMode)}
              className={multiSelectMode ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {multiSelectMode ? <CheckSquare className="h-4 w-4 me-1" /> : <Square className="h-4 w-4 me-1" />}
              {t.multiSelect}
            </Button>
            {multiSelectMode && (
              <>
                <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                  {allSelected ? t.deselectAll : t.selectAll}
                </Button>
                <span className="text-sm text-muted-foreground ms-2">{selectedIds.size} selected</span>
                <div className="flex-1" />
                <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={selectedIds.size === 0 || bulkDeleting}>
                  {bulkDeleting ? <Loader2 className="h-4 w-4 me-1 animate-spin" /> : <Trash2 className="h-4 w-4 me-1" />}
                  {t.deleteSelected} ({selectedIds.size})
                </Button>
              </>
            )}
            {!multiSelectMode && (
              <>
                <div className="flex-1" />
                <Button variant="outline" size="sm" onClick={() => setDeleteAllOpen(true)} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4 me-1" />
                  {t.deleteAllProducts}
                </Button>
              </>
            )}
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-dashed">
            <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{t.noProducts}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {products.map((p) => (
              <Card key={p.id} className={`border-0 shadow-sm ${multiSelectMode && selectedIds.has(p.id) ? "ring-2 ring-blue-500" : ""}`}>
                <CardContent className="p-3 flex items-center gap-3">
                  {multiSelectMode && (
                    <Checkbox checked={selectedIds.has(p.id)} onCheckedChange={() => toggleSelect(p.id)} />
                  )}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted/30 flex-shrink-0">
                    <img src={asset(p.image)} alt={p.nameAr} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{p.nameAr}</p>
                    <p className="text-xs text-muted-foreground">{p.brand || ""} • {p.price ? `${p.price} ج.س` : t.priceOnRequest}</p>
                  </div>
                  {!multiSelectMode && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={async () => { await deleteProduct(p.id); toast.success(t.productDeleted) }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Branches section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-bold">{t.branches}</h2>
          <span className="text-sm text-muted-foreground">({branches.length})</span>
        </div>
        {branches.length === 0 ? (
          <div className="text-center py-8 rounded-xl border border-dashed">
            <Building2 className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{t.loading}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {branches.map((b) => (
              <Card key={b.id} className="border-0 shadow-sm">
                <CardContent className="p-3 flex items-center gap-3">
                  <Building2 className="h-8 w-8 text-emerald-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{b.nameAr}</p>
                    <p className="text-xs text-muted-foreground">{b.state}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete All confirmation */}
      <AlertDialog open={deleteAllOpen} onOpenChange={setDeleteAllOpen}>
        <AlertDialogContent dir={language === "ar" ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">{t.deleteAllProducts}</AlertDialogTitle>
            <AlertDialogDescription>
              {language === "ar"
                ? `سيتم حذف جميع المنتجات (${products.length}) نهائياً.`
                : `This will permanently delete all ${products.length} products.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkDeleting}>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAll} disabled={bulkDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {bulkDeleting ? <Loader2 className="h-4 w-4 me-2 animate-spin" /> : null}
              {t.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
