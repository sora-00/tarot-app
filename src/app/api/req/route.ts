import { NextRequest, NextResponse } from "next/server";
import { TarotRequest } from "../../../types/tarot";
import { tarotCards } from "../../../data/tarotCards";

import { getOpenAIClient, buildSystemPrompt, buildUserPrompt } from "@/app/api/req/service";

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key not configured');
    return NextResponse.json({ error: { message: "占いに失敗しました", code: "OPENAI_KEY_MISSING" } }, { status: 500 });
  }

  try {
    // タロットリクエストのデータを取得
    const body = await req.json();
    const { question, cardId, isReversed, fortuneTellerId }: TarotRequest & { fortuneTellerId?: string } = body;
  
    if (!question || cardId === undefined) {
      console.error('Bad request: missing question or cardId');
      return NextResponse.json({ error: { message: "占いに失敗しました", code: "BAD_REQUEST" } }, { status: 400 });
    }

    const selectedCard = tarotCards.find(card => card.id === cardId);
    if (!selectedCard) {
      console.error('Invalid cardId:', cardId);
      return NextResponse.json({ error: { message: "占いに失敗しました", code: "INVALID_CARD_ID" } }, { status: 400 });
    }
    
    // 占い師タイプに応じたプロンプトを作成
    const userPrompt = buildUserPrompt(fortuneTellerId || 'miko', question, selectedCard, isReversed);

    // 質問の長さに応じてトークン数を調整
    const questionLength = question.length;
    const maxTokens = questionLength > 100 ? 2000 : questionLength > 50 ? 1500 : 1200;

    // 設定を諸々のせてAPIとやり取り
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: buildSystemPrompt(fortuneTellerId || 'miko') },
        { role: "user", content: userPrompt }
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
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response: { status: number; data: unknown } };
      console.error('OpenAI API error:', apiError.response.status, apiError.response.data);
      return NextResponse.json({ error: { message: "占いに失敗しました", code: "OPENAI_API_ERROR" } }, { status: apiError.response.status });
    } else {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Unhandled server error:', errorMessage);
      return NextResponse.json({ error: { message: "占いに失敗しました", code: "UNKNOWN_ERROR" } }, { status: 500 });
    }
  }
}