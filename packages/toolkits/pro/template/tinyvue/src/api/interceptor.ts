import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Modal } from '@opentiny/vue';
import locale from '@opentiny/vue-locale';
import router from '@/router';
import { getToken, clearToken } from '@/utils/auth';

export interface HttpResponse<T = unknown> {
  errMsg: string;
  code: string | number;
  data: T;
}

const { VITE_API_BASE_URL, VITE_BASE_API, VITE_MOCK_IGNORE } = import.meta
  .env || { VITE_BASE_API: '', VITE_MOCK_IGNORE: '' };

if (VITE_API_BASE_URL) {
  axios.defaults.baseURL = VITE_API_BASE_URL;
}

const ignoreMockApiList = VITE_MOCK_IGNORE?.split(',') || [];
axios.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    const isProxy = ignoreMockApiList.includes(config.url);
    if (isProxy) {
      config.url = config.url?.replace(VITE_BASE_API, '/api/v1');
    }

    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers = { ...config.headers };

    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  },
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res = response;
    return res;
  },
  (error) => {
    const { status, data } = error.response;
    if (status === 401) {
      clearToken();
      router.replace({ name: 'login' });
      Modal.message({
        message: locale.t('http.error.TokenExpire'),
        status: 'error',
      });
    }

    return Promise.reject(error);
  },
);
