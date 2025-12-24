// API Client for SYNAPSE platform
// This is a foundational client that will be connected to FastAPI backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface APIResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          error: {
            code: error.code || "UNKNOWN_ERROR",
            message: error.message || "An error occurred",
            details: error.details,
          },
        };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        error: {
          code: "NETWORK_ERROR",
          message: error instanceof Error ? error.message : "Network error occurred",
        },
      };
    }
  }

  // Document endpoints
  async uploadDocument(formData: FormData) {
    return this.request("/documents/upload", {
      method: "POST",
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async analyzeDocument(documentId: string) {
    return this.request(`/documents/${documentId}/analyze`, {
      method: "POST",
    });
  }

  async generateDocument(templateId: string, metadata: unknown) {
    return this.request("/documents/generate", {
      method: "POST",
      body: JSON.stringify({ templateId, metadata }),
    });
  }

  async getDocuments(folderId: string) {
    return this.request(`/documents?folderId=${folderId}`, {
      method: "GET",
    });
  }

  async deleteDocument(documentId: string) {
    return this.request(`/documents/${documentId}`, {
      method: "DELETE",
    });
  }

  // Project endpoints
  async getProjects() {
    return this.request("/projects", {
      method: "GET",
    });
  }

  async getProject(projectId: string) {
    return this.request(`/projects/${projectId}`, {
      method: "GET",
    });
  }

  async createProject(projectData: unknown) {
    return this.request("/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(projectId: string, projectData: unknown) {
    return this.request(`/projects/${projectId}`, {
      method: "PUT",
      body: JSON.stringify(projectData),
    });
  }
}

// Export singleton instance
export const apiClient = new APIClient(API_BASE_URL);

// Export class for testing
export { APIClient };
