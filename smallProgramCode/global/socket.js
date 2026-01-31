// global/socket.js
const SocketTask = wx.connectSocket({
	url: 'wss://http:localhost:8080', // 替换为实际的WebSocket服务器地址
  });
   
  let socketClientTimer; // 心跳定时器
   
  // 开启WebSocket连接
  function openSocketConnection() {
	wx.onSocketOpen(function (res) {
	  console.log('WebSocket连接已打开！');
	  startHeartbeat(); // 连接建立后开始心跳检测
	});
   
	wx.onSocketError(function (err) {
	  console.error('WebSocket连接发生错误：', err);
	});
   
	wx.onSocketMessage(function (res) {
	  // 处理服务器返回的消息
	  console.log('收到服务器内容：', res.data);
	  handleServerMessage(res.data);
	});
  }
   
  // 发送心跳
  function startHeartbeat() {
	socketClientTimer = setInterval(() => {
	  if (wx.getSocketState().readyState === 1) { // 只有在连接已建立时才发送心跳
		wx.sendSocketMessage({ data: 'ping' }); // 发送心跳数据
	  } else {
		clearInterval(socketClientTimer); // 如果连接非活动状态，则停止心跳计时器
	  }
	}, 30000); // 每30秒发送一次心跳（这里的时间可以根据实际情况调整）
  }
   
  // 关闭WebSocket连接
  function closeSocketConnection() {
	wx.closeSocket();
	clearInterval(socketClientTimer); // 当关闭连接时也同时停止心跳计时器
  }
   
  // 发送消息到服务器
  function sendMessage(msg) {
	if (wx.getSocketState().readyState === 1) {
	  wx.sendSocketMessage({ data: msg });
	} else {
	  console.warn('WebSocket连接未建立，无法发送消息');
	}
  }
   
  // 在小程序onHide生命周期内关闭连接或做相应处理
  function onHide() {
	closeSocketConnection();
  }
   
  // 将上述方法暴露出去
  module.exports = {
	openSocketConnection,
	closeSocketConnection,
	sendMessage,
	onHide,
  };