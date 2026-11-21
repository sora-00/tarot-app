import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SESSION_STORAGE_KEYS } from "@/constants/session-storage"
import { QUESTION_MAX_LENGTH } from "@/constants/question"

export function useTarotQuestion() {
  const [question, setQuestionState] = useState("")
  const [selectedFortuneTeller, setSelectedFortuneTeller] = useState("miko")
  const router = useRouter()

  const setQuestion = (value: string) => {
    setQuestionState(value.slice(0, QUESTION_MAX_LENGTH))
  }

  // 「もう一度占う」でtopに戻ったときに相談内容を復元
  useEffect(() => {
    const savedQuestion = sessionStorage.getItem(SESSION_STORAGE_KEYS.TAROT_QUESTION)
    const savedFortuneTeller = sessionStorage.getItem(SESSION_STORAGE_KEYS.SELECTED_FORTUNE_TELLER)
    if (savedQuestion) setQuestion(savedQuestion)
    if (savedFortuneTeller) setSelectedFortuneTeller(savedFortuneTeller)
  }, [])

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
