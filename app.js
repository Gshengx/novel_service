// 引入express
let express = require('express')
// 引入路径处理模块
let path = require('path')
//引入处理解析中间体模块
let bodyParser = require('body-parser')
// 引入cors解决跨域
let cors = require('cors')

//引入路径
let novels_h_router = require('./Routes/novels_h')
let novels_n_router = require('./Routes/novels_n')
let user_router = require('./Routes/user')

// 实例化
let app = express()
app.listen(8081)
console.log('后端服务已开启,现在监听8081端口...')

//使用所需中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
//解析application/json
app.use(bodyParser.json({ limit: '10mb' }))
//解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

//route设置,拦截器在前，route在后。这两者之间位置不能搞混。
app.use('/api/novels_n', novels_n_router)
app.use('/api/novels_h', novels_h_router)
app.use('/api/user', user_router)
// app.use(express.static(path.join(__dirname, 'public')));

module.exports = app
