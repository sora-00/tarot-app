'use client'

import { VStack, Box } from "@chakra-ui/react"
import { QuestionForm } from "../ui/container/top/QuestionForm"
import { FortuneTellerSelect } from "../ui/container/top/FortuneTellerSelect"
import { StartButton } from "../ui/container/top/StartButton"
import { useTarotQuestion } from "../hooks/useTarotQuestion"
import { Title, Note } from "../ui/common/typography"

export default function Home() {
  const { question, setQuestion, selectedFortuneTeller, setSelectedFortuneTeller, handleStartDivination } = useTarotQuestion()

  return (
    <Box 
      minHeight="100vh"
      py={8}
      px={4}
    >
      <VStack spacing={8} align="center" maxW="800px" mx="auto">
        <Title>AIタロット占い</Title>
        <Note>
          あなたの悩みや疑問をタロットカードに聞いてみませんか？
          <br />
          ChatGPTがあなたに寄り添った解釈を提供します。
        </Note>

        <QuestionForm 
          question={question}
          onQuestionChange={setQuestion}
        />

        <FortuneTellerSelect 
          selectedFortuneTeller={selectedFortuneTeller}
          onFortuneTellerChange={setSelectedFortuneTeller}
        />

        <StartButton 
          onStartDivination={handleStartDivination}
          isDisabled={!question.trim()}
        />
      </VStack>
    </Box>
  )
}
