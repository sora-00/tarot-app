'use client'

import { Box, Text, VStack, Container } from "@chakra-ui/react"

export default function FontTest() {
  return (
    <Container 
      maxW="800px" 
      py={8}
      bg="rgba(255, 255, 255, 0.9)"
      borderRadius="lg"
      boxShadow="lg"
    >
      <VStack spacing={4} align="start">
        <Text fontSize="2xl" fontWeight="bold">
          フォントテストページ
        </Text>
        
        <Text fontSize="lg" fontWeight="300">
          Light (300): Zen Maru Gothic Light
        </Text>
        
        <Text fontSize="lg" fontWeight="400">
          Regular (400): Zen Maru Gothic Regular
        </Text>
        
        <Text fontSize="lg" fontWeight="500">
          Medium (500): Zen Maru Gothic Medium
        </Text>
        
        <Text fontSize="lg" fontWeight="700">
          Bold (700): Zen Maru Gothic Bold
        </Text>
        
        <Text fontSize="lg" fontWeight="900">
          Black (900): Zen Maru Gothic Black
        </Text>
        
        <Box mt={8}>
          <Text fontSize="md" color="gray.600">
            このページでフォントが正しく表示されていれば、Zen Maru Gothicが適用されています。
          </Text>
        </Box>
      </VStack>
    </Container>
  )
}
