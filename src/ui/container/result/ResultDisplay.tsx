import { Box, Text, Button, VStack, HStack, Badge, Grid, GridItem, Image } from "@chakra-ui/react"
import { TarotReading } from "../../../types/tarot"
import { getTarotImageName } from "../../common/imageName"
import { Title2, Note2 } from "../../common/typography"

interface ResultDisplayProps {
  result: TarotReading
  fortuneTeller: { id: string; name: string; emoji: string; personality: string; speechStyle: string; example: string } | null
  onNewReading: () => void
  onShare: () => void
}

export function ResultDisplay({ result, fortuneTeller, onNewReading, onShare }: ResultDisplayProps) {
  return (
    <VStack spacing={8} align="stretch" mx={{ base: 4, md: 10 }}>
      <Box textAlign="center">
        <Title2 align="center">AIタロット占い結果</Title2>
        {fortuneTeller && (
          <HStack justify="center">
            <Text fontSize={{ base: "xl", md: "2xl" }}>{fortuneTeller.emoji}</Text>
            <Note2 align="center">{fortuneTeller.name}の解釈</Note2>
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
                    src={`/images/card-front/${getTarotImageName(result.card.id)}.png`}
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
              onClick={onNewReading}
            >
              もう一度占う
            </Button>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={onShare}
            >
              結果をシェア
            </Button>
          </HStack>
        </VStack>
      </Box>
    </VStack>
  )
}
