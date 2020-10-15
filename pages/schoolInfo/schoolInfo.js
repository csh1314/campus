const common = require('../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newMessage:[]
  },
  // 图片预览
  preImg(e) {
  	console.log(e)
  	let index = e.currentTarget.dataset.index
  	let urls = e.currentTarget.dataset.imgs
  	wx.previewImage({
  		current: urls[index], // 当前显示图片的http链接
  		urls: urls // 需要预览的图片http链接列表
  	})
  },
  onLoad: function (options) {
	  // 高度自适应
	  var that = this
	  wx.getSystemInfo({
	  	success: function(res) {
	  		that.setData({
	  			clientHeight: res.windowHeight-250
	  		});
	  	}
	  })
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
  	  let that=this;
  	  wx.request({
  	  	url: common.baseUrl + 'lost/showAllLost',
  	  	method: "get",
  	  	success(res) {
  	  		console.log(res)
			// 获得当前时间
			var currentTime=new Date(common.formatTime(new Date()));
  	  		that.setData({
				// 只显示3天内的数据
  	  			newMessage:res.data.lost.filter(function(item){
					var date=new Date(item.releaseTime.replace(/\-/g, "/")) 
					var dateDiff=parseInt(currentTime-date)
					if(dateDiff<259200000){
						return -1;
					}
					return 0;
				}).reverse()
  	  		})
  			
  	  	}
  	  })
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