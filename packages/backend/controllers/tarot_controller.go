package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"

	"backend/models"
	"backend/responses"
	"backend/usecases"
)

// Tarot タロットカードのコントローラー
type Tarot interface {
	GetTarotCards(w http.ResponseWriter, r *http.Request)
	GetRandomCard(w http.ResponseWriter, r *http.Request)
}

// tarotController タロットカードのコントローラー実装
type tarotController struct {
	usecase usecases.Tarot
}

// NewTarot 新しいTarotコントローラーを作成
func NewTarot() Tarot {
	return &tarotController{
		usecase: usecases.NewTarot(),
	}
}

// GetTarotCards タロットカード一覧を取得
func (c *tarotController) GetTarotCards(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	
	// クエリパラメータを解析
	limitStr := r.URL.Query().Get("limit")
	offsetStr := r.URL.Query().Get("offset")

	limit := 100 // デフォルト値
	offset := 0

	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}

	if offsetStr != "" {
		if o, err := strconv.Atoi(offsetStr); err == nil && o >= 0 {
			offset = o
		}
	}

	// ユースケースを実行
	cards, err := c.usecase.GetAllCards(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// ページネーション処理（簡易版）
	if offset >= len(cards) {
		cards = []models.TarotCard{}
	} else if offset+limit > len(cards) {
		cards = cards[offset:]
	} else {
		cards = cards[offset : offset+limit]
	}

	// レスポンスを作成
	response := &responses.TarotCards{}
	response.FromModels(cards)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// GetRandomCard ランダムなタロットカードを取得（占い用）
func (c *tarotController) GetRandomCard(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	
	// クエリパラメータを解析
	countStr := r.URL.Query().Get("count")
	count := 1 // デフォルト値

	if countStr != "" {
		if c, err := strconv.Atoi(countStr); err == nil && c > 0 {
			count = c
		}
	}

	// ユースケースを実行
	cards, err := c.usecase.GetRandomCards(ctx, count)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// レスポンスを作成
	response := &responses.Fortune{
		Cards:   make([]responses.TarotCard, len(cards)),
		Message: "占いが完了しました",
	}

	for i, card := range cards {
		response.Cards[i].FromModel(card)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
} 