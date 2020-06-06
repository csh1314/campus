// pages/wallet/wallet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
	  payParams:{}
  },
  recharge(){
	  wx.request({
	  　 url: "后端的充值接口",
	     method: "POST",
	     dataType: "json",
	     header: {
	       'content-type': 'application/x-www-form-urlencoded'
	     },
	     data: {
	       amount: amount,  // 充值金额
	       token: token,
	       openId: openId
	     },
	     success: function (res) {
	       if (res.data.code == '1') {
	         that.setData({
	           payParams: res.data.data  // 后端从微信得到的统一下单的参数
	         })
	         //that.xcxPay();  // 拿到统一下单的参数后唤起微信支付页面
	       } 
	     }
	  }),
	 wx.requestPayment({
	 　 'timeStamp': that.data.payParams.timestamp.toString(),  // 时间戳必须是字符串，否则会报错 'nonceStr': that.data.payParams.str,
	    'package': 'prepay_id=' + that.data.payParams.prepay_id,  // 这里的值必须是 prepay_id=XXXXXXXXX 的格式，否则也会报错 'signType': 'MD5',
	    'paySign': that.data.payParams.sign,
	    'success': function (res) { 
	 　　　　// 这里应该是 res.errMsg , 跟公众号的支付返回的参数不一样，公众号是 err_msg, 就因为没注意到这个，折腾了很长时间 if(res.errMsg == "requestPayment:ok"){  // 调用支付成功
	       if(res.errMsg == "requestPayment:ok"){ 
		   wx.redirectTo({
	               url: '' // 充值成功后的处理，可以跳转，也可以根据自己的需要做其他处理
	          })
	       }else if(res.errMsg == 'requestPayment:cancel'){
	 　　　　　　// 用户取消支付的操作
	 　　　 }
	    },
	    'fail': function (res) {
	    　　return false;
	    },
	    'complete': function (res) { }
	 }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})