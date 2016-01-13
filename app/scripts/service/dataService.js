'use strict';

/*!
 * @ngdoc function
 * @author sofichael@126.com
 * @name weipeiApp.controller:DataServiceModule
 * @description
 * # DataServiceModule
 * DataServiceModule of the weipei
 */

angular.module('DataServiceModule',[]).factory('AdminService', function($http,$window,Configuration,sharedService,logger)
{
  //------------------------------------------------------------------------
  //All Request URL   http://api.dev.chehubao.com/v1/
  //Real RESTful URL style, use the same URL with different HTTP actions
  //(POST=insert, PUT=update, DELETE=delete, GET=select)
  //------------------------------------------------------------------------

  var REST_BASE_URL = Configuration.BASE_URL;
  //1.API身份认证（Token）
  var URL_POST_TOKEN = REST_BASE_URL + 'token';
  //发送手机验证码
  //var URL_SEND_MOBILE_VERIFICATION_CODE = REST_BASE_URL + 'send_mobile_verification_code';
  //验证手机验证码
  //var URL_MOBILE_VERIFICATION_CODE = REST_BASE_URL + 'mobile_verification_code';
  //上传用户头像
  //var URL_POST_AVATAR = REST_BASE_URL + 'avatar';
  //找回密码
  //var URL_GET_PASSWORD = REST_BASE_URL + 'password';
  //8.获取账户基本信息
  var URL_GET_ACCOUNT_INFORMATION = REST_BASE_URL + 'account_information';
  //9.修改密码
  var URL_PUT_ACCOUNT_PASSWORD = REST_BASE_URL + 'account_password';
  //账号登陆
  //var URL_POST_LOGIN = REST_BASE_URL + 'login';
  //14.获取配件商基础信息
  var URL_GET_ACCESSORY_SHOP_INFOMATION = REST_BASE_URL + 'accessory-shop/infomation';
  //18.配件商创建报价单  32.配件商修改报价单
  var URL_POST_ACCESSORY_SHOP_QUOTATION_SHEET = REST_BASE_URL + 'accessory-shop/quotation-sheet';
  //19.修理厂询价列表
  var URL_GET_MOTOR_REPAIR_SHOP_INQUIRY_SHEET_LISTS = REST_BASE_URL + 'motor-repair-shop/inquiry-sheet-lists';
  //20.配件商报价列表 (已报价、未报价)
  var URL_GET_ACCESSORY_SHOP_QUOTATION_SHEET_LISTS = REST_BASE_URL + 'accessory-shop/quotation-sheet-lists';
  //25.TOKEN免密码登陆
  var URL_POST_TOKEN_LOGIN = REST_BASE_URL + 'token_login';
  //31.配件商报价单详情
  var URL_GET_ACCESSORY_SHOP_QUOTATION_SHEET_DETAIL = REST_BASE_URL + 'accessory-shop/quotation-sheet-detail';
  //37.配件商采购单列表
  var URL_GET_ACCESSORY_SHOP_PURCHASE_ORDER_LISTS = REST_BASE_URL + 'accessory-shop/purchase-order-lists';
  //39.使用邀请码
  var URL_PUT_INVITE_CODE = REST_BASE_URL + 'invitation/code';
  //40.修改用户姓名
  var URL_PUT_REAL_NAME = REST_BASE_URL + 'realname';
  //46.配件属性接口
  var URL_GET_ACCESSORY_ATTRIBUTES = REST_BASE_URL + 'accessories/attributes';
  //50.配件商采购单详情
  var URL_GET_ACCESSORY_SHOP_PURCHASE_ORDER_DETAIL = REST_BASE_URL + 'accessory-shop/purchase-order-detail';


  /**
   * 无刷新操作取缓存值
   */
  //19.修理厂询价列表
  var motorRepairShopInquirySheetLists;
  //20.配件商报价列表 (已报价、未报价)
  // var accessoryShopQuotationSheetLists;
  // var getOffset;
  // var getLimit;



  function handleError(error, operation)
  {
    var msg = operation + (error ? JSON.stringify(error) : '');
    logger.error(msg);
  }

  var service =
  {
    /**
     * 1.API身份认证（Token）
     * @param  var     scope       全局变量
     * @param  object  inputObj    参数对象
     * @param  Function  callback    回调函数
     */
    token : function(scope,inputObj,callback) {
      logger.info('Executing token() from "AdminService".');
      if (inputObj)
      {
      this.httpPost(scope,URL_POST_TOKEN,inputObj,
          function(result)
             {
              logger.info('token() call successful.');
              callback(result.data);
              return result.data;
             },
             'API身份认证（Token）请求异常，请联系管理员!'
             );
      }else{
        sharedService.errorOcurs('API身份验证 参数错误！');
      }
    },

    /**
     * 8.获取账户基本信息
     * @param  var     scope       全局变量
     * @param  object  accessToken 权限token
     * @param  Function  callback    回调函数
     */
    accountInformation : function(scope,accessToken,callback) {
      logger.info('Executing accountInformation() from "AdminService".');
      if (accessToken)
      {
      this.httpGet(scope,URL_GET_ACCOUNT_INFORMATION+'?access_token='+accessToken,
          function(result)
             {
              logger.info('accountInformation() call successful.');
              callback(result.data);
              return result.data;
             },
             '获取账户基本信息请求异常，请联系管理员!'
             );
      }else{
        sharedService.errorOcurs('获取账户基本信息 参数错误！');
      }
    },

    /**
     * 8.修改密码
     * @param  var     scope       全局变量
     * @param  object  inputObj    参数对象
     * @param  Function  callback    回调函数
     */
    accountPassword : function(scope,inputObj,callback) {
      logger.info('Executing accountPassword() from "AdminService".');
      if (inputObj)
      {
      this.httpPut(scope,URL_PUT_ACCOUNT_PASSWORD,inputObj,
          function(result)
             {
              logger.info('accountPassword() call successful.');
              callback(result.data);
              return result.data;
             },
             '修改密码请求异常，请联系管理员!'
             );
      }else{
        sharedService.errorOcurs('修改密码 参数错误！');
      }
    },

    /**
     * 14.获取配件商基础信息
     * @param  var     scope              全局变量
     * @param  object  accessory_shop_id  配件商ID
     * @param  Function  callback           回调函数
     */
    accessoryShopInfomation : function(scope,accessoryShopId,callback) {
      logger.info('Executing accessoryShop() from "AdminService".');
      if (accessoryShopId)
      {
      this.httpGet(scope,URL_GET_ACCESSORY_SHOP_INFOMATION+'?accessory_shop_id='+accessoryShopId,
          function(result)
             {
              logger.info('accessoryShop() call successful.');
              callback(result.data);
              return result.data;
             },
             '获取配件商基础信息请求异常，请联系管理员!'
             );
      }else{
        sharedService.errorOcurs('获取配件商基础信息 参数错误！');
      }
    },

    /**
     * 18.配件商创建报价单 配件商修改报价单
     * @param  var          scope            全局变量
     * @param  object     inputObj      参数对象
     * @param  Function  callback       回调函数
     */
    accessoryShopQuotationSheet : function(scope,inputObj,method,callback) {
      logger.info('Executing accessoryShopQuotationSheet() from "AdminService"');
      if (inputObj)
      {
      if (method === 'POST') {
          this.httpPost(scope,URL_POST_ACCESSORY_SHOP_QUOTATION_SHEET,inputObj,
              function(result)
                 {
                  logger.info('accessoryShopQuotationSheet() call successful.');
                  callback(result.data);
                  return result.data;
                 },
                 '配件商创建报价单请求异常，请联系管理员!'
                 );
      } else{
          this.httpPut(scope,URL_POST_ACCESSORY_SHOP_QUOTATION_SHEET,inputObj,
              function(result)
                 {
                  logger.info('accessoryShopQuotationSheet() call successful.');
                  callback(result.data);
                  return result.data;
                 },
                 '配件商创建报价单请求异常，请联系管理员!'
                 );
      }
      }else{
        sharedService.errorOcurs('配件商创建报价单 参数错误！');
      }
    },

    /**
     * 20.配件商报价列表 (已报价、未报价)
     * @param  var     scope              全局变量
     * @param  object  accessToken        权限token
     * @param  int     limit              限制大小
     * @param  int     offset             偏移量
     * @param  {[boolen]}  reload             刷新
     * @param  Function  callback           回调函数
     */
    accessoryShopQuotationSheetLists : function(scope,accessToken,limit,offset,reload,callback) {
      logger.info('Executing accessoryShopQuotationSheetLists() from "AdminService".');
      // if (reload || !accessoryShopQuotationSheetLists || getOffset !== offset || getLimit !== limit)
      if (accessToken && limit)
      {
      this.httpGet(scope,URL_GET_ACCESSORY_SHOP_QUOTATION_SHEET_LISTS+'?access_token='+accessToken+'&limit='+limit+'&offset='+offset,
          function(result)
             {
              logger.info('accessoryShopQuotationSheetLists() call successful.');
              // getOffset = offset;
              // getLimit = limit;
              // accessoryShopQuotationSheetLists = result.data;
              callback(result.data);
              return result.data;
             },
             '获取配件商报价列表请求异常，请联系管理员!'
             );
      }else{
        sharedService.errorOcurs('配件商报价列表 参数错误！');
      }
    },

    /**
     * 25.TOKEN免密码登陆
     * @param  var     scope       全局变量
     * @param  object  inputObj    参数对象
     * @param  Function  callback    回调函数
     */
    tokenLogin : function(scope,inputObj,callback) {
      logger.info('Executing tokenLogin() from "AdminService"');
      if (inputObj)
      {
      this.httpPost(scope,URL_POST_TOKEN_LOGIN,inputObj,
          function(result)
             {
              logger.info('tokenLogin() call successful.');
              callback(result.data);
              return result.data;
             },
             'TOKEN免密码登陆请求异常，请联系管理员!'
             );
      }else{
        sharedService.errorOcurs('TOKEN免密码登陆 参数错误！');
      }
    },

    /**
     * 31.配件商报价单详情
     * @param  var          scope                        全局变量
     * @param  int          access_token            权限token
     * @param  int          quotation_sheet_id   询价单号
     * @param  Function callback                    回调函数
     */
    accessoryShopQuotationSheetDetail : function(scope,accessToken,inquirySheetId,callback) {
      logger.info('Executing accessoryShopQuotationSheetDetail() from "AdminService".');
      if (accessToken && inquirySheetId)
      {
      this.httpGet(scope,URL_GET_ACCESSORY_SHOP_QUOTATION_SHEET_DETAIL+'?access_token='+accessToken+'&inquiry_sheet_id='+inquirySheetId,
          function(result)
             {
              logger.info('accessoryShopQuotationSheetDetail() call successful.');
              callback(result.data);
              return result.data;
             },
             '配件商报价单详情请求异常，请联系管理员!'
             );
      }else{
        sharedService.errorOcurs('配件商报价单详情 参数错误！');
      }
    },

    /**
     * 37.配件商采购单列表
     * @param  var          scope                        全局变量
     * @param  string     access_token            权限token
     * @param  string     status                       状态　（0待发货 1已发货 2已关闭 3全部）
     * @param  int          limit                         限制大小
     * @param  int          offset                      偏移量
     * @param  Function callback                    回调函数
     */
    accessoryShopPurchaseOrderLists : function(scope,accessToken,status,limit,offset,callback) {
      logger.info('Executing accessoryShopPurchaseOrderLists() from "AdminService".');
      if (accessToken && status)
      {
      this.httpGet(scope,URL_GET_ACCESSORY_SHOP_PURCHASE_ORDER_LISTS+'?access_token='+accessToken+'&status='+status+'&limit='+limit+'&offset='+offset,
          function(result)
             {
              logger.info('accessoryShopPurchaseOrderLists() call successful.');
              callback(result.data);
              return result.data;
             },
             '配件商采购单列表请求异常，请联系管理员!'
             );
      }else{
        sharedService.errorOcurs('配件商采购单列表 参数错误！');
      }
    },

    /**
     * 39.使用邀请码
     * @param  var               scope         全局变量
     * @param  object         inputObj    参数对象
     * @param  Function      callback     回调函数
     */
    inviteCode : function(scope,inputObj,callback) {
      logger.info('Executing inviteCode() from "AdminService".');
      if (inputObj)
      {
      this.httpPut(scope,URL_PUT_INVITE_CODE,inputObj,
          function(result)
             {
              logger.info('inviteCode() call successful.');
              callback(result.data);
              return result.data;
             },
             '使用邀请码请求异常，请联系管理员!'
             );
      }else{
        sharedService.errorOcurs('使用邀请码 参数错误！');
      }
    },

    /**
     * 40.修改用户姓名
     * @param  var            scope          全局变量
     * @param  object       inputObj    参数对象
     * @param  Function    callback     回调函数
     */
    realName : function(scope,inputObj,callback) {
      logger.info('Executing realName() from "AdminService".');
      if (inputObj)
      {
      this.httpPut(scope,URL_PUT_REAL_NAME,inputObj,
          function(result)
             {
              logger.info('realName() call successful.');
              callback(result.data);
              return result.data;
             },
             '修改用户姓名请求异常，请联系管理员!'
             );
      }else{
        sharedService.errorOcurs('修改用户姓名参数错误！');
      }
    },

    /**
     * 50.配件商采购单详情
     * @param  var          scope                      全局变量
     * @param  int          access_token           权限token
     * @param  int          order_id                  采购单编号
     * @param  Function callback                    回调函数
     */
    accessoryShopPurchaseOrderDetail : function(scope,accessToken,orderId,callback) {
      logger.info('Executing accessoryShopPurchaseOrderDetail() from "AdminService".');
      if (accessToken && orderId)
      {
      this.httpGet(scope,URL_GET_ACCESSORY_SHOP_PURCHASE_ORDER_DETAIL+'?access_token='+accessToken+'&order_id='+orderId,
          function(result)
             {
              logger.info('accessoryShopPurchaseOrderDetail() call successful.');
              callback(result.data);
              return result.data;
             },
             '配件商采购单详情请求异常，请联系管理员!'
             );
      }else{
        sharedService.errorOcurs('配件商采购单详情 参数错误！');
      }
    },

    /**
     * 46.配件属性接口
     * @param  var          scope                       全局变量
     * @param  int          access_token            权限token
     * @param  Function callback                     回调函数
     */
    accessoryAttributes : function(scope,accessToken,callback) {
      logger.info('Executing accessoryAttributes() from "AdminService".');
      if (accessToken)
      {
      this.httpGet(scope,URL_GET_ACCESSORY_ATTRIBUTES+'?access_token='+accessToken,
          function(result)
             {
              logger.info('accessoryAttributes() call successful.');
              callback(result.data);
              return result.data;
             },
             '配件属性接口请求异常，请联系管理员!'
             );
      }else{
        sharedService.errorOcurs('配件属性接口 参数错误！');
      }
    },

    /**
     * httpGet httpPost httpPut请求
     * 所有请求当status = 1 返回到controller处理
     * 所有请求当status = 0 返回到errorOcurs处理
     *
     * @param  var           scope     全局变量
     * @param  string       url         url
     * @param  Function   cb         回调函数
     * @param  string       errMsg  异常参数
     */
    httpGet : function(scope,url, cb, errMsg){
      //prevent cache
      if(url.indexOf('?') > 0){
        url += '&time=' + new Date().valueOf();
      }else{
        url += '?time=' + new Date().valueOf();
      }
      return scope.myPromise = $http.get(url).then(
        function(result)
        {
          if(angular.equals(result.data.status,1))
          {
            cb(result);
          }
          else
          {
            sharedService.errorOcurs(result.data);
          }
        },
        function(error)
        {
          errMsg = errMsg || 'HttpGet Exception';
          handleError(error, errMsg);
          sharedService.errorOcurs(errMsg);
        });
    },

    httpPost : function(scope,url,inputObj,cb,errMsg){
      return scope.myPromise = $http.post(url,inputObj).then(
        function(result)
        {
          if(angular.equals(result.data.status,1))
          {
            cb(result);
          }
          else
          {
            sharedService.errorOcurs(result.data);
          }
        },function(error)
        {
          errMsg = errMsg || 'HtpPost Exception';
          handleError(error, errMsg);
          sharedService.errorOcurs(errMsg);
        });
    },

    httpPut : function(scope,url,inputObj,cb,errMsg){
      return scope.myPromise = $http.put(url,inputObj).then(
        function(result)
        {
          if(angular.equals(result.data.status,1))
          {
            cb(result);
          }
          else
          {
            sharedService.errorOcurs(result.data);
          }
        },function(error)
        {
          errMsg = errMsg || 'HtpPut Exception';
          handleError(error, errMsg);
          sharedService.errorOcurs(errMsg);
        });
    }
  };
  return service;
});