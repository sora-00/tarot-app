import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { TarotRequest } from "../../../types/tarot";
import { tarotCards } from "../../../data/tarotCards";
import { fortuneTellers } from "../../../data/fortuneTellers";

// 発行したAPI Keyを使って設定を定義
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 占い師タイプに応じたプロンプトを生成する関数
function generateFortuneTellerPrompt(fortuneTellerId: string, question: string, selectedCard: { name: string; nameEn: string; meaning: string; reversedMeaning: string; description: string }, isReversed: boolean) {
  const fortuneTeller = fortuneTellers.find(t => t.id === fortuneTellerId) || fortuneTellers[0];
  
  // 質問の長さに応じて回答の長さを調整
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
7. ${fortuneTeller.name === 'ツンデレ占い師' ? 'ツンデレの特徴として「べ、別に〜」「〜じゃない！」「〜なんだから！」などの表現を使い、最初は冷たく最後は優しく締めること' : ''}

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

export async function POST(req: NextRequest) {
  console.log('API route called');
  
  if (!process.env.OPENAI_API_KEY) {
    console.log('OpenAI API key not configured');
    return NextResponse.json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    }, { status: 500 });
  }

  try {
    // タロットリクエストのデータを取得
    const body = await req.json();
    console.log('Request body:', body);
    const { question, cardId, isReversed, fortuneTellerId }: TarotRequest & { fortuneTellerId?: string } = body;
    
    // デバッグ用：APIキーがない場合はモックデータを返す
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.log('Using mock data due to missing API key');
      const selectedCard = tarotCards.find(card => card.id === cardId);
      if (!selectedCard) {
        return NextResponse.json({
          error: {
            message: "無効なカードIDです",
          },
        }, { status: 400 });
      }
      
      // モックデータ用の解釈を生成（より長く親身な内容）
      const tellerName = fortuneTellers.find(t => t.id === (fortuneTellerId || 'miko'))?.name || '巫女';
      const mockInterpretation = `【${tellerName}の解釈】

■ カードからのメッセージ
あなたの質問「${question}」について、${selectedCard.name}のカードが${isReversed ? '逆位置' : '正位置'}で現れました。これは、${isReversed ? selectedCard.reversedMeaning : selectedCard.meaning}という意味を示しています。

あなたの気持ち、とてもよく分かります。このような悩みを抱えている時こそ、カードは私たちに大切なメッセージを伝えてくれるのです。${selectedCard.name}のカードは、あなたの現在の状況を深く理解し、これからの道筋を示してくれています。

■ あなたへの具体的なアドバイス
あなたの質問「${question}」に対して、カードは明確で温かいメッセージを伝えています。現在の状況を客観的に見つめ直し、直感を大切にしながら行動することが重要です。

特に、このカードが示すように、あなたの内なる声に耳を傾けることが大切です。時には迷いや不安を感じることもあるでしょうが、それは成長の証でもあります。あなたの直感は、思っている以上に正確で、正しい方向へと導いてくれるはずです。

■ 今後の行動指針
・質問の内容を具体的に分析し、優先順位をつける
  まずは、あなたの質問の核心を整理してみてください。何が一番大切で、何から取り組むべきかを明確にすることで、道筋が見えてきます。

・カードのメッセージを参考に、次のステップを計画する
  ${selectedCard.name}のカードが示す方向性を参考に、具体的な行動計画を立ててみてください。小さな一歩から始めることが、大きな変化につながります。

・直感と論理のバランスを保ちながら判断する
  時には論理的に考え、時には直感を信じてみてください。このバランスが、あなたにとって最適な答えを見つける鍵となります。

■ まとめ
${tellerName}として、あなたの質問に対する答えは、カードが示す通りです。あなたは既に答えを知っているのです。ただ、それを信じる勇気が必要なだけかもしれません。

信じて前に進んでください。あなたの道は、必ず明るい未来へと続いています。カードは、あなたを応援し、支えてくれています。`;
      
      return NextResponse.json({ 
        result: {
          interpretation: mockInterpretation,
          card: selectedCard,
          isReversed,
          question
        }
      });
    }
  
    if (!question || cardId === undefined) {
      console.log('Missing question or cardId');
      return NextResponse.json({
        error: {
          message: "質問とカードIDが必要です",
        },
      }, { status: 400 });
    }

    const selectedCard = tarotCards.find(card => card.id === cardId);
    if (!selectedCard) {
      console.log('Invalid cardId:', cardId);
      return NextResponse.json({
        error: {
          message: "無効なカードIDです",
        },
      }, { status: 400 });
    }

    console.log('Selected card:', selectedCard);
    console.log('Calling OpenAI API...');
    
    // 占い師タイプに応じたプロンプトを作成
    const prompt = generateFortuneTellerPrompt(fortuneTellerId || 'miko', question, selectedCard, isReversed);

    // 質問の長さに応じてトークン数を調整
    const questionLength = question.length;
    const maxTokens = questionLength > 100 ? 2000 : questionLength > 50 ? 1500 : 1200;

    // 設定を諸々のせてAPIとやり取り
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `あなたは${fortuneTellers.find(t => t.id === (fortuneTellerId || 'miko'))?.name || '巫女'}として、質問者の具体的な質問に直接答えるタロット占いの解釈を提供してください。

重要な指示:
1. 質問者の質問内容に必ず直接答える内容にしてください
2. 一般的な解釈ではなく、質問の文脈に合わせた具体的なアドバイスを提供してください
3. カードの意味を質問の状況に応じて解釈してください
4. マークダウン記法は使用せず、通常のテキストで回答してください
5. 絵文字は適切に使用して読みやすくしてください
6. 質問の長さに応じて、詳細で長めの回答を提供してください
7. ツンデレ占い師の場合は「べ、別に〜」「〜じゃない！」「〜なんだから！」などの表現を使い、最初は冷たく最後は優しく締めてください
8. 具体的なエピソードや例え話を使って、より理解しやすくしてください`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: maxTokens,
    });
    
    // GPTの返答を取得
    const interpretation = completion.choices[0].message?.content || "解釈を生成できませんでした。";
    
    return NextResponse.json({ 
      result: {
        interpretation,
        card: selectedCard,
        isReversed,
        question
      }
    });
  } catch (error: unknown) {
    // Consider adjusting the error handling logic for your use case
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response: { status: number; data: unknown } };
      console.error(apiError.response.status, apiError.response.data);
      return NextResponse.json(apiError.response.data, { status: apiError.response.status });
    } else {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error with OpenAI API request: ${errorMessage}`);
      return NextResponse.json({
        error: {
          message: "An error occurred during your request.",
        },
      }, { status: 500 });
    }
  }
}