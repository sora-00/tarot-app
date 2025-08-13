package models

// TarotCard タロットカードのモデル
type TarotCard struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	EnglishName string `json:"english_name"`
	ImageURL    string `json:"image_url"`
} 