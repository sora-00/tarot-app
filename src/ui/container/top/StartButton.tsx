import { Button, VStack } from "@chakra-ui/react"

interface StartButtonProps {
  onStartDivination: () => void
  isDisabled: boolean
}

export function StartButton({ onStartDivination, isDisabled }: StartButtonProps) {
  return (
    <VStack spacing={4}>
      <Button 
        colorScheme="purple" 
        size="lg" 
        width="200px"
        onClick={onStartDivination}
        isDisabled={isDisabled}
      >
        カードを選ぶ
      </Button>
    </VStack>
  )
}
