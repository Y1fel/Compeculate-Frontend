// pages/login/login.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const userManager = require('../../utils/userManager.js')
const { userAPI } = require('../../utils/api.js')

Page({
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    isLoading: false,
    error: null
  },

  onLoad() {
    // 检查是否已经登录
    this.checkLoginStatus()
  },

  // 检查登录状态
  checkLoginStatus() {
    const userInfo = userManager.getUserInfo()
    if (userInfo && userInfo.nickName && userInfo.avatarUrl !== defaultAvatarUrl) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
      // 如果已登录，跳转到主页
      this.navigateToHome()
    }
  },

  // 选择头像
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      error: null
    })
  },

  // 输入昵称
  onInputChange(e) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      error: null
    })
  },

  // 获取用户信息（兼容旧版本）
  getUserProfile(e) {
    this.setData({ isLoading: true, error: null })
    wx.getUserProfile({
      desc: '用于完善答题系统用户资料',
      success: (res) => {
        console.log('获取用户信息成功:', res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          isLoading: false
        })
        this.loginWithUserInfo(res.userInfo)
      },
      fail: (err) => {
        console.error('获取用户信息失败:', err)
        this.setData({ 
          isLoading: false,
          error: '获取用户信息失败，请重试'
        })
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        })
      }
    })
  },

  // 完成登录
  onLoginComplete() {
    const { userInfo, hasUserInfo } = this.data
    
    if (!hasUserInfo) {
      this.setData({ error: '请完善用户信息' })
      wx.showToast({
        title: '请完善用户信息',
        icon: 'none'
      })
      return
    }

    this.loginWithUserInfo(userInfo)
  },

  // 使用用户信息进行登录
  async loginWithUserInfo(userInfo) {
    this.setData({ 
      isLoading: true, 
      error: null 
    })

    try {
      // 调用后端登录接口
      const loginResult = await userAPI.login(userInfo)
      console.log('登录成功:', loginResult)
      
      // 保存用户信息到本地，包括token
      const userInfoWithToken = {
        ...userInfo,
        token: loginResult.data?.token || null
      }
      
      const saveSuccess = userManager.saveUserInfo(userInfoWithToken)
      if (!saveSuccess) {
        throw new Error('保存用户信息失败')
      }

      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })
      
      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        this.navigateToHome()
      }, 1500)

    } catch (error) {
      console.error('登录失败:', error)
      
      this.setData({ 
        isLoading: false,
        error: error.message || '登录失败，请重试'
      })
      
      wx.showToast({
        title: error.message || '登录失败',
        icon: 'none',
        duration: 2000
      })
    } finally {
      this.setData({ isLoading: false })
    }
  },

  // 跳转到主页
  navigateToHome() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  // 重试登录
  retryLogin() {
    this.setData({ error: null })
    if (this.data.hasUserInfo) {
      this.onLoginComplete()
    }
  }
}) 