import { Text, Button, VStack, HStack, Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Switch, FormControl, FormLabel, useToast } from "@chakra-ui/react"
import type { Reading, FortuneTeller } from "@/types"
import { useShareModal } from "@/hooks/use-share-modal"
import { getShareXUrl, getShareLineUrl } from "@/utils/share-urls"

type Props = {
  isOpen: boolean
  onClose: () => void
  result: Reading
  fortuneTeller: FortuneTeller | null
}

export function ShareModal(props: Props) {
  const { isPrivate, setIsPrivate, shareText } = useShareModal({
    result: props.result,
    fortuneTeller: props.fortuneTeller
  })
  const toast = useToast()

  const shareXUrl = shareText ? getShareXUrl(shareText) : undefined
  const shareLineUrl = shareText ? getShareLineUrl(shareText) : undefined

  const handleCopyToClipboard = async () => {
    if (!shareText) return
    try {
      await navigator.clipboard.writeText(shareText)
      toast({
        title: "コピーしました！",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch {
      toast({
        title: "コピーに失敗しました",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

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
              {!isPrivate && (
                <>
                  <Button
                    as="a"
                    href={shareXUrl ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    bg="black"
                    color="white"
                    _hover={{ bg: "gray.800" }}
                    minW="80px"
                    isDisabled={!shareText}
                  >
                    <Text fontSize="lg">𝕏</Text>
                  </Button>
                  <Button
                    as="a"
                    href={shareLineUrl ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    colorScheme="green"
                    leftIcon={<Text>💬</Text>}
                    minW="80px"
                    isDisabled={!shareText}
                  >
                    LINE
                  </Button>
                </>
              )}
              <Button
                colorScheme="gray"
                leftIcon={<Text>📋</Text>}
                onClick={handleCopyToClipboard}
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
