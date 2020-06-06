// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
    key: 'CATBZ-4W7WW-7K3RF-O77CE-MUONE-BWB62'//申请的开发者秘钥key
});
Page({
  data: {
    addressList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  slideButtonTap(e) {
		console.log(e)
		if(e.detail.index==1){
			this.deleteThis(e.detail.data);
		}else{
			this.editThis(e.detail.data);
		}
      },
	  
  // 删除当前地址
  deleteThis(index){
	  let that=this
	  wx.showModal({
	    title: '提示',
	    content: '确定删除该地址吗?',
	    success (res) {
	      if (res.confirm) {
	         let arr=that.data.addressList
			 arr.splice(index,1)
			 // 必须靠setData驱动更新
			 that.setData({
				 addressList:arr
			 })
			 // 更新session
			 wx.setStorage({//异步方法
			 	key:'allAdress',
			 	data:that.data.addressList
			 })
	      } 
	    }
	  })
	},
  // 编辑当前地址(编辑和添加使用同一页面)
  editThis(index){
	  wx.navigateTo({
	    url: "/pages/addAddress/addAddress?index="+index+"&title=修改地址"
	  });
  },
  onLoad: function (options) {
	  let that=this
	  wx.getStorage({
		  key:'allAdress',
		  success:function(res){
			  that.setData({
				  addressList:res.data
			  }) 
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
    let that=this
    wx.getStorage({
    		  key:'allAdress',
    		  success:function(res){
    			  that.setData({
    				  addressList:res.data
    			  }) 
    		  }
    })
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