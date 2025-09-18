import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@chakra-ui/react"
import { TarotReading } from "../types/tarot"
import { fortuneTellers } from "../data/fortuneTellers"

export function useTarotResult() {
  const [result, setResult] = useState<TarotReading | null>(null)
  const [fortuneTeller, setFortuneTeller] = useState<{ id: string; name: string; emoji: string; personality: string; speechStyle: string; example: string } | null>(null)
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    const savedResult = sessionStorage.getItem('tarotResult')
    const savedFortuneTellerId = sessionStorage.getItem('selectedFortuneTeller')
    
    if (savedResult) {
      setResult(JSON.parse(savedResult))
    } else {
      // 結果がない場合はカード選択ページにリダイレクト
      router.push('/pick-card')
    }
    
    if (savedFortuneTellerId) {
      const teller = fortuneTellers.find(t => t.id === savedFortuneTellerId)
      if (teller) {
        setFortuneTeller(teller)
      }
    }
  }, [router])

  const handleNewReading = () => {
    sessionStorage.removeItem('tarotResult')
    router.push('/')
  }

  // シェア用のテキストを生成（140字以内、個人的な内容は含めない）
  const generateShareText = () => {
    if (!result || !fortuneTeller) return ""
    
    const siteUrl = 'https://tarot-app-kappa.vercel.app'
    
    // カードの意味を短縮（30文字以内）
    const cardMeaning = result.isReversed ? result.card.reversedMeaning : result.card.meaning
    const shortMeaning = cardMeaning.length > 30 
      ? cardMeaning.substring(0, 30) + '...'
      : cardMeaning
    
    const shareText = `🔮 AIタロット占いアプリ 🔮

${fortuneTeller.emoji} ${fortuneTeller.name}が解釈！

【引いたカード】${result.card.name} ${result.isReversed ? '逆位置' : '正位置'}
${shortMeaning}

7人の占い師があなたの悩みに寄り添います✨

${siteUrl}

#タロット占い #AI占い #タロットカード`

    return shareText
  }

  // Xでシェア
  const shareOnX = () => {
    const text = generateShareText()
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  // LINEでシェア
  const shareOnLine = () => {
    const text = generateShareText()
    const currentUrl = 'https://tarot-app-kappa.vercel.app'
    const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  // テキストをコピー
  const copyToClipboard = async () => {
    try {
      const text = generateShareText()
      await navigator.clipboard.writeText(text)
      toast({
        title: "コピーしました！",
        description: "占い結果をクリップボードにコピーしました",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch {
      toast({
        title: "コピーに失敗しました",
        description: "手動でコピーしてください",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return {
    result,
    fortuneTeller,
    handleNewReading,
    shareOnX,
    shareOnLine,
    copyToClipboard
  }
}
