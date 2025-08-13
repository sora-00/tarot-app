package utils

import "os"

// GetEnv 環境変数を取得し、存在しない場合はデフォルト値を返す
func GetEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
} 