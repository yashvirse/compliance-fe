import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.ocmspro.com/api";
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // IMPORTANT: Enable sending cookies/session tokens with requests
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug logging
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, {
      withCredentials: config.withCredentials,
      headers: config.headers,
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
apiClient.interceptors.response.use(
  (response) => {
    // Debug logging
    console.log(
      `📥 ${response.config.method?.toUpperCase()} ${response.config.url} - ${
        response.status
      }`,
      {
        setCookie: response.headers["set-cookie"],
        data: response.data,
      }
    );
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        `❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${
          error.response.status
        }`,
        {
          data: error.response.data,
          headers: error.response.headers,
        }
      );

      // Handle specific error codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
          break;
        case 403:
          console.error("Forbidden - You do not have permission");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Internal server error");
          break;
        default:
          console.error("An error occurred:", error.response.data);
      }
    } else if (error.request) {
      console.error("No response received from server");
    } else {
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

// API Service class with all HTTP methods
class ApiService {
  /**
   * GET request
   * @param url - API endpoint
   * @param config - Axios request config
   * @returns Promise with response data
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.get(url, config);
    return response.data;
  }

  /**
   * POST request
   * @param url - API endpoint
   * @param data - Request payload
   * @param config - Axios request config
   * @returns Promise with response data
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.post(url, data, config);
    return response.data;
  }

  /**
   * PUT request
   * @param url - API endpoint
   * @param data - Request payload
   * @param config - Axios request config
   * @returns Promise with response data
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.put(url, data, config);
    return response.data;
  }

  /**
   * PATCH request
   * @param url - API endpoint
   * @param data - Request payload
   * @param config - Axios request config
   * @returns Promise with response data
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.patch(url, data, config);
    return response.data;
  }

  /**
   * DELETE request
   * @param url - API endpoint
   * @param config - Axios request config
   * @returns Promise with response data
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.delete(url, config);
    return response.data;
  }

  /**
   * Upload file(s)
   * @param url - API endpoint
   * @param files - File or FormData object
   * @param onUploadProgress - Progress callback
   * @param config - Axios request config
   * @returns Promise with response data
   */
  async upload<T = any>(
    url: string,
    files: File | File[] | FormData,
    onUploadProgress?: (progressEvent: any) => void,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const formData = files instanceof FormData ? files : new FormData();

    // If files is a File or File[], append to FormData
    if (!(files instanceof FormData)) {
      if (Array.isArray(files)) {
        files.forEach((file, index) => {
          formData.append(`file${index}`, file);
        });
      } else {
        formData.append("file", files);
      }
    }

    const response: AxiosResponse<T> = await apiClient.post(url, formData, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config?.headers,
      },
      onUploadProgress,
    });

    return response.data;
  }

  /**
   * Download file
   * @param url - API endpoint
   * @param filename - Name for downloaded file
   * @param config - Axios request config
   * @returns Promise that resolves when download starts
   */
  async download(
    url: string,
    filename?: string,
    config?: AxiosRequestConfig
  ): Promise<void> {
    const response: AxiosResponse<Blob> = await apiClient.get(url, {
      ...config,
      responseType: "blob",
    });

    // Create blob link to download
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;

    // Extract filename from response headers or use provided filename
    const contentDisposition = response.headers["content-disposition"];
    const extractedFilename = contentDisposition
      ? contentDisposition.split("filename=")[1]?.replace(/['"]/g, "")
      : filename || "download";

    link.setAttribute("download", extractedFilename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  }

  /**
   * Make a request with custom config
   * @param config - Full Axios request config
   * @returns Promise with response data
   */
  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.request(config);
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export axios instance for advanced use cases
export { apiClient };

// Export types
export type { AxiosRequestConfig, AxiosResponse };
