import { HTTPError } from 'ky'

type ApiErrorBody = {
  message?: unknown
}

export async function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof HTTPError) {
    const body: unknown = await error.response
      .clone()
      .json()
      .catch(() => undefined)
    if (body && typeof body === 'object' && 'message' in body) {
      const message = (body as ApiErrorBody).message
      if (typeof message === 'string') return message
    }
  }

  return fallback
}
