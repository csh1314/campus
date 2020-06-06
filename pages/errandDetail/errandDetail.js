const common = require('../../utils/common.js')
Page({
	data: {
		// 表单信息
		avatarUrl:'',
		contact:'',
		remark:'',
		nickName:'',
		price:'',
		startTime:'',
		errandType:'',
		QQ:'',
		weight:'',
		sendLocation:'',
		errand: ["代拿快递", "代买东西","带饭" ],
		bid:'',//订单号
		uid:'',//当前查看用户的uid
		fettle:''
	},


	onLoad: function(options) {
		let that = this;
		//console.log(options.bid)
		wx.request({
			url: common.baseUrl+'errand/showDetailErrand',
			method: "GET",
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: {
				bid: options.bid
			},
			success(res) {
				console.log(res)
				that.setData({
					avatarUrl:res.data.avatarUrl,
					nickName:res.data.nickName,
					contact:common.toHide(res.data.contact),
					remark:res.data.remark,
					price:res.data.price,
					errandType:that.data.errand[res.data.errandType],
					startTime:res.data.startTime,
					sendLocation:res.data.sendLocation,
					QQ:common.toHide(res.data.QQ),
					weight:res.data.weight,
					fettle:res.data.fettle,
					bid:options.bid,
					uid:options.uid
				})
				// 1.判断发单人是否为自己
				if(that.data.uid===res.data.uid){
					that.setData({
						fettle:-1,
						contact:res.data.contact,
						QQ:res.data.QQ
					})
				}else if(that.data.uid===res.data.receiver){
					// 2.判断uid是否为接单人来确定是否显示联系信息
					that.setData({
						contact:res.data.contact,
						QQ:res.data.QQ
					})
				}
			}
		})
	},
	copyWord(e){
		common.copyThat(e.currentTarget.dataset.content);
	},
	// 接单
	receiveOrder(){
		let that=this;
		wx.showModal({
		  title: '提示',
		  content: '请您确定是否接单,接单后请尽快联系发单者!',
		  success (res) {
		    if (res.confirm) {
				wx.request({
					url: common.baseUrl+'receive/orders',
					method: "GET",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						bid: that.data.bid,
						uid: that.data.uid
					},
					success(res){
						console.log(res)
						setTimeout(function () {
							wx.showToast({
							  title: '接单成功',
							})
						}, 1000)
						wx.navigateBack({
						  delta:1
						}); 
					},
					fail(){
						console.log("接单失败")
					}
				})
		    }
		  }
		})
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {
		let that=this;
		var bid=that.data.bid;
		return{
			title:that.data.errandType,
			path:'/pages/errandDetail/errandDetail?bid='+bid,
			imageUrl:"../../images/logo/logo.jpg",
			success(res){
				console.log('转发成功',res)
			},
			fail(res){
				console.log("转发失败",res)
			}
		}
	}
})
