import { Text, Textarea, FormControl, FormLabel, Box, Button } from "@chakra-ui/react"
import { useRef, useEffect } from "react"

type Props = {
  question: string
  onQuestionChange: (question: string) => void
  onReset?: () => void
}

export function QuestionForm(props: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // テキストエリアの自動リサイズ
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      // 画面の高さを考慮して最大高さを制限
      const maxHeight = Math.min(300, window.innerHeight * 0.4)
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px'
    }
  }, [props.question])

  return (
    <FormControl>
      <FormLabel fontSize={{ base: "md", md: "lg" }} fontWeight="bold" textAlign="center" px={2}>
        質問を入力してください
      </FormLabel>
      <Box mb={2} px={{ base: 2, md: 0 }}>
        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" textAlign="center" lineHeight="tall">
          「○○はどうなりますか？」「○○はどうしたらいいですか？」
        </Text>
        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" textAlign="center" lineHeight="tall" mt={1}>
          など、はいかいいえで答えられない質問で、より具体的なものになると効果的です。
        </Text>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2} w="100%" maxW="700px" mx="auto">
        <Box display="flex" justifyContent="center" w="100%">
          <Textarea
            ref={textareaRef}
            bg="white"
            value={props.question}
            onChange={(e) => props.onQuestionChange(e.target.value)}
            placeholder="ここに質問を入力してください"
            size="lg"
            w="100%"
            minH="100px"
            resize="none"
            overflowY="auto"
          />
        </Box>
        {props.onReset && (
          <Button
            size="sm"
            variant="ghost"
            colorScheme="gray"
            alignSelf="flex-end"
            onClick={props.onReset}
          >
            質問をリセット
          </Button>
        )}
      </Box>
    </FormControl>
  )
}
