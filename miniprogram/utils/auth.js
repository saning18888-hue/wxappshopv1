// 登录态管理：token 存本地缓存，自动 Mock 登录
const api = require('./request');

const TOKEN_KEY = 'wxapp_token';
const USER_KEY = 'wxapp_user';

function getToken() {
  return wx.getStorageSync(TOKEN_KEY) || '';
}
function setToken(t) {
  wx.setStorageSync(TOKEN_KEY, t);
}
function getUser() {
  return wx.getStorageSync(USER_KEY) || null;
}
function setUser(u) {
  wx.setStorageSync(USER_KEY, u);
}

// 确保已登录：已登录直接返回；否则走登录接口（Mock 模式用 wx.login code）
function ensureLogin() {
  if (getToken()) {
    return Promise.resolve(getUser());
  }
  return new Promise((resolve) => {
    wx.login({
      success(res) {
        api
          .post('/auth/dev_login', { code: res.code || 'dev' })
          .then((data) => {
            setToken(data.token);
            setUser(data.user);
            resolve(data.user);
          })
          .catch(() => resolve(null));
      },
      fail() {
        resolve(null);
      },
    });
  });
}

module.exports = { getToken, setToken, getUser, setUser, ensureLogin };
