package repositories

import (
	"context"

	"backend/models"
)

// Tarot タロットカードのリポジトリインターフェース
type Tarot interface {
	GetAll(ctx context.Context) ([]models.TarotCard, error)
	GetRandom(ctx context.Context, count int) ([]models.TarotCard, error)
	GetByID(ctx context.Context, id string) (*models.TarotCard, error)
} 