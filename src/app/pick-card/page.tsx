'use client'

import { Box, Text, Button, VStack, useMediaQuery } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { tarotCards } from "../../data/tarotCards"
import { getTarotImageName } from "../../ui/common/imageName"
import { FlipCard } from "../../ui/common/FlipCard"
import { HorizontalDraggable } from "../../ui/common/HorizontalDraggable"

interface CardAssignment {
  cardId: number
  isReversed: boolean
  isFlipped: boolean
}

export default function PickCard() {
  const [question, setQuestion] = useState("")
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null)
  const [selectedCardReversed, setSelectedCardReversed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [cardAssignments, setCardAssignments] = useState<CardAssignment[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()
  
  // スマホかパソコンかの判定
  const [isMobile] = useMediaQuery("(max-width: 767px)")

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

  if (!isInitialized || cardAssignments.length === 0) {
    return (
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Text fontSize="3xl" fontWeight="bold" mb={4} color="purple.600">
            AIタロット占い
          </Text>
          <Text fontSize="lg" color="gray.600" mb={4}>
            あなたの質問: {question}
          </Text>
        </Box>
        <Box textAlign="center" p={8}>
          <Text fontSize="lg">カードを準備中...</Text>
        </Box>
      </VStack>
    )
  }

  return (
    <VStack  align="stretch">
      <Box textAlign="center" p={8}>
        <Text fontSize="3xl" fontWeight="bold" mb={4} color="purple.600">
          AIタロット占い
        </Text>
        <Text fontSize="lg" color="gray.600" mb={4}>
          あなたの質問: {question}
        </Text>
        <Text fontSize="md" color="gray.500">
          左右にスワイプしてカードを探し、直感で1枚を選んでください
        </Text>
      </Box>

      <Box
        position="relative"
        width="80%"
        height="500px"
        bg="rgba(255, 255, 255, 0.1)"
        borderRadius="lg"
        border="2px solid"
        borderColor="purple.200"
        overflow="hidden"
        mx="auto"
      >
        <HorizontalDraggable widthPx={160} itemCount={cardAssignments.length} isMobile={isMobile}>
            {cardAssignments.map((assignment, index) => {
              const isSelected = selectedCardId === assignment.cardId
              const card = tarotCards[assignment.cardId]
              const imageName = getTarotImageName(assignment.cardId)
              
              return (
                <motion.div
                  key={index}
                  whileHover={!assignment.isFlipped ? { scale: 1.1 } : {}}
                  whileTap={!assignment.isFlipped ? { scale: 0.95 } : {}}
                  animate={{
                    scale: isSelected ? 1.15 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    flexShrink: 0,
                    width: "160px",
                    height: "280px",
                    position: "relative"
                  }}
                >
                  {/* カード選択時の情報表示 */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 0.3,
                        ease: "easeOut"
                      }}
                      style={{
                        position: "absolute",
                        top: "-60px",
                        left: "17%",
                        transform: "translateX(-50%)",
                        zIndex: 20
                      }}
                    >
                      <Box
                        bg="purple.600"
                        color="white"
                        px={3}
                        py={2}
                        borderRadius="md"
                        fontSize="sm"
                        fontWeight="bold"
                        textAlign="center"
                        whiteSpace="nowrap"
                        boxShadow="0 4px 12px rgba(147, 51, 234, 0.3)"
                        w="100px"
                      >
                        <Text>{card.name}</Text>
                        <Text fontSize="xs" opacity={0.9}>
                          {assignment.isReversed ? "逆位置" : "正位置"}
                        </Text>
                      </Box>
                    </motion.div>
                  )}
                  <Box
                    position="relative"
                    cursor={assignment.isFlipped ? "default" : (selectedCardId !== null ? "not-allowed" : "pointer")}
                    border={isSelected ? "3px solid" : "2px solid"}
                    borderColor={isSelected ? "purple.500" : "purple.300"}
                    borderRadius="lg"
                    p={1}
                    bg={isSelected ? "purple.100" : (selectedCardId !== null && !assignment.isFlipped ? "gray.100" : "white")}
                    boxShadow={isSelected ? "0 8px 25px rgba(147, 51, 234, 0.3)" : "0 4px 15px rgba(0, 0, 0, 0.1)"}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCardClick(index)
                    }}
                    height="100%"
                    zIndex={10}
                    opacity={selectedCardId !== null && !assignment.isFlipped ? 0.6 : 1}
                  >
                    <FlipCard
                      backSrc="/back.png"
                      frontSrc={`/${imageName}.png`}
                      isFlipped={assignment.isFlipped}
                      isReversed={assignment.isReversed}
                    />
                  </Box>
                </motion.div>
              )
            })}
        </HorizontalDraggable>
      </Box>


      <Box textAlign="center" py={8}>
        <Button
          colorScheme="purple"
          size="lg"
          onClick={handleViewResult}
          isLoading={isLoading}
          loadingText="占い中..."
          isDisabled={selectedCardId === null}
        >
          結果を見る
        </Button>
      </Box>
      </VStack>
  );
}
