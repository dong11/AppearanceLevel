//index.js
//获取应用实例
const app = getApp()
const request = require('../../utils/request.js');

Page({
  data: {
    userInfo: {},
  },
  //事件处理函数
  bindViewTap: function() {
      console.log('点击了测试按钮！！！');
  },
  onLoad: function () {
    
  }
})
