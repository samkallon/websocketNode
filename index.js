const ws  = require('ws')
const express = require('express')

// 初始化express实例
const app = express()

// 设置public文件夹为静态文件存放文件夹
app.use('public',express.static('public'))

app.get('/', (req,res) => {
  res.send('Hello World!')
})


// const server = app.listen(8089,()=>{
//   const host = server.address().address
//   const port = server.address().port
//   console.log("Node.JS 服务器已启动，访问地址： http://%s:%s", host, port)
// })


// 创建一个 WebSocket 服务器，监听的是 30002 端口
const webSocketServer = new ws.Server({
  port: 30002,
});

// 监听的是 WebSocket 服务开始监听的事件
webSocketServer.on('listening', (socket) => {
  console.log('web socket begins listening');
});

// 监听的是 WebSocket 服务被客户端连接上的事件
webSocketServer.on('connection', (socket, req) => {

  // 监听的是 服务端收到了客户端发来的消息 事件
  socket.on('message', (data) => {
    console.log(data);
    if (data === 'terminate') {
      socket.close();
      setTimeout(() => {
        webSocketServer.close();
      }, 3000);
    }
  });

  // 监听的是，服务端收到了客户端关闭连接的事件，由客户端发起的关闭
  socket.on('close', (code, reason) => {
    console.log(code);
    console.log(reason);
  });

  // 监听的是，WebSocket 通信过程中出错的事件
  socket.on('error', (error) => {
    console.log('error:');
    console.log(error);
  });

  const ip = req.connection.remoteAddress;
  console.log(ip + ' is connected');
  socket.send('hi');
});
