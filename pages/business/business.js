const common = require('../../utils/common.js')
Page({
	data: {
		tabs: [],
		activeTab: 0,
		// 订单列表
		marketList: [],
		skillList:[],
		errandList:[],
		shareList:[],
		// 跳蚤市场
		goodsType: ["生活物品", "二手书籍", "数码产品", "其他"],
		orderType: ["线下自提", "快递邮寄"],
		// 技能服务
		servType:["设计类","编程类","游戏类","其他"],
		// 跑腿代购
		errandType:["代拿快递","代买东西","带饭"],
		// 订单状态
		fettleList:["icon-daijiedan iconfont icon1","icon-weiwancheng iconfont icon2","icon-yiwancheng iconfont icon1"]
	},

	onLoad(options) {
		wx.showLoading({
		  title: '正在加载数据',
		})
		const titles = ['跳蚤市场', '技能服务', '跑腿代拿', '拼车滴滴']
		const tabs = titles.map(item => ({
			title: item
		}))
		this.setData({
			tabs,
			activeTab:options.index
		})

		// 高度自适应
		var that = this
		wx.getSystemInfo({
			success: function(res) {
				that.setData({
					clientHeight: res.windowHeight
				});
			}
		})
	},
	onShow() {
		let that = this;
		// marketList获取 跳蚤市场
		wx.request({
			url: common.baseUrl + 'orders/showMarket',
			method: "get",
			success(res) {
				//console.log(res)
				that.setData({
					marketList: res.data,
				});
			},
			fail() {
				console.log(res)
			}
		})
		// skillList获取 技能服务
		wx.request({
			url: common.baseUrl + 'skillServ/showSkillServ',
			method: "get",
			success(res) {
				//console.log(res)
				that.setData({
					skillList: res.data
				});
			},
			fail() {
				console.log(res)
			}
		})
		// errandList获取 跑腿代拿
		wx.request({
			url: common.baseUrl + 'errand/showErrand',
			method: "get",
			success(res) {
				//console.log(res)
				that.setData({
					errandList: res.data
				});
			},
			fail() {
				console.log(res)
			}
		})
		// shareList获取 拼单滴滴
		wx.request({
			url: common.baseUrl + 'share/showShare',
			method: "get",
			success(res) {
				console.log(res)
				that.setData({
					shareList: res.data
				});
			},
			fail() {
				console.log(res)
			}
		})
		wx.hideLoading()
	},
	onTabCLick(e) {
		const index = e.detail.index
		this.setData({
			activeTab: index
		})
	},

	onChange(e) {
		const index = e.detail.index
		this.setData({
			activeTab: index
		})
	},
	goDetail: function(event) {
		var bid = event.currentTarget.dataset.bid
		let index=this.data.activeTab
		//console.log(index)
		common.checkLogin().then(function(res) {
			if (res) {
				//存在登陆态
				// 读取uid看是否为已注册用户
				wx.getStorage({
					key: 'uid',
					success: function(res) {
						if(index==0){
							wx.navigateTo({
								url: '/pages/marketDetail/marketDetail?bid='+bid+'&uid='+res.data,
							})
						}else if(index==1){
							wx.navigateTo({
								url: '/pages/skillDetail/skillDetail?bid='+bid+'&uid='+res.data,
							})
						}else if(index==2){
							wx.navigateTo({
								url: '/pages/errandDetail/errandDetail?bid='+bid+'&uid='+res.data,
							})
						}else if(index==3){
							wx.navigateTo({
								url: '/pages/shareDetail/shareDetail?bid='+bid+'&uid='+res.data,
							})
						}
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
		}).catch(err =>
			console.log(err)
		);

	}
})
