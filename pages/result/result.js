// pages/result/result.js
const { quizAPI } = require('../../utils/api.js')

Page({
  data: {
    total: 0,
    correct: 0,
    accuracy: 0,
    score: 0,
    submitting: false
  },

  onLoad(options) {
    const total = Number(options.total || 0)
    const correct = Number(options.correct || 0)
    const accuracy = total > 0 ? Math.round(correct / total * 100) : 0
    const score = Math.round(accuracy * 10) // 简单的分数计算
    
    this.setData({ total, correct, accuracy, score })
    
    // 提交答题结果到后端
    this.submitQuizResult()
  },

  // 提交答题结果
  async submitQuizResult() {
    this.setData({ submitting: true })
    
    try {
      const result = await quizAPI.submitQuizResult({
        totalQuestions: this.data.total,
        correctAnswers: this.data.correct,
        totalTime: 30 * this.data.total, // 估算总时间
        score: this.data.score
      })
      
      console.log('答题结果提交成功:', result)
      
      // 可以在这里处理提交成功后的逻辑
      // 比如更新用户统计信息等
      
    } catch (error) {
      console.error('提交答题结果失败:', error)
      
      // 显示错误提示，但不影响用户查看结果
      wx.showToast({
        title: '提交结果失败，但不影响您的答题记录',
        icon: 'none',
        duration: 3000
      })
    } finally {
      this.setData({ submitting: false })
    }
  },

  goHome() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
}) 