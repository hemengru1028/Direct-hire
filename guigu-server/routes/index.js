
var express = require('express')
var router = express.Router()
const md5 = require('blueimp-md5') //md5加密的函数
const { UserModel,ChatModel } = require('../../guigu-server/db/models')
const filter = {password:0,__v:0}  //查询时过滤出指定的属性


// 注册路由
router.post('/register', (req, res) => {
    // 读取请求参数
    const { username, password, type } = req.body
    
    // 处理:判断用户是否已经存在；如果已经存在提示错误信息，不存在则保存
    UserModel.findOne({ username }, (err, user) => {
        // 如果 user 有值 已存在
        if (user) {  //存在  提示错误信息
            res.send({code:1,msg:'此用户已存在'})
        }
        else {  // 不存在 保存
            new UserModel({ username, type, password:md5(password) }).save((err, user) => {

                // 生成一个 cookie(userid: user._id), 并交给浏览器保存
                res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 * 7 }) // 持久化 cookie, 浏`览器会保存在本地文件
                // 返回包含user的json数据
                const data = {username, type, _id:user._id}  //响应数据中不要携带password
                res.send({code:0 ,data})
            })
        }
    })



    // 返回响应数据
})


// 登录路由
router.post('/login', (req, res) => {
    const { username, password } = req.body
    // 根据username和password查询数据库users集合
    UserModel.findOne({ username, password: md5(password) }, filter,(err, user) => {
        if (user) {
            // 登录成功
             // 生成一个 cookie(userid: user._id), 并交给浏览器保存
             res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 * 7 }) // 持久化 cookie, 浏 览器会保存在本地文件
            // 返回成功信息
            res.send({code:0, data:user})
            
        }
        else {
            // 登录失败
            res.send({code:1,msg:'用户名或密码不正确'})
        }
    })
})


// 更新用户信息的路由
router.post('/update', function (req, res) {
    // 从请求的cookie得到userid
    const userid = req.cookies.userid
    // 如果不存在, 直接返回一个提示信息
    if(!userid) {
      return res.send({code: 1, msg: '请先登陆'})
    }
    // 存在, 根据userid更新对应的user文档数据
    // 得到提交的用户数据
 
    const user = req.body // 没有_id
    // console.log(userid);
    UserModel.findByIdAndUpdate({_id: userid}, user, function (err, oldUser) {
  
      if(!oldUser) {
        // 通知浏览器删除userid cookie
          // console.log('okok');
        res.clearCookie('userid')
        // 返回返回一个提示信息
        res.send({code: 1, msg: '请先登陆'})
      } else {
        // 准备一个返回的user数据对象
        const {_id, username, type} = oldUser
        const data = Object.assign({_id, username, type}, user)
        // 返回
        res.send({code: 0, data})
      }
    })
  })


// 获取用户信息的路由
router.get('/user', (req, res) => {
  // 从请求的cookie中获取userid
  const userid = req.cookies.userid
  // 如果不存在, 直接返回一个提示信息
  if(!userid) {
    return res.send({code: 1, msg: '请先登陆'})
  }
  else {
    // console.log('okok');
    UserModel.findOne(
     { _id: userid}, filter, function(err, user) {
      res.send({code:0,data:user})
     })
  }
})



// 获取用户列表(根据用户type获取)
router.get('/userlist', function (req, res) {
  const { type } = req.query
  UserModel.find({ type }, filter, function (err, users) {
    res.send({code:0, data:users})
  })
})


/*
获取当前用户所有相关聊天信息列表
 */
router.get('/msglist', function (req, res) {
  // 获取cookie中的userid
  const userid = req.cookies.userid
  // 查询得到所有user文档数组
  UserModel.find(function (err, userDocs) {
    // 用对象存储所有user信息: key为user的_id, val为name和header组成的user对象
    const users = {} // 对象容器
    userDocs.forEach(doc => {
      users[doc._id] = {username: doc.username, header: doc.header}
    })

    // const users = userDocs.reduce((users, user) => {
    //   users[user._id] = {username: user.username, header: user.header}
    //   return users
    // } , {})
    /*
    查询userid相关的所有聊天信息
     参数1: 查询条件
     参数2: 过滤条件
     参数3: 回调函数
    */
    ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (err, chatMsgs) {
      // 返回包含所有用户和当前用户相关的所有聊天消息的数据
      res.send({code: 0, data: {users, chatMsgs}})
    })
  })
})



// 修改指定消息为已读
router.post('/readmsg', function (req, res) {
  // 得到请求中的from和to
  const from = req.body.from
  const to = req.cookies.userid

   /*更新数据库中的 chat 数据 
   参数 1: 查询条件 
   参数 2: 更新为指定的数据对象 
  参数 3: 是否 1 次更新多条, 默认只更新一条 
  参数 4: 更新完成的回调函数 */

  ChatModel.updateMany(
    { from, to, read: false },
    { read: true },
    { multi: true }, //一次更新多条
    function (err, doc) {
      // console.log('/readmsg', doc)
      res.send({ code: 0, data: doc.nModified }) // 更新的数量 
    })

})






  module.exports = router;