import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@chakra-ui/react"
import { fortuneTellers } from "@server/tarot"
import type { Reading, FortuneTeller } from "@/types"
import { formatShareText } from "@/utils/share-text"
import { getShareXUrl, getShareLineUrl } from "@/utils/share-urls"
import { SESSION_STORAGE_KEYS } from "@/constants/session-storage"

export function useTarotResult() {
  const [result, setResult] = useState<Reading | null>(null)
  const [fortuneTeller, setFortuneTeller] = useState<FortuneTeller | null>(null)
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    const savedResult = sessionStorage.getItem(SESSION_STORAGE_KEYS.TAROT_RESULT)
    const savedFortuneTellerId = sessionStorage.getItem(SESSION_STORAGE_KEYS.SELECTED_FORTUNE_TELLER)
    
    if (!savedResult) {
      router.push('/pick-card')
      return
    }

    setResult(JSON.parse(savedResult))
    
    if (savedFortuneTellerId) {
      const teller = fortuneTellers.find(t => t.id === savedFortuneTellerId)
      if (teller) {
        setFortuneTeller(teller)
      }
    }
  }, [router])

  const startNewReading = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEYS.TAROT_RESULT)
    router.push('/')
  }

  const getShareText = () => {
    if (!result || !fortuneTeller) return ""
    return formatShareText({
      result,
      fortuneTeller,
      isPrivate: false
    })
  }

  const shareOnX = () => {
    const shareText = getShareText()
    if (!shareText) return
    window.open(getShareXUrl(shareText), '_blank')
  }

  const shareOnLine = () => {
    const shareText = getShareText()
    if (!shareText) return
    window.open(getShareLineUrl(shareText), '_blank')
  }

  const copyToClipboard = async () => {
    const shareText = getShareText()
    if (!shareText) return
    
    try {
      await navigator.clipboard.writeText(shareText)
      toast({
        title: "コピーしました！",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch {
      toast({
        title: "コピーに失敗しました",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return {
    result,
    fortuneTeller,
    startNewReading,
    shareOnX,
    shareOnLine,
    copyToClipboard
  }
}
