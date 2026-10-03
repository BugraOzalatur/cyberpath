import axios, { AxiosError } from 'axios'

export const http = axios.create({ baseURL: '/api' })

interface ProblemDetail {
  detail?: string
  title?: string
}

/** Turns an API error into a message that can be shown to the user. */
export const errorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const problem = error.response?.data as ProblemDetail | undefined
    return problem?.detail ?? problem?.title ?? error.message
  }
  return error instanceof Error ? error.message : 'Something went wrong'
}
