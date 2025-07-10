// pages/profile/profile.js
const userManager = require('../../utils/userManager.js')
const { userAPI } = require('../../utils/api.js')

Page({
  data: {
    userInfo: null,
    stats: {
      totalQuizzes: 0,
      totalScore: 0,
      accuracy: 0,
      ranking: 0
    },
    loading: false,
    error: null
  },

  onLoad() {
    this.loadUserInfo()
    this.loadUserStats()
  },

  onShow() {
    // 刷新用户信息
    this.loadUserInfo()
    this.loadUserStats()
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = userManager.getUserInfo()
    if (userInfo) {
      this.setData({ userInfo })
    } else {
      // 如果未登录，跳转到登录页面
      wx.redirectTo({
        url: '/pages/login/login'
      })
    }
  },

  // 加载用户统计
  async loadUserStats() {
    this.setData({ 
      loading: true, 
      error: null 
    })

    try {
      const stats = await userAPI.getUserStats()
      console.log(stats)
      // 格式化数据
      const formattedStats = {
        totalQuizzes: stats.data.totalQuizzes || 0,
        totalScore: stats.data.totalScore || 0,
        accuracy: stats.data.accuracy || 0,
        ranking: stats.ranking || 0
      }
      console.log(formattedStats)
      this.setData({ 
        stats: formattedStats,
        loading: false 
      })
    } catch (error) {
      console.error('获取用户统计失败:', error)
      this.setData({ 
        error: error.message || '获取统计数据失败',
        loading: false 
      })
      
      // 显示错误提示
      wx.showToast({
        title: '获取统计数据失败',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 刷新统计数据
  onRefreshStats() {
    this.loadUserStats()
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          userManager.clearUserInfo()
          wx.redirectTo({
            url: '/pages/login/login'
          })
        }
      }
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadUserStats().then(() => {
      wx.stopPullDownRefresh()
    }).catch(() => {
      wx.stopPullDownRefresh()
    })
  }
}) 