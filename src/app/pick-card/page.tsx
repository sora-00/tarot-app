'use client'

import { Box, Text, VStack } from "@chakra-ui/react"
import { CardCarousel } from "../../ui/container/pick-card/CardCarousel"
import { useCardSelection } from "../../hooks/use-card-selection"

export default function PickCard() {
  const { 
    question, 
    selectedCardId, 
    isLoading, 
    cardAssignments, 
    isInitialized, 
    handleCardClick, 
    handleViewResult 
  } = useCardSelection()

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
    <CardCarousel
      question={question}
      cardAssignments={cardAssignments}
      selectedCardId={selectedCardId}
      onCardClick={handleCardClick}
      onViewResult={handleViewResult}
      isLoading={isLoading}
    />
  )
}