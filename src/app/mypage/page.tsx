import React from 'react'
import { Container, Text, VStack } from "@chakra-ui/react"

export default function Mypage() {
  return (
    <Container 
      maxW="800px" 
      py={8}
      bg="rgba(255, 255, 255, 0.9)"
      borderRadius="lg"
      boxShadow="lg"
    >
      <VStack spacing={8} align="center">
        <Text fontSize="3xl" fontWeight="bold" textAlign="center" color="purple.600">
          マイページ
        </Text>
        <Text fontSize="lg" textAlign="center" color="gray.600">
          占いの履歴や設定を管理できます
        </Text>
      </VStack>
    </Container>
  )
}