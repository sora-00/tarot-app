'use client'

import { Box, Text, Button, VStack, Image, useMediaQuery } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { tarotCards } from "../../data/tarotCards"

interface CardAssignment {
  cardId: number
  isReversed: boolean
  isFlipped: boolean
}

// 画像ファイル名のマッピング
const getImageName = (cardId: number) => {
  const imageMap: { [key: number]: string } = {
    0: "the-foool",
    1: "magician", 
    2: "the-high-priestess",
    3: "the-empress",
    4: "the-emperor",
    5: "the-hierophant",
    6: "the-lovers",
    7: "the-chariot",
    8: "strength",
    9: "the-hermit",
    10: "whell-of-fortune",
    11: "justice",
    12: "the-hanged-man",
    13: "death",
    14: "temperance",
    15: "the-devil",
    16: "the-tower",
    17: "star",
    18: "the-moon",
    19: "the-sun",
    20: "judgement",
    21: "the-world"
  }
  return imageMap[cardId] || "back"
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
        alert(data.error?.message || 'エラーが発生しました')
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
          あなたのご質問: {question}
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
        <motion.div
          style={{
            display: "flex",
            height: "100%",
            alignItems: "center",
            gap: "20px",
            padding: "0 30px",
            cursor: "grab",
            width: "max-content",
            minWidth: "100%",
          }}
          drag="x"
          dragConstraints={{ 
            left: isMobile 
              ? -(cardAssignments.length * 168)
              : -(cardAssignments.length * 130),
            right: 0
          }}
          dragElastic={0.1}
          dragMomentum={true}
          dragPropagation={false}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
          whileDrag={{ cursor: "grabbing" }}
        >
            {cardAssignments.map((assignment, index) => {
              const isSelected = selectedCardId === assignment.cardId
              const card = tarotCards[assignment.cardId]
              const imageName = getImageName(assignment.cardId)
              
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
                    <Box
                      position="relative"
                      width="100%"
                      height="100%"
                      borderRadius="md"
                      overflow="hidden"
                      style={{ perspective: "1000px" }}
                    >
                      <motion.div
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "relative",
                          transformStyle: "preserve-3d"
                        }}
                        animate={{
                          rotateY: assignment.isFlipped ? 180 : 0,
                        }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      >
                        {/* 裏面 */}
                        <div
                          style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backfaceVisibility: "hidden",
                            transform: "rotateY(0deg)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Image
                            src="/back.png"
                            alt="タロットカード（裏面）"
                            width="100%"
                            height="100%"
                            objectFit="cover"
                            borderRadius="md"
                            style={{
                              width: "100%",
                              height: "100%"
                            }}
                          />
                        </div>
                        
                        {/* 表面 */}
                        <div
                          style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <motion.div
                            animate={{
                              rotate: assignment.isReversed ? 180 : 0,
                            }}
                            transition={{ duration: 0.3, delay: assignment.isFlipped ? 0.3 : 0 }}
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <Image
                              src={`/${imageName}.png`}
                              alt={card.name}
                              width="100%"
                              height="100%"
                              objectFit="contain"
                              borderRadius="md"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%"
                              }}
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    </Box>
                  </Box>
                </motion.div>
              )
            })}
        </motion.div>
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
