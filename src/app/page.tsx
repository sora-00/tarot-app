'use client'

import { Text, Button, VStack, Textarea, FormControl, FormLabel, Select, Box } from "@chakra-ui/react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { fortuneTellers } from "../data/fortuneTellers"

export default function Home() {
  const [question, setQuestion] = useState("")
  const [selectedFortuneTeller, setSelectedFortuneTeller] = useState("miko")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

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

  const handleStartDivination = () => {
    if (!question.trim()) {
      alert("質問を入力してください")
      return
    }
    if (!selectedFortuneTeller) {
      alert("占い師を選択してください")
      return
    }
    // 質問と占い師をセッションストレージに保存してカード選択ページに遷移
    sessionStorage.setItem('tarotQuestion', question.trim())
    sessionStorage.setItem('selectedFortuneTeller', selectedFortuneTeller)
    router.push('/pick-card')
  }

  return (
    <Box 
      minHeight="100vh"
      py={8}
      px={4}
    >
      <VStack spacing={8} align="center" maxW="800px" mx="auto">
        <Text fontSize="4xl" fontWeight="bold" textAlign="center" color="purple.600">
          AIタロット占い
        </Text>
        
        <Text fontSize="lg" textAlign="center" color="gray.600">
          あなたの悩みや疑問をタロットカードに聞いてみませんか？
          <br />
          ChatGPTがあなたに寄り添った解釈を提供します。
        </Text>

        <FormControl>
          <FormLabel fontSize="lg" fontWeight="bold" textAlign="center">
            あなたのご質問を入力してください
          </FormLabel>
          <Box mb={2}>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              「○○はどうなりますか？」
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
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="ここにご質問を入力してください"
              size="lg"
              w="100%"
              maxW="700px"
              minH="100px"
              resize="none"
              overflowY="auto"
            />
          </Box>
        </FormControl>

        <FormControl>
          <FormLabel fontSize="lg" fontWeight="bold" textAlign="center">
            占い師を選択してください
          </FormLabel>
          <Box display="flex" justifyContent="center">
            <Select
              value={selectedFortuneTeller}
              onChange={(e) => setSelectedFortuneTeller(e.target.value)}
              size="lg"
              bg="white"
              w="100%"
              maxW="500px"
            >
              {fortuneTellers.map((teller) => (
                <option key={teller.id} value={teller.id}>
                  {teller.emoji} {teller.name} - {teller.description}
                </option>
              ))}
            </Select>
          </Box>
        </FormControl>
        <VStack spacing={4}>
          <Button 
            colorScheme="purple" 
            size="lg" 
            width="200px"
            onClick={handleStartDivination}
            isDisabled={!question.trim()}
          >
            カードを選ぶ
          </Button>
{/*           
          <Button 
            variant="outline" 
            colorScheme="purple" 
            size="lg" 
            width="200px"
            onClick={() => router.push('/mypage')}
          >
            マイページ
          </Button> */}
        </VStack>
      </VStack>
    </Box>
    );
}
