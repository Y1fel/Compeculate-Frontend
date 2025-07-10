/**
 * 用户信息管理工具类
 */
class UserManager {
  constructor() {
    this.storageKey = 'userInfo'
    this.userInfo = null
  }

  /**
   * 获取用户信息
   */
  getUserInfo() {
    if (this.userInfo) {
      return this.userInfo
    }
    
    try {
      const userInfo = wx.getStorageSync(this.storageKey)
      if (userInfo && userInfo.nickName) {
        this.userInfo = userInfo
        return userInfo
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
    
    return null
  }

  /**
   * 保存用户信息
   */
  saveUserInfo(userInfo) {
    try {
      this.userInfo = userInfo
      wx.setStorageSync(this.storageKey, userInfo)
      
      // 同时更新全局数据
      const app = getApp()
      if (app && app.globalData) {
        app.globalData.userInfo = userInfo
      }
      
      return true
    } catch (error) {
      console.error('保存用户信息失败:', error)
      return false
    }
  }

  /**
   * 清除用户信息
   */
  clearUserInfo() {
    try {
      this.userInfo = null
      wx.removeStorageSync(this.storageKey)
      
      // 同时清除全局数据
      const app = getApp()
      if (app && app.globalData) {
        app.globalData.userInfo = null
      }
      
      return true
    } catch (error) {
      console.error('清除用户信息失败:', error)
      return false
    }
  }

  /**
   * 检查是否已登录
   */
  isLoggedIn() {
    const userInfo = this.getUserInfo()
    return !!(userInfo && userInfo.nickName)
  }

  /**
   * 检查是否有有效的token
   */
  hasValidToken() {
    const userInfo = this.getUserInfo()
    return !!(userInfo && userInfo.token)
  }

  /**
   * 获取用户token
   */
  getToken() {
    const userInfo = this.getUserInfo()
    return userInfo ? userInfo.token : null
  }

  /**
   * 更新token
   */
  updateToken(token) {
    const currentUserInfo = this.getUserInfo()
    if (!currentUserInfo) {
      return false
    }
    
    const newUserInfo = { ...currentUserInfo, token }
    return this.saveUserInfo(newUserInfo)
  }

  /**
   * 获取用户昵称
   */
  getNickName() {
    const userInfo = this.getUserInfo()
    return userInfo ? userInfo.nickName : ''
  }

  /**
   * 获取用户头像
   */
  getAvatarUrl() {
    const userInfo = this.getUserInfo()
    return userInfo ? userInfo.avatarUrl : ''
  }

  /**
   * 更新用户信息
   */
  updateUserInfo(updates) {
    const currentUserInfo = this.getUserInfo()
    if (!currentUserInfo) {
      return false
    }
    
    const newUserInfo = { ...currentUserInfo, ...updates }
    return this.saveUserInfo(newUserInfo)
  }
}

// 创建单例实例
const userManager = new UserManager()

module.exports = userManager 