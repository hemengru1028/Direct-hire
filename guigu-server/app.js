// 配置

const express = require("express");
var bodyParser = require('body-parser')
const router = require('./routes/index')
var cookieParser = require('cookie-parser');



var app = express();
app.use(cookieParser()); //配置后端cookie-parser



// 配置解析表单 POST 请求体插件（注意：一定要在 app.use(router) 之前 ）
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())




// var server = http.createServer(app)
// require('./socketIO/test')(server)  //执行函数


app.use(router)


module.exports = app


// app.listen(4000, () => console.log('server is listening on port 4000!'))




