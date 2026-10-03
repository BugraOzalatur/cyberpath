const BASE_URL = (process.env.TRACKER_API_URL ?? 'http://127.0.0.1:5180/api').replace(/\/$/, '')

export class ApiError extends Error {}

/** Calls the CyberPath API; on failure, surfaces the API's ProblemDetail message. */
export const api = async <T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> => {
  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: init.method ?? 'GET',
      headers: init.body ? { 'Content-Type': 'application/json' } : undefined,
      body: init.body ? JSON.stringify(init.body) : undefined,
    })
  } catch {
    throw new ApiError(`Could not reach the CyberPath API (${BASE_URL}). Start it with "./gradlew dockerBuild" in the cyberpath folder.`)
  }
  if (!response.ok) {
    const problem = (await response.json().catch(() => ({}))) as { detail?: string }
    throw new ApiError(problem.detail ?? `API error: ${response.status}`)
  }
  return response.status === 204 ? (undefined as T) : ((await response.json()) as T)
}
