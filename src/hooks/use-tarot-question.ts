import { useState } from "react"
import { useRouter } from "next/navigation"

export function useTarotQuestion() {
  const [question, setQuestion] = useState("")
  const [selectedFortuneTeller, setSelectedFortuneTeller] = useState("miko")
  const router = useRouter()

  const handleStartDivination = () => {
    if (!question.trim()) {
      alert("質問を入力してください")
      return
    }
    if (!selectedFortuneTeller) {
      alert("占い師を選択してください")
      return
    }
    // 質問と占い師をセッションストレージに保存してカード選択ページに遷移
    sessionStorage.setItem('tarotQuestion', question.trim())
    sessionStorage.setItem('selectedFortuneTeller', selectedFortuneTeller)
    router.push('/pick-card')
  }

  return {
    question,
    setQuestion,
    selectedFortuneTeller,
    setSelectedFortuneTeller,
    handleStartDivination
  }
}
