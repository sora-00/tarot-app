package usecases

import (
	"context"

	"backend/models"
	"backend/services"
)

// Tarot タロットカードのユースケース
type Tarot interface {
	GetAllCards(ctx context.Context) ([]models.TarotCard, error)
	GetRandomCards(ctx context.Context, count int) ([]models.TarotCard, error)
	GetCardByID(ctx context.Context, id string) (*models.TarotCard, error)
	GetFortune(ctx context.Context) ([]models.TarotCard, error)
}

// tarotUsecase タロットカードのユースケース実装
type tarotUsecase struct {
	service services.Tarot
}

// NewTarot 新しいTarotユースケースを作成
func NewTarot() Tarot {
	return &tarotUsecase{
		service: services.NewTarot(),
	}
}

// GetAllCards 全タロットカードを取得するユースケース
func (u *tarotUsecase) GetAllCards(ctx context.Context) ([]models.TarotCard, error) {
	return u.service.GetAllCards(ctx)
}

// GetRandomCards ランダムなタロットカードを取得するユースケース
func (u *tarotUsecase) GetRandomCards(ctx context.Context, count int) ([]models.TarotCard, error) {
	return u.service.GetRandomCards(ctx, count)
}

// GetCardByID IDでタロットカードを取得するユースケース
func (u *tarotUsecase) GetCardByID(ctx context.Context, id string) (*models.TarotCard, error) {
	return u.service.GetCardByID(ctx, id)
}

// GetFortune 占いを実行するユースケース
func (u *tarotUsecase) GetFortune(ctx context.Context) ([]models.TarotCard, error) {
	return u.service.GetFortune(ctx)
} 