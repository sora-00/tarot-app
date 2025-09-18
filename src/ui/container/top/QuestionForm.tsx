import { Text, Textarea, FormControl, FormLabel, Box } from "@chakra-ui/react"
import { useRef, useEffect } from "react"

interface QuestionFormProps {
  question: string
  onQuestionChange: (question: string) => void
}

export function QuestionForm({ question, onQuestionChange }: QuestionFormProps) {
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
  }, [question])

  return (
    <FormControl>
      <FormLabel fontSize="lg" fontWeight="bold" textAlign="center">
        質問を入力してください
      </FormLabel>
      <Box mb={2}>
        <Text fontSize="sm" color="gray.600" textAlign="center">
          「○○はどうなりますか？」「○○はどうしたらいいですか？」
        </Text>
        <Text fontSize="sm" color="gray.600" textAlign="center">
          など、はいかいいえで答えられない質問で、より具体的なものになると効果的です。
        </Text>
      </Box>
      <Box display="flex" justifyContent="center">
        <Textarea
          ref={textareaRef}
          bg="white"
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          placeholder="ここに質問を入力してください"
          size="lg"
          w="100%"
          maxW="700px"
          minH="100px"
          resize="none"
          overflowY="auto"
        />
      </Box>
    </FormControl>
  )
}
