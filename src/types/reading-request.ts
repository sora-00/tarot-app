// 占いリクエスト（API送信用）
export type ReadingRequest = {
  question: string;
  cardId: string;
  isReversed: boolean;
}
