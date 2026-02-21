import { Button, VStack } from "@chakra-ui/react"

type Props = {
  onStartDivination: () => void
  isDisabled: boolean
}

export function StartButton(props: Props) {
  return (
    <VStack spacing={4}>
      <Button 
        colorScheme="purple" 
        size="lg" 
        width="200px"
        onClick={props.onStartDivination}
        isDisabled={props.isDisabled}
      >
        カードを選ぶ
      </Button>
    </VStack>
  )
}
