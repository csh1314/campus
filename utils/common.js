// 接口地址
//const baseUrl='http://localhost:8090/api/'
const baseUrl='https://www.booksms.top/api/'
// 检查登录态
function checkLogin(){
	let isLogin=false;
	return new Promise(function(resolve){
		wx.checkSession({
		  success: function () {
		    //存在登陆态
			console.log('已登录')
			isLogin=true
			resolve(isLogin)
		  },
		  fail: function () {
		    //不存在登陆态
			resolve(isLogin)
		    wx.showModal({
		      title: '提示',
		      content: '尚未登录,请前往登录',
		      success (res) {
		        if (res.confirm) {
		          console.log('用户点击确定')
				  wx.switchTab({
				  	url:'/pages/user/user'
				  })
		        } else if (res.cancel) {
		          console.log('用户点击取消')
		        }
		      }
		    })
		  }
		})
	})
}
// 部分显示信息
const toHide = function(array) {
  var info = array.substring(0, 3) + '******';
  return info;
}
// 一键复制信息
const copyThat = function(data) {
	wx.setClipboardData({
	  data: data,
	  success (res) {
	    wx.getClipboardData({
	      success (res) {
	        //console.log(res.data) // data
	      }
	    })
	  }
	})
}
// 过滤器  condition为fettle="?"（待接、进行、完成）
const filter = function(data,condition) {
	var result=data.filter(item=>item.fettle===condition.toString())
	return result
}

module.exports = {
  baseUrl: baseUrl,
  checkLogin:checkLogin,
  toHide:toHide,
  copyThat:copyThat,
  filter:filter
}
