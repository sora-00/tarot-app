import { Text, Button, VStack, HStack, Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Switch, FormControl, FormLabel } from "@chakra-ui/react"
import type { Reading, FortuneTeller } from "@/types"
import { useShareModal } from "@/hooks/use-share-modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  result: Reading
  fortuneTeller: FortuneTeller | null
  onShareX: () => void
  onShareLine: () => void
  onCopyToClipboard: () => void
}

export function ShareModal(props: Props) {
  const { isPrivate, setIsPrivate, shareText } = useShareModal({
    result: props.result,
    fortuneTeller: props.fortuneTeller
  })

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>結果をシェア</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <Text fontSize="md" color="gray.600" textAlign="center">
              占い結果をSNSでシェアしたり、テキストをコピーして友達に送ることができます。
            </Text>
            
            <HStack spacing={4} justify="center">
              <Button
                bg="black"
                color="white"
                _hover={{ bg: "gray.800" }}
                onClick={props.onShareX}
                minW="80px"
              >
                <Text fontSize="lg">𝕏</Text>
              </Button>
              <Button
                colorScheme="green"
                leftIcon={<Text>💬</Text>}
                onClick={props.onShareLine}
                minW="80px"
              >
                LINE
              </Button>
              <Button
                colorScheme="gray"
                leftIcon={<Text>📋</Text>}
                onClick={props.onCopyToClipboard}
                minW="80px"
              >
                コピー
              </Button>
            </HStack>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb={0} fontSize="sm">
                詳細を表示
              </FormLabel>
              <Switch
                isChecked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                colorScheme="purple"
              />
            </FormControl>
            <Box w="full" p={4} bg="gray.50" borderRadius="md">
              <Text fontSize="sm" color="gray.600" mb={2}>
                シェア内容のプレビュー:
              </Text>
              <Text fontSize="xs" color="gray.700" whiteSpace="pre-wrap">
                {shareText}
              </Text>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
