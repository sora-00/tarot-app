import { Box, Text, VStack, HStack, Grid, GridItem } from "@chakra-ui/react"
import type { Reading, FortuneTeller } from "@/types"
import { Title2, Note2 } from "@/components/common/typography"
import { QuestionBox } from "./QuestionBox"
import { CardInfo } from "./CardInfo"
import { InterpretationBox } from "./InterpretationBox"
import { ResultActions } from "./ResultActions"

type Props = {
  result: Reading
  fortuneTeller: FortuneTeller | null
  onNewReading: () => void
  onShare: () => void
}

export function ResultDisplay(props: Props) {
  return (
    <VStack spacing={8} mx={{ base: 4, md: 10 }}>
      <Box textAlign="center">
        <Title2 align="center">AIタロット占い結果</Title2>
        {props.fortuneTeller && (
          <HStack justify="center">
            <Text fontSize={{ base: "xl", md: "2xl" }}>{props.fortuneTeller.emoji}</Text>
            <Note2 align="center">{props.fortuneTeller.name}の解釈</Note2>
          </HStack>
        )}
      </Box>

      <Grid 
        templateColumns={{ base: "1fr", md: "1fr 1fr" }} 
        gap={8} 
        minH="70vh"
      >
        {/* 左半分: 質問・カード情報 */}
        <GridItem>
          <VStack spacing={6} align="stretch" h="full">
            <QuestionBox question={props.result.question} />
            <CardInfo card={props.result.card} isReversed={props.result.isReversed} />
          </VStack>
        </GridItem>

        {/* 右半分: 占い師の解釈 */}
        <GridItem>
          <InterpretationBox interpretation={props.result.interpretation} />
        </GridItem>
      </Grid>

      <ResultActions 
        onNewReading={props.onNewReading}
        onShare={props.onShare}
      />
    </VStack>
  )
}
