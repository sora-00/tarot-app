'use client'

import { Box, Text, Button, VStack, HStack, Badge, Grid, GridItem, Image } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TarotReading } from "../../types/tarot"
import { fortuneTellers } from "../../data/fortuneTellers"

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

export default function Result() {
  const [result, setResult] = useState<TarotReading | null>(null)
  const [fortuneTeller, setFortuneTeller] = useState<{ id: string; name: string; emoji: string; personality: string; speechStyle: string; example: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const savedResult = sessionStorage.getItem('tarotResult')
    const savedFortuneTellerId = sessionStorage.getItem('selectedFortuneTeller')
    
    if (savedResult) {
      setResult(JSON.parse(savedResult))
    } else {
      // 結果がない場合はカード選択ページにリダイレクト
      router.push('/pick-card')
    }
    
    if (savedFortuneTellerId) {
      const teller = fortuneTellers.find(t => t.id === savedFortuneTellerId)
      if (teller) {
        setFortuneTeller(teller)
      }
    }
  }, [router])

  const handleNewReading = () => {
    sessionStorage.removeItem('tarotResult')
    router.push('/')
  }

  if (!result) {
    return (
      <Box textAlign="center" p={8}>
        <Text>結果を読み込み中...</Text>
      </Box>
    )
  }

  return (
    <VStack spacing={8} align="stretch" mx={10}>
      <Box textAlign="center">
        <Text fontSize="3xl" fontWeight="bold" mt={4} color="purple.600">
          AIタロット占い結果
        </Text>
        {fortuneTeller && (
          <HStack justify="center">
            <Text fontSize="2xl">{fortuneTeller.emoji}</Text>
            <Text fontSize="lg" fontWeight="bold" color="purple.600">
              {fortuneTeller.name}の解釈
            </Text>
          </HStack>
        )}
      </Box>

      <Grid templateColumns="1fr 1fr" gap={8} minH="70vh">
        {/* 左半分: 質問・カード情報 */}
        <GridItem>
          <VStack spacing={6} align="stretch" h="full">
            {/* 質問 */}
            <Box bg="purple.50" p={6} borderRadius="lg" border="1px" borderColor="purple.200">
              <Text fontSize="lg" fontWeight="bold" mb={3} color="purple.700">
                あなたの質問
              </Text>
              <Text fontSize="md" color="gray.700" lineHeight="1.6">
                {result.question}
              </Text>
            </Box>

            {/* 選ばれたカードとカードの意味を横並び */}
            <HStack spacing={6} align="start">
              {/* カード情報（画像・名前） */}
              <Box bg="purple.50" p={6} borderRadius="lg" border="1px" borderColor="purple.200" flex={1} display="flex" flexDirection="row" alignItems="start" gap={10} justifyContent="space-between">
                <Box>
                    <Text fontSize="lg" fontWeight="bold" mb={4} color="purple.700">
                      選ばれたカード
                    </Text>
                    {/* カード名と位置 */}
                    <VStack spacing={2} align="start" display="flex" flexDirection="row" alignItems="end" gap={10} pb={4}>
                        <Box>
                            <Text fontSize="xl" fontWeight="bold" color="purple.800" textAlign="start">
                              {result.card.name}
                            </Text>
                            <Text fontSize="sm" color="gray.600" textAlign="start">
                              {result.card.nameEn}
                            </Text>
                        </Box>
                        <Box>
                            <Badge
                              colorScheme={result.isReversed ? "red" : "green"}
                              variant="solid"
                              fontSize="sm"
                              px={3}
                              py={1}
                            >
                              {result.isReversed ? "逆位置" : "正位置"}
                            </Badge>
                        </Box>
                      </VStack>
                    <Text fontSize="lg" fontWeight="bold" mb={3} color="purple.700">
                      カードの意味
                    </Text>
                    <Text fontSize="md" color="gray.700" lineHeight="1.6">
                      {result.isReversed ? result.card.reversedMeaning : result.card.meaning}
                    </Text>
                </Box>
                <VStack spacing={4} align="center">
                  {/* カード画像 */}
                  <Image
                    src={`/${getImageName(result.card.id)}.png`}
                    alt={result.card.name}
                    maxW="230px"
                    transform={result.isReversed ? "rotate(180deg)" : "none"}
                    transition="transform 0.3s ease"
                  />
                </VStack>
              </Box>

              
            </HStack>
          </VStack>
        </GridItem>

        {/* 右半分: 占い師の解釈 */}
        <GridItem>
          <Box bg="purple.50" p={6} borderRadius="lg" border="1px" borderColor="purple.200" h="full">
            <VStack spacing={4} align="stretch" h="full">
              <Box>
                  <Text 
                    fontSize="md" 
                    lineHeight="1.8"
                    color="gray.800"
                    whiteSpace="pre-wrap"
                  >
                    {result.interpretation}
                  </Text>
                </Box>
            </VStack>
          </Box>
        </GridItem>
      </Grid>

      <Box textAlign="center">
        <Button
          colorScheme="purple"
          size="lg"
          onClick={handleNewReading}
        >
          もう一度占う
        </Button>
      </Box>
    </VStack>
  );        
}
