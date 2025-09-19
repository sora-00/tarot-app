import { Box, Text, Button, VStack, useMediaQuery } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { tarotCards } from "../../../data/tarotCards"
import { getTarotImageName } from "../../common/imageName"
import { FlipCard } from "../../common/FlipCard"
import { HorizontalDraggable } from "../../common/HorizontalDraggable"
import { Title, Note } from "../../common/typography"

interface CardAssignment {
  cardId: number
  isReversed: boolean
  isFlipped: boolean
}

interface CardCarouselProps {
  question: string
  cardAssignments: CardAssignment[]
  selectedCardId: number | null
  onCardClick: (index: number) => void
  onViewResult: () => void
  isLoading: boolean
}

export function CardCarousel({ 
  question, 
  cardAssignments, 
  selectedCardId, 
  onCardClick, 
  onViewResult, 
  isLoading 
}: CardCarouselProps) {
  const [isMobile] = useMediaQuery("(max-width: 767px)")

  return (
    <VStack align="stretch">
      <Box textAlign="center" p={8}>
        <Title>AIタロット占い</Title>
        <Note>あなたの質問: {question}</Note>
        <Text fontSize="md" color="gray.500">左右にスワイプしてカードを探し、直感で1枚を選んでください</Text>
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
                    onCardClick(index)
                  }}
                  height="100%"
                  zIndex={10}
                  opacity={selectedCardId !== null && !assignment.isFlipped ? 0.6 : 1}
                >
                  <FlipCard
                    backSrc="/images/back.png"
                    frontSrc={`/images/card-front/${imageName}.png`}
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
          onClick={onViewResult}
          isLoading={isLoading}
          loadingText="占い中..."
          isDisabled={selectedCardId === null}
        >
          結果を見る
        </Button>
      </Box>
    </VStack>
  )
}
