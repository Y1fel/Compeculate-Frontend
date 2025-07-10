/**
 * API服务模块
 * 处理与后端的所有HTTP请求
 */

// API基础配置
const API_CONFIG = {
  // 开发环境
  development: {
    baseUrl: 'http://localhost:8080/api',
    timeout: 10000
  },
  // 生产环境
  production: {
    baseUrl: 'https://your-production-domain.com/api',
    timeout: 10000
  }
}

// 根据环境选择配置
const config = API_CONFIG.development

/**
 * 通用请求方法
 */
function request(options) {
  return new Promise((resolve, reject) => {
    const { url, method = 'GET', data = {}, header = {} } = options
    
    // 获取用户token
    const userManager = require('./userManager.js')
    const userInfo = userManager.getUserInfo()
    
    // 设置请求头
    const requestHeader = {
      'Content-Type': 'application/json',
      ...header
    }
    
    // 如果有用户信息，添加认证头
    if (userInfo && userInfo.token) {
      requestHeader['Authorization'] = `Bearer ${userInfo.token}`
    }
    
    wx.request({
      url: `${config.baseUrl}${url}`,
      method: method,
      data: data,
      header: requestHeader,
      timeout: config.timeout,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          // 未授权，清除用户信息并跳转到登录页
          userManager.clearUserInfo()
          wx.redirectTo({
            url: '/pages/login/login'
          })
          reject(new Error('未授权访问'))
        } else {
          reject(new Error(res.data.message || '请求失败'))
        }
      },
      fail: (err) => {
        console.error('API请求失败:', err)
        reject(new Error('网络请求失败'))
      }
    })
  })
}

/**
 * 用户相关API
 */
const userAPI = {
  // 用户登录
  login: (userInfo) => {
    return request({
      url: '/user/login',
      method: 'POST',
      data: {
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl
      }
    })
  },
  
  // 获取用户统计信息
  getUserStats: () => {
    return request({
      url: '/user/stats',
      method: 'GET'
    })
  },
  
  // 获取用户详细信息
  getUserProfile: () => {
    return request({
      url: '/user/profile',
      method: 'GET'
    })
  }
}

/**
 * 答题相关API
 */
const quizAPI = {
  // 提交答题结果
  submitQuizResult: (data) => {
    return request({
      url: '/quiz/submit',
      method: 'POST',
      data: data
    })
  }
}

/**
 * 排行榜相关API
 */
const rankingAPI = {
  // 获取排行榜列表
  getRankingList: (page = 1, limit = 20) => {
    return request({
      url: '/ranking/list',
      method: 'GET',
      data: { page, limit }
    })
  }
}

module.exports = {
  request,
  userAPI,
  quizAPI,
  rankingAPI
} 