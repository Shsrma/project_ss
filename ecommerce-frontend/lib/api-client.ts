const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"

interface ApiResponse {
  ok: boolean
  status: number
  statusText: string
  json: () => Promise<any>
  text: () => Promise<string>
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<ApiResponse> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      // Handle authentication errors
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          // Only redirect on client side
          window.location.href = "/login"
        }
      }

      return response
    } catch (error) {
      console.warn(`API request failed for ${url}:`, error)
      console.log("Using fallback mode - backend not available")

      // Return a mock response that indicates the backend is not available
      // This ensures the app continues to work with fallback data
      return {
        ok: false,
        status: 503,
        statusText: "Service Unavailable",
        json: async () => ({
          error: "Backend not available",
          fallback: true,
        }),
        text: async () =>
          JSON.stringify({
            error: "Backend not available",
            fallback: true,
          }),
      }
    }
  }

  async get(endpoint: string) {
    return this.request(endpoint, { method: "GET" })
  }

  async post(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: "DELETE" })
  }

  async postFormData(endpoint: string, formData: FormData) {
    return this.request(endpoint, {
      method: "POST",
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
