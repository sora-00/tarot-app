package database

import (
	"database/sql"
	"log"

	"backend/config"

	_ "github.com/lib/pq"
)

var DB *sql.DB

// Connect データベースに接続
func Connect() error {
	dbConfig := config.NewDatabaseConfig()
	connStr := dbConfig.GetConnectionString()

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		return err
	}

	// 接続テスト
	err = DB.Ping()
	if err != nil {
		return err
	}

	log.Println("PostgreSQLに接続しました")
	return nil
}

// Close データベース接続を閉じる
func Close() error {
	if DB != nil {
		return DB.Close()
	}
	return nil
} 