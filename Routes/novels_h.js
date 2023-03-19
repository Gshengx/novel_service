// 引入路由
const router = require('express').Router()
//引入封装好的数据库操作
let db = require('../db.js')

// 测试
router.get('/test', (req, res) => {
  let sql = db.test('h')
  console.log('连接数据库测试')
  db.Query(sql).then(
    (data) => {
      res.send({ code: '200', data: data })
    },
    (err) => {
      console.log(err)
      res.send({ code: '400', err: '服务器开小差了' })
    }
  )
})

//获取更新的数据
router.get('/getLastNovels', (req, res) => {
  let sql = db.getLastNovels('h',req.body.current, req.body.size||10)
  console.log('获取昨天更新的数据')
  db.Query(sql).then(
    (data) => {
      res.send({ code: '200', data: data })
    },
    (err) => {
      res.send({ code: '400', err: '服务器开小差了' })
    }
  )
})

//根据搜索关键词获取列表
router.post('/getNovelsByKeyword', (req, res) => {
  let sql = db.getNovelsByKeyword('h',req.body.current,req.body.size||10,req.body.keyword)
  console.log('根据搜索关键词获取列表')
  db.Query(sql).then(
    (data) => {
      res.send({ code: '200', data: data })
    },
    (err) => {
      res.send({ code: '400', err: '服务器开小差了' })
    }
  )
})

module.exports = router
