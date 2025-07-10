# 微信小程序答题系统

这是一个基于微信小程序的答题系统，包含完整的用户登录、答题、排行榜等功能模块，采用现代化的界面设计。

## 功能特性

### 用户系统
- 微信授权登录
- 用户信息管理（昵称、头像）
- 登录状态持久化
- 自动登录检查
- 退出登录功能

### 答题系统
- 随机题目生成
- 答题计时功能
- 答题结果统计
- 正确率计算
- 分数计算算法

### 排行榜系统
- 用户排行榜展示
- 分页加载
- 下拉刷新
- 前三名特殊样式

### 个人中心
- 用户统计信息（总答题数、总分数、正确率、排名）
- 下拉刷新数据
- 自动数据加载

## 项目结构

```
Compeculate/
├── app.js                 # 应用入口文件
├── app.json              # 应用配置文件（包含TabBar配置）
├── app.wxss              # 应用全局样式
├── pages/
│   ├── login/            # 登录页面
│   │   ├── login.js      # 登录页面逻辑
│   │   ├── login.wxml    # 登录页面结构
│   │   ├── login.wxss    # 登录页面样式
│   │   └── login.json    # 登录页面配置
│   ├── index/            # 首页
│   │   ├── index.js      # 首页逻辑
│   │   ├── index.wxml    # 首页结构
│   │   ├── index.wxss    # 首页样式
│   │   └── index.json    # 首页配置
│   ├── quiz/             # 答题页面
│   │   ├── quiz.js       # 答题页面逻辑
│   │   ├── quiz.wxml     # 答题页面结构
│   │   ├── quiz.wxss     # 答题页面样式
│   │   └── quiz.json     # 答题页面配置
│   ├── result/           # 答题结果页面
│   │   ├── result.js     # 结果页面逻辑
│   │   ├── result.wxml   # 结果页面结构
│   │   ├── result.wxss   # 结果页面样式
│   │   └── result.json   # 结果页面配置
│   ├── profile/          # 个人页面
│   │   ├── profile.js    # 个人页面逻辑
│   │   ├── profile.wxml  # 个人页面结构
│   │   ├── profile.wxss  # 个人页面样式
│   │   └── profile.json  # 个人页面配置
│   └── logs/             # 日志页面
├── utils/
│   ├── util.js           # 通用工具函数
│   ├── userManager.js    # 用户信息管理工具
│   └── api.js            # API 接口管理
└── README.md             # 项目说明文档
```

## 使用说明

### 1. 登录流程
1. 用户首次进入应用会自动跳转到登录页面
2. 用户通过微信授权获取头像和昵称
3. 登录成功后自动跳转到首页
4. 登录状态会持久化保存

### 2. 答题流程
1. 在首页点击"开始答题"进入答题页面
2. 系统随机生成题目，开始计时
3. 用户选择答案，系统自动判断正误
4. 答题完成后显示结果页面
5. 结果自动提交到服务器

### 3. 排行榜功能
1. 在首页可以查看排行榜
2. 支持分页加载更多数据
3. 下拉刷新获取最新排名
4. 前三名有特殊样式展示

### 4. 个人中心
1. 查看个人统计信息
2. 下拉刷新更新数据
3. 支持退出登录功能

## API 接口说明

### 认证方式
所有 API 接口都需要 Bearer Token 认证，格式：`Authorization: Bearer <token>`

### 用户相关接口

#### 1. 用户登录
```
POST /api/user/login
Content-Type: application/json

Request:
{
  "code": "string"  // 微信授权码
}

Response:
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "string",
    "userInfo": {
      "nickname": "string",
      "avatarUrl": "string"
    }
  }
}
```

#### 2. 获取用户统计
```
GET /api/user/stats
Authorization: Bearer <token>

Response:
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "totalQuizzes": 10,
    "totalScore": 850,
    "accuracy": 85.5,
    "ranking": 5
  }
}
```

### 答题相关接口

#### 3. 提交答题结果
```
POST /api/quiz/submit
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "totalQuestions": 10,
  "correctAnswers": 8,
  "timeSpent": 120,
  "score": 85
}

Response:
{
  "code": 200,
  "message": "提交成功",
  "data": {
    "accuracy": 80.0,
    "ranking": 5
  }
}
```

### 排行榜相关接口

#### 4. 获取排行榜
```
GET /api/ranking?page=1&limit=20
Authorization: Bearer <token>

Response:
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "nickname": "string",
        "avatarUrl": "string",
        "totalScore": 1000,
        "accuracy": 90.5,
        "ranking": 1
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

## 工具类说明

### UserManager 类
```javascript
const userManager = require('./utils/userManager.js')

// 获取用户信息
const userInfo = userManager.getUserInfo()

// 保存用户信息
userManager.saveUserInfo(userInfo)

// 获取 token
const token = userManager.getToken()

// 保存 token
userManager.saveToken(token)

// 检查登录状态
const isLoggedIn = userManager.isLoggedIn()

// 清除用户信息
userManager.clearUserInfo()
```

### API 工具类
```javascript
const { userAPI, quizAPI, rankingAPI } = require('./utils/api.js')

// 用户登录
const loginResult = await userAPI.login(code)

// 获取用户统计
const stats = await userAPI.getUserStats()

// 提交答题结果
const result = await quizAPI.submitQuiz(data)

// 获取排行榜
const ranking = await rankingAPI.getRanking(page, limit)
```

## 开发说明

### 环境要求
- 微信开发者工具
- 微信小程序基础库 2.10.4 及以上版本
- Node.js 后端服务

### 开发步骤
1. 克隆项目到本地
2. 使用微信开发者工具打开项目
3. 配置后端 API 地址
4. 在模拟器中测试各项功能
5. 真机调试验证

### 配置说明
在 `utils/api.js` 中配置后端 API 地址：
```javascript
const BASE_URL = 'https://your-api-domain.com'
```
## 许可证

MIT License 
