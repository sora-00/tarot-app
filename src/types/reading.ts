import type { CardDetail } from "./card-detail"

// 占い結果全体
export type Reading = {
  question: string;
  card: CardDetail;
  isReversed: boolean;
  interpretation: string;
}
