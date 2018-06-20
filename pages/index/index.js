// pages/demo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    appid:'',
    movies: [],//这里接受的是movies数据，所以骨架文件那里绑定的也是这个
    currentTab: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    // tab切换  
    //获取第三方小程序appid
    var extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
    var appid = extConfig.appid;
    this.setData({
      appid:appid,
    })
    if (appid) {
      this.request(appid,'all');
    } else {
      wx.showModal({
        title: '系统出错',
        content: '无法获取小程序appid或该值不存在',
      })
    }
  },
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },

  swichNav:function(e){          //点击的时候可以找到相对应的数据
    var data = e.target.dataset;
    var typ = data.type;
    var category = data.category;
    var appid = this.data.appid;
    this.request(appid,typ);//获取到投票数据
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  request:function(appid,typ){
    var that=this;
    wx.request({
      url: 'https://test.moh.cc/home/wxapp/index/appid/' + appid + '.html?page=1',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      data: { "type": typ },
      success: function (res) {
        var errcode = res.data.errcode;
        var data = res.data.data;
        // console.log(data);
        that.prosessData(data, appid, typ);//对传进来的数据进行筛选
       
        //  console.log(movies);
        if (errcode == 1) {
          //  console.log(data);
          // that.setData({
          //   movies:data
          // })
        } else {
          wx.showModal({
            title: '系统提示',
            content: '没有数据....',
          })
        }
      }
    })  
  },
  prosessData: function (data) {
    var movies = [];
    for(var i in data) {
      // console.log(data[i].reply_title);
      // var subject=data[i];
      // console.log(subject);
      // var title = subject.reply_title;
      // console.log(title);
      // var coverageUrl = subject.reply_pic;
      // console.log(coverageUrl);
      // var time = subject.apply_end_time;
      // console.log(time);
      // var temp = {

      //   title: title,                           //获取到题目，图片还有日期
      //   coverageUrl: coverageUrl,
      //   time: time

      // }
      var reply_title = data[i].reply_title
      var reply_pic = data[i].reply_pic
      var id = data[i].id
      var token = data[i].token
      var apply_start_time = data[i].apply_start_time
      var apply_end_time = data[i].apply_end_time
      var temp = {
        reply_title : reply_title,
        reply_pic : reply_pic,
        id:id,
        token:token,
        apply_start_time:apply_start_time,
        apply_end_time:apply_end_time
      };
      movies.push(temp);
    }
    console.log(data);
    this.setData({
      movies: data
    });
    console.log(movies);
    // console.log(this.data.movies);
    /*for (var idx in data.subjects) {
      console.log('xxxxxxxx');
      var subject = data.subjects[idx];
      var title = subject.title;
      console.log(subject);
      if (title.length > 6) {
        title = title.substring(0, 6) + "...";   //当题目的字数超过6个的时候后面的字会省略掉
      }
      var temp = {

        title: subject.action_name,                           //获取到题目，图片还有日期
        coverageUrl: subject.reply_pic,
        time: subject.start_time

      }
      movies.push(temp)
    }*/
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '魔盒CMS投票系统单选粉色演示模版',
      path: '/page/index/index'
    }
  }
})