const common = require('../../utils/common.js')
Page({
	data: {
		// 表单信息
		avatarUrl:'',
		remark:'',
		nickName:'',
		startTime:'',
		QQ:'',
		peopleNum:'',
		mapStart:'',
		mapEnd:'',
		getUpTime:'',
		bid:'',//订单号
		uid:'',//当前查看用户的uid
		fettle:'',
		receivers:[],//接单者
		receiverNum:'',
		isReceived:false//当前查看用户是否接单
	},


	onLoad: function(options) {
		let that = this;
		//console.log(options)
		wx.request({
			url: common.baseUrl+'share/showDetailShare',
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
					mapStart:res.data.mapStart,
					remark:res.data.remark,
					mapEnd:res.data.mapEnd,
					startTime:res.data.startTime,
					peopleNum:res.data.peopleNum,
					QQ:common.toHide(res.data.QQ),
					getUpTime:res.data.getUpTime,
					fettle:res.data.fettle,
					bid:options.bid,
					uid:options.uid
				})
				
				if(res.data.receiver){
					
					//追加
					if(res.data.receiver.indexOf(",")===-1){
						//仅一个
						that.data.receivers.push(res.data.receiver)
					}else{
						that.setData({
							receivers:res.data.receiver.split(',')
						})
					}
					//设置当前接单人数
					that.setData({
						receiverNum:that.data.receivers.length
					})
				
					for(var i=0;i<that.data.receivers.length;i++){
						// 判断uid是否为接单人来确定是否显示联系信息
						if(options.uid===that.data.receivers[i]){
							that.setData({
								QQ:res.data.QQ,
								isReceived:true
							})
						} 
						
					}
				}
				
			
				// 判断发单人是否为自己
				if(options.uid===res.data.uid){
					that.setData({
						fettle:-1,
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
		var content='请您确定是否接单,接单后请尽快联系发单者!';
		if(this.data.isReceived)
			content='请您确定是否要重复接单(占座)!';
		let that=this;
		wx.showModal({
		  title: '提示',
		  content: content,
		  success (res) {
		    if (res.confirm) {
				wx.request({
					url: common.baseUrl+'receive/carpooling',
					method: "GET",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						bid:that.data.bid,
						uid:that.data.uid
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
		var num=that.data.peopleNum-that.data.receiverNum;
		return{
			title:'拼车滴滴还差'+num+'人！',
			path:'/pages/marketDetail/marketDetail?bid='+bid,
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
