'use client'

import { VStack } from "@chakra-ui/react"
import { QuestionForm } from "@/components/container/top/QuestionForm"
import { FortuneTellerSelect } from "@/components/container/top/FortuneTellerSelect"
import { StartButton } from "@/components/container/top/StartButton"
import { useTarotQuestion } from "@/hooks/use-screen-tarot-question"
import { Title, Note } from "@/components/common/typography"

export default function Home() {
  const { question, setQuestion, selectedFortuneTeller, setSelectedFortuneTeller, startDivination } = useTarotQuestion()

  return (
    <VStack spacing={{ base: 6, md: 8 }} minH="100vh" justify="center" p={{ base: 4, md: 6 }} px={{ base: 3, md: undefined }}>
      <Title>AIタロット占い</Title>
      <Note align="center">
        あなたの悩みや疑問をタロットカードに聞いてみませんか？
        <br />
        ChatGPTがあなたに寄り添った解釈を提供します。
      </Note>

      <QuestionForm 
        question={question}
        onQuestionChange={setQuestion}
        onReset={() => setQuestion("")}
      />

      <FortuneTellerSelect 
        selectedFortuneTeller={selectedFortuneTeller}
        onFortuneTellerChange={setSelectedFortuneTeller}
      />

      <StartButton 
        onStartDivination={startDivination}
        isDisabled={!question.trim()}
      />
    </VStack>
  )
}
