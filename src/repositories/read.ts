import type { Reading, ReadingRequest } from "@/types"
import { fetcher } from "./cli/client"

type Resp = {
  postReading: {
    result: Reading
  }
}

type PostReading = ReadingRequest & {
  fortuneTellerId: string
}

export async function postReading(params: PostReading): Promise<Reading> {
  const data = await fetcher.fetchJson<Resp["postReading"]>({
    method: "POST",
    path: "/api/req",
    b: params,
  })
  return data.result
}
