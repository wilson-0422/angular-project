
angular.module('user', [
    'ui.router',
    'ngAnimate',
    'ngCookies',
    'Ttouch.services',
    'Ttouch.index',
    'Ttouch.commodity',
    'Ttouch.mycenters',
    'ksSwiper',
    'ngFileUpload',
    'infinite-scroll'
])
    .constant("ENV", {
        "accessToken": '',
        "debug": false,
        'url':"http://m.knito2o.com",
        "api": "http://chinaknit.cn/api/web/v1/",
        "staticUrl":"http://chinaknit.cn/storage/web/source/",
        "thumb180Url":"http://chinaknit.cn/storage/web/thumb180/",
        'version':'1.0.1'
    })
    .run(function($rootScope,$state,Storage,ENV,weiXinService,postService,$location){

        $rootScope.$isloaing = false;
        $rootScope.staticUrl = ENV.staticUrl;
        $rootScope.thumb180Url = ENV.thumb180Url;

        var box=[];

        Storage.set('historyRecord',box)

        //Storage.set('shangshe-user-data','{"uid":8,"mobile":"13585821080","password":null,"phone":"","nickname":"周超","gender":1,"score":100,"birthday":0,"shop_name":"","hobby":"[{\"label_name\":\"明星同款\",\"label_id\":\"21\",\"$$hashKey\":\"object:57\"},{\"label_name\":\"针织\",\"label_id\":\"18\",\"$$hashKey\":\"object:63\"},{\"label_name\":\"文艺\",\"label_id\":\"14\",\"$$hashKey\":\"object:66\"}]","sign":"","avatar_path":"http://wx.qlogo.cn/mmopen/MqFvc6tFkbXSsc8H5rP1xVwNu7aIsc9zYuSEvsrbRDJjVhDCoXZ62GU86q8kJ5Y5vSEFkozzFUwuoSEWmdVzIRcPJklBcomY/0","avatar_base_url":null,"province":"","city":"","town":"","address":"","address_info":null,"openid":"oqk4EsxVX6UKXT54KslIjbY9VYfQ","license_path":"","run_year":"","client_id":"","updated_at":1473582329,"created_at":1473491398,"last_ip":"","last_login":1473582329,"lng":"","lat":"","banned":2,"access_token":"","refresh_token":"","refresh_token_time":0}');
        //
        //Storage.set('shangshe-user-authToken','2866hDDrC9wJ0Ksk39nSH1/m6OZyfMoafAlr=aqA/Bivv/nBedSxOfN9IpljhFQvuIX4YRUKIKUvFsFUaVwsvDPR7XOExkK70MmNAX5Y9adEMJBYxV5yI5I5/GosLIQwJjLJJOepRONHovwx88b2=9X=lO3Cisi9e8Aa2NtsdCot6pXftGVw1qqBIqt09n8iv33ADPUqaXtzEgAvBZVfpUO3yyUS36MRS=6loLicdXj8MhvbluLL0yKA52cbgcwKda4pfu/egvzsDp0559oMKo=t5c0ndOjCdfQIYF8BK7WadA/aDq1wVNjs6fKnC1RIxJ/t');

        weiXinService.weiChatLoginByOpenId();

        //weiXinService.onMenuShareAppMessage('易批','商家店铺详情',imgUrl,link,type);

        //$rootScope.user = Storage.get('shangshe-user-data');
        //
        //$rootScope.authToken = Storage.get('shangshe-user-authToken');

        $rootScope.$on('$locationChangeSuccess',function(event, next, nextParams){

            weiXinService.loadWeiXin(next);

        });

        $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){

            $rootScope.user = Storage.get('shangshe-user-data');

            $rootScope.authToken = Storage.get('shangshe-user-authToken');

            if(!$rootScope.user || !$rootScope.authToken){

                if(toState.name=='index.main'){

                    return;
                }

                event.preventDefault();// 取消默认跳转行为

                $state.go("index.main");//跳转到登录界面

            }else{//已经登录

                if($rootScope.user.banned==2){//审核通过

                    if($rootScope.user.hobby==''||$rootScope.user.hobby==null){

                        if(toState.name=='changeLabel'){

                            return;
                        }
                        event.preventDefault();

                        $state.go("changeLabel");

                    }else{
                        if(toState.name=='changeLabel'){

                            return;
                        }
                    }
                }else if($rootScope.user.banned==1){

                    if(toState.name=='index.Purchase'||toState.name=='index.MyCenters'||toState.name=='placeOrder'){

                        postService.showMsg('注册还未通过，请稍作等待');

                        event.preventDefault();

                        return false;
                    }

                }else{

                    if(toState.name=='index.Purchase'||toState.name=='index.MyCenters'||toState.name=='placeOrder'){

                        postService.showMsg('游客止步，请先注册');

                        event.preventDefault();// 取消默认跳转行为

                        $state.go('login');
                    }

                }
            }
        });
        //$rootScope.$on('loginSuccess',function(event) {
        //
        //    if($state.current.name=='index.main'){
        //
        //        event.preventDefault();// 取消默认跳转行为
        //
        //        $state.go('index.main');
        //    }
        //
        //})

        $rootScope.showOpening = function(){

            postService.showMsg('功能暂未开放，敬请期待~');

        }

        $rootScope.showMsg = function(msg){

            if(msg){

                postService.showMsg(msg);

            }else{

                postService.showMsg('暂无优惠活动~');

            }


        }

    })
    .config(function($stateProvider, $urlRouterProvider,$locationProvider) {

        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/index');

        $stateProvider.state('login', {// 注册页面
            url: '/login',
            cache:false,
            templateUrl:'template/index/login.html',
            controller:'loginCtrl'
        });
        $stateProvider.state('index', {  //  首页
            url: '',
            templateUrl:'template/index/index.html',
            controller:'indexCtrl',
            abstract: true
        })
        .state('index.main', {
            url: '/index',
            cache:false,
            templateUrl:'template/index/main.html',
            controller:'mainCtrl',
            resolve:{
                data:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

                    var _url_business="user-extend/index";
                    var _path_part={};


                    return postService.doPostPromise(_path_part,_url_business);//首页轮播图区数据源
                }]
            }
        })
        .state('index.FindThe',{  //  找货
            url: '/FindThe/:keyWord',
            templateUrl:'template/index/FindThe.html',
            controller:'FindTheCtrl',
            resolve:{
                labels:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

                    var _url_business="product/get-product-class";
                    var _path={};

                    $rootScope.$isloaing = true;

                    return postService.doPostPromise(_path,_url_business);//labels数据源
                }]
            }
        })
        .state('index.Availability',{ //  供求供货
            url: '/Availability',
            templateUrl:'template/index/Availability.html',
            controller:'AvailabilityCtrl'
        })
        .state('index.Purchase',{  //  进货单
            url: '/Purchase',
            templateUrl:'template/index/Purchase.html',
            controller:'PurchaseCtrl',
            resolve:{
                myOrderList:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

                    var _url_business="user-extend/shop-car-list";
                    var _path={};

                    $rootScope.$isloaing = true;

                    return postService.doPostPromise(_path,_url_business);//labels数据源
                }]
            }
        })
        .state('index.MyCenters',{  //  个人中心
            url: '/MyCenters',
            templateUrl:'template/mycenters/MyCenters.html',
            controller:'MyCentersCtrl'
        });
        $stateProvider.state('placeOrder',{  //  商品_____下单
            url: '/placeOrder?:order_sn',
            templateUrl:'template/index/placeOrder.html',
            controller:'placeOrderCtrl',
            resolve:{
                placeOrderinfo:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

                    var _url_business="product/get-order-info-by-sn";
                    var _path={
                        order_sn:$stateParams.order_sn
                    };

                    $rootScope.$isloaing = true;

                    return postService.doPostPromise(_path,_url_business);//labels数据源
                }]
            }
        });
        $stateProvider.state('adressList',{  //  下单修改地址
            url: '/adressList/:order_sn/:oid/:class',
            templateUrl:'template/index/adressList.html',
            controller:'adressListCtrl'

        })
        $stateProvider.state('supplyDemandInfo',{  //  供求详情
            url: '/supplyDemandInfo/:tid',
            templateUrl:'template/mycenters/supplyDemandInfo.html',
            controller:'supplyDemandInfoCtrl',
            resolve:{
                data:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

                    var _url_business="user-extend/supply-info";
                    var _path={
                        tid:$stateParams.tid
                    };

                    $rootScope.$isloaing = true;

                    return postService.doPostPromise(_path,_url_business);//labels数据源
                }]
            }
        });
        $stateProvider.state('changeLabel', { //  添加兴趣页面
            url: '/changeLabel/:type',
            templateUrl:'template/index/changeLabel.html',
            controller:'changeLabelCtrl',
            resolve:{
                labelst:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

                    var _url_business="user/get-labels";
                    var _path={};

                    $rootScope.$isloaing = true;

                    return postService.doPostPromise(_path,_url_business);//labels数据源
                }]
            }
        });
        $stateProvider.state('Search',{  //  搜索框页面
            url: '/Search',
            templateUrl:'template/index/Search.html',
            controller:'SearchCtrl',
            resolve:{
                data:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

                    var _url_business="user-extend/get-keywords";
                    var _path={};

                    $rootScope.$isloaing = true;

                    return postService.doPostPromise(_path,_url_business);// 搜索页面数据源
                }]
            }
        });
        $stateProvider.state('SearchGoods',{  //  搜索商品页面
            url: '/SearchGoods/:keyWord',
            templateUrl:'template/index/SearchGoods.html',
            controller:'SearchGoodsCtrl'

        })
        $stateProvider.state('SearchShop',{  //  搜索店铺页面
            url: '/SearchShop/:keyWord',
            templateUrl:'template/index/SearchShop.html',
            controller:'SearchShopCtrl'

        });
        $stateProvider.state('FactoryDirectSelling',{ //  工厂直销
            url: '/FactoryDirectSelling',
            cache:false,
            templateUrl:'template/index/FactoryDirectSelling.html',
            controller:'FactoryDirectSellingCtrl',
        });
        $stateProvider.state('wholesalePop',{  //  批发档口
            url: '/wholesalePop',
            templateUrl:'template/index/wholesalePop.html',
            controller:'wholesalePopCtrl',
        });
        $stateProvider.state('Designers',{  //  设计师
            url: '/Designers',
            templateUrl:'template/index/Designers.html',
            controller:'DesignersCtrl',
            resolve:{
                data:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

                    var _url_business="user-extend/designer";
                    var _path_part={
                    };

                    $rootScope.$isloaing = true;
                    return postService.doPostPromise(_path_part,_url_business);//首页轮播图区数据源
                }]
            }
        });
        $stateProvider.state('DesignersCrowd',{  //  设计师众筹
            url: '/DesignersCrowd/:aid',
            templateUrl:'template/commodity/DesignersCrowd.html',
            controller:'DesignersCrowdCtrl'
        });
        $stateProvider.state('shopDetailsShare',{  //  设计师众筹
            url: '/shopDetailsShare/:merchant_id',
            templateUrl:'template/commodity/shopDetailsShare.html',
            controller:'shopDetailsShareCtrl'
        });
        $stateProvider.state('DesignersDetails',{  //  众筹详情
            url: '/DesignersDetails/:rid/:is_gid',
            templateUrl:'template/commodity/DesignersDetails.html',
            controller:'DesignersDetailsCtrl',
        });
        $stateProvider.state('brandArea',{  //  品牌专区
            url: '/brandArea',
            templateUrl:'template/index/brandArea.html',
            controller:'brandAreaCtrl'
        });
        $stateProvider.state('directSeeding',{  //  直播
            url: '/directSeeding',
            templateUrl:'template/index/directSeeding.html',
            controller:'directSeedingCtrl',
            resolve:{
                data:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

                    var _url_business="product/live-goods";
                    var _path_part={
                    };

                    $rootScope.$isloaing = true;
                    return postService.doPostPromise(_path_part,_url_business);//首页轮播图区数据源
                }]
            }
        });
        $stateProvider.state('brandEnter',{  //  品牌专区
            url: '/brandEnter/:bid',
            templateUrl:'template/index/brandEnter.html',
            controller:'brandEnterCtrl'
        });
        $stateProvider.state('wholesale',{  //  一件代发
            url: '/wholesale',
            templateUrl:'template/index/wholesale.html',
            controller:'wholesaleCtrl'
        });
        $stateProvider.state('putSheet',{  //  拼单
            url: '/putSheet',
            templateUrl:'template/index/putSheet.html',
            controller:'putSheetCtrl'
        });
        $stateProvider.state('GroupPurchase',{  //  团购
            url: '/GroupPurchase/:aid',
            cache:false,
            templateUrl:'template/index/GroupPurchase.html',
            controller:'GroupPurchaseCtrl',
        });
        $stateProvider.state('advance',{  //  新品预售
            url: '/advance',
            templateUrl:'template/index/advance.html',
            controller:'advanceCtrl'
        });
        $stateProvider.state('fullMotion',{  //  全部活动  更多
            url: '/fullMotion',
            templateUrl:'template/index/fullMotion.html',
            controller:'fullMotionCtrl'
        });
        $stateProvider.state('flashSale',{  //  活动页面  限时抢购
            url: '/flashSale/:aid',
            templateUrl:'template/index/flashSale.html',
            controller:'flashSaleCtrl',
            resolve:{
                flashSaleList:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

                        var _url_business="product/grap-goods";
                        var _path_part={
                            aid:$stateParams.aid,
                        };


                        return postService.doPostPromise(_path_part,_url_business);//首页轮播图区数据源
                    }]
                }
        });
        $stateProvider.state('shopDetails',{  //  店铺详情
            url: '/shopDetails/:merchant_id',
            templateUrl:'template/index/shopDetails.html',
            controller:'shopDetailsCtrl'
        });
        $stateProvider.state('CommodityDetails',{  //  商品详情
            url: '/CommodityDetails/:pid/:type',
            templateUrl:'template/index/CommodityDetails.html',
            controller:'CommodityDetailsCtrl',
            abstract: true,
            resolve:{
                Details:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

                    var _url_business="product/product-info";
                    var _path_part={
                        pid:$stateParams.pid,
                    };


                    return postService.doPostPromise(_path_part,_url_business);//首页轮播图区数据源
                }]
            }
        })
        .state('CommodityDetails.details_one',{  //  商品详情——1
            url: '/details_one/:pid/:type',
            templateUrl:'template/index/details_one.html',
            controller:'details_oneCtrl',
            resolve:{
                Details:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

                    if($stateParams.type==5){

                        var _url='product/grap-info';

                        var _path={
                            grap_id:$stateParams.pid
                        }

                    }else if($stateParams.type==1||$stateParams.type==2){

                        var _url='user-extend/group-info';

                        var _path={
                            group_id:$stateParams.pid
                        }
                    }else{

                        var _url="product/product-info";

                        var _path={
                            pid:$stateParams.pid,
                        };

                    }



                    return postService.doPostPromise(_path,_url);//首页轮播图区数据源
                }]
            }
        })
        .state('CommodityDetails.details_two',{  //   商品详情——2
            url: '/details_two/:pid/:type',
            templateUrl:'template/index/details_two.html',
            controller:'details_twoCtrl',
            resolve:{
                Details:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

                    var _url_business="product/product-info";
                    var _path_part={
                        pid:$stateParams.pid,
                    };


                    return postService.doPostPromise(_path_part,_url_business);//首页轮播图区数据源
                }]
            }
        });
        $stateProvider.state('Classification', {  //  找货--分类
            url: '/Classification',
            templateUrl:'template/commodity/Classification.html',
            controller:'ClassificationCtrl',
            resolve:{
                labels:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

                    var _url_business="product/get-product-class";
                    var _path={};

                    $rootScope.$isloaing = true;

                    return postService.doPostPromise(_path,_url_business);
                }]
            }
        });
        $stateProvider.state('releaseSupplyDemand', {  //  找货--分类
            url: '/releaseSupplyDemand',
            templateUrl:'template/commodity/releaseSupplyDemand.html',
            controller:'releaseSupplyDemandCtrl'

        });
        $stateProvider.state('MyBioInfo',{  //  个人中心——个人资料
            url: '/MyBioInfo',
            templateUrl:'template/mycenters/MyBioInfo.html',
            controller:'MyBioInfoCtrl'

        });
        $stateProvider.state('MessageCenter',{  //  个人中心——消息中心
            url: '/MessageCenter',
            templateUrl:'template/mycenters/MessageCenter.html',
            controller:'MessageCenterCtrl',
            resolve:{
                messages:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

                    var _url_business="user-extend/message-list";
                    var _path={};

                    $rootScope.$isloaing = true;

                    return postService.doPostPromise(_path,_url_business);//labels数据源
                }]
            }
        });
        $stateProvider.state('OrdersMessage',{  //  个人中心——消息中心——订单消息
            url: '/OrdersMessage',
            templateUrl:'template/mycenters/OrdersMessage.html',
            controller:'OrdersMessageCtrl'
        });
        $stateProvider.state('ConcernMessage',{  //  个人中心——消息中心——关注消息
            url: '/ConcernMessage:did',
            templateUrl:'template/mycenters/ConcernMessage.html',
            controller:'ConcernMessageCtrl'
        });
        $stateProvider.state('CrowdMessage',{  //  个人中心——消息中心——众筹消息
            url: '/CrowdMessage',
            templateUrl:'template/mycenters/CrowdMessage.html',
            controller:'CrowdMessageCtrl'
        });
        $stateProvider.state('integralsCenter',{  //  个人中心——积分中心
            url: '/integralsCenter',
            templateUrl:'template/mycenters/integralsCenter.html',
            controller:'integralsCenterCtrl',
            resolve:{
                personInfo:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

                    var _url_business="user-extend/user-info";
                    var _path={};

                    $rootScope.$isloaing = true;

                    return postService.doPostPromise(_path,_url_business);//labels数据源
                }]
            }
        });
        $stateProvider.state('myOrders',{  //  个人中心——我的全部订单
            url: '/myOrders/:status',
            templateUrl:'template/mycenters/myOrders.html',
            controller:'myOrdersCtrl'
        });
        $stateProvider.state('WaitingGood',{  //  我的订单详情
            url: '/WaitingGood?:oid',
            templateUrl:'template/mycenters/WaitingGood.html',
            controller:'WaitingGoodCtrl',
            resolve:{
                orderInfo:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

                    var _url='product/order-info';

                    var _path={
                        order_id:$stateParams.oid
                    };

                    $rootScope.$isloaing = true;

                    return postService.doPostPromise(_path,_url);//关注收藏的商品
                }]
            }
        });
        $stateProvider.state('applicationService',{  //  申请退换货
            url: '/applicationService/:oid/:class',
            templateUrl:'template/mycenters/applicationService.html',
            controller:'applicationServiceCtrl'
        });
        $stateProvider.state('applicationServiceCrowd',{  //  申请退换货
            url: '/applicationServiceCrowd/:oid/:class',
            templateUrl:'template/mycenters/applicationServiceCrowd.html',
            controller:'applicationServiceCrowdCtrl'
        });
        $stateProvider.state('myCrowdfunding',{  //  个人中心——我的众筹
            url: '/myCrowdfunding/:state',
            templateUrl:'template/mycenters/myCrowdfunding.html',
            controller:'myCrowdfundingCtrl'
        });
        $stateProvider.state('crowdfundInfo',{  //  个人中心——我的众筹详情
            url: '/crowdfundInfo?:oid',
            templateUrl:'template/mycenters/crowdfundInfo.html',
            controller:'crowdfundInfoCtrl',
            resolve:{
                info:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

                    var _url_business="product/raise-order-info";
                    var _path_part={
                        order_id:$stateParams.oid,
                    };

                    $rootScope.$isloaing = true;
                    return postService.doPostPromise(_path_part,_url_business);//首页轮播图区数据源
                }]
            }
        });
        $stateProvider.state('collection',{  //  个人中心——关注收藏
            url: '/collection',
            templateUrl:'template/mycenters/collection.html',
            controller:'collectionCtrl',
            resolve:{
                goods:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

                    var _url_business="user-extend/attention-list";
                    var _path={
                        type:0
                    };

                    $rootScope.$isloaing = true;

                    return postService.doPostPromise(_path,_url_business);//关注收藏的商品
                }],
                store:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

                    var _url_business="user-extend/attention-list";
                    var _path={
                        type:1
                    };

                    $rootScope.$isloaing = true;

                    return postService.doPostPromise(_path,_url_business);//关注收藏的店铺
                }]
            }
        })
        $stateProvider.state('mySupply',{  //  个人中心——我的供求
            url: '/mySupply',
            templateUrl:'template/mycenters/mySupply.html',
            controller:'mySupplyCtrl',
            resolve:{
                publishSupply:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

                    var _url_business="user-extend/my-publish-supply";
                    var _path={};

                    $rootScope.$isloaing = false;

                    return postService.doPostPromise(_path,_url_business);//我发布的供求
                }],
                attentionSupply:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

                    var _url_business="user-extend/my-attention-supply";
                    var _path={};

                    $rootScope.$isloaing = false;

                    return postService.doPostPromise(_path,_url_business);//我收藏的供求
                }]
            }
        });
        $stateProvider.state('ShippingAddress',{ //  个人中心——收货地址
            url: '/ShippingAddress',
            templateUrl:'template/mycenters/ShippingAddress.html',
            controller:'ShippingAddressCtrl'
        });
        $stateProvider.state('newAddress',{ //  个人中心——新增地址
            url: '/newAddress/',
            templateUrl:'template/mycenters/newAddress.html',
            controller:'newAddressCtrl'
        });
        $stateProvider.state('Returns',{  //  个人中心——退换货
            url: '/Returns',
            templateUrl:'template/mycenters/Returns.html',
            controller:'ReturnsCtrl',
        });
        $stateProvider.state('returnInfo',{  //  个人中心——退换货——详情
            url: '/returnInfo/:rid',
            templateUrl:'template/mycenters/returnInfo.html',
            controller:'returnInfoCtrl',
        });
    })
    .config(function($httpProvider) {

        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function(data) {
            /**
             * The workhorse; converts an object to x-www-form-urlencoded serialization.
             * @param {Object} obj
             * @return {String}
             */
            var param = function(obj) {
                var query = '';
                var name, value, fullSubName, subName, subValue, innerObj, i;

                for (name in obj) {
                    value = obj[name];

                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value instanceof Object) {
                        for (subName in value) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value !== undefined && value !== null) {
                        query += encodeURIComponent(name) + '='
                            + encodeURIComponent(value) + '&';
                    }
                }

                return query.length ? query.substr(0, query.length - 1) : query;
            };

            return angular.isObject(data) && String(data) !== '[object File]'
                ? param(data)
                : data;
        }];
    });
