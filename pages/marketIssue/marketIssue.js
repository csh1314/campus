const common = require('../../utils/common.js')
Page({
	data: {
		// 错误提示
		showTopTips: false,
		// 上传的图片文件
		files: [],
		// 图片缓存
		images:[],
		baseImg:[], // base64图片集合
		// 物品类别下拉
		classes: ["生活物品", "二手书籍", "数码产品", "其他"],
		classIndex: 0,
		// 交易方式下拉
		types: ["线下自提", "快递邮寄"],
		typeIndex: 0,
		// 物品描述
		describe:'',
		// 是否同意条款
		isAgree: false,
		// 表单数据
		formData:{},
		// 表单验证规则
		rules: [{
			name: 'name',
			rules: {
				required: true,
				message: '请填写物品名称'
			},
		}, {
			name: 'nowPrice',
			rules: {
				required: true,
				message: '请填写出售价格'
			},
		}, {
			name: 'beforePrice',
			rules: {
				required: true,
				message: '请填写物品原价'
			},
		}, {
			name: 'describe',
			rules: {
				required: true,
				message: '请填写物品描述'
			},
		},{
			name: 'contact',
			rules:[{
				required: true,
				message: '请填写联系方式'
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
			classIndex: e.detail.value
		})
	},
	bindTypeChange: function(e) {
		this.setData({
			typeIndex: e.detail.value
		})
	},
	// textarea改变
	bindDescribeChange:function(e){
		this.setData({
			describe:e.detail.value,
			[`formData.describe`]:e.detail.value
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
		this.setData({
			selectFile: this.selectFile.bind(this),
			uploadFile: this.uploadFile.bind(this)
		}),
		wx.getStorage({
			key: 'uid',
			success: function(res) {
				that.setData({
					[`formData.uid`]:res.data,
				})
			}
			})
	},
	
	/* //选择图片
	chooseImage: function(e) {
		var that = this;
		wx.chooseImage({
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function(res) {
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
				console.log(res)
				that.setData({
					files: that.data.files.concat(res.tempFilePaths)
				});
				
			}
		})
	}, 
	// 预览图片
	previewImage: function(e) {
		wx.previewImage({
			current: e.currentTarget.id, // 当前显示图片的http链接
			urls: this.data.files // 需要预览的图片http链接列表
		})
	},
	*/
	selectFile(files) {
		//console.log('files', files)
		// 返回false可以阻止某次文件上传
	},
	uploadFile(files) {
		//console.log('upload files', files)
		// 文件上传的函数，返回一个promise
		var that=this;
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				//reject('some error')
				resolve({
					urls:files.tempFilePaths,
				})
			}, 1000)
		})
	},
	uploadError(e) {
		//console.log('upload error', e.detail)
	},
	uploadSuccess(e) {
		//console.log('upload success', e.detail)
		for(var i=0;i<e.detail.urls.length;i++){
			this.data.images.push(e.detail.urls[i])
			// 实现多图片同时上传
			// 转base64
			let that=this
			wx.getFileSystemManager().readFile({
			    filePath: e.detail.urls[i],
			    encoding: "base64",
			    success: function(res) {
					const temp='data:image/png;base64,' + res.data
			        that.data.baseImg.push(temp.toString());
			        //转换完毕，可以执行上传
			    }
			})
		}
	},
	deleteFile(e){
		//console.log('delete success',e.detail)
		this.data.images.splice(e.detail.index,1)	
		this.data.baseImg.splice(e.detail.index,1)
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
				this.setData({
				    //[`formData.images`]:this.data.images,
			        [`formData.goodsType`]:this.data.classIndex,
					[`formData.orderType`]:this.data.typeIndex
				})
				//上传图片到服务器
				let that=this;
				// 订阅消息
				wx.requestSubscribeMessage({
					tmplIds: ['a4JqS-Qr4xRDs94L94Wz2fiVk7ROJ6_2xFA-pZgE5E4'],
					success(res) {
						console.log(res)
						wx.request({
						      url: common.baseUrl+'orders/marketIssue',
							  method: "POST",
							  header: {
							  	'content-type': 'application/x-www-form-urlencoded'
							  },
							  data:{
								  base:JSON.stringify(that.data.baseImg),
								  uid: that.data.formData.uid,
								  name: that.data.formData.name,
								  describes: that.data.formData.describe,
								  nowPrice: that.data.formData.nowPrice,
								  beforePrice: that.data.formData.beforePrice,
								  contact: that.data.formData.contact,
								  goodsType: that.data.formData.goodsType,
								  orderType: that.data.formData.orderType,
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
