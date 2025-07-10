Page({
  data: {
    timeLeft: 30,
    timerPercent: '100%',
    timerBarColor: 'linear-gradient(90deg, #43e97b, #38f9d7)',
    formula: '',
    answer: 0,
    options: [],
    total: 0,
    correct: 0,
    timer: null,
    activeWrongIndex: null
  },

  onLoad() {
    this.startQuiz()
  },

  onUnload() {
    if (this.data.timer) clearInterval(this.data.timer)
  },

  startQuiz() {
    this.setData({
      timeLeft: 30,
      timerPercent: '100%',
      timerBarColor: 'linear-gradient(90deg, #43e97b, #38f9d7)',
      total: 0,
      correct: 0,
      activeWrongIndex: null
    })
    this.nextQuestion()
    this.startTimer()
  },

  startTimer() {
    if (this.data.timer) clearInterval(this.data.timer)
    let interval = setInterval(() => {
      let t = this.data.timeLeft - 1
      let percent = (t / 30 * 100).toFixed(2) + '%'
      let color = 'linear-gradient(90deg, #43e97b, #38f9d7)'
      if (t <= 10) {
        color = 'linear-gradient(90deg, #ff4e50, #f9d423)'
      } else if (t <= 20) {
        color = 'linear-gradient(90deg, #f9d423, #fffc00)'
      }
      this.setData({
        timeLeft: t,
        timerPercent: percent,
        timerBarColor: color
      })
      if (t <= 0) {
        clearInterval(interval)
        this.setData({ timer: null })
        this.finishQuiz()
      }
    }, 1000)
    this.setData({ timer: interval })
  },

  nextQuestion() {
    // 随机生成2-3项的加减乘除混合公式
    let n = Math.random() > 0.5 ? 2 : 3
    let nums = []
    let ops = []
    let opList = ['+', '-', '*', '/']
    for (let i = 0; i < n; i++) {
      nums.push(Math.floor(Math.random() * 20) + 1)
      if (i < n - 1) ops.push(opList[Math.floor(Math.random() * opList.length)])
    }
    // 保证除法分母不为0，且结果为整数
    for (let i = 0; i < ops.length; i++) {
      if (ops[i] === '/') {
        nums[i] = nums[i+1] * (Math.floor(Math.random() * 5) + 1)
      }
    }
    let formula = ''
    for (let i = 0; i < n; i++) {
      formula += nums[i]
      if (i < n - 1) formula += ' ' + ops[i] + ' '
    }
    // 计算答案
    let numArr = nums.slice()
    let opArr = ops.slice()
    // 乘除
    for (let i = 0; i < opArr.length; ) {
      if (opArr[i] === '*' || opArr[i] === '/') {
        let res = opArr[i] === '*' ? numArr[i] * numArr[i+1] : numArr[i] / numArr[i+1]
        numArr.splice(i, 2, res)
        opArr.splice(i, 1)
      } else {
        i++
      }
    }
    // 加减
    let answer = numArr[0]
    for (let i = 0; i < opArr.length; i++) {
      if (opArr[i] === '+') answer += numArr[i+1]
      else if (opArr[i] === '-') answer -= numArr[i+1]
    }
    // 四舍五入保留两位小数
    if (typeof answer === 'number' && !Number.isInteger(answer)) {
      answer = Math.round(answer * 100) / 100
    }
    // 生成3个不等于答案的干扰项
    let fakes = new Set()
    while (fakes.size < 3) {
      let delta = Math.floor(Math.random() * 8) + 1
      let fake = Math.random() > 0.5 ? answer + delta : answer - delta
      if (fake !== answer) fakes.add(fake)
    }
    let options = [answer, ...Array.from(fakes)]
    // 随机打乱顺序
    options = options.sort(() => Math.random() - 0.5)
    this.setData({
      formula,
      answer,
      options,
      activeWrongIndex: null
    })
  },

  chooseAnswer(e) {
    let val = Number(e.currentTarget.dataset.value)
    let idx = Number(e.currentTarget.dataset.idx)
    let { answer, total, correct } = this.data
    total++
    if (val === answer) {
      correct++
      this.setData({ total, correct, activeWrongIndex: null })
      this.nextQuestion()
    } else {
      this.setData({ activeWrongIndex: idx, total, correct })
      setTimeout(() => {
        this.setData({ activeWrongIndex: null })
        this.nextQuestion()
      }, 500)
    }
  },

  finishQuiz() {
    wx.redirectTo({
      url: '/pages/result/result?total=' + this.data.total + '&correct=' + this.data.correct
    })
  }
}) 