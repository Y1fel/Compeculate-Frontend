// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 检查登录状态
    this.checkLoginStatus()

    // 微信登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('微信登录成功:', res.code)
      },
      fail: err => {
        console.error('微信登录失败:', err)
      }
    })
  },

  // 检查登录状态
  checkLoginStatus() {
    try {
      const userInfo = wx.getStorageSync('userInfo')
      if (userInfo && userInfo.nickName) {
        this.globalData.userInfo = userInfo
        console.log('用户已登录:', userInfo.nickName)
      } else {
        console.log('用户未登录')
      }
    } catch (error) {
      console.error('检查登录状态失败:', error)
    }
  },

  // 设置用户信息
  setUserInfo(userInfo) {
    this.globalData.userInfo = userInfo
    try {
      wx.setStorageSync('userInfo', userInfo)
    } catch (error) {
      console.error('保存用户信息失败:', error)
    }
  },

  // 清除用户信息
  clearUserInfo() {
    this.globalData.userInfo = null
    try {
      wx.removeStorageSync('userInfo')
    } catch (error) {
      console.error('清除用户信息失败:', error)
    }
  },

  // 检查是否已登录
  isLoggedIn() {
    return !!(this.globalData.userInfo && this.globalData.userInfo.nickName)
  },

  globalData: {
    userInfo: null
  }
})
