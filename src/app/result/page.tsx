'use client'

import { Box, Text, Button, VStack, HStack, Badge, Grid, GridItem, Image, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react"
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
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

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

  // シェア用のテキストを生成（140字以内、個人的な内容は含めない）
  const generateShareText = () => {
    if (!result || !fortuneTeller) return ""
    
    const siteUrl = 'https://tarot-app-kappa.vercel.app'
    
    // カードの意味を短縮（30文字以内）
    const cardMeaning = result.isReversed ? result.card.reversedMeaning : result.card.meaning
    const shortMeaning = cardMeaning.length > 30 
      ? cardMeaning.substring(0, 30) + '...'
      : cardMeaning
    
    const shareText = `🔮 AIタロット占いアプリ 🔮

${fortuneTeller.emoji} ${fortuneTeller.name}が解釈！

【引いたカード】${result.card.name} ${result.isReversed ? '逆位置' : '正位置'}
${shortMeaning}

7人の占い師があなたの悩みに寄り添います✨

${siteUrl}

#タロット占い #AI占い #タロットカード`

    return shareText
  }

  // Xでシェア
  const shareOnX = () => {
    const text = generateShareText()
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  // LINEでシェア
  const shareOnLine = () => {
    const text = generateShareText()
    const currentUrl = 'https://tarot-app-kappa.vercel.app'
    const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  // テキストをコピー
  const copyToClipboard = async () => {
    try {
      const text = generateShareText()
      await navigator.clipboard.writeText(text)
      toast({
        title: "コピーしました！",
        description: "占い結果をクリップボードにコピーしました",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch {
      toast({
        title: "コピーに失敗しました",
        description: "手動でコピーしてください",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  if (!result) {
    return (
      <Box textAlign="center" p={8}>
        <Text>結果を読み込み中...</Text>
      </Box>
    )
  }

  return (
    <VStack spacing={8} align="stretch" mx={{ base: 4, md: 10 }}>
      <Box textAlign="center">
        <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" mt={4} color="purple.600">
          AIタロット占い結果
        </Text>
        {fortuneTeller && (
          <HStack justify="center">
            <Text fontSize={{ base: "xl", md: "2xl" }}>{fortuneTeller.emoji}</Text>
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color="purple.600">
              {fortuneTeller.name}の解釈
            </Text>
          </HStack>
        )}
      </Box>

      <Grid 
        templateColumns={{ base: "1fr", md: "1fr 1fr" }} 
        gap={8} 
        minH="70vh"
      >
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
            <HStack spacing={6} align="start" direction={{ base: "column", md: "row" }}>
              {/* カード情報（画像・名前） */}
              <Box bg="purple.50" p={6} borderRadius="lg" border="1px" borderColor="purple.200" flex={1} display="flex" flexDirection={{ base: "column", md: "row" }} alignItems="start" gap={{ base: 4, md: 10 }} justifyContent="space-between">
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
                        maxW={{ base: "200px", md: "230px" }}
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

      <Box textAlign="center" pb="8">
        <VStack spacing={4}>
          <HStack spacing={4}>
            <Button
              colorScheme="purple"
              size="lg"
              onClick={handleNewReading}
            >
              もう一度占う
            </Button>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={onOpen}
            >
              結果をシェア
            </Button>
          </HStack>
        </VStack>
      </Box>

      {/* シェアモーダル */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>結果をシェア</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Text fontSize="md" color="gray.600" textAlign="center">
                占い結果をSNSでシェアしたり、テキストをコピーして友達に送ることができます。
              </Text>
              
              <HStack spacing={4} justify="center">
                <Button
                  bg="black"
                  color="white"
                  _hover={{ bg: "gray.800" }}
                  onClick={shareOnX}
                  minW="80px"
                >
                  <Text fontSize="lg">𝕏</Text>
                </Button>
                <Button
                  colorScheme="green"
                  leftIcon={<Text>💬</Text>}
                  onClick={shareOnLine}
                  minW="80px"
                >
                  LINE
                </Button>
                <Button
                  colorScheme="gray"
                  leftIcon={<Text>📋</Text>}
                  onClick={copyToClipboard}
                  minW="80px"
                >
                  コピー
                </Button>
              </HStack>

              <Box w="full" p={4} bg="gray.50" borderRadius="md">
                <Text fontSize="sm" color="gray.600" mb={2}>
                  シェア内容のプレビュー:
                </Text>
                <Text fontSize="xs" color="gray.700" whiteSpace="pre-wrap">
                  {generateShareText()}
                </Text>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );        
}
