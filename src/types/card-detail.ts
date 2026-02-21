// カードの詳細情報（名前、意味など）
export type CardDetail = {
  id: string;
  name: string;
  nameEn: string;
  meaning: string;
  reversedMeaning: string;
  imageUrl?: string;
}
