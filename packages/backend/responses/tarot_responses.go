package responses

import "backend/models"

// TarotCard タロットカードレスポンス
type TarotCard struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	EnglishName string `json:"english_name"`
	ImageURL    string `json:"image_url"`
}

// NewTarotCard 新しいTarotCardレスポンスを作成
func NewTarotCard() *TarotCard {
	return &TarotCard{}
}

// TarotCards タロットカード一覧レスポンス
type TarotCards struct {
	Cards []TarotCard `json:"cards"`
	Total int         `json:"total"`
}

// NewTarotCards 新しいTarotCardsレスポンスを作成
func NewTarotCards() *TarotCards {
	return &TarotCards{
		Cards: []TarotCard{},
		Total: 0,
	}
}

// Fortune 占い結果レスポンス
type Fortune struct {
	Cards   []TarotCard `json:"cards"`
	Message string       `json:"message"`
}

// NewFortune 新しいFortuneレスポンスを作成
func NewFortune() *Fortune {
	return &Fortune{
		Cards:   []TarotCard{},
		Message: "占いが完了しました",
	}
}

// FromModel TarotCardモデルからレスポンスに変換
func (r *TarotCard) FromModel(card models.TarotCard) {
	r.ID = card.ID
	r.Name = card.Name
	r.EnglishName = card.EnglishName
	r.ImageURL = card.ImageURL
}

// FromModels 複数のTarotCardモデルからレスポンスに変換
func (r *TarotCards) FromModels(cards []models.TarotCard) {
	r.Cards = make([]TarotCard, len(cards))
	for i, card := range cards {
		r.Cards[i].FromModel(card)
	}
	r.Total = len(cards)
} 