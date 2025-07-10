// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const userManager = require('../../utils/userManager.js')
const { rankingAPI } = require('../../utils/api.js')

Page({
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    rankingList: [],
    hasMore: true,
    isLoadingMore: false,
    loading: false,
    error: null,
    currentPage: 1,
    pageSize: 20
  },

  onLoad() {
    // 检查登录状态
    this.checkLoginStatus()
    // 加载排行榜数据
    this.loadRankingList()
  },

  onShow() {
    // 每次显示页面时检查登录状态
    this.checkLoginStatus()
  },

  // 检查登录状态
  checkLoginStatus() {
    const userInfo = userManager.getUserInfo()
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
    } else {
      // 如果未登录，跳转到登录页面
      wx.redirectTo({
        url: '/pages/login/login'
      })
    }
  },

  // 加载排行榜数据
  async loadRankingList(refresh = false) {
    if (refresh) {
      this.setData({ currentPage: 1, hasMore: true })
    }

    if (!this.data.hasMore || this.data.loading) {
      return
    }

    this.setData({ 
      loading: true, 
      error: null 
    })

    try {
      const response = await rankingAPI.getRankingList(this.data.currentPage, this.data.pageSize)
      console.log(response)
      const newRankingList = response.data || []
      const total = response.total || 0
      
      if (refresh) {
        this.setData({ rankingList: newRankingList })
      } else {
        this.setData({ 
          rankingList: [...this.data.rankingList, ...newRankingList] 
        })
      }
      
      // 检查是否还有更多数据
      const hasMore = this.data.rankingList.length < total
      this.setData({ 
        hasMore,
        currentPage: this.data.currentPage + 1,
        loading: false 
      })
    } catch (error) {
      console.error('获取排行榜失败:', error)
      this.setData({ 
        error: error.message || '获取排行榜失败',
        loading: false 
      })
      
      // 显示错误提示
      wx.showToast({
        title: '获取排行榜失败',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 加载更多排行榜数据
  async loadMoreRanking() {
    if (this.data.isLoadingMore) return
    
    this.setData({ isLoadingMore: true })
    
    try {
      await this.loadRankingList()
    } catch (error) {
      console.error('加载更多排行榜失败:', error)
    } finally {
      this.setData({ isLoadingMore: false })
    }
  },

  // 开始比赛
  startMatch() {
    wx.showModal({
      title: '开始比赛',
      content: '确定要开始答题比赛吗？比赛过程中请保持专注。',
      success: (res) => {
        if (res.confirm) {
            wx.navigateTo({
                url: '/pages/quiz/quiz'
              })
        }
      }
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadRankingList(true).then(() => {
      wx.stopPullDownRefresh()
    }).catch(() => {
      wx.stopPullDownRefresh()
    })
  },

  // 重试加载
  retryLoad() {
    this.loadRankingList(true)
  }
})
