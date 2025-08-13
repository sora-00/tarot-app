# Goのバックエンド用Dockerfile
FROM golang:1.21-alpine

WORKDIR /app

# 依存関係をコピー
COPY go.mod ./
RUN go mod download

# ソースコードをコピー
COPY . .

# ビルド
RUN go build -o main .

# 実行
CMD ["./main"] 