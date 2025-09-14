export interface TarotCard {
  id: number;
  name: string;
  nameEn: string;
  meaning: string;
  reversedMeaning: string;
  description: string;
  imageUrl?: string;
}

export interface TarotReading {
  question: string;
  card: TarotCard;
  isReversed: boolean;
  interpretation: string;
}

export interface TarotRequest {
  question: string;
  cardId: number;
  isReversed: boolean;
}
