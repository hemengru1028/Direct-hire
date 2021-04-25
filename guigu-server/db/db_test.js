/* 
    测试使用mongoose操作数据库
*/

const md5 = require('blueimp-md5') //md5加密的函数

/* 1. 连接数据库 */
// 引入数据库
const mongoose = require('mongoose')
// 连接指定数据库
mongoose.connect('mongodb://localhost/guiguzp', { useNewUrlParser: true, useUnifiedTopology: true })
// 获取连接对象
const conn = mongoose.connection
// 绑定连接完成的监听(用来提示连接成功)
conn.on('connected', function () {
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
    }
})


// 定义Model
const UserModel = mongoose.model('user', userSchema) //集合名为users

// 3.1. 通过 Model 实例的 save()添加数据 
function testSave()
{
    //创建 UserModel 的实例
    const userModel = new UserModel({
        username: 'xfzhang', password: md5('1234'), type: 'dashen'
    })

    // 调用 save()保存到数据库 
    userModel.save(function (err, user) { console.log('save', err, user) })
}

testSave()