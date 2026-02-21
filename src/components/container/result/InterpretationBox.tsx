import { Box, Text, VStack } from "@chakra-ui/react"

type Props = {
  interpretation: string
}

export function InterpretationBox(props: Props) {
  return (
    <Box 
      bg="purple.50"
      p={6}
      borderRadius="lg"
      border="1px"
      borderColor="purple.200"
      h="full"
    >
      <VStack 
        spacing={4} 
        align="stretch" 
        h="full"
      >
        <Box>
          <Text 
            fontSize="md" 
            lineHeight="1.8"
            color="gray.800"
            whiteSpace="pre-wrap"
          >
            {props.interpretation}
          </Text>
        </Box>
      </VStack>
    </Box>
  )
}
