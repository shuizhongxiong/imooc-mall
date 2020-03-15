/**
 * axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios';
import { Message } from 'element-ui';
import store from '../store/index';

// 创建axios实例
const service = axios.create({
  baseURL: '',
  timeout: 10000, // 请求超时时间
});

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
service.interceptors.request.use(
  config => {
    // 设置 token header
    /* const token = store.state.token
		token && (config.headers.Authorization = token) */
    return config;
  },
  error => {
    return Promise.error(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      if (response.data && response.data.code !== 200) {
        errorHandle(response.data.code, response.data.msg);
      }
      return Promise.resolve(response);
    } else {
      errorHandle(response.status, response.data.msg);
      return Promise.reject(response);
    }
  },
  error => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.msg);
      return Promise.reject(response);
    } else {
      // 处理断网的情况
      if (!window.navigator.onLine) {
        showMessage('网络出错');
      }
    }
  },
);

export default service;

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    service
      .get(url, { params })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object} config [请求时携带的参数]
 */
export function post(url, params, config) {
  return new Promise((resolve, reject) => {
    service
      .post(url, params, config)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, message) => {
  // 状态码判断
  switch (status) {
    case 40101: // 当前未登录
      showMessage(message);
      store.commit('changeLoginVisible', true);
      break;
    case 500:
      showMessage(message);
      break;
    default:
      console.log(message);
  }
};

/**
 * 提示函数，显示一秒后关闭
 */
const showMessage = message => {
  if (!message) {
    return false;
  }
  Message.error(message);
};
