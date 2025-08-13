package requests

// GetTarotCards タロットカード一覧取得リクエスト
type GetTarotCards struct {
	Limit  int `json:"limit" query:"limit"`
	Offset int `json:"offset" query:"offset"`
}

// NewGetTarotCards 新しいGetTarotCardsリクエストを作成
func NewGetTarotCards() *GetTarotCards {
	return &GetTarotCards{
		Limit:  100, // デフォルト値
		Offset: 0,
	}
}

// GetRandomCard ランダムカード取得リクエスト（占い用）
type GetRandomCard struct {
	Count int `json:"count" query:"count"` // 取得するカード数（デフォルト1）
}

// NewGetRandomCard 新しいGetRandomCardリクエストを作成
func NewGetRandomCard() *GetRandomCard {
	return &GetRandomCard{
		Count: 1, // デフォルト値
	}
} 