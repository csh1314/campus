const common = require('../../utils/common.js')
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		// 被点击的导航菜单索引
		currentIndexNav: 0,
		// 被点击的子导航菜单索引
		currentIndexNav1: 0,
		uid:'',//当前用户的uid
		// 导航
		navList:[{text: "我的发布"},
			{text: "我的接单"}],
		// 子导航
		navchildList1: [{text: "全部"},{text: "待接"},{text: "进行中"},{text: "已完成"}],
		navchildList2: [{text: "全部"},{text: "未开始"},{text: "进行中"},{text: "已完成"}],
		goods: ["生活物品", "二手书籍", "数码产品", "其他"],
		order: ["线下自提", "快递邮寄"],
		//我的发布
		myIssue:[],
		marketList:[],
		servList:[],
		errandList:[],
		shareList:[],
		// 我的接单
		marketReceiveList:[],
		servReceiveList:[],
		errandReceiveList:[],
		shareReceiveList:[],
		errand: ["代拿快递", "代买东西","带饭" ],
		serv: ["设计类", "编程类","游戏类","其他" ]
	},

	// 点击首页导航按钮
	activeNav:function(e) {
		this.setData({
			currentIndexNav: e.currentTarget.dataset.index,
			currentIndexNav1: 0
		})
	},
	
	// 点击子导航按钮
	activeNavChild:function(e){
		this.setData({
			currentIndexNav1: e.currentTarget.dataset.index,
		})
		
	},
	
	// 订单详情滑动切换
	 switchTab(e){
	        this.setData({
				currentIndexNav1: e.detail.current,
	        });
	    },
	// 去详情页
	goDetail(event){
		var bid = event.currentTarget.dataset.bid;
		var uid = event.currentTarget.dataset.uid;
		var index = event.currentTarget.dataset.index;
		if(index==0){
			wx.navigateTo({
				url: '/pages/marketDetail/marketDetail?bid='+bid+'&uid='+uid,
			})
		}else if(index==1){
			wx.navigateTo({
				url: '/pages/skillDetail/skillDetail?bid='+bid+'&uid='+uid,
			})
		}else if(index==2){
			wx.navigateTo({
				url: '/pages/errandDetail/errandDetail?bid='+bid+'&uid='+uid,
			})
		}else if(index==3){
			wx.navigateTo({
				url: '/pages/shareDetail/shareDetail?bid='+bid+'&uid='+uid,
			})
		}
	},
	// 撤销（删除）订单
	delOrder(event){
		let that =this;
		var bid = event.currentTarget.dataset.bid;
		var fettle = event.currentTarget.dataset.fettle;
		var content = "确定撤销该订单吗？"
		if( fettle === '9')
			content = "确定删除该订单吗？"
		wx.showModal({
		  title: '提示',
		  content: content,
		  success (res) {
		    if (res.confirm) {
				wx.request({
					url: common.baseUrl + 'receive/delOrder',
					method: "get",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						bid: bid
					},
					success(res) {
						console.log(res)
						that.onShow();
						wx.showToast({
						  title: '操作成功'
						})
					}
				})
		    }
		  }
		})
	},
	// 完单
	finishOrder(event){
		let that = this;
		var bid = event.currentTarget.dataset.bid;
		var uid = event.currentTarget.dataset.uid;
		var fettle = event.currentTarget.dataset.fettle;
		if( fettle === '1'){
			wx.showModal({
			  title: '提示',
			  content: '请您确定是否要完单？',
			  success (res) {
			    if (res.confirm) {
					wx.request({
						url: common.baseUrl + 'receive/finishOrder',
						method: "get",
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							uid: uid,
							bid: bid
						},
						success(res) {
							console.log(res)
							that.onShow();
							wx.showToast({
							  title: '操作成功'
							})
						}
					})
			    }
			  }
			})
		}else{
			wx.showToast({
			  title: '当前状态不可完单哦！',
			  icon:'none',
			  duration:2000
			})
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		// 高度自适应
		var that = this
		wx.getSystemInfo({
			success: function(res) {
				that.setData({
					clientHeight: res.windowHeight-100
				});
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
		let that = this;
		wx.getStorage({
			key: 'uid',
			success: function(res) {
				that.setData({
					uid:res.data
				})
				// 我的发布
				wx.request({
					url: common.baseUrl + 'receive/myIssue',
					method: "get",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						uid: res.data
					},
					success(res) {
						console.log(res)
						var marketList =[res.data.market,common.filter(res.data.market,0),common.filter(res.data.market,1),common.filter(res.data.market,9)]
						var servList=[res.data.skillserv,common.filter(res.data.skillserv,0),common.filter(res.data.skillserv,1),common.filter(res.data.skillserv,9)]
						var errandList=[res.data.errand,common.filter(res.data.errand,0),common.filter(res.data.errand,1),common.filter(res.data.errand,9)]
						var shareList=[res.data.share,common.filter(res.data.share,0),common.filter(res.data.share,1),common.filter(res.data.share,9)]
						that.setData({
							myIssue:res.data,
							marketList:marketList,
							servList:servList,
							errandList:errandList,
							shareList:shareList
						})
					}
				})
				// 我的接单
				wx.request({
					url: common.baseUrl + 'receive/selMyReceiveOrders',
					method: "get",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						receiver: res.data
					},
					success(res) {
						console.log(res)
						var marketReceiveList =[res.data.market,common.filter(res.data.market,0),common.filter(res.data.market,1),common.filter(res.data.market,9)]
						var servReceiveList=[res.data.skillserv,common.filter(res.data.skillserv,0),common.filter(res.data.skillserv,1),common.filter(res.data.skillserv,9)]
						var errandReceiveList=[res.data.errand,common.filter(res.data.errand,0),common.filter(res.data.errand,1),common.filter(res.data.errand,9)]
						var shareReceiveList=[res.data.share,common.filter(res.data.share,0),common.filter(res.data.share,1),common.filter(res.data.share,9)]
						that.setData({
							marketReceiveList:marketReceiveList,
							servReceiveList:servReceiveList,
							errandReceiveList:errandReceiveList,
							shareReceiveList:shareReceiveList
						})
					}
				})
			},
		})
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

	}
})
