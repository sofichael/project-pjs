'use strict';

/**
 * @ngdoc function
 * @name WPAPP.controller:InquireCtrl
 * @description
 * # InquireCtrl
 * Controller of the WPAPP
 */
app.controller('InquireCtrl', function ($scope,AdminService,dialogs,sharedService,logger,$window) {

    ajaxBlockUI(angular.element('.page-container .container-fluid'));
    angular.element('.blockUI.blockMsg.blockElement').css({
      left: '40%',
      top: '10%'
    });

    // 分页处理 默认10页
    $scope.records = [{id : 5,name : '5条'},
                                {id : 10,name : '10条'},
                                {id : 20,name : '20条'},
                                {id : 50,name : '50条'}
                                ];
    $scope.record = $scope.records[0];
    $scope.limit = $scope.records[0].id;

    $scope.pages = [];
    $scope.currentPage = 1;
    // $scope.recordInfo = ($scope.currentPage - 1) * record+ '{{(currentPage-1) * record}} 到 {{currentPage-1 * record}} 共 {{quotationSheetLists.total}}条';
    $scope.offset = 0;

    //(1,3)  //Math.ceil(result.total/$scope.limit)
    //totalPage < 5 currentPage 1-5
    //totalPage > 5 currentPage 1-~
    $scope.handlePages = function (currentPage,totalPage) {
            // logger.info('currentPage:' + currentPage +'/totalPage:' + totalPage);
            $scope.pages.length = 0;
            if (currentPage === 1) {
                $scope.prevBtn = true;
            } else{
                $scope.prevBtn = false;
            }

            if (currentPage === totalPage) {
                $scope.nextBtn = true;
            } else{
                $scope.nextBtn = false;
            }

            if (totalPage <= 5) {
                // logger.info('totalPage <= 5');
                for (var i = 1; i <= totalPage; i++) {
                    $scope.pages.push(i);
                }
            }else if (currentPage > 3) {
                    if (currentPage <= totalPage-2) {
                        // logger.info('currentPage > 3 =>> currentPage <= totalPage-2');
                        $scope.pages = [currentPage-2,currentPage-1,currentPage,currentPage+1,currentPage+2];
                    }else if(currentPage <= totalPage-1){
                        // logger.info('currentPage > 3 =>> currentPage = totalPage-1');
                        $scope.pages = [currentPage-3,currentPage-2,currentPage-1,currentPage,currentPage+1];
                    }else if(currentPage === totalPage){
                        // logger.info('currentPage > 3 =>> currentPage = totalPage');
                        $scope.pages = [currentPage-4,currentPage-3,currentPage-2,currentPage-1,currentPage];
                    }
            }else if (currentPage <= 3) {
                    // logger.info('currentPage <= 3');
                   $scope.pages = [1,2,3,4,5];
            }
    };

    /**
     * 20.配件商报价列表 (已报价、未报价)
     * @param  string      accessToken    权限token
     * @param  int           limit                   限制大小  default 5
     * @param  int           offset               偏移量      default 0
     * @param  Function  callback          回调函数
     */
    if ($scope.accessToken !== undefined) {
        AdminService.accessoryShopQuotationSheetLists($scope,$scope.accessToken,$scope.limit,$scope.offset,false,function (result) {
            if (result.quotation_sheet_lists.length === 0) {
                $scope.msg = result.error_msg || '暂无维修厂询价！';
                launch($scope,dialogs,'notify');
            } else{
                // 分页处理 默认5页 (23/5)
                $scope.handlePages(1,Math.ceil(result.total / $scope.limit));
                $scope.quotationSheetLists = result;
                angular.element('#inquireTable').removeClass('hidden');
           }
          unblockUI(angular.element('.page-container .container-fluid'));
        });
    }

    $scope.showRecord = function (record) {
        $scope.limit = record;
        $scope.offset = 0;
        // logger.info('起始位置offset：' + $scope.offset +'/条数limit：' + $scope.limit);
        ajaxBlockUI(angular.element('.page-container .container-fluid'));
        AdminService.accessoryShopQuotationSheetLists($scope,$scope.accessToken,$scope.limit,$scope.offset,false,function (result) {
            $scope.handlePages(1,Math.ceil(result.total / record));
            $scope.quotationSheetLists = result;
            unblockUI(angular.element('.page-container .container-fluid'));
        });
    };

    //eg: 第5页  每页10条  limit=10 offset=10*4
    $scope.changePage = function (page) {
          $scope.currentPage = page;
          $scope.offset = (page - 1)  * $scope.limit;
          // logger.info('起始位置offset：' + $scope.offset +'/条数limit：' + $scope.limit);
          ajaxBlockUI(angular.element('.page-container .container-fluid'));
          AdminService.accessoryShopQuotationSheetLists($scope,$scope.accessToken,$scope.limit,$scope.offset,false,function (result) {
              $scope.quotationSheetLists = result;
              $scope.handlePages($scope.currentPage,Math.ceil(result.total / $scope.limit));
              unblockUI(angular.element('.page-container .container-fluid'));
          });
    };

    $scope.prev = function (page) {
          $scope.currentPage = page-1;
          $scope.offset = (page - 2)  * $scope.limit;
          // logger.info('起始位置offset：' + $scope.offset +'/条数limit：' + $scope.limit);
          ajaxBlockUI(angular.element('.page-container .container-fluid'));
          AdminService.accessoryShopQuotationSheetLists($scope,$scope.accessToken,$scope.limit,$scope.offset,false,function (result) {
              $scope.quotationSheetLists = result;
              $scope.handlePages($scope.currentPage,Math.ceil(result.total / $scope.limit));
              unblockUI(angular.element('.page-container .container-fluid'));
          });
    };

    $scope.next = function (page) {
          $scope.currentPage = page+1;
          $scope.offset = (page)  * $scope.limit;
          // logger.info('起始位置offset：' + $scope.offset +'/条数limit：' + $scope.limit);
          ajaxBlockUI(angular.element('.page-container .container-fluid'));
          AdminService.accessoryShopQuotationSheetLists($scope,$scope.accessToken,$scope.limit,$scope.offset,false,function (result) {
              $scope.quotationSheetLists = result;
              $scope.handlePages($scope.currentPage,Math.ceil(result.total / $scope.limit));
              unblockUI(angular.element('.page-container .container-fluid'));
          });
    };

    //sort by column
    //$scope.column = '';
    $scope.sort = function(column,reverse){
        $scope.column = column;
        if ($scope.reverse === 'undefined') {
            $scope.reverse = true;
        } else{
            $scope.reverse = !$scope.reverse;
        }
        $scope.quotationSheetLists.quotation_sheet_lists.sort(sortBy(column, $scope.reverse, function(a){return parseInt(a);}));
    };

    //reload
    $scope.reload = function () {
        ajaxBlockUI(angular.element('.page-container .container-fluid'));
        AdminService.accessoryShopQuotationSheetLists($scope,$scope.accessToken,$scope.limit,$scope.offset,true,function (result) {
            $scope.quotationSheetLists = result;
            $scope.handlePages($scope.currentPage,Math.ceil(result.total / $scope.limit));
            unblockUI(angular.element('.page-container .container-fluid'));
        });
    };

    //查看询价单详情页面 call 31.配件商报价单详情接口
    $scope.inquireDetail = function (inquirySheetId,quotationSheetId) {
        sharedService.setCookie('inquirySheetId',inquirySheetId);
        sharedService.setCookie('quotationSheetId',quotationSheetId);
        $window.location.href = '#/inquireDetail';
    };

});