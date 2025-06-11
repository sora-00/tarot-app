// main.go
package main

import (
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/fortune", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("占いAPIへようこそ！"))
	})

	log.Println("http://localhost:8080 で待機中…")
	http.ListenAndServe(":8080", nil)
}
