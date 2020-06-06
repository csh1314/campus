const common = require('../../utils/common.js')
Page({
	data: {
		// 错误提示
		showTopTips: false,
		// 是否同意条款
		isAgree: false,
		// 表单数据
		formData: {},
		// 表单验证规则
		rules: [{
			name: 'name',
			rules: {
				required: true,
				message: '请填写昵称'
			},
		}, {
			name: 'email',
			rules: [{
				required: true,
				message: '请填写邮箱号码'
			}, {
				email: true,
				message: '邮箱格式不对'
			}]
		}, {
			name: 'vcode',
			rules: {
				required: true,
				message: '请填写验证码'
			},
		}, {
			name: 'sname',
			rules: {
				required: true,
				message: '请填写姓名'
			},
		}, {
			name: 'sno',
			rules: {
				required: true,
				message: '请填写学号'
			},
		}],
		emailCode: '',
		// 部分个人信息自动获取
		hasUserInfo: false,
		// 验证码
		codeText:'获取验证码',
		counttime:'',
		codeTextLast:'',
		disabled:false
	},
	// 部分个人信息自动获取
	getUserInfo() {
		var that = this;
		wx.getStorage({
			key: 'wxuserInfo',
			success: function(res) {
				console.log(res)
				that.setData({
					avatarUrl: res.data.avatarUrl,
					[`formData.avatarUrl`]: res.data.avatarUrl,
					name: res.data.nickName,
					[`formData.name`]: res.data.nickName,
					gender: res.data.gender,
					[`formData.gender`]: res.data.gender,
					[`formData.openid`]: res.data.openId
				})
			}
		})
	},
	// 发送邮箱验证码
	sendVcode() {
		// 邮箱格式验证
		let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
		var that = this;
		if(!that.data.formData.email){
			that.setData({
				error: '邮箱不能为空'
			})
		}else if(str.test(that.data.formData.email)){
			wx.request({
				url: common.baseUrl+'email',
				method: "post",
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					emailAddress: that.data.formData.email
				},
				success(res) {
					console.log("验证码发送成功")
					//console.log(res)
					that.setData({
						emailCode: res.data.maillCode,
						codeText:'',
						codeTextLast:'秒后重新获取',
						counttime:60,
						disabled:true
					})
					// 开始计时
					that.countTime();
				},
				fail() {
					console.log("失败");
				}
			})
		} else {
			that.setData({
				error: '邮箱格式不对'
			})
		}
	},
	// 计时器
	countTime(){
		let that=this;
		let time=this.data.counttime;
		let interval = setInterval(function(){
			time--;
			that.setData({
				counttime:time
			})
			if(time===0){
				clearInterval(interval)
				that.setData({
					codeText:'重新获取',
					codeTextLast:'',
					counttime:'',
					disabled:false
				})
			}
		},1000)
	},
	// input信息改变
	formInputChange(e) {
		const {
			field
		} = e.currentTarget.dataset
		this.setData({
			[`formData.${field}`]: e.detail.value
		})
	},
	// 勾选
	bindAgreeChange: function(e) {
		this.setData({
			isAgree: !!e.detail.value.length
		})
	},

	onLoad() {
		this.getUserInfo();
	},

	// 提交校验
	submitForm() {
		var that = this;
		this.selectComponent('#form').validate((valid, errors) => {
			//console.log('valid', valid, errors)
			if (!valid) {
				const firstError = Object.keys(errors)
				if (firstError.length) {
					this.setData({
						error: errors[firstError[0]].message
					})
				}
			} else if (this.data.emailCode === this.data.formData.vcode) {
				wx.request({
					url: common.baseUrl+'users/regist',
					method: "get",
					data: {
						nickName: that.data.formData.name,
						gender: that.data.formData.gender,
						avatarUrl: that.data.formData.avatarUrl,
						email: that.data.formData.email,
						openid: that.data.formData.openid,
						sno: that.data.formData.sno,
						sname: that.data.formData.sname
					},
					success(res) {
						console.log(res)
						if(res.data.status=='0'){
							that.setData({
								error: res.data.msg
							})
						}else if(res.data.status=='1'){
							wx.setStorage({
								key: "userInfo",
								data: {
									nickName: that.data.formData.name,
									gender: that.data.formData.gender,
									avatarUrl: that.data.formData.avatarUrl,
									email: that.data.formData.email
								}
							})
							wx.setStorage({
								key: "uid",
								data:res.data.uid
							})
							wx.showToast({
								title: '注册成功'
							})
							setTimeout(function() {
								wx.switchTab({
									url: '/pages/user/user'
								})
							}, 1000)
						}
					},
					fail() {}
				})
			} else {
				this.setData({
					error: '验证码错误'
				})
			}
		})
	}
});
