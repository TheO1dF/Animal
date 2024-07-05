const cloud = require('wx-server-sdk');
const axios = require('axios');
cloud.init();

const db = cloud.database();

exports.main = async (event) => {
  const { APPID, APPSECRET } = process.env;
  const { code, avatarUrl, nickName } = event;

  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${APPSECRET}&js_code=${code}&grant_type=authorization_code`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    if (data.errcode) {
      return { success: false, error: data.errmsg, code: data.errcode };
    } else {
      const openid = data.openid;
      const session_key = data.session_key;

      // 检查用户是否已存在
      const checkUser = await db.collection('userInfo').where({ openid }).get();

      if (checkUser.data.length > 0) {
        // 用户已存在，更新用户信息
        const userInfo = checkUser.data[0];
        await db.collection('userInfo').doc(userInfo._id).update({
          data: {
            nickName: nickName || userInfo.nickName
          }
        });

        return {
          success: true,
          openid: openid,
          session_key: session_key,
          avatarUrl: userInfo.avatarFileID,
          nickName: nickName || userInfo.nickName
        };
      } else {
        // 用户不存在，上传头像并添加新用户
        const uploadResult = await cloud.uploadFile({
          cloudPath: `user/${Date.now()}-${Math.floor(Math.random() * 1000)}.png`,
          fileContent: Buffer.from(avatarUrl, 'base64')
        });

        await db.collection('userInfo').add({
          data: {
            openid: openid,
            avatarFileID: uploadResult.fileID,
            nickName: nickName,
            createTime: new Date()
          }
        });

        return {
          success: true,
          openid: openid,
          session_key: session_key,
          avatarUrl: uploadResult.fileID,
          nickName: nickName
        };
      }
    }
  } catch (error) {
    return { success: false, error: error.toString() };
  }
};
