import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { BaseFilter } from '@/types/api/base/filters';
import type { ApiResponse, PagedResponse } from '@/types/api/base/responses';

export abstract class BaseHttpService<T = any, F extends BaseFilter = BaseFilter> {
  protected readonly http: AxiosInstance;
  protected readonly baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.http = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Adicionar interceptors para tratamento de erros globais
    this.setupInterceptors();
  }

  protected setupInterceptors(): void {
    this.http.interceptors.response.use(
      (response) => response.data,
      (error) => {
        // Aqui você pode adicionar lógica para tratamento de erros
        // Como refresh de token, redirecionamento para login, etc
        return Promise.reject(error);
      }
    );
  }

  protected getRequestConfig(config?: AxiosRequestConfig): AxiosRequestConfig {
    const token = localStorage.getItem('token');
    return {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    };
  }

  // Métodos CRUD base
  async getById(id: number | string): Promise<ApiResponse<T>> {
    return this.http.get(`${this.baseURL}/${id}`, this.getRequestConfig());
  }

  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    return this.http.post(this.baseURL, data, this.getRequestConfig());
  }

  async update(id: number | string, data: Partial<T>): Promise<ApiResponse<T>> {
    return this.http.put(`${this.baseURL}/${id}`, data, this.getRequestConfig());
  }

  async delete(id: number | string): Promise<ApiResponse<void>> {
    return this.http.delete(`${this.baseURL}/${id}`, this.getRequestConfig());
  }

  // Métodos para listagem paginada
  async getGrid(filter: F): Promise<ApiResponse<PagedResponse<T>>> {
    const params = {
      page: filter.page,
      pageSize: filter.pageSize,
      sort: filter.sort,
      searchTerm: filter.searchTerm,
    };

    return this.http.get(`${this.baseURL}/grid`, {
      ...this.getRequestConfig(),
      params,
    });
  }

  async getAll(): Promise<ApiResponse<T[]>> {
    return this.http.get(this.baseURL, this.getRequestConfig());
  }
}