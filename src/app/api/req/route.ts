import { NextResponse } from "next/server"
import type { ReadingRequest } from "@/types"
import { tarotCards } from "@server/tarot"
import { getOpenAIClient, buildPrompt } from "@server/tarot/openai"

const ERROR_MESSAGE = "占いに失敗しました"
const CHAT_MODEL = "gpt-4o-mini"

function errorJson(code: string, status: number) {
  return NextResponse.json({ error: { message: ERROR_MESSAGE, code } }, { status })
}

function getMaxTokens(questionLength: number) {
  if (questionLength > 100) return 2000
  if (questionLength > 50) return 1500
  return 1200
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OpenAI API key not configured")
    return errorJson("OPENAI_KEY_MISSING", 500)
  }

  try {
    const body = (await req.json()) as ReadingRequest & { fortuneTellerId?: string }
    const { question, cardId, isReversed, fortuneTellerId } = body
    const tellerId = fortuneTellerId || "miko"

    if (!question?.trim() || !cardId) {
      return errorJson("BAD_REQUEST", 400)
    }

    const selectedCard = tarotCards.find((c) => c.id === cardId)
    if (!selectedCard) {
      return errorJson("INVALID_CARD_ID", 400)
    }

    const prompt = buildPrompt(tellerId, question, selectedCard, isReversed)
    const openai = getOpenAIClient()
    const completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: getMaxTokens(question.length),
    })

    const interpretation = completion.choices[0].message?.content ?? "解釈を生成できませんでした。"

    return NextResponse.json({
      result: { interpretation, card: selectedCard, isReversed, question },
    })
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const { response } = error as { response: { status: number } }
      return errorJson("OPENAI_API_ERROR", response.status)
    }
    console.error(error instanceof Error ? error.message : error)
    return errorJson("UNKNOWN_ERROR", 500)
  }
}