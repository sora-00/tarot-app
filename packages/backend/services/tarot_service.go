package services

import (
	"context"
	"database/sql"

	"backend/database"
	"backend/models"
)

// Tarot タロットカードのサービス
type Tarot interface {
	GetAllCards(ctx context.Context) ([]models.TarotCard, error)
	GetRandomCards(ctx context.Context, count int) ([]models.TarotCard, error)
	GetCardByID(ctx context.Context, id string) (*models.TarotCard, error)
	GetFortune(ctx context.Context) ([]models.TarotCard, error)
}

// tarotService タロットカードのサービス実装
type tarotService struct {
	db *sql.DB
}

// NewTarot 新しいTarotサービスを作成
func NewTarot() Tarot {
	return &tarotService{
		db: database.DB,
	}
}

// GetAllCards 全タロットカードを取得
func (s *tarotService) GetAllCards(ctx context.Context) ([]models.TarotCard, error) {
	rows, err := s.db.QueryContext(ctx, "SELECT id, name, english_name, image_url FROM tarot_cards ORDER BY name")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var cards []models.TarotCard
	for rows.Next() {
		var card models.TarotCard
		err := rows.Scan(&card.ID, &card.Name, &card.EnglishName, &card.ImageURL)
		if err != nil {
			return nil, err
		}
		cards = append(cards, card)
	}

	return cards, nil
}

// GetRandomCards ランダムなタロットカードを取得
func (s *tarotService) GetRandomCards(ctx context.Context, count int) ([]models.TarotCard, error) {
	if count <= 0 {
		count = 1
	}

	rows, err := s.db.QueryContext(ctx, "SELECT id, name, english_name, image_url FROM tarot_cards ORDER BY RANDOM() LIMIT $1", count)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var cards []models.TarotCard
	for rows.Next() {
		var card models.TarotCard
		err := rows.Scan(&card.ID, &card.Name, &card.EnglishName, &card.ImageURL)
		if err != nil {
			return nil, err
		}
		cards = append(cards, card)
	}

	return cards, nil
}

// GetCardByID IDでタロットカードを取得
func (s *tarotService) GetCardByID(ctx context.Context, id string) (*models.TarotCard, error) {
	var card models.TarotCard
	err := s.db.QueryRowContext(ctx, "SELECT id, name, english_name, image_url FROM tarot_cards WHERE id = $1", id).
		Scan(&card.ID, &card.Name, &card.EnglishName, &card.ImageURL)
	if err != nil {
		return nil, err
	}

	return &card, nil
}

// GetFortune 占い用のランダムカードを取得（ビジネスロジック付き）
func (s *tarotService) GetFortune(ctx context.Context) ([]models.TarotCard, error) {
	// 占いでは通常1枚のカードを取得
	// ここに占いのビジネスロジックを追加可能
	// 例：ユーザーの過去の占い履歴を考慮する、特定のカードを除外するなど
	return s.GetRandomCards(ctx, 1)
} 