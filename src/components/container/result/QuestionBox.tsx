import { Box, Text } from "@chakra-ui/react"

type Props = {
  question: string
}

export function QuestionBox(props: Props) {
  return (
    <Box
      bg="purple.50"
      p={6}
      borderRadius="lg"
      border="1px"
      borderColor="purple.200"
    >
      <Text fontSize="lg" fontWeight="bold" mb={3} color="purple.700">
        あなたの質問
      </Text>
      <Text fontSize="md" color="gray.700" lineHeight="1.6">
        {props.question}
      </Text>
    </Box>
  )
}
