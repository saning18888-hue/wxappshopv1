// 统一请求层：支持 Mock 与真实 API 双模式
const config = require('../config');
const mock = require('./mock');

function request(method, path, data = {}) {
  // 兼容只传 path 的旧写法: api.request('/api/v1/xxx')
  // 第一个参数若以 / 开头,把它当 path,method 默认为 GET
  if (typeof method === 'string' && method.startsWith('/')) {
    data = path || {};
    path = method;
    method = 'GET';
  }
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
      fail(err) {
        // 透传 wx.request 的真实失败原因(URL、连接错误、超时、合法域名拦截等),
        // 便于排查「真机预览 127.0.0.1 不可达」「未配合法域名」之类问题
        const msg = (err && err.errMsg) ? err.errMsg : '网络异常';
        reject(new Error(`${msg}（${method} ${config.baseUrl}${path}）`));
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
