const ERROR_MESSAGES: Record<string, string> = {
  OPENAI_KEY_MISSING: '設定エラーにより現在占いを実行できません。時間をおいて再度お試しください。',
  BAD_REQUEST: '入力内容を確認してください。質問とカードが必要です。',
  INVALID_CARD_ID: 'カード情報が不正です。もう一度カードを選択してください。',
  OPENAI_API_ERROR: '占いサービスでエラーが発生しました。しばらくしてから再度お試しください。',
  UNKNOWN_ERROR: '不明なエラーが発生しました。時間をおいて再度お試しください。',
}

export class ReadError extends Error {
  constructor(
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'ReadError'
  }

  getUiMessage(): string {
    return ERROR_MESSAGES[this.code] || this.message || 'エラーが発生しました'
  }
}
