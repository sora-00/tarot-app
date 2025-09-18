import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface CardAssignment {
  cardId: number
  isReversed: boolean
  isFlipped: boolean
}

export function useCardSelection() {
  const [question, setQuestion] = useState("")
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null)
  const [selectedCardReversed, setSelectedCardReversed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [cardAssignments, setCardAssignments] = useState<CardAssignment[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // セッションストレージから質問を取得
    const savedQuestion = sessionStorage.getItem('tarotQuestion')
    if (savedQuestion) {
      setQuestion(savedQuestion)
    } else {
      // 質問がない場合はメインページにリダイレクト
      router.push('/')
      return
    }

    // クライアントサイドでのみカードを配置（SSRハイドレーションエラーを防ぐ）
    const initializeCards = () => {
      // 現在時刻をシードとして使用してよりランダムに
      const seed = Date.now() + Math.random() * 1000
      
      // 22枚のカードを完全ランダムに配置
      const shuffledCards = [...Array(22)].map((_, index) => ({
        cardId: index,
        isReversed: (Math.random() + seed) % 1 < 0.5, // よりランダムで逆位置
        isFlipped: false // 最初はすべて裏面
      }))
      
      // 複数回シャッフルしてよりランダムに
      for (let shuffle = 0; shuffle < 3; shuffle++) {
        // Fisher-Yates シャッフル
        for (let i = shuffledCards.length - 1; i > 0; i--) {
          const j = Math.floor((Math.random() + seed + shuffle) % 1 * (i + 1));
          [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]]
        }
      }
      
      // 各カードの正位置/逆位置も再ランダム化
      shuffledCards.forEach(card => {
        card.isReversed = Math.random() < 0.5
      })
      
      setCardAssignments(shuffledCards)
      setIsInitialized(true)
    }

    // クライアントサイドでのみ実行
    initializeCards()
  }, [router])

  const handleCardClick = (index: number) => {
    const assignment = cardAssignments[index]
    if (assignment.isFlipped) return // 既にひっくり返っているカードは無視
    
    // 既にカードが選択されている場合は何もしない
    if (selectedCardId !== null) return
    
    // 新しいカードをひっくり返す
    setCardAssignments(prev => 
      prev.map((card, i) => 
        i === index ? { ...card, isFlipped: true } : card
      )
    )
    
    setSelectedCardId(assignment.cardId)
    setSelectedCardReversed(assignment.isReversed)
  }

  const handleViewResult = async () => {
    if (selectedCardId === null) {
      alert("カードを選択してください")
      return
    }

    setIsLoading(true)
    
    try {
      // セッションストレージから占い師タイプを取得
      const fortuneTellerId = sessionStorage.getItem('selectedFortuneTeller') || 'miko'
      
      const response = await fetch('/api/req', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.trim(),
          cardId: selectedCardId,
          isReversed: selectedCardReversed,
          fortuneTellerId: fortuneTellerId
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // 結果をセッションストレージに保存して結果ページに遷移
        sessionStorage.setItem('tarotResult', JSON.stringify(data.result))
        router.push('/result')
      } else {
        const code = data?.error?.code as string | undefined
        if (code) {
          console.error('Tarot API error code:', code, 'detail:', data)
        }
        const messageMap: Record<string, string> = {
          OPENAI_KEY_MISSING: '設定エラーにより現在占いを実行できません。時間をおいて再度お試しください。',
          BAD_REQUEST: '入力内容を確認してください。質問とカードが必要です。',
          INVALID_CARD_ID: 'カード情報が不正です。もう一度カードを選択してください。',
          OPENAI_API_ERROR: '占いサービスでエラーが発生しました。しばらくしてから再度お試しください。',
          UNKNOWN_ERROR: '不明なエラーが発生しました。時間をおいて再度お試しください。',
        }
        const uiMessage = (code && messageMap[code]) || data.error?.message || 'エラーが発生しました'
        alert(uiMessage)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    question,
    selectedCardId,
    selectedCardReversed,
    isLoading,
    cardAssignments,
    isInitialized,
    handleCardClick,
    handleViewResult
  }
}
