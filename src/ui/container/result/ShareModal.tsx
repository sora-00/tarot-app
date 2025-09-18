import { Text, Button, VStack, HStack, Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from "@chakra-ui/react"
import { TarotReading } from "../../../types/tarot"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  result: TarotReading
  fortuneTeller: { id: string; name: string; emoji: string; personality: string; speechStyle: string; example: string } | null
  onShareX: () => void
  onShareLine: () => void
  onCopyToClipboard: () => void
}

export function ShareModal({ 
  isOpen, 
  onClose, 
  result, 
  fortuneTeller, 
  onShareX, 
  onShareLine, 
  onCopyToClipboard 
}: ShareModalProps) {
  // シェア用のテキストを生成（140字以内、個人的な内容は含めない）
  const generateShareText = () => {
    if (!result || !fortuneTeller) return ""
    
    const siteUrl = 'https://tarot-app-kappa.vercel.app'
    
    // カードの意味を短縮（30文字以内）
    const cardMeaning = result.isReversed ? result.card.reversedMeaning : result.card.meaning
    const shortMeaning = cardMeaning.length > 30 
      ? cardMeaning.substring(0, 30) + '...'
      : cardMeaning
    
    const shareText = `🔮 AIタロット占いアプリ 🔮

${fortuneTeller.emoji} ${fortuneTeller.name}が解釈！

【引いたカード】${result.card.name} ${result.isReversed ? '逆位置' : '正位置'}
${shortMeaning}

7人の占い師があなたの悩みに寄り添います✨

${siteUrl}

#タロット占い #AI占い #タロットカード`

    return shareText
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
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
                onClick={onShareX}
                minW="80px"
              >
                <Text fontSize="lg">𝕏</Text>
              </Button>
              <Button
                colorScheme="green"
                leftIcon={<Text>💬</Text>}
                onClick={onShareLine}
                minW="80px"
              >
                LINE
              </Button>
              <Button
                colorScheme="gray"
                leftIcon={<Text>📋</Text>}
                onClick={onCopyToClipboard}
                minW="80px"
              >
                コピー
              </Button>
            </HStack>

            <Box w="full" p={4} bg="gray.50" borderRadius="md">
              <Text fontSize="sm" color="gray.600" mb={2}>
                シェア内容のプレビュー:
              </Text>
              <Text fontSize="xs" color="gray.700" whiteSpace="pre-wrap">
                {generateShareText()}
              </Text>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
