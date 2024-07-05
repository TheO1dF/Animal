App({
  onLaunch() {
    wx.cloud.init({
      env: 'cloud1-5gthmchkb0a01bbd'
    });
  },
  globalData: {
    user_openid: '',
    userInfo: null
  }
});
