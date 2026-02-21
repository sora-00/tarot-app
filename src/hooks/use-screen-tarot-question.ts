import { useState } from "react"
import { useRouter } from "next/navigation"
import { SESSION_STORAGE_KEYS } from "@/constants/session-storage"

export function useTarotQuestion() {
  const [question, setQuestion] = useState("")
  const [selectedFortuneTeller, setSelectedFortuneTeller] = useState("miko")
  const router = useRouter()

  const startDivination = () => {
    if (!question.trim() || !selectedFortuneTeller) {
      return
    }
    
    sessionStorage.setItem(SESSION_STORAGE_KEYS.TAROT_QUESTION, question.trim())
    sessionStorage.setItem(SESSION_STORAGE_KEYS.SELECTED_FORTUNE_TELLER, selectedFortuneTeller)
    router.push('/pick-card')
  }

  return {
    question,
    setQuestion,
    selectedFortuneTeller,
    setSelectedFortuneTeller,
    startDivination
  }
}
