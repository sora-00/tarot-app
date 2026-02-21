import type { Reading, FortuneTeller } from "@/types"

type FormatShareTextParams = {
  result: Reading
  fortuneTeller: FortuneTeller
  isPrivate: boolean
}

export function formatShareText(params: FormatShareTextParams): string {
  const { result, fortuneTeller, isPrivate } = params
  if (!result || !fortuneTeller) return ""
  
  const cardMeaning = result.isReversed ? result.card.reversedMeaning : result.card.meaning
  const header = `🔮 AIタロット占いアプリ 🔮

${fortuneTeller.emoji} ${fortuneTeller.name}が解釈！`
  
  const cardInfo = `【引いたカード】${result.card.name} ${result.isReversed ? '逆位置' : '正位置'}
${cardMeaning}`
  
  const footer = `
7人の占い師があなたの悩みに寄り添います✨

#タロット占い #AI占い #タロットカード`
  
  if (!isPrivate) {
    return `${header}

${cardInfo}${footer}`
  } else {
    return `${header}

【あなたの質問】
${result.question}

${cardInfo}

${result.interpretation}${footer}`
  }
}
