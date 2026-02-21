'use client'

import { Box, Text, VStack } from "@chakra-ui/react"
import { CardCarousel } from "@/components/container/pick-card/CardCarousel"
import { useCardSelection } from "@/hooks/use-screen-card-selection"

export default function PickCard() {
  const { 
    question, 
    selectedCardId, 
    isLoading, 
    cards, 
    isInitialized, 
    onClickCard, 
    onScreenResult 
  } = useCardSelection()

  if (!isInitialized || cards.length === 0) {
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
    <CardCarousel
      question={question}
      cards={cards}
      selectedCardId={selectedCardId}
      onClickCard={onClickCard}
      onScreenResult={onScreenResult}
      isLoading={isLoading}
    />
  )
}