const common = require('utils/common.js')
App({
  onLaunch: function () {
	  let that=this;
	  wx.checkSession({
	    success: function () {
	      //存在登陆态
	  	console.log('已登录')
		//存在登陆态
		wx.getStorage({
			key: 'wxuserInfo',
			success: function(res) {
				that.globalData.userInfo = res.data
			}
		})
	    },
	    fail: function () {
	      //不存在登陆态
		  console.log('未登录')
	    }
	     })
  },

  globalData: {
    userInfo: null
  }
})