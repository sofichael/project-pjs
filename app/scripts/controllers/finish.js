'use strict';

/**
 * @ngdoc function
 * @name WPAPP.controller:FinishCtrl
 * @description
 * # FinishCtrl
 * Controller of the WPAPP
 */
app.controller('FinishCtrl', function ($scope,dialogs,sharedService,AdminService,logger,$window) {

    ajaxBlockUI(angular.element('.page-container .container-fluid'));
    angular.element('.blockUI.blockMsg.blockElement').css({
      left: '40%',
      top: '10%'
    });
    /**
     * 37.配件商采购单列表
     * @param  var          scope                        全局变量
     * @param  string     access_token            权限token
     * @param  string     status                       状态　（0待发货 1已发货 2已关闭 3全部）
     * @param  int          limit                         限制大小
     * @param  int          offset                      偏移量
     * @param  Function callback                    回调函数
     */
    $scope.limit = 50;
    $scope.offset = 0;
    AdminService.accessoryShopPurchaseOrderLists($scope,$scope.accessToken,3,$scope.limit,$scope.offset,function(result){
        if (result.purchase_order_list.length !== 0) {
            $scope.orders = result.purchase_order_list;
            $scope.orderTabOn = 0; //采购单tab
            $scope.purchaseOrder = result.purchase_order_list[0];
            $scope.accessoryItems = result.purchase_order_list[0].purchase_order_accessories[0].accessory_items;
        }else{
              $scope.msg = result.error_msg || '暂无维修厂确认的采购单！';
              launch($scope,dialogs,'notify');
        }
        unblockUI(angular.element('.page-container .container-fluid'));
    });

    //采购单切换tab
    $scope.orderTab = function  (index) {
          $scope.quotationSheetOn = 0;
          $scope.orderTabOn = index;
          $scope.purchaseOrder = $scope.orders[index];
          $scope.accessoryItems = $scope.orders[index].purchase_order_accessories[0].accessory_items;
    };


    $scope.quotationSheetOn = 0; //采购单配价tab
    $scope.quotationSheetItemTab = function  (index) {
          $scope.quotationSheetOn = index;
          $scope.accessoryItems = $scope.orders[$scope.orderTabOn].purchase_order_accessories[index].accessory_items;
    };

    $scope.itemOn = 0; //采购单配价 商家报价tab
    $scope.itemOnTab = function  (index) {
          $scope.itemOn = index;
    };


  });