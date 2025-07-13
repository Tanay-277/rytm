import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    CancelToken
} from "axios";
import { toast } from "sonner";

export type ApiResponse<T> =
    | { success: true; data: T }
    | { success: false; error: string };

class ApiClient {
    private baseURL = "/api";
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: this.baseURL,
            headers: { "Content-Type": "application/json" },
            timeout: 15000
        });

        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => Promise.reject(error)
        );
    }

    async post<T>(
        endpoint: string,
        data: any,
        config: AxiosRequestConfig = {}
    ): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.post<T>(endpoint, data, config);
            return { success: true, data: response.data };
        } catch (error) {
            const message = this.handleError(error);
            return { success: false, error: message };
        }
    }

    async get<T>(
        endpoint: string,
        params?: Record<string, string>,
        config: AxiosRequestConfig = {}
    ): Promise<ApiResponse<T>> {
        try {
            const mergedConfig = {
                ...config,
                params
            };

            const response = await this.axiosInstance.get<T>(endpoint, mergedConfig);
            return { success: true, data: response.data };
        } catch (error) {
            const message = this.handleError(error);
            return { success: false, error: message };
        }
    }

    private handleError(error: any): string {
        let message = "Something went wrong. Please try again.";

        if (axios.isAxiosError(error)) {
            message =
                error.response?.data?.message ||
                error.response?.statusText ||
                error.message;
        } else {
            message = "Unexpected error occurred.";
        }

        if (typeof window !== "undefined") {
            toast.error(message);
        }

        console.error("[API ERROR]", message);
        return message;
    }

    setAuthToken(token: string): void {
        this.axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    clearAuthToken(): void {
        delete this.axiosInstance.defaults.headers.common["Authorization"];
    }
}

const api = new ApiClient();
export default api;
