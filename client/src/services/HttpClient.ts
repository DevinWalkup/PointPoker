import axios, {AxiosInstance, AxiosRequestConfig} from 'axios'

export class HttpClient {
    private static _axiosInstance() : AxiosInstance {
        // @ts-ignore
        let url = import.meta.env.VITE_API_URL

        return axios.create({
            baseURL: url,
            withCredentials: true
        });
    }

    public static async get<T>(endpoint: string, params = {}) {
        return await this._axiosInstance().get(`${endpoint}`, {
            params: params
        });
    }

    public static async post<T>(endpoint: string, reqData={}) {
        return await this._axiosInstance().post<T, T>(`${endpoint}`, reqData);
    }

    public static async put<T>(endpoint: string, reqData = {}, config?: AxiosRequestConfig){
        return await this._axiosInstance().patch<T, T>(`${endpoint}`, reqData, config);
    }

    public static async patch<T>(endpoint: string, reqData ={}){
        return await this._axiosInstance().patch<T, T>(`${endpoint}`, reqData);
    }

    public static async delete<T>(endpoint: string, reqData = {}){
        return await this._axiosInstance().delete<T, T>(`${endpoint}`, {data: reqData})
    }
}

