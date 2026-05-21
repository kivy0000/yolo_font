import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from "../router";
import { ElMessage } from 'element-plus'

export interface Data {
  code: number
  message?: string
}

export interface Pagination {
  currentPage: number
  pageSize: number
  total: number
}

export interface NormalData<T = unknown> extends Data {
  data: T
}

export interface ListData<Row = unknown> extends Data {
  data: {
    list: Row[]
    pagination: Pagination
  }
}

interface FormDataObject {
  [key: string]: any
}

NProgress.configure({
  easing: 'ease',
  showSpinner: false
})

const request = axios.create({
  // baseURL: import.meta.env.VITE_BASE_API,
  timeout: 10000, //请求超时时间
  withCredentials: true,
  headers: {
    // 'Content-Type': 'application/json'
  }
})
// 请求拦截器
request.interceptors.request.use(
  (config) => {
    if (!config.url?.includes('/api/Public')) {
      NProgress.start()
    }
    return config
  },
  (error) => {
    console.log('request error')
    NProgress.done()
    return Promise.reject(error)
  }
)

// let isRedirecting = false
function relogin() {
  router.push({ path: '/login' })
}

function handleNetworkError(errStatus: number) {
  let errMessage = '未知错误'
  if (errStatus) {
    switch (errStatus) {
      case 400:
        errMessage = '请求数据格式错误'
        break
      case 403:
        errMessage = '无权访问'
        break
      case 404:
        errMessage = '找不到资源'
        break
      case 411:
        errMessage = '缺少参数' // WebAuthInterceptor
        break
      case 412:
        errMessage = '长时间未操作，请重新登录登录！' // WebAuthInterceptor 长时间未操作，请重新登录
        break
      case 413:
        errMessage = '参数错误' // WebAuthInterceptor
        break
      case 415:
        errMessage = '授权已过期'
        break
      case 500:
        errMessage = '系统执行出错，请联系管理员'
        break
      default:
        errMessage = `其他错误[代码${errStatus}]`
    }
  } else {
    errMessage = `未知错误！`
  }

  // 需要重新登录
  if (errStatus === 411 || errStatus === 412 || errStatus === 413 || errStatus === 415) {
    // if (!isRedirecting) {
    //   isRedirecting = true
    //   ElMessage.error({
    //     message: errMessage,
    //     onClose: () => {
    //       isRedirecting = false
    //     }
    //   })
    //   relogin()
    // }
    ElMessage.error(errMessage)
    relogin()
  } else {
    ElMessage.error(errMessage)
  }
}

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    NProgress.done()
    if (response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer') {
      return response
    }
    if (response.data.code != 200) {
      ElMessage.error(response.data.message)
      return Promise.reject(new Error(response.data.message || 'Error'))
    }
    return response.data // 注意这里不是直接返回response
  },
  async (error) => {
    const response = error.response
    NProgress.done()
    handleNetworkError(response.status)
    return Promise.reject(error)
  }
)

/**
 * 将对象转换为 FormData 格式
 * @param data 要转换的对象
 * @returns FormData 实例
 */
function objectToFormData(data: FormDataObject): FormData {
  const formData = new FormData()
  for (const key in data) {
    formData.append(key, data[key])
  }
  return formData
}

/**
 * 发起 POST 请求，以 FormData 格式提交数据
 * @param url 请求的URL
 * @param formDataObject 包含要提交的数据的对象
 * @returns Promise<Data>
 */
export const postForm = async function (
  url: string,
  formDataObject: FormDataObject | FormData
): Promise<Data> {
  try {
    const response = (await request.post(
      url,
      Object.prototype.toString.call(formDataObject) === '[object FormData]'
        ? formDataObject
        : objectToFormData(formDataObject),
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )) as Data

    return response
  } catch (error) {
    throw new Error(`Error during POST request: ${(error as Error).message}`)
  }
}

export default request
