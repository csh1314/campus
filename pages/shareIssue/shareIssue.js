const common = require('../../utils/common.js')
Page({
	data: {
		mapStart: '',
		mapEnd: '',
		classes: ['1', '2','3'],
		peopleNum: 0,
		// 备注信息
		remark:'',
		// 是否同意条款
		isAgree: false,
		// 表单数据
		formData:{},
		// 表单验证规则
		addressList:[],
		rules: [{
			name: 'mapStart',
			rules: {
				required: true,
				message: '请获取上车位置'
			},
		}, {
			name: 'mapEnd',
			rules: {
				required: true,
				message: '请获取目的地位置'
			},
		}, {
			name: 'remark',
			rules: {
				required: true,
				message: '请填写备注信息'
			},
		}, {
			name: 'getUpTime',
			rules: {
				required: true,
				message: '请填写预计上车时间'
			},
		},{
			name: 'QQ',
			rules: {
				required: true,
				message: '请填写联系QQ'
			},
		}]
	},
	// 表单信息改变
	    // input信息改变
		formInputChange(e) {
		            const {field} = e.currentTarget.dataset
		            this.setData({
		                [`formData.${field}`]: e.detail.value
		            })
		},
		// 下拉改变
		bindClassChange: function(e) {
			this.setData({
				peopleNum: e.detail.value,
			})
		},
		
		
		// textarea改变
		bindDescribeChange:function(e){
			this.setData({
				remark:e.detail.value,
				[`formData.remark`]:e.detail.value
			})
		},
		// 勾选
		bindAgreeChange: function (e) {
		    this.setData({
		        isAgree: !!e.detail.value.length
		    })
		},
		// 我的地址(上车)
	getAllAdress1:function(){
		let that=this
		wx.getStorage({
				  key:'allAdress',
				  success:function(res){
					  that.setData({
						  addressList:res.data
					  })
					  const arr=[]
					  for(var i=0;i<that.data.addressList.length;i++){
						  arr.push(that.data.addressList[i].map+that.data.addressList[i].detail)
					  }
					  wx.showActionSheet({
					    itemList: arr,
					    success (res) {
						  that.setData({
						  	mapStart: arr[res.tapIndex],
						  	[`formData.mapStart`]: arr[res.tapIndex]
						  })
					    },
					    fail (res) {
					      console.log(res.errMsg)
					    }
					  })
				  },
				  fail(){
					  wx.showToast({
					    title: '您还没有添加地址哦!',
					    icon: 'none',
					    duration: 2000
					  })
				  }
		})
	},
	//移动选点
	// 起点
	moveToLocation1: function() {
		let that = this
		wx.chooseLocation({
			success: function(res) {
				that.setData({
					mapStart: res.name,
					[`formData.mapStart`]: res.name
				})
			},
			fail: function(err) {
				console.log(err)
			}
		});
	},
	// 我的地址(目的地)
	getAllAdress2:function(){
		let that=this
		wx.getStorage({
				  key:'allAdress',
				  success:function(res){
					  console.log(res)
					  that.setData({
						  addressList:res.data
					  })
					  const arr=[]
					  for(var i=0;i<that.data.addressList.length;i++){
						  arr.push(that.data.addressList[i].map+that.data.addressList[i].detail)
					  }
					  wx.showActionSheet({
					    itemList: arr,
					    success (res) {
						  that.setData({
						  	mapEnd: arr[res.tapIndex],
						  	[`formData.mapEnd`]: arr[res.tapIndex]
						  })
					    },
					    fail (res) {
					      console.log(res.errMsg)
					    }
					  })
				  },
				  fail(){
					  wx.showToast({
					    title: '您还没有添加地址哦!',
					    icon: 'none',
					    duration: 2000
					  })
				  }
		})
	},
	// 终点
	moveToLocation2: function() {
		let that = this
		wx.chooseLocation({
			success: function(res) {
				that.setData({
					mapEnd: res.name,
					[`formData.mapEnd`]: res.name
				})
			},
			fail: function(err) {
				console.log(err)
			}
		});
	},
	
	onLoad() {
		let that = this;
		wx.getStorage({
			key: 'uid',
			success: function(res) {
				that.setData({
					[`formData.uid`]:res.data,
				})
			}
			})
	},
	
	// 提交校验
	submitForm(){
		this.selectComponent('#form').validate((valid, errors)=>{
			console.log('valid', valid, errors)
			if (!valid) {
				const firstError = Object.keys(errors)
				if (firstError.length) {
					this.setData({
						error: errors[firstError[0]].message
				})
				}
			}else{
				let that=this;
				wx.requestSubscribeMessage({
					tmplIds: ['a4JqS-Qr4xRDs94L94Wz2fiVk7ROJ6_2xFA-pZgE5E4'],
					success(res) {
						console.log(res)
						wx.request({
						      url: common.baseUrl+'share/shareIssue',
							  method: "GET",
							  header: {
							  	'content-type': 'application/x-www-form-urlencoded'
							  },
							  data:{
								  uid:that.data.formData.uid,
								  mapStart:that.data.formData.mapStart,
								  mapEnd:that.data.formData.mapEnd,
								  peopleNum:parseInt(that.data.peopleNum)+1,
								  remark:that.data.formData.remark,
								  QQ:that.data.formData.QQ,
								  getUpTime:that.data.formData.getUpTime
							  }, 
						      success (res){
						        console.log(res)
								wx.switchTab({
									url: '/pages/home/home'
								})
								wx.showToast({
									title: '已提交发布！'
								})
						      }
						})	
					}
					})
			}
		})
	}
})
