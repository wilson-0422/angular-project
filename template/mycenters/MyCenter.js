var C= angular.module('Ttouch.mycenters', [])
    .controller('MyCentersCtrl',  //  个人中心
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$interval','$cookieStore',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$interval,$cookieStore) {

                $scope.openId=$cookieStore.get('shangshe-user-openId');

                var getUserInfo=function(){
                    var _url='user-extend/user-info';

                    var _path={
                    }

                    postService.doPost(_path,_url,function(data){

                        console.log(data)
                        $scope.userInfo=data.data;


                    })
                }
                getUserInfo()

                $rootScope.$isloaing = false;

                $scope.sginDay=function(){

                    var _url='user-extend/sign';

                    var _path={
                        openid:$scope.openId
                    }

                    postService.doPost(_path,_url,function(data){

                        postService.showMsg(data.msg);

                        $scope.userInfo.is_sign=1;

                        $state.reload();

                    })

                }

                $scope.enter_myInfo=function(){

                    Storage.remove('userInfo');

                    $state.go('MyBioInfo');

                }
            }
        ])
    .controller('MyBioInfoCtrl',  //  个人中心 —— 个人资料
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$interval','Upload','ENV',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$interval,Upload,ENV) {

                $scope.arrt = [];

                var data=Storage.get('userInfo');

                var myBioDataInfo = function () {

                    var _url='user-extend/user-info';

                    var _path={
                    }


                    postService.doPost(_path,_url,function(data){

                        console.log(data)

                        $scope.MyBioaInfo=data.data;

                        $scope._hobby = window.JSON.parse($scope.MyBioaInfo.hobby)


                    })
                }

                if(data!=null){

                    $scope.MyBioaInfo=data

                    $scope._hobby = window.JSON.parse($scope.MyBioaInfo.hobby)

                }else{

                    myBioDataInfo();

                }


                $scope.editMyBioDataInfo=function(){

                    var _url='user-extend/edit-user-info';

                    var _path={
                        avatar:$scope.MyBioaInfo.avatar_path,
                        shop_name:$scope.MyBioaInfo.shop_name,
                        address_info:$scope.MyBioaInfo.address_info,
                        license_path:$scope.MyBioaInfo.license_path,
                        run_year:$scope.MyBioaInfo.run_year,
                        nickname:$scope.MyBioaInfo.nickname,
                        hobby:$scope.MyBioaInfo.hobby
                    }


                    postService.doPost(_path,_url,function(data){

                        $state.go('index.MyCenters');

                        Storage.remove('userInfo');
                    })
                };



                $scope.ui_label=function(){

                    Storage.set('userInfo',$scope.MyBioaInfo);

                    $state.go('changeLabel',{type:1});

                }

            }
        ])
    .controller('MessageCenterCtrl', //  个人中心 ——  消息中心
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$interval','messages',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$interval,messages) {

                $rootScope.$isloaing = false;

                var getMessageList=function(type){

                    var _url='user-extend/message-list';

                    var _path={
                        data_type:type
                    }

                    postService.doPost(_path,_url,function(data){

                        if(type==101){
                            $scope.xitongMsg=data.data.models[0];
                        }else if(type==102){
                            $scope.orderMsg=data.data.models[0];
                        }else if(type==103){
                            $scope.collectMsg=data.data.models[0];

                            console.log($scope.collectMsg)
                        }else if(type==104){
                            $scope.crowdMsg=data.data.models[0];
                        }

                    })
                }

                getMessageList(101);
                getMessageList(102);
                getMessageList(103);
                getMessageList(104);

            }
        ])
    .controller('OrdersMessageCtrl',  //  个人中心 ——  消息中心——订单消息
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$interval',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$interval) {

                $rootScope.$isloaing = false;

                var getMessageList=function(type){

                    var _url='user-extend/message-list';

                    var _path={
                        data_type:type,
                    }

                    postService.doPost(_path,_url,function(data){

                        console.log(data)

                        $scope.orderMsg=data.data

                    })
                }

                getMessageList(102);

            }
        ])
    .controller('ConcernMessageCtrl',  //  个人中心 ——  消息中心——关注消息
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$interval',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$interval) {

                $rootScope.$isloaing = false;


                var getMessageList=function(did){

                    var _url='user-extend/get-merchant-by-message';

                    var _path={
                        data_id:did
                    }

                    postService.doPost(_path,_url,function(data){

                        console.log(data)

                        $scope.collectInfo=data.data

                    })
                }

                getMessageList($stateParams.did);

            }
        ])
    .controller('CrowdMessageCtrl',  //  个人中心 ——  消息中心——众筹消息
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$interval',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$interval) {

                $rootScope.$isloaing = false;

                //var getMessageList=function(type){
                //
                //    var _url='user-extend/message-list';
                //
                //    var _path={
                //    }
                //
                //    postService.doPost(_path,_url,function(data){
                //
                //        console.log(data)
                //
                //        $scope.crowdMsg=data.data
                //
                //    })
                //}
                //
                //getMessageList(104);

                var _path={
                    page:0
                }

                $scope.load = {
                    busy:false
                };

                $scope.msgList = [];

                $scope.load.nextPage = function(){

                    _path.page++;

                    $scope.load.busy = true;

                    var _url='user-extend/message-list';

                    postService.doPost(_path,_url,function(data){

                        if(_path.page>data.data.totalPage){

                            $scope.load.busy = true;

                        }else{

                            var models = data.data.models;

                            for (var i = 0; i < models.length; i++) {

                                $scope.msgList.push(models[i]);

                            }

                            $scope.load.busy = false;

                        }
                    });
                };

            }
        ])
    .controller('integralsCenterCtrl', //  个人中心 —— 积分中心
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$interval','personInfo',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$interval,personInfo) {

                $rootScope.$isloaing = false;

                $scope.userInfo=personInfo.data.data;

                var _path={
                    page:0
                }

                $scope.load = {
                    busy:false
                };

                $scope.goodsList = [];

                $scope.load.nextPage = function(){

                    _path.page++;

                    $scope.load.busy = true;

                    var _url='user-extend/point-log';

                    postService.doPost(_path,_url,function(data){

                        if(_path.page>data.data.totalPage){

                            $scope.load.busy = true;

                        }else{

                            var models = data.data.models;

                            for (var i = 0; i < models.length; i++) {

                                $scope.goodsList.push(models[i]);

                            }

                            $scope.load.busy = false;

                        }
                    });
                };
            }
        ])
    .controller('myOrdersCtrl',//  个人中心 —— 我的全部订单
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$interval',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$interval) {


                $rootScope.$isloaing = false;

                $scope.stateLsit = [
                    "买家未付款",
                    "待付款",
                    "已付款",
                    "卖家已发货",
                    "交易成功",
                    "申请退换货中",
                    "已退换货",
                    "交易已关闭",
                    "订单已删除"
                ];

                //订单列表加载

                $scope.path = {
                    page:0,
                    status:$stateParams.status,
                    comment_status:''
                };

                $scope.tab_index= $stateParams.status;

                $scope.load = {
                    busy:false
                };
                $scope.orderList = [];

                $scope.load.nextPage = function(){

                    $scope.path.page++;

                    $scope.load.busy = false;

                    var _url='user-extend/my-orders';

                    postService.doPost($scope.path,_url,function(data){

                        if($scope.path.page > data.data.totalPage){

                            $scope.load.busy = true;

                        }else {

                            var models = data.data.models;

                            for (var i = 0; i < models.length; i++) {

                                $scope.orderList.push(models[i]);

                            }
                            if ($scope.path.page == data.data.totalPage) {

                                $scope.load.busy = true;

                            } else {

                                $scope.load.busy = false;


                            }
                        }
                    });
                };

                //筛选
                $scope.getOrderList=function(status){

                    $scope.orderList = [];

                    $scope.tab_index = status;

                    if (status == 4) {

                        $scope.path.comment_status = 1;
                    }else{

                        $scope.path.comment_status = '';
                    }

                    $scope.path.page = 0;

                    $scope.path.status = status;

                    $scope.load.nextPage();

                };

                //删除订单
                $scope.deleteOrder = function (order) {

                    postService.confirm('确认要删除订单',function(){

                        var _url = 'product/del-order';

                        var _path = {
                            order_id:order.order_id,
                            type:1
                        }
                        postService.doPost(_path, _url, function (data) {

                            console.log(data)
                            postService.showMsg('订单已删除')
                            $state.reload();

                        })
                    })
                    
                }
                //取消订单
                $scope.cancelOrder = function (oreders) {

                    postService.confirm('确认要取消订单',function(){

                        var _url = 'product/chanel-order';

                        var _path = {
                            order_id:oreders.order_id,
                            type:1
                        }
                        postService.doPost(_path, _url, function (data) {

                            console.log(data)
                            postService.showMsg('订单取消成功')
                            $state.reload();

                        })
                    })

                }
                //评价

                $scope.stars=[1,2,3,4,5]

                $scope.evaluate = false;

                $scope.lightStarF=[];
                $scope.lightStarW=[];
                $scope.lightStarP=[];

                $scope.oid='';

                $scope.clickevaluate =function (order) {

                    if(order.comment_status==2){

                        postService.showMsg('该商品已经评价过了')
                        return false;

                    }

                    $scope.evaluate=!$scope.evaluate

                    $scope.oid=order.order_id;

                }

                $scope.changeStar=function(index,num){

                    if(num==1){
                        $scope.lightStarF=[]
                    }else if(num==2){
                        $scope.lightStarW=[]
                    }else{
                        $scope.lightStarP=[]
                    }

                    for(var i=0;i<$scope.stars.length;i++){

                        if(i<=index){

                            if(num==1){
                                $scope.lightStarF.push(i+1);
                            }else if(num==2){
                                $scope.lightStarW.push(i+1);
                            }else{
                                $scope.lightStarP.push(i+1);
                            }

                        }

                    }

                }

                $scope.evaluateOrder=function(){

                    if($scope.lightStarF.length==0||$scope.lightStarW.length==0||$scope.lightStarP.length==0){

                        postService.showMsg('请完整填写评价列表');
                        return false;

                    }

                    var _url = 'product/comment-order';

                     var _path = {
                         order_id:$scope.oid,
                         dispatch_grade:$scope.lightStarF.length,
                         transport_grade:$scope.lightStarW.length,
                         quality_grade:$scope.lightStarP.length,
                         type:1
                     }
                     postService.doPost(_path, _url, function (data) {

                         console.log(data);
                         $scope.evaluate = false;
                         $state.reload();
                         postService.showMsg(data.msg)

                     })

                }

                // $scope.evaluateFn = function (oreders) {
                //
                //     var _url = 'product/comment-order';
                //
                //     var _path = {
                //         order_id:oreders.order_id,
                //     }
                //     postService.doPost(_path, _url, function (data) {
                //
                //         console.log(data)
                //
                //         $scope.evaluateInfo=data.data
                //
                //     })
                //
                // }

            }
        ])
    .controller('WaitingGoodCtrl', //  我的订单详情
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$interval','weiXinService','orderInfo',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$interval,weiXinService,orderInfo) {

                $rootScope.$isloaing = false;

                $scope.showBox  = {
                    'note':false
                };

                    $scope.orderInfo=orderInfo.data.data;


                if($scope.orderInfo.is_lose==2){

                    $scope.showQue={
                        'note':true,
                    }

                }else{

                    $scope.showQue={
                        'note':false,
                    }

                }

                $scope.changeAddress=function(status){

                    if(status==1){

                        $state.go('adressList',{'oid':$stateParams.oid,class:1})

                    }else{

                        return false;
                    }

                };

                $scope.doPay = function(){

                    weiXinService.pay($scope.orderInfo.params,function(res){

                        postService.showMsg('支付成功');

                        $state.reload();

                    });
                };

                $scope.comfigeOrder=function(){

                    var _url='product/confirm-order';

                    var _path={
                        order_id:$scope.orderInfo.order_id,
                        type:1,
                    }

                    postService.doPost(_path,_url,function(data){

                        postService.showMsg('收到货啦~')

                        $state.go('myOrders',{'status':4})

                    })

                };

                $scope.disable = false;
                $scope.setOrderNote = function(){

                    $scope.disable = true;

                    var _url='product/edit-note';

                    var _path={
                        order_id:$scope.orderInfo.order_id,
                        note:$scope.orderInfo.note
                    };
                    postService.doPost(_path,_url,function(data){

                        postService.showMsg(data.msg);

                    })

                }



                $scope.partLose = function (type) {

                    var _url='product/part-lose-refund';

                    var _path={
                        order_id:$scope.orderInfo.order_id,
                        type:type
                    };
                    postService.doPost(_path,_url,function(data){

                        postService.showMsg(data.msg);

                        //$state.reload();

                        $state.go('myOrders',{status:0})

                    })
                }
//删除订单
                $scope.deleteOrder = function (order) {

                    postService.confirm('确认要删除订单',function(){

                        var _url = 'product/del-order';

                        var _path = {
                            order_id:order.order_id,
                            type:2
                        }
                        postService.doPost(_path, _url, function (data) {

                            console.log(data)
                            postService.showMsg('订单已删除')
                            //$state.reload();

                            $state.go('myOrders',{status:0})

                        })
                    })

                }
                //取消订单
                $scope.cancelOrder = function (oreders) {

                    postService.confirm('确认要取消订单',function(){

                        var _url = 'product/chanel-order';

                        var _path = {
                            order_id:oreders.order_id,
                            type:2
                        }
                        postService.doPost(_path, _url, function (data) {

                            console.log(data)
                            postService.showMsg('订单取消成功')
                            $state.reload();

                        })
                    })

                }
                //评价

                $scope.stars=[1,2,3,4,5]

                $scope.evaluate = false;

                $scope.lightStarF=[];
                $scope.lightStarW=[];
                $scope.lightStarP=[];

                $scope.oid='';

                $scope.clickevaluate =function (order) {

                    if(order.comment_status==2){

                        postService.showMsg('该商品已经评价过了')
                        return false;

                    }

                    $scope.evaluate=!$scope.evaluate

                    $scope.oid=order.order_id;

                }

                $scope.changeStar=function(index,num){

                    if(num==1){
                        $scope.lightStarF=[]
                    }else if(num==2){
                        $scope.lightStarW=[]
                    }else{
                        $scope.lightStarP=[]
                    }

                    for(var i=0;i<$scope.stars.length;i++){

                        if(i<=index){

                            if(num==1){
                                $scope.lightStarF.push(i+1);
                            }else if(num==2){
                                $scope.lightStarW.push(i+1);
                            }else{
                                $scope.lightStarP.push(i+1);
                            }

                        }

                    }

                }

                $scope.evaluateOrder=function(){

                    if($scope.lightStarF.length==0||$scope.lightStarW.length==0||$scope.lightStarP.length==0){

                        postService.showMsg('请完整填写评价列表');
                        return false;

                    }

                    var _url = 'product/comment-order';

                    var _path = {
                        order_id:$scope.oid,
                        dispatch_grade:$scope.lightStarF.length,
                        transport_grade:$scope.lightStarW.length,
                        quality_grade:$scope.lightStarP.length,
                        type:2
                    }
                    postService.doPost(_path, _url, function (data) {

                        console.log(data);
                        $scope.evaluate = false;
                        $state.reload();
                        postService.showMsg(data.msg)

                    })

                }
            }
        ])
    .controller('applicationServiceCtrl', //  订单详情 —— 申请售后
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$timeout','Upload','ENV',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$timeout,Upload,ENV) {

                $scope.getOrderList=function(oid){

                    var _url='product/order-info';

                    var _path={
                        order_id:oid
                    }

                    postService.doPost(_path,_url,function(data){

                        console.log(data);

                        $scope.orderInfo=data.data;

                        $scope.orderInfo.totlePrice=0;

                        angular.forEach($scope.orderInfo.info,function(data){

                            angular.forEach(data.items,function(data){

                                data['refund_num']=0;

                                $scope.orderInfo.totlePrice+=data.refund_num*data.price;

                            })

                        })

                        if($scope.orderInfo.status==2){

                            $scope.orderInfo.type=2;

                            angular.forEach($scope.orderInfo.info,function(data){

                                data.is_select=true;

                                angular.forEach(data.items,function(data){

                                    data.is_select=true;
                                    data.refund_num=data.num;

                                })
                                $scope.orderInfo.totlePrice=$scope.orderInfo.price

                            })

                        }else{

                            $scope.orderInfo.type=1;

                        }


                        $scope.orderInfo.notice_img="";

                        $scope.orderInfo.notice="";

                    })

                }
                $scope.getOrderList($stateParams.oid);

                /**
                 * 上传图片
                 * @param file
                 * @param type
                 */
                $scope.progress = 0;

                $scope.upload = function (file) {

                    if(file){

                        $scope.photoUp = true;

                        var _authToken = Storage.get('shangshe-user-authToken');

                        var _uploadUrl = 'index/upload-img';

                        Upload.upload({

                            url: ENV.api+_uploadUrl,
                            data: {
                                img: file,
                                authToken:_authToken,
                                time:1470823494,
                                token:'867a061511577ea3d2241d02b825cc57'
                            }

                        }).then(function (response) {

                            $timeout(function () {
                                if (response.data.status == 1) {

                                    file.result = response.data.data.path;

                                    $scope.photoUp = false;

                                    postService.showMsg('上传完成');

                                    $scope.orderInfo.notice_img = response.data.data.path;

                                }
                            });

                        }, function (response) {

                            $scope.photoUp = false;

                            postService.showMsg(response.status
                                + ': ' + response.data);

                        }, function (evt) {

                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

                            $scope.progress = progressPercentage + ' %';

                            $rootScope.$digest();
                        })
                    }
                };

                $scope.editNum = function(cart,type){

                    if($scope.orderInfo.type==2&&$scope.orderInfo.status==2){

                        return false;

                    }

                    if(type==1){

                        if(cart.refund_num>=cart.num){
                            return false;
                        }

                        cart.refund_num++;

                        $scope.orderInfo.totlePrice = Tools.addNum($scope.orderInfo.totlePrice,cart.price);

                    }else{

                        if(cart.refund_num==0){

                            return false;
                        }

                        cart.refund_num--;

                        $scope.orderInfo.totlePrice = Tools.decNum($scope.orderInfo.totlePrice,cart.price);

                    }
                };

                $scope.changeRrturnType=function(num){

                    if($scope.orderInfo.status==2){

                        return false;

                    }

                    $scope.orderInfo.type=num;

                    if(num==2){

                        angular.forEach($scope.orderInfo.info,function(data){

                            data.is_select=true;

                            angular.forEach(data.items,function(data){

                                data.is_select=true;
                                data.refund_num=data.num;
                                $scope.orderInfo.totlePrice+=data.refund_num*data.price

                            })

                        })

                    }else{

                        angular.forEach($scope.orderInfo.info,function(data){

                            data.is_select=false;

                            angular.forEach(data.items,function(data){

                                data.is_select=false;
                                data.refund_num=0;
                                $scope.orderInfo.totlePrice=0
                            })

                        })

                    }

                }

                $scope.applicationReturn=function(){

                    var _url='product/request-refund';

                    var _num = 0;

                    var _orderInfo = [];

                    angular.forEach($scope.orderInfo.info,function(data){

                        var _items = [];

                        angular.forEach(data.items,function(item){

                            if(item.refund_num>0){

                                _items.push(item);

                                _num+=item.refund_num;
                            }
                        });

                        if(_items.length>0){

                            var _info = angular.copy(data);

                            _info.items = _items;

                            _orderInfo.push(_info);

                        }
                    });

                    if(_num>0){

                        var _path={
                            class:1,
                            order_id:$scope.orderInfo.order_id,
                            refund_price:$scope.orderInfo.totlePrice,
                            refund_type:$scope.orderInfo.type,
                            is_include_freight:1,
                            notice:$scope.orderInfo.notice,
                            notice_img:$scope.orderInfo.notice_img,
                            merchant_id:$scope.orderInfo.merchant_id,
                            merchant_name:$scope.orderInfo.merchant_name,
                            merchant_avatar:$scope.orderInfo.merchant_avatar,
                            param:window.JSON.stringify(_orderInfo)

                        };

                        postService.doPost(_path,_url,function(data){

                            console.log(data);

                            postService.showMsg('申请成功！');

                            $state.go('Returns');

                        })

                    }else{

                        postService.showMsg('请设置退货数量');
                    }



                };

                $scope.allGoodsSelect=function(goodsAll){

                    if($scope.orderInfo.type==2){

                        return false

                    }

                    goodsAll.is_select=!goodsAll.is_select;

                    if(goodsAll.is_select==true){

                        angular.forEach(goodsAll.items,function(data){

                            data.is_select=true;

                        })

                    }else{

                        angular.forEach(goodsAll.items,function(data){

                            data.is_select=false;

                        })


                    }

                }

                $scope.sizeChange=function(goodsAll,sizes){

                    if($scope.orderInfo.type==2){

                        return false

                    }

                    sizes.is_select=!sizes.is_select;

                    angular.forEach(goodsAll.items,function(data){

                        if(data.is_select==false){

                            goodsAll.is_select=false;

                        }else{

                            goodsAll.is_select=true;

                        }

                    })

                }
            }
        ])
    .controller('applicationServiceCrowdCtrl', //  众筹订单详情 —— 申请售后
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$timeout','Upload','ENV',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$timeout,Upload,ENV) {

                $scope.getOrderList=function(oid){

                    var _url='product/raise-order-info';

                    var _path={
                        order_id:oid
                    }

                    postService.doPost(_path,_url,function(data){

                        console.log(data);

                        $scope.orderInfo=data.data;

                        $scope.orderInfo.totlePrice=0;

                        angular.forEach($scope.orderInfo.info,function(data){

                                data['refund_num']=0;

                                $scope.orderInfo.totlePrice+=data.refund_num*$scope.orderInfo.final_price;

                        })

                        if($scope.orderInfo.status==2){

                            $scope.orderInfo.type=2;


                            $scope.orderInfo.is_select=true;

                            angular.forEach($scope.orderInfo.info,function(data){


                                    data.is_select=true;
                                    data.refund_num=data.num;
                                    $scope.orderInfo.totlePrice+=data.refund_num*$scope.orderInfo.final_price

                            })

                        }else{

                            $scope.orderInfo.type=1;

                        }


                        $scope.orderInfo.notice_img="";

                        $scope.orderInfo.notice="";

                    })

                }
                $scope.getOrderList($stateParams.oid);

                /**
                 * 上传图片
                 * @param file
                 * @param type
                 */
                $scope.progress = 0;

                $scope.upload = function (file) {

                    if(file){

                        $scope.photoUp = true;

                        var _authToken = Storage.get('shangshe-user-authToken');

                        var _uploadUrl = 'index/upload-img';

                        Upload.upload({

                            url: ENV.api+_uploadUrl,
                            data: {
                                img: file,
                                authToken:_authToken,
                                time:1470823494,
                                token:'867a061511577ea3d2241d02b825cc57'
                            }

                        }).then(function (response) {

                            $timeout(function () {
                                if (response.data.status == 1) {

                                    file.result = response.data.data.path;

                                    $scope.photoUp = false;

                                    postService.showMsg('上传完成');

                                    $scope.orderInfo.notice_img = response.data.data.path;

                                }
                            });

                        }, function (response) {

                            $scope.photoUp = false;

                            postService.showMsg(response.status
                                + ': ' + response.data);

                        }, function (evt) {

                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

                            $scope.progress = progressPercentage + ' %';

                            $rootScope.$digest();
                        })
                    }
                };

                $scope.editNum = function(cart,type){

                    if($scope.orderInfo.type==2&&$scope.orderInfo.status==2){

                        return false;

                    }

                    if(type==1){

                        if(cart.refund_num>=cart.num){
                            return false;
                        }

                        cart.refund_num++;

                        $scope.orderInfo.totlePrice = Tools.addNum($scope.orderInfo.totlePrice,$scope.orderInfo.final_price);

                    }else{

                        if(cart.refund_num==0){

                            return false;
                        }

                        cart.refund_num--;

                        $scope.orderInfo.totlePrice = Tools.decNum($scope.orderInfo.totlePrice,$scope.orderInfo.final_price);

                    }
                };

                $scope.changeRrturnType=function(num){

                    if($scope.orderInfo.status==2){

                        return false;

                    }

                    $scope.orderInfo.type=num;

                    if(num==2){

                        $scope.orderInfo.is_select=true;

                        angular.forEach($scope.orderInfo.info,function(data){


                                data.is_select=true;
                                data.refund_num=data.num;
                                $scope.orderInfo.totlePrice+=data.refund_num*$scope.orderInfo.final_price

                        })

                    }else{
                        $scope.orderInfo.is_select=false;

                        angular.forEach($scope.orderInfo.info,function(data){

                                data.is_select=false;
                                data.refund_num=0;
                                $scope.orderInfo.totlePrice=0
                        })

                    }

                }

                $scope.applicationReturn=function(){

                    var _url='product/request-refund';

                    var _num = 0;

                    var _orderInfo = [];

                    angular.forEach($scope.orderInfo.info,function(data){

                        if(data.refund_num>0){

                            _orderInfo.push(data);

                            _num+=data.refund_num;
                        }

                    });

                    if(_num>0){

                        var _path={
                            class:2,
                            order_id:$scope.orderInfo.order_id,
                            refund_price:$scope.orderInfo.totlePrice,
                            refund_type:$scope.orderInfo.type,
                            is_include_freight:1,
                            notice:$scope.orderInfo.notice,
                            notice_img:$scope.orderInfo.notice_img,
                            merchant_id:$scope.orderInfo.merchant_id,
                            merchant_name:$scope.orderInfo.merchant_name,
                            merchant_avatar:$scope.orderInfo.merchant_avatar,
                            param:window.JSON.stringify(_orderInfo)

                        };

                        postService.doPost(_path,_url,function(data){

                            console.log(data);

                            postService.showMsg('申请成功！');

                            $state.go('Returns');

                        })

                    }else{

                        postService.showMsg('请设置退货数量');
                    }



                };

                $scope.allGoodsSelect=function(goodsAll){

                    if($scope.orderInfo.type==2){

                        return false

                    }

                    goodsAll.is_select=!goodsAll.is_select;

                    if(goodsAll.is_select==true){

                        angular.forEach(goodsAll.info,function(data){

                            data.is_select=true;

                        })

                    }else{

                        angular.forEach(goodsAll.info,function(data){

                            data.is_select=false;

                        })


                    }

                }

                $scope.sizeChange=function(goodsAll,sizes){

                    if($scope.orderInfo.type==2){

                        return false

                    }

                    sizes.is_select=!sizes.is_select;

                    angular.forEach(goodsAll.info,function(data){

                        if(data.is_select==false){

                            goodsAll.is_select=false;

                        }else{

                            goodsAll.is_select=true;

                        }

                    })

                }

            }
        ])
    .controller('myCrowdfundingCtrl', //  个人中心 —— 我的众筹
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$interval',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$interval) {

                $scope.stateLsit = [
                    "买家未付款",
                    "买家未付款",
                    "买家已付款",
                    "卖家已发货",
                    "交易成功",
                    "申请退换货中",
                    "已退换货",
                    "交易已关闭",
                    "订单已删除"
                ];

                $scope.crowdfund='';

                $scope.path = {
                    page:0,
                    state:'',
                };

                $scope.tab_index= $stateParams.status;

                $scope.load = {
                    busy:false
                };
                $scope.orderList = [];

                $scope.load.nextPage = function(){

                    $scope.path.page++;

                    $scope.load.busy = false;

                    var _url='user-extend/my-raise-orders';

                    postService.doPost($scope.path,_url,function(data){

                        if($scope.path.page > data.data.totalPage){

                            $scope.load.busy = true;

                        }else {

                            var models = data.data.models;

                            for (var i = 0; i < models.length; i++) {

                                $scope.orderList.push(models[i]);

                            }
                            if ($scope.path.page == data.data.totalPage) {

                                $scope.load.busy = true;

                            } else {

                                $scope.load.busy = false;


                            }
                        }
                    });
                };

                $scope.changeState=function(state){

                    $scope.orderList = [];

                    $scope.path = {
                        page:0,
                        state:state,
                    };

                    $scope.load.nextPage()

                }
                //删除订单
                $scope.deleteOrder = function (order) {

                    postService.confirm('确认要删除订单',function(){

                        var _url = 'product/del-order';

                        var _path = {
                            order_id:order.order_id,
                            type:2
                        }
                        postService.doPost(_path, _url, function (data) {

                            console.log(data)
                            postService.showMsg('订单已删除')
                            $state.reload();

                        })
                    })

                }
                //取消订单
                $scope.cancelOrder = function (oreders) {

                    postService.confirm('确认要取消订单',function(){

                        var _url = 'product/chanel-order';

                        var _path = {
                            order_id:oreders.order_id,
                            type:2
                        }
                        postService.doPost(_path, _url, function (data) {

                            console.log(data)
                            postService.showMsg('订单取消成功')
                            $state.reload();

                        })
                    })

                }
                //评价
                $scope.stars=[1,2,3,4,5]

                $scope.evaluate = false;

                $scope.lightStarF=[];
                $scope.lightStarW=[];
                $scope.lightStarP=[];

                $scope.oid='';

                $scope.clickevaluate =function (order) {

                    if(order.comment_status==2){

                        postService.showMsg('该商品已经评价过了')
                        return false;

                    }

                    $scope.evaluate=!$scope.evaluate

                    $scope.oid=order.order_id;

                }

                $scope.changeStar=function(index,num){

                    if(num==1){
                        $scope.lightStarF=[]
                    }else if(num==2){
                        $scope.lightStarW=[]
                    }else{
                        $scope.lightStarP=[]
                    }

                    for(var i=0;i<$scope.stars.length;i++){

                        if(i<=index){

                            if(num==1){
                                $scope.lightStarF.push(i+1);
                            }else if(num==2){
                                $scope.lightStarW.push(i+1);
                            }else{
                                $scope.lightStarP.push(i+1);
                            }

                        }

                    }

                }

                $scope.evaluateOrder=function(){

                    if($scope.lightStarF.length==0||$scope.lightStarW.length==0||$scope.lightStarP.length==0){

                        postService.showMsg('请完整填写评价列表');
                        return false;

                    }

                    var _url = 'product/comment-order';

                    var _path = {
                        order_id:$scope.oid,
                        dispatch_grade:$scope.lightStarF.length,
                        transport_grade:$scope.lightStarW.length,
                        quality_grade:$scope.lightStarP.length,
                        type:2
                    }
                    postService.doPost(_path, _url, function (data) {

                        console.log(data);
                        $scope.evaluate = false;
                        $state.reload();
                        postService.showMsg(data.msg)

                    })

                }
            }
        ])
    .controller('crowdfundInfoCtrl',  //  个人中心 —— 众筹详情
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','weiXinService','info',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,weiXinService,info) {

                $rootScope.$isloaing = false;

                $scope.showBox  = {
                    'note':false
                };

                $scope.orderInfo=info.data.data

                $scope.changeAddress=function(status){

                    if(status==1){

                        $state.go('adressList',{'oid':$scope.orderInfo.order_id,class:2})

                    }else{

                        return false;
                    }

                };

                $scope.doPay = function(){

                    weiXinService.pay($scope.orderInfo.params,function(res){

                        postService.showMsg('支付成功');

                        $state.reload();

                    });
                };

                $scope.comfigeOrder=function(){

                    var _url='product/confirm-order';

                    var _path={
                        order_id:$scope.orderInfo.order_id,
                        type:2,
                    }

                    postService.doPost(_path,_url,function(data){

                        postService.showMsg('收到货啦~')

                        $state.go('myOrders',{'status':4})

                    })

                };

                $scope.disable = false;
                $scope.setOrderNote = function(){

                    $scope.disable = true;

                    var _url='product/edit-note';

                    var _path={
                        order_id:$scope.orderInfo.order_id,
                        note:$scope.orderInfo.note
                    };
                    postService.doPost(_path,_url,function(data){

                        postService.showMsg(data.msg);

                    })

                }
                //删除订单
                $scope.deleteOrder = function (order) {

                    postService.confirm('确认要删除订单',function(){

                        var _url = 'product/del-order';

                        var _path = {
                            order_id:order.order_id,
                            type:2
                        }
                        postService.doPost(_path, _url, function (data) {

                            console.log(data)
                            postService.showMsg('订单已删除')
                            //$state.reload();

                            $state.go('myCrowdfunding')

                        })
                    })

                }
                //取消订单
                $scope.cancelOrder = function (oreders) {

                    postService.confirm('确认要取消订单',function(){

                        var _url = 'product/chanel-order';

                        var _path = {
                            order_id:oreders.order_id,
                            type:2
                        }
                        postService.doPost(_path, _url, function (data) {

                            console.log(data)
                            postService.showMsg('订单取消成功')
                            $state.reload();

                        })
                    })

                }
                //评价

                $scope.stars=[1,2,3,4,5]

                $scope.evaluate = false;

                $scope.lightStarF=[];
                $scope.lightStarW=[];
                $scope.lightStarP=[];

                $scope.oid='';

                $scope.clickevaluate =function (order) {

                    if(order.comment_status==2){

                        postService.showMsg('该商品已经评价过了')
                        return false;

                    }

                    $scope.evaluate=!$scope.evaluate

                    $scope.oid=order.order_id;

                }

                $scope.changeStar=function(index,num){

                    if(num==1){
                        $scope.lightStarF=[]
                    }else if(num==2){
                        $scope.lightStarW=[]
                    }else{
                        $scope.lightStarP=[]
                    }

                    for(var i=0;i<$scope.stars.length;i++){

                        if(i<=index){

                            if(num==1){
                                $scope.lightStarF.push(i+1);
                            }else if(num==2){
                                $scope.lightStarW.push(i+1);
                            }else{
                                $scope.lightStarP.push(i+1);
                            }

                        }

                    }

                }

                $scope.evaluateOrder=function(){

                    if($scope.lightStarF.length==0||$scope.lightStarW.length==0||$scope.lightStarP.length==0){

                        postService.showMsg('请完整填写评价列表');
                        return false;

                    }

                    var _url = 'product/comment-order';

                    var _path = {
                        order_id:$scope.oid,
                        dispatch_grade:$scope.lightStarF.length,
                        transport_grade:$scope.lightStarW.length,
                        quality_grade:$scope.lightStarP.length,
                        type:2
                    }
                    postService.doPost(_path, _url, function (data) {

                        console.log(data);
                        $scope.evaluate = false;
                        $state.reload();
                        postService.showMsg(data.msg)

                    })

                }
            }
        ])
    .controller('collectionCtrl',  //  个人中心 —— 关注收藏
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$interval','goods','store',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$interval,goods,store) {

                $rootScope.$isloaing = false;

                $scope.collectionType=1;

                $scope.collectionList=store.data.data.models;

                console.log($scope.collectionList)

                $scope.myCollection=function(num){

                    $scope.collectionType=num

                    if(num==0){
                        $scope.collectionList=goods.data.data.models
                    }else{
                        $scope.collectionList=store.data.data.models
                    }

                }
            }
        ])
    .controller('mySupplyCtrl',  //  个人中心 —— 我的供求
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$interval','publishSupply','attentionSupply',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$interval,publishSupply,attentionSupply) {

                $scope.mySupply=1;

                $scope.mySupplyList=publishSupply.data.data.models;

                $scope.myCollection=function(num){

                    $scope.mySupply=num

                    if(num==1){

                        $scope.mySupplyList=publishSupply.data.data.models;

                    }else{

                        $scope.mySupplyList=attentionSupply.data.data.models;

                    }


                }

                $scope.delGoods=function(supply){

                    var _url='user-extend/del-supply';

                    var _path={
                        tid:supply.tid
                    }

                    postService.doPost(_path,_url,function(data){

                        postService.showMsg(data.msg);

                    })

                }
            }
        ])
    .controller('supplyDemandInfoCtrl', // 个人中心 ——  供求详情
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$interval','data',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$interval,data) {

                $scope.goodsInfo=data.data.data;

                console.log($scope.goodsInfo)

                console.log(data)

                $rootScope.$isloaing = false;

            }
        ])
    .controller('ShippingAddressCtrl',  //  个人中心 —— 收货地址
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$interval',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$interval) {


                $scope.myAddressInfo=function(){

                    var _url='user/my-address';

                    var _path={
                    }

                    postService.doPost(_path,_url,function(data){

                        console.log(data)
                        $scope.addressList=data.data;

                    })

                }
                $scope.myAddressInfo()

                $scope.is_selected = function () {


                    
                }

                $scope.is_default=function(address) {

                    postService.confirm('确认要修改默认地址',function(){

                        address.is_default=1;

                        var _url = 'user/default-address';

                        var _path = {
                            address_id:address.address_id,
                        }
                        postService.doPost(_path, _url, function (data) {

                            console.log(data)
                            postService.showMsg('修改成功！')
                            $state.reload();

                        })
                    })

                }

                // $scope.addressid = $stateParams.address_id

                $scope.DeleteInfo=function(address){

                    postService.confirm('确认要删除地址',function() {

                        var _url = 'user/del-address';

                        var _path = {
                            address_id: address.address_id
                        }

                        postService.doPost(_path, _url, function (data) {

                            console.log(data)
                            postService.showMsg('删除成功！')
                            $state.reload();

                        })
                    })

                }

            }
        ])
    .controller('ReturnsCtrl',  //  个人中心 —— 退换货
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$interval',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$interval) {

                $scope.returnText=['','处理中','已同意','已拒绝','已退款'];

                $scope.refundType=['','退款退货','仅退款','换货补货']

                $scope.searchBox={
                    'type':'',
                    'page':0
                }

                $scope.showbox={
                    'expressNum':false,
                    'rid':'',
                }

                $scope.orderType='';

                $scope.changeListType=function(type){

                    $scope.returnList = [];

                    $scope.orderType=type;

                    $scope.searchBox.type=type;

                    $scope.searchBox.page=0;

                    $scope.load.nextPage()

                }

                $scope.load = {
                    busy:false,
                    nost:false
                };

                $scope.returnList = [];

                $scope.load.nextPage = function(){

                    $scope.searchBox.page++;

                    $scope.load.busy = true;

                    var _url='user-extend/refund-list';

                    postService.doPost($scope.searchBox,_url,function(data){

                        if($scope.searchBox.page>data.data.totalPage){

                            $scope.load.busy = false;

                        }else{

                            var models = data.data.models;

                            for (var i = 0; i < models.length; i++) {

                                $scope.returnList.push(models[i]);

                            }

                            console.log($scope.returnList);


                            $scope.load.busy = false;

                        }
                    });
                };

                $scope.wirteExpree=function(rid){

                    $scope.showbox.expressNum=true;
                    $scope.showbox.rid=rid;


                }


                $scope.wirteExpressNum=function(msgNum){


                    var _url='user-extend/add-refund-sn';

                    var _path={
                        rid:$scope.showbox.rid,
                        refund_sn:msgNum
                    }

                    postService.doPost(_path,_url,function(data){

                        $scope.showbox.expressNum=false;

                        postService.showMsg('操作成功~')
                    })
                }

            }
        ])
    .controller('returnInfoCtrl',  //  个人中心 —— 退换货—详情
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$interval',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$interval) {

                $scope.getOrderList=function(rid){

                    var _url='user-extend/refund-info';

                    var _path={
                        rid:rid
                    }

                    postService.doPost(_path,_url,function(data){

                        console.log(data);
                        $scope.orderInfo=data.data;

                        console.log($scope.orderInfo)

                    })

                }
                $scope.getOrderList($stateParams.rid);



            }
        ])
    .controller('newAddressCtrl',  //  个人中心 —— 收货地址 —— 新增地址
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$interval',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$interval) {


                $scope.addressInfo=function(){

                    var _url='user/add-address';

                    var _path={
                    }

                    postService.doPost(_path,_url,function(data){

                        console.log(data)
                        $scope.addressList=data.data;

                    })

                }


                var _url_business="merchant/get-citys";

                var _path={
                    pid:0,
                }

                postService.doPost(_path,_url_business,function(data){
                    console.log(data);
                    $scope.provinces=data.data;
                })
                $scope.changeProvince=function(index){

                    if(index!=''){
                        var _url_business="merchant/get-citys";

                        var _path={
                            pid:index,
                        }

                        postService.doPost(_path,_url_business,function(data){
                            console.log(data);
                            $scope.getCity=data.data;
                        })
                    }
                }
                $scope.changeCity=function(index){

                    if(index!=''){
                        var _url_business="merchant/get-citys";

                        var _path={
                            pid:index,
                        }

                        postService.doPost(_path,_url_business,function(data){
                            console.log(data);
                            $scope.getTown=data.data;
                        })
                    }
                }

                $scope.upUserInfo =function() {

                    if ($scope.addressList.uname == '' ||
                        $scope.addressList.mobile == '' ||
                        $scope.addressList.province == '' ||
                        $scope.addressList.city == '' ||
                        $scope.addressList.town == '' ||
                        $scope.addressList.street == '' ) {
                        postService.showMsg('请填写完整信息');
                        return false;
                    }

                    var _url_business = "user/add-address";

                    var _path = {
                        uname: $scope.addressList.uname,
                        mobile: $scope.addressList.mobile,
                        province: $scope.addressList.province,
                        city: $scope.addressList.city,
                        town: $scope.addressList.town,
                        street: $scope.addressList.street,
                        address_str:$scope.addressList.address_str
                    }

                    postService.doPost(_path, _url_business, function (data) {

                        Storage.set('shangshe-data', data.data);

                        postService.showMsg('地址添加成功')

                        window.history.go(-1);

                    })
                }

            }
        ])