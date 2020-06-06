const common = require('../../utils/common.js')
Page({
	data: {
		imgs: [],
		// 表单信息
		avatarUrl: '',
		contact: '',
		describes: '',
		name: '',
		nickName: '',
		nowPrice: '',
		startTime: '',
		orderType: '',
		goodsType: '',
		goods: ["生活物品", "二手书籍", "数码产品", "其他"],
		order: ["线下自提", "快递邮寄"],
		bid: '', //订单号
		uid: '', //当前查看用户的uid
		fettle: ''
	},
	onLoad: function(options) {
		let that = this;
		wx.request({
			url: common.baseUrl + 'orders/showDetailMarket',
			method: "GET",
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: {
				bid: options.bid
			},
			success(res) {
				console.log(res)
				/* base64 弃用
				let ImgUrls = []
				ImgUrls = res.data.image
				if(ImgUrls!=null){
					for (var i = 0; i < ImgUrls.length; i++) {
							// 去除数据传输过程中新增的转义字符
							ImgUrls[i] = ImgUrls[i].replace(/[\r\n]/g, "");
						}
				} */
				that.setData({
					imgs: res.data.image,
					avatarUrl: res.data.avatarUrl,
					nickName: res.data.nickName,
					contact: common.toHide(res.data.contact),
					describes: res.data.describes,
					name: res.data.name,
					nowPrice: res.data.nowPrice,
					orderType: that.data.order[res.data.orderType],
					startTime: res.data.startTime,
					goodsType: that.data.goods[res.data.goodsType],
					fettle: res.data.fettle,
					bid: options.bid,
					uid: options.uid
				})
				// 1.判断发单人是否为自己
				if (that.data.uid === res.data.uid) {
					that.setData({
						fettle: -1,
						contact: res.data.contact
					})
				} else if (that.data.uid === res.data.receiver) {
					// 2.判断uid是否为接单人来确定是否显示联系信息
					that.setData({
						contact: res.data.contact
					})
				}
			}
		})
	},
	copyWord(e) {
		common.copyThat(e.currentTarget.dataset.content);
	},
	// 图片预览
	preImg(e) {
		//console.log(e.currentTarget.dataset.index)
		let index = e.currentTarget.dataset.index
		let urls = this.data.imgs
		wx.previewImage({
			current: urls[index], // 当前显示图片的http链接
			urls: urls // 需要预览的图片http链接列表
		})
	},
	// 接单
	receiveOrder() {
		let that = this;
		wx.showModal({
			title: '提示',
			content: '请您确定是否接单,接单后请尽快联系发单者!',
			success(res) {
				if (res.confirm) {
					wx.request({
						url: common.baseUrl + 'receive/orders',
						method: "GET",
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							bid: that.data.bid,
							uid: that.data.uid
						},
						success(res) {
							console.log(res)
							// 订阅、发布消息
							var receiveTime = res.data.receiveTime
							console.log(that.data.openId)
							if (res.data.status === "200") {
								setTimeout(function() {
									wx.showToast({
										title: '接单成功',
									})
								}, 1000)
								wx.navigateBack({
									delta: 1
								});
							}
						},
						fail() {
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
		let that = this;
		var bid = that.data.bid;
		return {
			title: that.data.name,
			path: '/pages/marketDetail/marketDetail?bid=' + bid,
			imageUrl: "../../images/logo/logo.jpg",
			success(res) {
				console.log('转发成功', res)
			},
			fail(res) {
				console.log("转发失败", res)
			}
		}
	}
})
