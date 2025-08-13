# Next.jsのフロントエンド用Dockerfile
FROM node:18-alpine

WORKDIR /app

# 依存関係をコピー
COPY package*.json ./
RUN npm install

# ソースコードをコピー
COPY . .

# ビルド
RUN npm run build

# 実行
EXPOSE 3000
CMD ["npm", "start"] 