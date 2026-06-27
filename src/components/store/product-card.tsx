"use client"

import { useLanguage } from "@/hooks/use-language"
import { useProductStore, categories, type Product } from "@/store/product-store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"
import { motion } from "framer-motion"
import { asset } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  index: number
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { t, language } = useLanguage()
  const name = language === "ar" ? product.nameAr : product.nameEn
  const description = language === "ar" ? product.descriptionAr : product.descriptionEn
  const categoryInfo = categories.find((c) => c.id === product.category)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
    >
      <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted/30">
          <img
            src={asset(product.image)}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {categoryInfo && (
            <Badge className="absolute top-3 start-3 bg-emerald-600/90 text-white backdrop-blur-sm">
              {categoryInfo.icon} {language === "ar" ? categoryInfo.nameAr : categoryInfo.nameEn}
            </Badge>
          )}
          {product.brand && (
            <Badge className="absolute top-3 end-3 bg-amber-500/90 text-white backdrop-blur-sm">
              {product.brand}
            </Badge>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-base text-foreground mb-1 line-clamp-2">
            {name}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
              {description}
            </p>
          )}

          {/* Price */}
          <div className="mb-3">
            {product.price !== null ? (
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {product.price.toLocaleString()} {t.currency}
              </p>
            ) : (
              <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                {t.priceOnRequest}
              </p>
            )}
          </div>

          {/* WhatsApp contact button */}
          <a
            href="https://wa.me/249122011111"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              size="sm"
            >
              <Phone className="h-4 w-4 me-1.5" />
              {t.callUs}
            </Button>
          </a>
        </CardContent>
      </Card>
    </motion.div>
  )
}
