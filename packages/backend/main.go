// main.go
package main

import (
	"log"
	"net/http"

	"backend/controllers"
	"backend/database"
)

func main() {
	// データベース接続
	err := database.Connect()
	if err != nil {
		log.Fatal(err)
	}
	defer database.Close()

	// コントローラーを初期化
	tarotController := controllers.NewTarot()

	// ルートハンドラー
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("占いAPIへようこそ！"))
	})

	// タロットカード一覧取得API
	http.HandleFunc("/api/cards", tarotController.GetTarotCards)

	// ランダムカード取得API（占い用）
	http.HandleFunc("/api/fortune", tarotController.GetRandomCard)

	log.Println("http://localhost:8080 で待機中…")
	http.ListenAndServe(":8080", nil)
}
