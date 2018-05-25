const domain = require('../config/app.config.js').urls.domainUrl;

const NETWORK_TIMEOUT = '网络连接超时，请稍后再试';
const NETWORK_ERR = '网络连接失败，请检查您的网络设置';
const SYSTEM_ERR = '系统错误，请稍后再试';

var getUserInfo = obj => {
  _request({
    uri: 'user',
    success: function (data) {
      obj.success && obj.success(formatObj.userInfo(data));
    },
    fail: obj.fail,
    complete: obj.complete
  });
}

var _request = function (obj, noRetry) {
    wx.request({
    url: domain + '/v1/' + obj.uri,
    method: obj.method ? obj.method : (obj.data != undefined ? 'POST' : 'GET'),
    data: obj.data,
    success: function (res) {
        if (res.data.code == 0) {
        obj.success && obj.success(res.data.data);
        return;
        }
        // 错误码 5 开头提示系统错误
        if (res.data == "" || res.data.code.toString().substr(0, 1) == "5") {
            systemErrHandle(res);
        }

        if (res.data.code.toString().substr(0, 1) == "4" && !noRetry) {
        _request(obj, true);
        return;
        }
    },
    fail: function (err) {
        networkErrHandle(err);
        obj.fail && obj.fail(err);
    },
    complete: function () {
        wx.hideNavigationBarLoading();
        obj.complete && obj.complete();
    }
    });
}

const systemErrHandle = err => {
  wx.showToast({
    title: SYSTEM_ERR,
    icon: 'none',
  });
}
const networkErrHandle = err => {
  if (err.errMsg == 'request:fail timeout') {
    wx.showToast({
      title: NETWORK_TIMEOUT,
      icon: 'none',
    });
  } else {
    wx.showToast({
      title: NETWORK_ERR,
      icon: 'none',
    });
  }
}

module.exports = {
  getUserInfo: getUserInfo,
}