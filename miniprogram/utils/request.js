// 统一请求层：支持 Mock 与真实 API 双模式
const config = require('../config');
const mock = require('./mock');

function request(method, path, data = {}) {
  return new Promise((resolve, reject) => {
    if (config.useMock) {
      // Mock：模拟网络延迟后返回内存数据
      setTimeout(() => {
        try {
          const res = mock.dispatch(method, path, data);
          if (res && res.code === 0) {
            resolve(res.data);
          } else {
            reject(new Error((res && res.msg) || '请求失败'));
          }
        } catch (e) {
          reject(e);
        }
      }, 150);
      return;
    }

    const token = wx.getStorageSync('wxapp_token') || '';
    wx.request({
      url: config.baseUrl + path,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        Authorization: token ? 'Bearer ' + token : '',
      },
      success(res) {
        const body = res.data;
        if (body && body.code === 0) {
          resolve(body.data);
        } else {
          reject(new Error((body && body.msg) || '请求失败'));
        }
      },
      fail() {
        reject(new Error('网络异常，请稍后重试'));
      },
    });
  });
}

module.exports = {
  request,
  get: (p, d) => request('GET', p, d),
  post: (p, d) => request('POST', p, d),
  put: (p, d) => request('PUT', p, d),
  del: (p, d) => request('DELETE', p, d),
};
