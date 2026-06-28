import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const BASE_PATH = "/KTC"

/**
 * إضافة basePath للصور والموارد الثابتة.
 * يجب استخدامها لكل مسار صورة يبدأ بـ /
 */
export function asset(path: string): string {
  if (!path) return ""
  // إذا كان URL كامل، أعد كما هو
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  // إذا كان data URL
  if (path.startsWith("data:")) return path
  // إزالة الـ / المكررة في البداية
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return `${BASE_PATH}${cleanPath}`
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
