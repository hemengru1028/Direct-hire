/*包含 n 个能操作 mongodb 数据库集合的 model 的模块 
1. 连接数据库
   1.1. 引入 mongoose
   1.2. 连接指定数据库(URL 只有数据库是变化的) 
   1.3. 获取连接对象 
   1.4. 绑定连接完成的监听(用来提示连接成功)
2. 定义出对应特定集合的 Model 并向外暴露
   2.1. 字义 Schema(描述文档结构)
   2.2. 定义 Model(与集合对应, 可以操作集合)
   2.3. 向外暴露 Model 
*/

/* 1. 连接数据库 */
// 引入数据库
const mongoose = require('mongoose')
// 连接指定数据库
mongoose.connect('mongodb://localhost/guiguzp', { useNewUrlParser: true, useUnifiedTopology: true })
// 获取连接对象
const conn = mongoose.connection
// 绑定连接完成的监听(用来提示连接成功)
conn.on('connected',  () =>{
    console.log('数据库连接成功');
})

/* 2.得到对应特定集合的 Model */
// Schema (描述文档结构)
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    type: {  //用户类型
        type: String,
        required:true
    },
    header: { //头像
        type:String
    },
    post: {  //职位
        type:String
    },
    info: {  //个人或职位介绍
        type:String
    },
   company: {  //公司名称
        type:String
    },
    salary: {  //工资 
        type:String
    },
   

})


// 定义user Model
const UserModel = mongoose.model('user', userSchema) //集合名为users


// 向外暴露 user Model
exports.UserModel = UserModel



// 定义 chats 集合的文档结构 
const chatSchema = mongoose.Schema({
    from: { type: String, required: true }, // 发送用户的 id 
    to: { type: String, required: true }, // 接收用户的 id 
    chat_id: { type: String, required: true }, // from 和 to 组成的字符串
    content: { type: String, required: true }, // 内容 
    read: { type: Boolean, default: false }, // 标识是否已读 
    create_time: { type: Number } // 创建时间 
})
// 定义能操作 chats 集合数据的 Model
const ChatModel = mongoose.model('chat', chatSchema)
// 向外暴露
 exports.ChatModel = ChatModel