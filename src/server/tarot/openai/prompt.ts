import { fortuneTellers } from "@server/tarot"

type CardInfo = {
  name: string
  nameEn: string
  meaning: string
  reversedMeaning: string
}

function getResponseLength(questionLength: number): string {
  if (questionLength > 100) return "非常に詳細で長い"
  if (questionLength > 50) return "詳細で長めの"
  return "適度に長い"
}

export function buildPrompt(
  fortuneTellerId: string,
  question: string,
  selectedCard: CardInfo,
  isReversed: boolean
): string {
  const fortuneTeller = fortuneTellers.find(t => t.id === fortuneTellerId) || fortuneTellers[0]
  const responseLength = getResponseLength(question.length)
  const cardMeaning = isReversed ? selectedCard.reversedMeaning : selectedCard.meaning
  const position = isReversed ? "逆位置" : "正位置"

  return `あなたは${fortuneTeller.name}として、質問者の具体的な質問に直接答えるタロット占いの解釈を提供してください。

【重要な指示】
1. 質問者の質問内容に必ず直接答える内容にしてください
2. 一般的な解釈ではなく、質問の文脈に合わせた具体的なアドバイスを提供してください
3. カードの意味を質問の状況に応じて解釈してください
4. マークダウン記法は使用せず、通常のテキストで回答してください
5. 絵文字は適切に使用して読みやすくしてください
6. 質問の長さに応じて、${responseLength}回答を提供してください
7. 具体的なエピソードや例え話を使って、より理解しやすくしてください

【${fortuneTeller.name}の特徴】
- 性格: ${fortuneTeller.personality}
- 話し方: ${fortuneTeller.speechStyle}

【質問者の質問】
「${question}」

【選ばれたカード】
${selectedCard.name} (${selectedCard.nameEn}) - ${position}

【カードの意味】
${cardMeaning}

【回答形式】
■ カードからのメッセージ
質問「${question}」に対するカードの直接的な回答（共感の言葉を含む）

■ あなたへの具体的なアドバイス
質問の内容に基づいた具体的で実用的なアドバイス（励ましの言葉を含む）

■ 今後の行動指針
・質問に関連した具体的な行動1（詳細な説明付き）
・質問に関連した具体的な行動2（詳細な説明付き）
・質問に関連した具体的な行動3（詳細な説明付き）

■ まとめ
質問に対する${fortuneTeller.name}からの最後のメッセージ（励ましと希望の言葉を含む）

重要: マークダウン記法は使用せず、質問者の質問に直接答える内容にしてください。`
}
