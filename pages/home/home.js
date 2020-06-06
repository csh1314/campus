const common = require('../../utils/common.js')
Page({
	data: {
		// 轮播图数据
		movies:[  
		    {url:'../../images/home/swiper/1.jpg'} ,  
		    {url:'../../images/home/swiper/2.jpg'} ,  
		    {url:'../../images/home/swiper/3.jpg'} ,   
		    {url:'../../images/home/swiper/4.jpg'} ,
		    {url:'../../images/home/swiper/5.jpg'} , 
		    {url:'../../images/home/swiper/6.jpg'} ,  
		    ]  

	},
	onLoad() {
		
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
							url: '/pages/issue/issue'
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
	}
});
