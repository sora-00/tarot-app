import OpenAI from "openai";
import { fortuneTellers } from "../../../data/fortuneTellers";

export function getOpenAIClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export function buildSystemPrompt(fortuneTellerId: string): string {
  const tellerName = fortuneTellers.find(t => t.id === (fortuneTellerId || 'miko'))?.name || '巫女';
  return `あなたは${tellerName}として、質問者の具体的な質問に直接答えるタロット占いの解釈を提供してください。

重要な指示:
1. 質問者の質問内容に必ず直接答える内容にしてください
2. 一般的な解釈ではなく、質問の文脈に合わせた具体的なアドバイスを提供してください
3. カードの意味を質問の状況に応じて解釈してください
4. マークダウン記法は使用せず、通常のテキストで回答してください
5. 絵文字は適切に使用して読みやすくしてください
6. 質問の長さに応じて、詳細で長めの回答を提供してください
8. 具体的なエピソードや例え話を使って、より理解しやすくしてください`;
}

export function buildUserPrompt(
  fortuneTellerId: string,
  question: string,
  selectedCard: { name: string; nameEn: string; meaning: string; reversedMeaning: string; description: string },
  isReversed: boolean
): string {
  const fortuneTeller = fortuneTellers.find(t => t.id === fortuneTellerId) || fortuneTellers[0];
  const questionLength = question.length;
  const responseLength = questionLength > 100 ? "非常に詳細で長い" : questionLength > 50 ? "詳細で長めの" : "適度に長い";

  return `
あなたは${fortuneTeller.name}として、質問者の具体的な質問に直接答えるタロット占いの解釈を提供してください。

【${fortuneTeller.name}の特徴】
- 性格: ${fortuneTeller.personality}
- 話し方: ${fortuneTeller.speechStyle}

【質問者の質問】
「${question}」

【選ばれたカード】
${selectedCard.name} (${selectedCard.nameEn}) - ${isReversed ? '逆位置' : '正位置'}

【カードの意味】
${isReversed ? selectedCard.reversedMeaning : selectedCard.meaning}

【カードの説明】
${selectedCard.description}

【重要な指示】
1. 質問者の質問「${question}」に直接答える内容にしてください
2. カードの意味を質問の文脈に合わせて解釈してください
3. 一般的な解釈ではなく、質問者の具体的な状況に応じたアドバイスを提供してください
4. ${fortuneTeller.name}の口調と性格を維持してください
5. 質問の長さに応じて、${responseLength}回答を提供してください
6. 具体的なエピソードや例え話を使って、より理解しやすくしてください

【回答形式】
【${fortuneTeller.name}の解釈】

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

重要: マークダウン記法は使用せず、質問者の質問に直接答える内容にしてください。
`;
}


