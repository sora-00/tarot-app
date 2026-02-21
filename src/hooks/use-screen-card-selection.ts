import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Card } from "@/types/card"
import { tarotCards } from "@server/tarot"
import { postReading } from "@/repositories/read"
import { ReadError } from "@/repositories/read-error"
import { isApiError } from "@/repositories/cli/client"
import { shuffleArray } from "@/utils/card-shuffle"
import { SESSION_STORAGE_KEYS } from "@/constants/session-storage"

export function useCardSelection() {
  const [question, setQuestion] = useState("")
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [selectedCardReversed, setSelectedCardReversed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [cards, setCards] = useState<Card[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedQuestion = sessionStorage.getItem(SESSION_STORAGE_KEYS.TAROT_QUESTION)
    if (!savedQuestion) {
      router.push('/')
      return
    }
    setQuestion(savedQuestion)
  
    const cardIds = tarotCards.map(card => card.id)
    const shuffledIds = shuffleArray(cardIds)
    
    const shuffledCards = shuffledIds.map(id => ({
      id,
      isReversed: Math.random() < 0.5,
      isFlipped: false
    }))
    setCards(shuffledCards)
    setIsInitialized(true)
  }, [router])

  const onClickCard = (cardId: string) => {
    const card = cards.find(c => c.id === cardId)
    if (!card || card.isFlipped || selectedCardId !== null) {
      return
    }
    
    setCards(prev =>
      prev.map(c =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      ))
    
    setSelectedCardId(card.id)
    setSelectedCardReversed(card.isReversed)
  }

  const onScreenResult = async () => {
    if (selectedCardId === null) {
      return
    }

    setIsLoading(true)
    
    try {
      const fortuneTellerId = sessionStorage.getItem(SESSION_STORAGE_KEYS.SELECTED_FORTUNE_TELLER) || 'miko'
      const result = await postReading({
        question: question.trim(),
        cardId: selectedCardId,
        isReversed: selectedCardReversed,
        fortuneTellerId
      })
      
      sessionStorage.setItem(SESSION_STORAGE_KEYS.TAROT_RESULT, JSON.stringify(result))
      router.push('/result')
    } catch (error) {
        if (isApiError(error)) {
          alert(new ReadError(error.code, error.message).getUiMessage())
        } else {
          console.error(error)
          alert('エラーが発生しました')
        }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    question,
    selectedCardId,
    selectedCardReversed,
    isLoading,
    cards,
    isInitialized,
    onClickCard,
    onScreenResult
  }
}
