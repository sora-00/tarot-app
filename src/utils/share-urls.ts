import { APP_URL } from "@/constants/env"

export function getShareXUrl(text: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
}

export function getShareLineUrl(text: string, currentUrl?: string): string {
  const url = currentUrl || APP_URL
  return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
}
