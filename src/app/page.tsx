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
    <VStack spacing={8} minH="100vh" justify="center" p={4}>
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
        onStartDivination={startDivination}
        isDisabled={!question.trim()}
      />
    </VStack>
  )
}
