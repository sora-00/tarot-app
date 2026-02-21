import { Box, Button, VStack, HStack } from "@chakra-ui/react"

type Props = {
  onNewReading: () => void
  onShare: () => void
}

export function ResultActions(props: Props) {
  return (
    <Box textAlign="center" pb="8">
      <VStack spacing={4}>
        <HStack spacing={4}>
          <Button
            colorScheme="purple"
            size="lg"
            onClick={props.onNewReading}
          >
            もう一度占う
          </Button>
          <Button
            colorScheme="blue"
            size="lg"
            onClick={props.onShare}
          >
            結果をシェア
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}
