Page({
  data: {
    avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
    nickName: ''
  },

  onChooseAvatar: function(e) {
    const { avatarUrl } = e.detail;
    this.setData({
      avatarUrl
    });
  },

  onInputNickname: function(e) {
    this.setData({
      nickName: e.detail.value
    });
  },

  onBlurNickname: function(e) {
    this.setData({
      nickName: e.detail.value
    });
  },

  onLoginButtonTap: function() {
    wx.login({
      success: (loginResult) => {
        console.log('获取登录code成功:', loginResult);
        if (loginResult.code) {
          this.saveUserInfo(loginResult.code);
        } else {
          console.error('获取code失败:', loginResult);
          wx.showToast({
            title: '获取code失败！',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('wx.login调用失败:', err);
      }
    });
  },

  saveUserInfo: function(code) {
    const { avatarUrl, nickName } = this.data;
    console.log(`昵称: ${nickName}`); // 调试信息
    wx.cloud.callFunction({
      name: 'login',
      data: {
        code,
        avatarUrl,
        nickName
      },
      success: res => {
        console.log('云函数调用成功:', res);
        if (res.result.success) {
          wx.setStorageSync('openid', res.result.openid);
          wx.setStorageSync('session_key', res.result.session_key);
          wx.setStorageSync('userInfo', JSON.stringify({
            avatarUrl,
            nickName
          }));
          wx.redirectTo({
            url: '/pages/game/game'
          });
        } else {
          console.error('登录失败:', res.result.error);
          wx.showToast({
            title: '登录失败！' + res.result.error,
            icon: 'none'
          });
        }
      },
      fail: error => {
        console.error('云函数调用失败:', error);
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        });
      }
    });
  }
});
