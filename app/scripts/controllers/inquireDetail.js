'use strict';

/**
 * @ngdoc function
 * @name WPAPP.controller:InquireDetailCtrl
 * @description
 * # InquireDetailCtrl
 * Controller of the WPAPP
 */
app.controller('InquireDetailCtrl', function ($scope,logger,AdminService,sharedService,$window,dialogs) {
    ajaxBlockUI(angular.element('.page-container .container-fluid'));
    angular.element('.blockUI.blockMsg.blockElement').css({
      left: '40%',
      top: '10%'
    });
     /**
       * 31.配件商报价单详情
       * @param  var          scope                        全局变量
       * @param  int          access_token            权限token
       * @param  int          quotation_sheet_id   询价单号
       * @param  Function callback                    回调函数
     */
     $scope.inquirySheetId = sharedService.getCookie('inquirySheetId');
     AdminService.accessoryShopQuotationSheetDetail($scope,$scope.accessToken,$scope.inquirySheetId,function (result) {
          $scope.motorRepairShop  = result.motor_repair_shop; //维修厂详情
          $scope.inquirySheet  = result.inquiry_sheet; //询价单详情
          $scope.inquirySheetAccessoires  = result.inquiry_sheet_accessoires; //询价单报价详情 list

          // 根据 quotation_sheet_items 属性判断是否报过价
          if (result.current_accessory_shop_is_quoted  === false) {
              $scope.actionBtn = '保存报价';
              $scope.actionMethod = 'POST';
          }else {
              //初始默认第一个配价最后一个报价tab active
              for (var i = 0; i < $scope.inquirySheetAccessoires.length; i++) {
                  if (typeof $scope.inquirySheetAccessoires[i].quotation_sheet_items !== 'undefined') {
                      $scope.accessoryItemOn = i;
                      $scope.inquirySheetAccessoires[i].quotationSheetOn = $scope.inquirySheetAccessoires[i].quotation_sheet_items.length-1;
                      break;
                  }
              }
              // logger.info(JSON.stringify($scope.inquirySheetAccessoires));
              $scope.actionBtn = '更新报价';
              $scope.actionMethod = 'PUT';
          }
          var val = {page:'inquire',pageTitle:$scope.motorRepairShop.motor_repair_shop_name+'询价详情',pageBURL:'#/inquire',pageBtitle:'询价',pageSubtitle:'询价详情'};
          sharedService.shareData('inquire',val);
          unblockUI(angular.element('.page-container .container-fluid'));
          angular.element('.blog-page').removeClass('hidden');
     });

    //accessoiry 配件tab切换
     $scope.accessoirySwitch = function (index) {
         $scope.accessoryItemOn = index;
         if (typeof $scope.inquirySheetAccessoires[index].quotation_sheet_items !== 'undefined') {
            $scope.inquirySheetAccessoires[index].quotationSheetOn = $scope.inquirySheetAccessoires[index].quotation_sheet_items.length-1;
         }
     };

     /**
       * 新增报价单
       * @param  string         accessoryItemId     配价ID
       * @param  void
     */
     var isAddQuotation = false;
     $scope.addQuotation = function (accessoryItemId)  {
          for (var i = $scope.inquirySheetAccessoires.length - 1; i >= 0; i--) {
               if ($scope.inquirySheetAccessoires[i].accessory_item_id === accessoryItemId) {
                    if ($scope.inquirySheetAccessoires[i].quotation_sheet_items  === undefined) {
                        $scope.inquirySheetAccessoires[i].quotation_sheet_items  = [];
                    }
                    var accessoryItem = {
                                                  'price':0, //default : 0
                                                  'accessory_level':1, //default : 1
                                                  'accessory_quality_gurantee_period':1, //default : 1
                                                  'accessory_arrival':1, //default : 1
                                                  'accessory_brand':'',
                                                  'accessory_unit':'',
                                                  'notes':''
                                                  };
                    $scope.inquirySheetAccessoires[i].quotation_sheet_items.push(accessoryItem);
                    isAddQuotation = true;
                    $scope.inquirySheetAccessoires[i].quotationSheetOn = $scope.inquirySheetAccessoires[i].quotation_sheet_items.length-1; //新增报价报价单tab = on
                    break;
               }
          }
     };

     /**
       * 删除某个配价的单次报价
       * @param  string         parentIndex     配价索引
       * @param  string         Index               配价报价索引
       * @param  void
     */
     $scope.delQutation = function (parentIndex,index) {
          $scope.inquirySheetAccessoires[parentIndex].quotation_sheet_items.splice(index,1);
          $scope.inquirySheetAccessoires[parentIndex].quotationSheetOn = $scope.inquirySheetAccessoires[parentIndex].quotation_sheet_items.length-1;
     };

    //配件报价单tab切换 accessoryItemId
    $scope.quotationSheetItemTab = function (accessoryItemId,index) {
          for (var i = $scope.inquirySheetAccessoires.length - 1; i >= 0; i--) {
               if ($scope.inquirySheetAccessoires[i].accessory_item_id === accessoryItemId) {
                    $scope.inquirySheetAccessoires[i].quotationSheetOn = index;
                    break;
               }
          }
          $scope.quotationSheetItemOn = index;
    };

    /**
     * 选择级别 质保 到货
     * @param  string   index       index
     * @param  string   levelId     levelId
     * @return void
     */
    $scope.optionSwitch = function (type,parentIndex,index,id) {
          switch (type) {
            case 'level' :
                $scope.inquirySheetAccessoires[parentIndex].quotation_sheet_items[index].accessory_level = id;
            break;
            case 'quality' :
                $scope.inquirySheetAccessoires[parentIndex].quotation_sheet_items[index].accessory_quality_gurantee_period = id;
            break;
            case 'arrival' :
                $scope.inquirySheetAccessoires[parentIndex].quotation_sheet_items[index].accessory_arrival = id;
            break;
          }
    };

    function assembleQuotationSheet () {
          var createQuotationSheet = {access_token : $scope.accessToken,
                                                        inquiry_sheet_id : $scope.inquirySheet.inquiry_sheet_id,
                                                        quotation_sheet_items : []
                                                        };
          for (var i = $scope.inquirySheetAccessoires.length - 1; i >= 0; i--) {
                var quotationSheetItems = {'inquiry_sheet_accessory_item_id' : $scope.inquirySheetAccessoires[i].inquiry_sheet_accessory_item_id,
                                                            'inquiry_sheet_accessory_items' : $scope.inquirySheetAccessoires[i].quotation_sheet_items
                                                          };
                createQuotationSheet.quotation_sheet_items.push(quotationSheetItems);
          }
          return createQuotationSheet;
    }

    $scope.$watch('inquirySheetAccessoires', function(nval,oval) {
        if (nval !== oval && oval !== undefined) {
          isAddQuotation = true;
        }
    },true);

     //创建报价单 $parent.$index
     $scope.SaveOrmodifyQutation = function(method) {
          var qutationPirce = true;
          angular.element('input[type="number"]').each(function(index, el) {
            if (!/^[1-9][0-9]+$/.test(angular.element(el).val())) {
                    $scope.msg = '报价价格不正确';
                    launch($scope,dialogs,'notify');
                    qutationPirce = false;
            }
          });

          if (qutationPirce && !isAddQuotation && $scope.actionMethod === 'POST') {
              $scope.msg = '请先添加报价单';
              launch($scope,dialogs,'notify');
          } else if(qutationPirce && !isAddQuotation && $scope.actionMethod === 'PUT'){
              $scope.msg = '请先修改你的报价单';
              launch($scope,dialogs,'notify');
          } else if(qutationPirce){
              ajaxBlockUI(angular.element('.page-container .container-fluid'),'保存中...');
               /**
                 * 18.配件商创建报价单
                 * @param  var            scope          全局变量
                 * @param  object       inputObj     参数对象
                 * @param  Function    callback       回调函数
               */
              var quotationSheetObj = assembleQuotationSheet();
              if (method === 'PUT') {
                   quotationSheetObj.quotation_sheet_id = sharedService.getCookie('quotationSheetId');
              }else{
                   quotationSheetObj.quotation_sheet_id = '';
              }
              AdminService.accessoryShopQuotationSheet($scope,quotationSheetObj,method,function (result) {
                    unblockUI(angular.element('.page-container .container-fluid'));
                    if (method === 'POST') {
                        $scope.inquirySheetAccessoires = result.inquiry_sheet_accessoires;
                        //初始默认第一个配价最后一个报价tab active
                        $scope.inquirySheetAccessoires[0].quotationSheetOn = $scope.inquirySheetAccessoires[0].quotation_sheet_items.length-1;
                        $scope.msg = '保存报价成功';
                        $scope.actionBtn = '更新报价';
                        $scope.actionMethod = 'PUT';
                    }else{
                        $scope.msg = '修改报价成功';
                    }
                    launch($scope,dialogs,'notify');
              });
          }
     };
});
