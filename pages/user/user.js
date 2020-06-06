const common = require('../../utils/common.js')
//获取应用实例
const app = getApp()
Page({
  data: {
    userInfo: {avatarUrl:"../../images/yonghu.png"},
    hasUserInfo: false,
	isRegister:true,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
		isRegister:false
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
		fail:res=>{
			this.setData({
			  hasUserInfo: false
			})
		}
      })
    }
  },
  onShow: function () {
	  var that = this;
	  wx.getStorage({
	  	key: 'userInfo',
	  	success: function(res) {
	  		//console.log(res)
	  		that.setData({
	  			userInfo:res.data,
				isRegister:true,
				hasUserInfo: true
	  		})
	  	},
		fail(){
		}
	  })
  },
  getUserInfo: function(value) {//value包含用户信息encryptedData, iv
	let that=this;
	//console.log(value)
	wx.getSetting({
		success: res => {
		if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
		wx.login({ //登录
		  success(res) {
		    //console.log(res)
		    //获取res.code, encryptedData, iv数据传给后端
		    wx.request({
		      url: common.baseUrl+'decodeUserInfo',
		      method: "post",
		      header: {
		        'content-type': 'application/x-www-form-urlencoded'
		      },
		      data: {encryptedData: value.detail.encryptedData, iv: value.detail.iv, code: res.code},
		      success(result) {
				  //console.log(result);
				  // 微信用户信息
				  wx.setStorage({
				    key: "wxuserInfo", 
				    data: result.data.wxuserInfo
				  })
		        if(result.data.status===1){
					if(result.data.uid){
						that.setData({
						  userInfo: result.data.userInfo,
						  hasUserInfo: true,
						  isRegister:true
						})
						console.log('登录为已注册用户')
						// 保存uid后面进行交互
						wx.setStorage({
						  key:"uid",
						  data:result.data.uid
						})
						// 保存平台用户信息
						wx.setStorage({
						  key: "userInfo", 
						  data: result.data.userInfo
						})
					}else{
						that.setData({
						  userInfo: result.data.wxuserInfo,
						  hasUserInfo: true,
						  isRegister:false
						})
						console.log('临时登录,尚未注册')
						// 引导用户注册
						wx.showModal({
						  title: '提示',
						  content: '尚未注册,请前往注册',
						  success (res) {
						    if (res.confirm) {
							  wx.navigateTo({
							  	url:'/pages/register/register'
							  })
						    } 
							}
						})
					}
				}else{
					console.log("请求失败")
				}
		      },
		      fail() {
		        console.log("解析失败");
		      }
		    })
		  },
		  fail() {
		    console.log("登录失败");
		  }
		})
      
      }
    }
  })
  

  }
})
