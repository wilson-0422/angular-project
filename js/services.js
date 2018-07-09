angular.module('Ttouch.services', [])
    .factory('Storage', function() {
      "use strict";
      return {
        set: function(key, data) {
          return window.localStorage.setItem(key, window.JSON.stringify(data));
        },
        get: function(key) {
          if(angular.isUndefined(window.localStorage.getItem(key))){
            return '';
          }
          return window.JSON.parse(window.localStorage.getItem(key));
        },
        remove: function(key) {
          return window.localStorage.removeItem(key);
        }
      };
    })

    .service('Tools',['Storage','$http',
          function(Storage,$http) {

            this.validateNull = function(value){
              if(angular.isUndefined(value)||value==''||value==null){
                return true;
              }

              return false;

            };

            this.json_encode = function(array){
              return window.JSON.stringify(array)
            };

            this.json_decode = function(json){
              return window.JSON.parse(json);
            };
              this.clearBindObj = function(obj){

                  delete obj.$$hashKey;

                  return obj

              };

              this.clearBindArr = function(arr){

                  var _data = [];
                  for(var key in arr){

                      _data.push(this.clearBindObj(arr[key]))

                  }

                  return _data;

              };
            this.addNum = function(num1, num2) {
                var sq1,sq2,m;
                try {
                    sq1 = num1.toString().split(".")[1].length;
                }
                catch (e) {
                    sq1 = 0;
                }
                try {
                    sq2 = num2.toString().split(".")[1].length;
                }
                catch (e) {
                    sq2 = 0;
                }
                m = Math.pow(10,Math.max(sq1, sq2));
                return (num1 * m + num2 * m) / m;
            };
              this.decNum = function(num1, num2) {
                  var sq1,sq2,m;
                  try {
                      sq1 = num1.toString().split(".")[1].length;
                  }
                  catch (e) {
                      sq1 = 0;
                  }
                  try {
                      sq2 = num2.toString().split(".")[1].length;
                  }
                  catch (e) {
                      sq2 = 0;
                  }
                  m = Math.pow(10,Math.max(sq1, sq2));
                  return (num1 * m - num2 * m) / m;
              };
              this.getFloors = function(){


                    return [
                        {
                            'id':'B1',
                            'name':'B1:地下一层'
                        },
                        {
                            'id':'B2',
                            'name':'B2:地下二层'
                        },
                        {
                            'id':'1F',
                            'name':'1F:一层'
                        },
                        {
                            'id':'2F',
                            'name':'2F:二层'
                        },
                        {
                            'id':'3F',
                            'name':'3F:三层'
                        },
                        {
                            'id':'4F',
                            'name':'4F:四层'
                        },
                        {
                            'id':'',
                            'name':'所有楼层'
                        }
                    ];

                },this.getRebate=function(){
                return [{id:1,name:"满减"},{id:2,name:"满赠"},{id:3,name:"抵扣"},{id:4,name:"代金"},{id:5,name:"折扣"},{id:6,name:"停车"}];
            },this.getType=function(){
                return [{id:1,name:"预购（品牌展示）"},{id:2,name:"秒杀"},{id:3,name:"团购"},{id:4,name:"兑换"},{id:5,name:"活动"}];
            },this.getIntegral=function(){
                return [{id:1,name:"纯积分兑换"},{id:2,name:"能量点兑换"},{id:3,name:"积分＋现金兑换"}];
            }
          }
        ]
    )
    .service('CityPickerService', function ($http,ENV,$q) {

        this.cityList = function(){
            return $http.get('js/cityList.json');
        };

    })
    .factory('postService', ['$http','$rootScope','Storage','ENV',
      function($http,$rootScope,Storage,ENV) {

        var doRequest = function(path,url) {

            path.authToken = Storage.get('shangshe-user-authToken')==null?'':Storage.get('shangshe-user-authToken');

            path.time =1470823494;

            path.token = '867a061511577ea3d2241d02b825cc57';

          return $http({
            method: 'POST',
            url: ENV.api+url,
            data:path
          })
        };
        var show = function(msg){

          layer.open({
            content: msg,
            style:'text-align: center;',
            time: 1
          });

        };
        var confirm = function(content,yesCallBack,btn,noCallBack){

          if(angular.isUndefined(btn)){
            btn = ['确定', '取消'];
          }

          if(angular.isUndefined(noCallBack)){
            noCallBack = function(){

            }
          }
            if(angular.isUndefined(yesCallBack)){
                yesCallBack = function(){

                }
            }

          layer.open({
            content: content,
            btn: btn,
            style:'text-align: center;',
            yes:yesCallBack , no:noCallBack
          });

        };
        return {
            matchs: function(path,url) {

                return doRequest(path,url);
            },
            doPostPromise: function(path,url) {

                $rootScope.$loading = true;

                return doRequest(path,url);

            },
          doPost:function(path,url,successCallback,errorCallback){

            $rootScope.$loading = true;

            doRequest(path,url).success(function(data){

            $rootScope.$loading = false;


              if(data.status){

                if(angular.isUndefined(successCallback)){
                  show(data.msg);
                }else{
                  successCallback(data);
                }

              }else{

                  if(data.data==100){

                      showLogin();
                      show(data.msg);

                  }else {

                      if (angular.isUndefined(errorCallback)) {
                          if (angular.isUndefined(data.msg)) {
                              show('网络错误');
                          } else {
                              show(data.msg);
                          }

                      } else {
                          errorCallback(data);
                      }

                  }
              }
            }).error(function(){
              show('网络错误');
            })
          },
          showMsg:function(msg){
            show(msg);
          },
          confirm:function(content,yesCallBack,btn,noCallBack){
            confirm(content,yesCallBack,btn,noCallBack);
          }
        };
      }
    ])
    .directive('repeatDone', function() {
      return {
        link: function(scope, element, attrs) {
          if (scope.$last) {                   // 这个判断意味着最后一个 OK
            scope.$eval(attrs.repeatDone)    // 执行绑定的表达式
          }
        }
      }
    })
    .filter('imgFilter', function () {

        return function (src,type) {

            if (!src) {

                src = 'http://m.knito2o.com/images/default_avatar_'+type+'.png';

            }

            return src;

        }

    })
    .filter('trustHtml', function ($sce) {

      return function (input) {

        return $sce.trustAsHtml(input);

      }
    })
    .filter('num', function ($sce) {

      return function (n) {

        return parseInt(n);

      }
    })
    .filter('textchange', function () {

      return function (lab) {

        if(lab){
            var labels=[];
            var label=angular.fromJson(lab);
            for(var i=0;i<label.services.length;i++){
                labels.push(label.services[i].name);
            }
        }
        return  labels.join(',');

      }

    })
    .filter('splitImg', function () {

      return function (img) {

          var imgs=img.split('#');

        return  imgs[0]

      }

    })
    .factory('weiXinService',['Storage','$rootScope','postService','$cookieStore','$state',function(Storage,$rootScope,postService,$cookieStore,$state){
      return{

          loadWeiXin:function(url){
              var _getWeiXinSignPackage_url="index/wei-xin-sign-package";
              var path = {
                  'url':url
              };
              postService.matchs(path,_getWeiXinSignPackage_url).success(function(data,status){

                  var sign = data.data;

                  $rootScope.sign = sign;

                  wx.config({
                      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                      appId: sign.appId, // 必填，公众号的唯一标识
                      timestamp: sign.timestamp, // 必填，生成签名的时间戳
                      nonceStr: sign.nonceStr, // 必填，生成签名的随机串
                      signature: sign.signature,// 必填，签名，见附录1
                      jsApiList: [
                          'onMenuShareTimeline',
                          'onMenuShareAppMessage',
                          'hideMenuItems',
                          'showMenuItems',
                          'showAllNonBaseMenuItem',
                          'hideAllNonBaseMenuItem',
                          'startRecord',
                          'stopRecord',
                          'onVoiceRecordEnd',
                          'uploadVoice',
                          'downloadVoice',
                          'playVoice',
                          'onVoicePlayEnd',
                          'pauseVoice',
                          'stopVoice',
                          'openLocation',
                          'getLocation',
                          'chooseWXPay'
                      ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                  });
              });
          },

        onMenuShareAppMessage:function(title,desc,imgUrl,link,type,dataUrl){

          wx.showAllNonBaseMenuItem();

          imgUrl = imgUrl==undefined?baseUrl+'mobile/images/letu.png':imgUrl;
          link = link==undefined?window.location.href:link;

          wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: link, // 分享链接
            imgUrl: imgUrl, // 分享图标
            type: type, // 分享类型,music、video或link，不填默认为link
            dataUrl: dataUrl, //如果type是music或video，则要提供数据链接，默认为空
            success: function () {
              // 用户确认分享后执行的回调函数
            },
            cancel: function () {
              // 用户取消分享后执行的回调函数
            }
          });

          wx.onMenuShareTimeline({
            title: title+'-'+desc, // 分享标题
            link: link, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {
              // 用户确认分享后执行的回调函数
            },
            cancel: function () {
              // 用户取消分享后执行的回调函数
            }
          });

        },
        hideMenuItems:function(){
          wx.hideAllNonBaseMenuItem();
        },weiChatLoginByOpenId:function(){//微信登陆处理

          var _openId = $cookieStore.get('shangshe-user-openId');

          var getQueryString =  function(name) {

            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;

          };

          var code = getQueryString("code");

          if(_openId!=null){

            var _getOpenId_url = "user/login-for-openid";

            var _path = {
              openid:_openId
            };

            postService.doPost(_path,_getOpenId_url,function(data){

                $rootScope.user = data.data;

                Storage.set('shangshe-user-authToken',data.authToken);

                Storage.set('shangshe-user-data',data.data);

                $rootScope.$emit('loginSuccess');

            },function(data){

                Storage.remove('shangshe-user-authToken');

                Storage.remove('shangshe-user-data');

                $cookieStore.remove('shangshe-user-openId');

                $state.go('index.main');

            });

          }else if(code!=null){

            var _getOpenId_url = "user/login-by-code";

            var _path = {
              code:code
            };

            postService.doPost(_path,_getOpenId_url,function(data){

                $rootScope.user = data.data;

                $cookieStore.put('shangshe-user-openId',data.data.openid);

                Storage.set('shangshe-user-authToken',data.authToken);

                Storage.set('shangshe-user-data',data.data);

                $state.reload();

            },function(data){

                Storage.remove('shangshe-user-authToken');

                Storage.remove('shangshe-user-data');

                $state.go('index.main');

            });
          }else{

                var _href = window.location.origin+window.location.pathname;

                window.location.href = "http://chinaknit.cn/frontend/web/site/direct-weixin-login?backUrl="+encodeURIComponent(_href);

          }
        },startRecord:function(){
              console.log("开始录音");
              var localId="";
              wx.startRecord();
              wx.onVoiceRecordEnd({
                  // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                  complete: function (res) {
                      localId = res.localId;
                  }
              });

              return localId;

          },stopRecord:function(callBack){
              wx.stopRecord({
                  complete: function (res) {
                      callBack(res.localId);
                  }
              });


          },uploadVoice:function(localId,callBack){

              wx.uploadVoice({
                  localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                  isShowProgressTips: 1, // 默认为1，显示进度提示
                  success: function (res) {
                      callBack(res.serverId); // 返回音频的服务器端ID
                  }
              });
          },playVoice:function(localId){

              wx.playVoice({
                  localId: localId // 需要播放的音频的本地ID，由stopRecord接口获得
              });

          },pauseVoice:function(localId){
              wx.pauseVoice({
                  localId: localId // 需要暂停的音频的本地ID，由stopRecord接口获得
              });
          },stopVoice:function(localId){
              wx.stopVoice({
                  localId: localId// 需要停止的音频的本地ID，由stopRecord接口获得
              });
          },
          downloadVoice:function(serverId,callBack){
              wx.downloadVoice({
                  serverId: serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
                  isShowProgressTips: 1, // 默认为1，显示进度提示
                  success: function (res) {
                      callBack(res.localId);
                     // 返回音频的本地ID
                  }
              });
          },previewImg:function(http,urls){
              wx.previewImage({
                  current: http, // 当前显示图片的http链接
                  urls: urls // 需要预览的图片http链接列表
              });
          },openLocation:function(){
              wx.openLocation({
                  latitude: 0, // 纬度，浮点数，范围为90 ~ -90
                  longitude: 0, // 经度，浮点数，范围为180 ~ -180。
                  name: '', // 位置名
                  address: '', // 地址详情说明
                  scale: 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
                  infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
              });
          },getLocation:function(callBack){
              wx.getLocation({
                  type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                  success: function (res) {
                      var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                      var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                      var speed = res.speed; // 速度，以米/每秒计
                      var accuracy = res.accuracy; // 位置精度,
                      callBack(res);
                  }
              });
          },pay:function(data,callback){

              wx.chooseWXPay({
                  timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                  nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                  package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                  signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                  paySign: data.paySign, // 支付签名
                  success: function (res) {

                      callback(res);
                      // 支付成功后的回调函数
                  }
              });

          }
      }
    }])




