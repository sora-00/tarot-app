import { Box, Text, Button, VStack } from "@chakra-ui/react"
import type { MouseEvent } from "react"
import { motion } from "framer-motion"
import { tarotCards } from "@server/tarot"
import { FlipCard } from "@/components/common/FlipCard"
import { HorizontalScroller } from "@/components/common/HorizontalScroller"
import { Title, Note } from "@/components/common/typography"
import type { Card } from "@/types/card"
import { Spacer } from "@/components/common/Spacer"

const MotionBox = motion(Box)

type Props = {
  question: string
  cards: Card[]
  selectedCardId: string | null
  onClickCard: (cardId: string) => void
  onScreenResult: () => void
  isLoading: boolean
}

export function CardCarousel(props: Props) {

  const CARD_WIDTH = "160px"
  const CARD_HEIGHT = "280px"

  return (
    <VStack>
      <Box textAlign="center" p={8}>
        <Title>AIタロット占い</Title>
        <Note>あなたの質問: {props.question}</Note>
        <Spacer/>
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
        <HorizontalScroller>
          {props.cards.map((card) => {
            const isSelected = props.selectedCardId === card.id
            const cardData = tarotCards.find(c => c.id === card.id)
            if (!cardData) return null
            const imageName = card.id
            
            return (
              <MotionBox
                key={card.id}
                flexShrink={0}
                w={CARD_WIDTH}
                h={CARD_HEIGHT}
                position="relative"
                whileHover={!card.isFlipped ? { scale: 1.1 } : {}}
                whileTap={!card.isFlipped ? { scale: 0.95 } : {}}
                animate={{
                  scale: isSelected ? 1.15 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {/* カード情報*/}
                {isSelected && (
                  <MotionBox
                    position="absolute"
                    top="-60px"
                    left="17%"
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.3,
                      ease: "easeOut"
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
                      <Text>{cardData.name}</Text>
                      <Text fontSize="xs" opacity={0.9}>
                        {card.isReversed ? "逆位置" : "正位置"}
                      </Text>
                    </Box>
                  </MotionBox>
                )}
                {/* カード */}
                <Box
                  position="relative"
                  cursor={card.isFlipped ? "default" : (props.selectedCardId !== null ? "not-allowed" : "pointer")}
                  border={isSelected ? "3px solid" : "2px solid"}
                  borderColor={isSelected ? "purple.500" : "purple.300"}
                  borderRadius="lg"
                  p={1}
                  bg={isSelected ? "purple.100" : (props.selectedCardId !== null && !card.isFlipped ? "gray.100" : "white")}
                  boxShadow={isSelected ? "0 8px 25px rgba(147, 51, 234, 0.3)" : "0 4px 15px rgba(0, 0, 0, 0.1)"}
                  onClick={(e: MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation()
                    props.onClickCard(card.id)
                  }}
                  height="100%"
                  opacity={props.selectedCardId !== null && !card.isFlipped ? 0.6 : 1}
                >
                  <FlipCard
                    backSrc="/images/back.png"
                    frontSrc={`/images/card-front/${imageName}.png`}
                    isFlipped={card.isFlipped}
                    isReversed={card.isReversed}
                  />
                </Box>
              </MotionBox>
            )
          })}
        </HorizontalScroller>
      </Box>

      <Box py={8}>
        <Button
          colorScheme="purple"
          size="lg"
          onClick={props.onScreenResult}
          isLoading={props.isLoading}
          loadingText="占い中..."
          isDisabled={props.selectedCardId === null}
        >
          結果を見る
        </Button>
      </Box>
    </VStack>
  )
}
