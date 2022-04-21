<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- 登录按钮 -->
    <!-- 可以从 @getuserinfo 事件处理函数的形参中，获取到用户的基本信息 -->
    <button type="primary" class="btn-login" @click="getUserInfo">一键登录</button>
    <!-- 登录提示 -->
    <view class="tips-text">登录后尽享更多权益</view>
  </view>
</template>

<script>
  import { mapMutations } from 'vuex'
	export default {
		data() {
			return {
			};
		},
    methods:{
      ...mapMutations('m_user',['updateUserInfo','updateToken']),
      // 获取微信用户的基本信息
      getUserInfo(){
        // uni.getUserInfo({
        uni.getUserProfile({
          desc:'登录',
          success:res => {
            // console.log(res.userInfo)
            this.updateUserInfo(res.userInfo)    
            console.log(res)
            this.getToken(res)
          },
          fail:res => {
            // 获取信息失败           
            // console.log(res)
            return uni.$showMsg('您取消了登录授权！')
          }
        })        
      },
      async getToken(info){
        const [err,res] = await uni.login().catch(err => err)
        // console.log(res)
        if(err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败')
        // console.log(res.code)
        // console.log(info)
        // 准备参数
        const query = {
          code:res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
        // console.log(query)
            
        const loginResult = await uni.$http.post('/api/public/v1/users/wxlogin',query)
        console.log(loginResult)
        if(loginResult.statusCode !== 200) return uni.$showMsg('登录失败')
        // return uni.$showMsg('登录成功')
        this.updateToken(query.code) 
        console.log('denglu' + query.code)
      },
    },
    
	}
</script>

<style lang="scss">
.login-container {
  // 登录盒子的样式
  height: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  position: relative;
  overflow: hidden;

  // 绘制登录盒子底部的半椭圆造型
  &::after {
    content: ' ';
    display: block;
    position: absolute;
    width: 100%;
    height: 40px;
    left: 0;
    bottom: 0;
    background-color: white;
    border-radius: 100%;
    transform: translateY(50%);
  }

  // 登录按钮的样式
  .btn-login {
    width: 90%;
    border-radius: 100px;
    margin: 15px 0;
    background-color: #c00000;
  }

  // 按钮下方提示消息的样式
  .tips-text {
    font-size: 12px;
    color: gray;
  }
}
</style>
