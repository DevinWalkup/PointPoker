import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'
import AlertStore from '../stores/AlertStore'

export class HttpClient {
    public static async get<T>(endpoint: string, params = {}) {
        return await this._axiosInstance().get(`${endpoint}`, {
            params: params
        });
    }

    public static async post<T>(endpoint: string, reqData = {}) {
        return await this._axiosInstance().post<T, T>(`${endpoint}`, reqData);
    }

    public static async put<T>(endpoint: string, reqData = {}, config?: AxiosRequestConfig) {
        return await this._axiosInstance().patch<T, T>(`${endpoint}`, reqData, config);
    }

    public static async patch<T>(endpoint: string, reqData = {}) {
        return await this._axiosInstance().patch<T, T>(`${endpoint}`, reqData);
    }

    public static async delete<T>(endpoint: string, reqData = {}): Promise<T> {
        return await this._axiosInstance().delete<T, T>(`${endpoint}`, {data: reqData})
    }

    private static _axiosInstance(): AxiosInstance {
        // @ts-ignore
        let url = import.meta.env.VITE_API_URL

        let instance = axios.create({
            baseURL: url,
            withCredentials: true
        });

        instance.interceptors.response.use((response) => response, (error) => {
            if (error.response.status === 404) {
                AlertStore.error({"message": "An unknown error occurred."})
            } else if (error.response.status !== 500) {
                AlertStore.error({"message": "There was an error performing the action. Please try again later."});
            }
        });

        return instance;
    }
}

