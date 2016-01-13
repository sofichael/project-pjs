'use strict';

/**
 * @ngdoc function
 * @name WPAPP.controller:PendingCtrl
 * @description  配件商查看已经报价的询价信息汇总(未结束)
 * # PendingCtrl
 * Controller of the WPAPP
 */
app.controller('PendingCtrl', function ($scope,dialogs,AdminService,sharedService,logger) {

  /**
   * 20.配件商报价列表
   * @param  {[inputObj]}
   */
  $scope.limit = 10;
  $scope.offset = 0;
  // AdminService.accessoryShopQuotationSheetLists($scope,sharedService.getCookie('accessToken'),$scope.limit,$scope.offset,function(result){
  //   $scope.sheetList = result.quotation_sheet_lists;
  // });

  //sort by column
  $scope.column = '';
  $scope.sort = function(column,reverse){
    $scope.column = column;
    if ($scope.reverse === 'undefined') {
      $scope.reverse = true;
    } else{
      $scope.reverse = !$scope.reverse;
    }
    $scope.inquires.sort(sortBy(column, $scope.reverse, function(a){return parseInt(a);}));
  };

  });
