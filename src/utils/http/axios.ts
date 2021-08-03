import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';
import { cloneDeep } from 'lodash-es';
import type { RequestOptions, CreateAxiosOptions, Result } from './types';
import { AxiosCanceler } from './axiosCancel';
import { isFunction } from '../is';
import { errorResult, tokenFakeTimeout } from './const';

// export * from './transform';

const axiosCanceler = new AxiosCanceler();
export class VAxios {
  private axiosInstance: AxiosInstance;

  private readonly options: CreateAxiosOptions;

  constructor(options: CreateAxiosOptions) {
    this.options = options;
    this.axiosInstance = axios.create(options);
    this.setupInterceptors();
  }

  /**
   * 创建 axios 实例
   */
  private createAxios(config: CreateAxiosOptions): void {
    this.axiosInstance = axios.create(config);
  }

  private getTransform() {
    const { transform } = this.options;
    return transform;
  }

  getAxios(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * 重新配置 axios
   */
  configAxios(config: CreateAxiosOptions) {
    if (!this.axiosInstance) {
      return;
    }
    this.createAxios(config);
  }

  /**
   * 配置 header
   */
  setHeader(header: any): void {
    if (!this.axiosInstance) {
      return;
    }
    Object.assign(this.axiosInstance.defaults.headers, header);
  }

  /**
   * 拦截器配置
   * @private
   */
  private setupInterceptors() {
    const transform = this.getTransform();
    if (!transform) {
      return;
    }
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform;

    // 请求拦截
    this.axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const {
          headers: { ignoreCancelToken = false },
        } = config;
        !ignoreCancelToken && axiosCanceler.addPending(config);
        if (requestInterceptors && isFunction(requestInterceptors)) {
          config = requestInterceptors(config);
        }
        return config;
      },
      undefined
    );
    // 请求拦截器错误捕获
    requestInterceptorsCatch &&
      isFunction(requestInterceptorsCatch) &&
      this.axiosInstance.interceptors.request.use(
        undefined,
        requestInterceptorsCatch
      );
    // 响应拦截
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res);
      }
      return res;
    }, undefined);
    // 响应结果拦截器错误捕获
    responseInterceptorsCatch &&
      isFunction(responseInterceptorsCatch) &&
      this.axiosInstance.interceptors.response.use(
        undefined,
        responseInterceptorsCatch
      );
  }

  /**
   * @description:   请求方法
   */
  request<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    let conf: AxiosRequestConfig = cloneDeep(config);
    const transform = this.getTransform();

    const opt: RequestOptions = { ...options };

    const { beforeRequestHook, requestCatch, transformRequestData } =
      transform || {};
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt);
    }
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then(async (res: AxiosResponse<Result>) => {
          if (transformRequestData && isFunction(transformRequestData)) {
            const ret = transformRequestData(res, opt);
            if (ret === tokenFakeTimeout) {
              axiosCanceler.removeAllPending();
              window.location.reload();
            } else {
              ret !== errorResult
                ? resolve(ret)
                : reject(new Error('request error!'));
            }
            return;
          }
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error) => {
          if (axios.isCancel(e)) {
            console.warn('请求中断，请不要过于频繁操作！');
            return;
          }
          if (requestCatch && isFunction(requestCatch)) {
            reject(requestCatch(e));
            return;
          }
          reject(e);
        });
    });
  }
}
