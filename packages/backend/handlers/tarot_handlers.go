package handlers

import (
	"encoding/json"
	"net/http"

	"backend/database"
	"backend/models"
)

// GetTarotCards タロットカード一覧を取得
func GetTarotCards(w http.ResponseWriter, r *http.Request) {
	rows, err := database.DB.Query("SELECT id, name, english_name, image_url FROM tarot_cards ORDER BY name")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var cards []models.TarotCard
	for rows.Next() {
		var card models.TarotCard
		err := rows.Scan(&card.ID, &card.Name, &card.EnglishName, &card.ImageURL)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		cards = append(cards, card)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(cards)
}

// GetRandomCard ランダムなタロットカードを取得（占い用）
func GetRandomCard(w http.ResponseWriter, r *http.Request) {
	var card models.TarotCard
	err := database.DB.QueryRow("SELECT id, name, english_name, image_url FROM tarot_cards ORDER BY RANDOM() LIMIT 1").
		Scan(&card.ID, &card.Name, &card.EnglishName, &card.ImageURL)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(card)
} 