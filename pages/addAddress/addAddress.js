// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
    key: 'CATBZ-4W7WW-7K3RF-O77CE-MUONE-BWB62'//申请的开发者秘钥key
});
Page({
  data: {
//测试
		index:-1,
	// 表单
		map:"",
		contact:"",
		detail:"",
		linkman:"",
		allAdress:[],
	// 表单数据
		formData:{},
		// 表单验证规则
		rules: [{
			name: 'map',
			rules: {
				required: true,
				message: '请获取地址'
			},
		}, {
			name: 'detail',
			rules: {
				required: true,
				message: '请填写详细地址'
			},
		}, {
			name: 'linkman',
			rules: {
				required: true,
				message: '请填写联系人'
			},
		}, {
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

  onLoad: function (options) {
	  let that=this
	  // 读取缓存session并赋值给allAdress
	  wx.getStorage({
	  			  key:'allAdress',
	  			  success:function(res){
	  				  that.setData({
	  					  allAdress:res.data
	  				  })
	  			  }
	  })
	  // 编辑业务传过来的index
	  let index=options.index
	  if(index>-1){
		  wx.setNavigationBarTitle({
		        title: options.title
		      })
		  wx.getStorage({
		  		  key:'allAdress',
		  		  success:function(res){
		  			  that.setData({
						  // 读取编辑的原数据
		  				map:res.data[index].map,
		  				[`formData.map`]:res.data[index].map,
		  				contact:res.data[index].contact,
		  				[`formData.contact`]:res.data[index].contact,
		  				detail:res.data[index].detail,
		  				[`formData.detail`]:res.data[index].detail,
		  				linkman:res.data[index].linkman,
		  				[`formData.linkman`]:res.data[index].linkman,
		  				index:index
		  			  }) 
		  		  }
		  })
	  }
  },
  
  //移动选点
  moveToLocation: function () {
	let that=this
    wx.chooseLocation({
      success: function (res) {
		  that.setData({
		  	map:res.name,
			[`formData.map`]:res.name
		  })
      },
      fail: function (err) {
        console.log(err)
      }
    });
  },
  
  // 提交校验
  saveChange(){
  	this.selectComponent('#form').validate((valid, errors)=>{
  		console.log('valid', valid, errors)
		var that=this;
  		if (!valid) {
  			const firstError = Object.keys(errors)
  			if (firstError.length) {
  				that.setData({
  					error: errors[firstError[0]].message
  			})
  			}
  		}else{
  			wx.showToast({
  				title: '保存成功'
  			})
			console.log(that.data.index)
			// 通过index是否有值来判断是修改还是新增
			if(that.data.index>-1)
				that.data.allAdress.splice(that.data.index,1,that.data.formData)
			else
				that.data.allAdress.push(that.data.formData)
			setTimeout(function () {
				// 设置allAdress的session
				wx.setStorage({//异步方法
					key:'allAdress',
					data:that.data.allAdress
				})
				wx.navigateBack({
				  delta:2
				}); 
			}, 1000) //循环间隔 单位ms
  		}
  	})
  }
})
