const express = require('express')

// 初始化express实例
const app = express()

// 设置public文件夹为静态文件存放文件夹
app.use('public',express.static('public'))

app.get('/', (req,res) => {
  res.send('Hello World!')
})

const server = app.listen(8089,()=>{
  const host = server.address().address
  const port = server.address().port
  console.log("Node.JS 服务器已启动，访问地址： http://%s:%s", host, port)
})

