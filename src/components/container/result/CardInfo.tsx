import { Box, Text, Badge, VStack, HStack } from "@chakra-ui/react"
import NextImage from "next/image"
import type { CardDetail } from "@/types"

type Props = {
  card: CardDetail
  isReversed: boolean
}

export function CardInfo(props: Props) {
  return (
    <Box 
      bg="purple.50" 
      p={6}
      borderRadius="lg"
      border="1px"
      borderColor="purple.200"
      flex={1}
      display="flex" 
      flexDirection={{ base: "column", md: "row" }}
      alignItems="start"
      gap={{ base: 4, md: 10 }} 
      justifyContent="space-between"
    >
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4} color="purple.700">
          選ばれたカード
        </Text>
        {/* カード名と位置 */}
        <HStack 
          spacing={10} 
          align="end" 
          pb={4}
        >
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="purple.800" textAlign="start">
              {props.card.name}
            </Text>
            <Text fontSize="sm" color="gray.600" textAlign="start">
              {props.card.nameEn}
            </Text>
          </Box>
          <Box>
            <Badge
              colorScheme={props.isReversed ? "red" : "green"}
              variant="solid"
              fontSize="sm"
              px={3}
              py={1}
            >
              {props.isReversed ? "逆位置" : "正位置"}
            </Badge>
          </Box>
        </HStack>
        <Text fontSize="lg" fontWeight="bold" mb={3} color="purple.700">
          カードの意味
        </Text>
        <Text fontSize="md" color="gray.700" lineHeight="1.6">
          {props.isReversed ? props.card.reversedMeaning : props.card.meaning}
        </Text>
      </Box>
      <VStack spacing={4} align="center">
        {/* カード画像 */}
        <Box 
          position="relative" 
          width={{ base: "200px", md: "230px" }} 
          height={{ base: "330px", md: "380px" }}
        >
          <NextImage
            src={`/images/card-front/${props.card.id}.png`}
            alt={props.card.name}
            fill
            sizes="(max-width: 767px) 200px, 230px"
            style={{ objectFit: "contain", transform: props.isReversed ? "rotate(180deg)" : "none" }}
            loading="lazy"
          />
        </Box>
      </VStack>
    </Box>
  )
}
