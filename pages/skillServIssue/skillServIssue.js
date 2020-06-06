const common = require('../../utils/common.js')
Page({
	data: {
		// 错误提示
		showTopTips: false,
		// 服务类别下拉
		classes: ["设计类", "编程类", "游戏类", "其他"],
		classIndex: 0,
		// 备注信息
		remark:'',
		// 是否同意条款
		isAgree: false,
		// 表单数据
		formData:{},
		// 表单验证规则
		rules: [{
			name: 'content',
			rules: {
				required: true,
				message: '请填写服务内容'
			},
		}, {
			name: 'price',
			rules: {
				required: true,
				message: '请填写预计价格'
			},
		}, {
			name: 'remark',
			rules: {
				required: true,
				message: '请填写备注信息'
			},
		},{
			name: 'QQ',
			rules: {
				required: true,
				message: '请填写联系QQ'
			},
		},{
			name: 'contact',
			rules:[{
				required: true,
				message: '请填写联系电话'
			},{
				mobile: true,
				message: '手机号格式不对'
			}]
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
			classIndex: e.detail.value,
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
				this.setData({
				    [`formData.servType`]:that.data.classIndex,
				})
				wx.requestSubscribeMessage({
					tmplIds: ['a4JqS-Qr4xRDs94L94Wz2fiVk7ROJ6_2xFA-pZgE5E4'],
					success(res) {
						console.log(res)
						wx.request({
						      url: common.baseUrl+'skillServ/skillServIssue',
							  method: "GET",
							  header: {
							  	'content-type': 'application/x-www-form-urlencoded'
							  },
							  data:{
								  uid:that.data.formData.uid,
								  content:that.data.formData.content,
								  remark:that.data.formData.remark,
								  price:that.data.formData.price,
								  servType:that.data.formData.servType,
								  contact:that.data.formData.contact,
								  QQ:that.data.formData.QQ
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
});
