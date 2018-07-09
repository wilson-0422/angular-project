var B= angular.module('Ttouch.commodity', [])
    .controller('ClassificationCtrl',   //  找货——分类
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$interval','labels',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$interval,labels) {

                var _labels=labels.data.data;

                console.log(labels);

                $scope.labelType=[];

                $scope.labelFabric=[];

                $scope.labelGe=[];

                $scope.labelEle=[];

                angular.forEach(_labels,function(data){

                    if(data.type==1){
                        $scope.labelType.push({
                            'name':data.name,
                            'path':data.img_url
                        })
                    }
                    if(data.type==2){
                        $scope.labelFabric.push({
                            'name':data.name,
                            'path':data.img_url
                        })
                    }
                    if(data.type==4){
                        $scope.labelGe.push({
                            'name':data.name,
                            'path':data.img_url
                        })
                    }
                    if(data.type==5){
                        $scope.labelEle.push({
                            'name':data.name,
                            'path':data.img_url
                        })
                    }

                })

                $scope.typeBox={

                    'type':''
                }

                $scope.classFn=function(num){

                    $scope.typeBox.type=num;


                }

                $rootScope.$isloaing = false;

            }
        ])
    .controller('DesignersCrowdCtrl',  //  设计师——设计师众筹
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$interval',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$interval) {

                $scope.aid=$stateParams.aid;

                $scope.flashSale={
                    'aid':$stateParams.aid,
                    'page':0
                }

                $scope.load = {
                    busy:false
                };
                $scope.detaulsList = [];

                $scope.load.nextPage = function(){

                    $scope.flashSale.page++;

                    $scope.load.busy = true;

                    var _url='user-extend/raise-list';

                    postService.doPost($scope.flashSale,_url,function(data){

                        if($scope.flashSale.page > data.data.totalPage){

                            $scope.load.busy = true;

                        }else{

                            var models = data.data.models;

                            for (var i = 0; i < models.length; i++) {

                                $scope.detaulsList.push(models[i]);

                            }
                            if ($scope.flashSale.page == data.data.totalPage) {

                                $scope.load.busy = true;

                            } else {

                                $scope.load.busy = false;


                            }

                        }
                    });

                };
            }
        ])
    .controller('shopDetailsShareCtrl',  //  设计师——设计师众筹
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$interval',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$interval) {

                $scope.banned=$rootScope.user.banned;

                $scope.merchant_id=$stateParams.merchant_id;//  获取店铺详情

                $scope.addLabel = [];

                var getActivityGoodsList=function(merchant_id){

                    var _url='user-extend/merchant-info';

                    var _path={
                        merchant_id:merchant_id
                    }

                    postService.doPost(_path,_url,function(data){

                        window.scrollTo(0,!0);

                        $scope.shop=data.data;

                        $scope.shopObjs=data.data.hobby;

                        if($scope.shopObjs){

                            var labels = window.JSON.parse($scope.shopObjs);


                        }


                    });
                };
                getActivityGoodsList($scope.merchant_id);

                var _path={
                    merchant_id:$scope.merchant_id,
                    page:0
                };

                $scope.load = {
                    busy:false,
                    nost:false
                };
                $scope.goodsList = [];

                $scope.load.nextPage = function(){

                    _path.page++;

                    $scope.load.busy = true;

                    var _url='user-extend/merchant-products';

                    postService.doPost(_path,_url,function(data){

                        if(_path.page > data.data.totalPage){

                            $scope.load.busy = true;

                            $scope.load.nost = true;

                        }else{

                            var models = data.data.models;

                            for (var i = 0; i < models.length; i++) {

                                $scope.goodsList.push(models[i]);

                            }
                            $scope.load.busy = false;
                        }
                    });
                };

                $scope.isAttention=function(shopList){

                    if($rootScope.user.banned==0){
                        postService.showMsg('游客止步，请先注册');
                        $state.go('login');
                        return false;
                    }else if($rootScope.user.banned==1){
                        postService.showMsg('注册还未通过，请稍作等待');
                        return false
                    }

                    shopList.is_attention = shopList.is_attention ==1?0:1

                    var _url_store="user-extend/attention";

                    var _path={
                        buid:shopList.uid,
                        type:1
                    }

                    postService.doPost(_path,_url_store,function(data){

                        if (shopList.is_attention ==1){

                            postService.showMsg('已收藏');

                        }else if (shopList.is_attention ==0) {

                            postService.showMsg('取消收藏');
                        }

                        console.log(data)
                    })

                }

            }
        ])
    .controller('DesignersDetailsCtrl', //  设计师众筹——众筹详情
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$interval',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$interval) {

                // $scope.rid=$stateParams.rid;

                if($stateParams.is_gid == 1){

                    var _url='user-extend/raise-info-by-gid';

                    var _path={
                        gid:$stateParams.rid
                    }

                    postService.doPost(_path,_url,function(data){

                        $scope.detailsInfo=data.data;

                        angular.forEach($scope.detailsInfo.attribute,function(data){

                            angular.forEach(data.size,function(data){

                                data['num']=0;

                            })

                        })
                    })

                }else{
                    var _url='user-extend/raise-info';

                    var _path={
                        rid:$stateParams.rid
                    }
                    postService.doPost(_path,_url,function(data){

                        $scope.detailsInfo=data.data;

                        angular.forEach($scope.detailsInfo.attribute,function(data){

                            angular.forEach(data.size,function(data){

                                data['num']=0;

                            })

                        })
                    })

                }
                $scope.gid=$stateParams.gid;

                $scope.totleNum=0;

                $scope.designersPrice=0;

                $scope.priceList=0;

                $scope.joinShopList={
                    'split':false,
                    'order':false
                }

                var getActivityGoodsList=function(_path,_url){



                }
                // getActivityGoodsList($scope.rid)

                var getPrePrice=function(count){

                    var _url='user-extend/get-raise-price';

                    var _path={
                        rid:$stateParams.rid,
                        num:count,
                    }

                    postService.doPost(_path,_url,function(data){

                        $scope.designersPrice=data.data*count;
                    })

                }
                $scope.enterShopCar=function(){

                    if($scope.detailsInfo.attribute==''){

                        postService.showMsg('该商品库存不足')

                    }else{

                        $scope.joinShopList.order=true;

                    }

                }

                $scope.changeColor=function(index){

                    $scope.priceList=index;

                }

                var changeAllNum=function(count){

                    angular.forEach($scope.detailsInfo.attribute,function(data){

                        angular.forEach(data.size,function(data){

                            if((data.num+count)>=0&&(data.num+count)<=data.stock){

                                data.num+=count;

                                $scope.totleNum+=count;

                            }else if((data.num+count)>data.stock){
                                postService.showMsg('库存数量不足')
                            }else{
                                postService.showMsg('请输入大于0的数字')
                            }

                        })
                    })
                    
                        getPrePrice($scope.totleNum);
                    
                }

                $scope.changeOne=function(sizesInfo,count){

                    if((sizesInfo.num+count)>=0&&(sizesInfo.num+count)<=sizesInfo.stock){

                        $scope.totleNum+=count;

                        sizesInfo.num+=count;

                    }else if((sizesInfo.num+count)>sizesInfo.stock){
                        postService.showMsg('库存数量不足')

                    }else{
                        postService.showMsg('请输入大于0的数字')

                    }
                        getPrePrice($scope.totleNum);

                }

                $scope.changeInput=function(sizesInfo){

                    if(sizesInfo.num<0){
                        postService.showMsg('请输入大于0的数字')
                    }else if(sizesInfo.num>sizesInfo.stock){

                        sizesInfo.num=sizesInfo.stock;
                        postService.showMsg('库存数量不足')
                    }

                }

                $scope.addNumAll=function(){

                    changeAllNum(1)
                }

                $scope.reduceNumAll=function(){

                    changeAllNum(-1)
                }
                

                 $scope.uploadOrder =function () {

                     if($rootScope.user.banned==0){
                         postService.showMsg('游客止步，请先注册');
                         $state.go('login');
                         return false;
                     }else if($rootScope.user.banned==1){
                         postService.showMsg('注册还未通过，请稍作等待');
                         return false
                     }

                     var _url='user-extend/place-order-for-raise';

                     var _path={
                         'rid':$stateParams.rid,
                         'stock':window.JSON.stringify($scope.detailsInfo.attribute)
                     }

                     postService.doPost(_path,_url,function(data){

                         console.log(data);

                         $state.go('crowdfundInfo',{oid:data.data})
                     })
                 }

            }
        ])
    .controller('releaseSupplyDemandCtrl', //  发布供求
        ['$rootScope','$scope','$stateParams','$state','postService','Tools','Storage','$interval','Upload','ENV','$timeout',
            function($rootScope,$scope,$stateParams,$state,postService,Tools,Storage,$interval,Upload,ENV,$timeout) {
                $scope.release={
                    'type':1,
                    'title':"",
                    'num':"",
                    'describe':"",
                    'imgs':[],
                    'name':"",
                    'mobile':"",
                }

                $scope.changeType=function(num){

                    $scope.release={
                        'type':num,
                        'title':"",
                        'num':"",
                        'describe':"",
                        'imgs':[],
                        'name':"",
                        'mobile':"",
                    }

                }

                /**
                 * 上传图片
                 * @param file
                 * @param type
                 */
                $scope.progress=0;

                $scope.uploads = function(files){

                    if (files && files.length) {

                        for (var i = 0; i < files.length; i++) {

                            var _authToken = Storage.get('authToken');

                            var _uploadUrl = 'index/upload-img';

                            Upload.upload({
                                url: ENV.api + _uploadUrl,
                                data: {
                                    img: files[i],
                                    authToken: _authToken,
                                    time: 1470823494,
                                    token: '867a061511577ea3d2241d02b825cc57'
                                }

                            }).then(function (resp) {

                                console.log(resp)
                                $timeout(function () {

                                    //file.result = resp.data.data.path;

                                    if (resp.data.status == 1) {

                                        $scope.photoUp = false;

                                        postService.showMsg('上传完成');

                                        if($scope.release.imgs.length >= 5){

                                            postService.showMsg('最多上次5张图片')
                                            return false;
                                        }

                                        $scope.release.imgs.push(resp.data.data.path);

                                    }

                                })

                            }, function (resp) {

                                postService.showMsg('上传失败');


                            }, function (evt) {

                                $scope.photoUp = true;

                                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                $scope.progress = progressPercentage + ' %';

                                $rootScope.$digest(); // 通知视图模型的变化
                            })

                        }

                    }
                };
                $scope.removeImg=function(index){

                    $scope.release.imgs.splice(index,1);

                };

                $scope.configRelease =function(){

                    if($scope.release.title==''){

                        postService.showMsg('标题不能为空')
                        return false;
                    }
                    if($scope.release.num==''){

                        postService.showMsg('供应量不能为空')
                        return false;
                    }
                    if($scope.release.title==''){

                        postService.showMsg('供应商品说明不能为空')
                        return false;
                    }
                    if($scope.release.name==''){

                        postService.showMsg('供应人姓名不能为空')
                        return false;
                    }
                    if($scope.release.mobile==''){

                        postService.showMsg('供应人联系方式不能为空')
                        return false;
                    }
                    if($scope.release.imgs == ''){
                        postService.showMsg('最少上次一张图片')
                        return false;
                    }

                    var _url='user/publish-demand';

                    var _path={
                        type:$scope.release.type,
                        title:$scope.release.title,
                        num:$scope.release.num,
                        describe:$scope.release.describe,
                        img:$scope.release.imgs.join('#'),
                        name:$scope.release.name,
                        mobile:$scope.release.mobile,

                    }

                    postService.doPost(_path,_url,function(data){

                        console.log(data)

                        postService.showMsg('发布成功')
                        $state.go('index.Availability')

                    })

                }

            }
        ])