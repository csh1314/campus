const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentCount: 0, //正文字数
    content: '' ,//正文内容
    lostOrFound: ["失物招领", "寻物启事"],
    type: 0,
	// 错误提示
	showTopTips: false,
	// 上传的图片文件
	files: [],
	// 图片缓存
	images:[],
	baseImg:[], // base64图片集合
	// 表单数据
	formData:{},
	uid:'',
	// 表单验证规则
	rules: [ {
		name: 'content',
		rules: {
			required: true,
			message: '请填写相关信息'
		},
	}]
  },
 
  handleContentInput(e) {
    const value = e.detail.value
    this.setData({
       content: value,
       contentCount: value.length,
	   [`formData.content`]:e.detail.value
    });
  },
  // 下拉
  bindTypeChange: function(e) {
  	this.setData({
  		type: e.detail.value
  	})
  },
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
  			let that=this;
  			wx.request({
  			      url: common.baseUrl+'lost/lostIssue',
  				  method: "POST",
  				  header: {
  				  	'content-type': 'application/x-www-form-urlencoded'
  				  },
  				  data:{
  					  base:JSON.stringify(that.data.baseImg),
  					  uid:that.data.uid,
					  content:that.data.content,
					  releaseType:that.data.type
  				  }, 
  			      success (res){
  			        console.log(res)
					if(res.data.statusCode==='200'){
						setTimeout(function () {
							wx.showToast({
							  title: '已提交发布！',
							})
						}, 1000)
						wx.navigateBack({
						  delta:1
						}); 
					}
  			      }
  			    })
  			
  		}
  	})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  var uid=options.uid;
	  this.setData({
		  uid:uid,
		  selectFile: this.selectFile.bind(this),
		  uploadFile: this.uploadFile.bind(this)
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