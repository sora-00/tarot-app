type FetchJsonParams = {
  method: "GET" | "POST" | "PUT" | "DELETE"
  path: string
  b?: unknown
}

export function isApiError(error: unknown): error is Error & { code: string } {
  return error instanceof Error && 'code' in error
}

export const fetcher = {
  async fetchJson<T>(params: FetchJsonParams): Promise<T> {
    const { method, path, b } = params
    
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }
    
    if (b) {
      fetchOptions.body = JSON.stringify(b)
    }
    
    const response = await fetch(path, fetchOptions)

    const data = await response.json()

    if (!response.ok) {
      const code = data?.error?.code as string | undefined
      const message = data?.error?.message || 'エラーが発生しました'
      const error = new Error(message) as Error & { code: string }
      error.code = code || 'UNKNOWN_ERROR'
      throw error
    }

    return data
  }
}
