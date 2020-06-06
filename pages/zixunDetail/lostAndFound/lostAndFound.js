const common = require('../../../utils/common.js')
Page({
  data: {
    tab: 0,
    lostList:[],//失物招领
	foundList:[]//寻物启事
  },
  tab_slide: function (e) {//滑动切换tab 
    var that = this;
    that.setData({ tab: e.detail.current });
  },
  tab_click: function (e) {//点击tab切换
    var that = this;
    if (that.data.tab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        tab: e.target.dataset.current
      })
    }
  },
  goIssue() {
  	common.checkLogin().then(function(res){
  		if(res){
  			//存在登陆态
  			// 读取uid看是否为已注册用户
  			wx.getStorage({
  				key: 'uid',
  				success: function(res) {
  					wx.navigateTo({
  						url: '/pages/zixunDetail/lostAndFoundIssue/lostAndFoundIssue?uid='+res.data
  					})
  				},
  				fail: function() {
  					//未注册
  					wx.showModal({
  						title: '提示',
  						content: '尚未注册,请前往注册',
  						success(res) {
  							if (res.confirm) {
  								wx.navigateTo({
  									url: '/pages/register/register'
  								})
  							} else if (res.cancel) {
  								console.log('用户点击取消')
  							}
  						}
  					})
  				}
  			})
  		}
  	}).catch(err=>
  		console.log(err)
  	);
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 高度自适应
    var that = this
    wx.getSystemInfo({
    	success: function(res) {
    		that.setData({
    			clientHeight: res.windowHeight-30
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
	  		that.setData({
	  			lostList:res.data.lost.filter(item=>item.releaseType===0),
				foundList:res.data.lost.filter(item=>item.releaseType===1)
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