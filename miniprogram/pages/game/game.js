Page({
  data: {
    userInfo: {}
  },

  onLoad: function() {
    this.setUserInfo();
  },

  setUserInfo: function() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: JSON.parse(userInfo)
      });
    }
  }
});
