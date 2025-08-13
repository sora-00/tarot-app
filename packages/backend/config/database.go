package config

import (
	"fmt"
	"os"
)

// DatabaseConfig データベース設定
type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
}

// NewDatabaseConfig データベース設定を新規作成
func NewDatabaseConfig() *DatabaseConfig {
	return &DatabaseConfig{
		Host:     GetEnv("DB_HOST", "localhost"),
		Port:     GetEnv("DB_PORT", "5432"),
		User:     GetEnv("DB_USER", "tarot_user"),
		Password: GetEnv("DB_PASSWORD", "tarot_pass"),
		DBName:   GetEnv("DB_NAME", "tarot_db"),
	}
}

// GetConnectionString データベース接続文字列を取得
func (c *DatabaseConfig) GetConnectionString() string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		c.Host, c.Port, c.User, c.Password, c.DBName)
}

// GetEnv 環境変数を取得（utilsパッケージの関数を直接使用）
func GetEnv(key, defaultValue string) string {
	// 循環インポートを避けるため、ここで直接実装
	// 実際のプロジェクトでは、utilsパッケージを適切に設計する
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
} 