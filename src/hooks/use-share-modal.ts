import { useState } from "react"
import type { Reading, FortuneTeller } from "@/types"
import { formatShareText } from "@/utils/share-text"

type UseShareModalParams = {
  result: Reading | null
  fortuneTeller: FortuneTeller | null
}

export function useShareModal({
  result,
  fortuneTeller
}: UseShareModalParams) {
  const [isPrivate, setIsPrivate] = useState(false)

  const shareText = !result || !fortuneTeller 
    ? "" 
    : formatShareText({
        result,
        fortuneTeller,
        isPrivate
      })

  return {
    isPrivate,
    setIsPrivate,
    shareText
  }
}