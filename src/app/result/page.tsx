'use client'

import { Box, Text, useDisclosure } from "@chakra-ui/react"
import { ResultDisplay } from "@/components/container/result/ResultDisplay"
import { ShareModal } from "@/components/container/result/ShareModal"
import { useTarotResult } from "@/hooks/use-screen-tarot-result"

export default function Result() {
  const { result, fortuneTeller, startNewReading, shareOnX, shareOnLine, copyToClipboard } = useTarotResult()
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (!result) {
    return (
      <Box textAlign="center" p={8}>
        <Text>結果を読み込み中...</Text>
      </Box>
    )
  }

  return (
    <>
      <ResultDisplay
        result={result}
        fortuneTeller={fortuneTeller}
        onNewReading={startNewReading}
        onShare={onOpen}
      />
      <ShareModal
        isOpen={isOpen}
        onClose={onClose}
        result={result}
        fortuneTeller={fortuneTeller}
        onShareX={shareOnX}
        onShareLine={shareOnLine}
        onCopyToClipboard={copyToClipboard}
      />
    </>
  )
}
