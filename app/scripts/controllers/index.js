'use strict';

/**
 * @ngdoc function
 * @name WPAPP.controller:IndexCtrl
 * @description app初始化控制器
 * # IndexCtrl
 * Controller of the WPAPP
 */
app.controller('IndexCtrl', function ($scope,AdminService,sharedService,dialogs,$window,logger) {
    //判断浏览器是否支持cookie
    if (!sharedService.isSupported) {
      $scope.msg = '该浏览器不支持，请尝试使用其它浏览器访问系统！';
        launch($scope,dialogs,'notify');
    }

    if (!sharedService.getCookie('lock') === false) {
        window.location.href = 'lock.html';
    }

  /**
   * 全局错误事件通知
   * @param  object scope   全局变量
   * @param  object result  事件对象
   * @description 1:  授权已过期,调用接口重新授权   error_code: 601
   *                      2:  登陆已失效,请重新登陆             error_code: 603
   *                      3:  refresh_token参数无效           error_code: 800
   *                      4:  抱歉，询价单不存在                 error_code: 600
   *                      5: '发生异常,请联系管理员'
   */
  $scope.$on('handleErrorOcurs', function(scope,result) {
    // logger.info('================handleErrorOcurs================' + JSON.stringify(result));
    if (result.error_code === 601) {
          var inputObj = {refresh_token:sharedService.getCookie('account').refresh_token};
          AdminService.tokenLogin($scope,inputObj,function(result){
              sharedService.setCookie('accessToken',result.access_token);
              sharedService.setCookie('accessTokenExpireTime',result.exipiry_time);
          });
    }else if(result.error_code === 600) {
          unblockUI(angular.element('.page-container .container-fluid'));
          $scope.msg = result.error_msg || '报价失败';
          launch($scope,dialogs,'notify');
          // $window.location.href = '#/inquire';
    }else if(result.error_code === 603 || result.error_code === 401){
          $scope.msg = result.error_msg || '登录未授权，请重新登录！';
          launch($scope,dialogs,'login');
    }else{
          $scope.msg = typeof result === 'object' ? result.error_msg || '发生异常，请联系管理员' : result || '发生异常，请联系管理员';
          launch($scope,dialogs,'notify');
    }
    unblockUI(angular.element('.page-container .container-fluid'));
  });


      /**
       * 登录过期判断
       * 过期记住密码    用refreToken重新登录
       * 过期未记住密码  退出
       */
      var remember = sharedService.getCookie('remember');
      var accessTokenExpireTime = sharedService.getCookie('accessTokenExpireTime') * 1000 > new Date().getTime();
      //accessTokenExpireTime ---true 未过期 ---false 过期
      if (!accessTokenExpireTime && remember) {//过期记住密码 - 取tokenExpireTime
          logger.info('access_token过期记住密码');
          var inputObj = {refresh_token:sharedService.getCookie('account').refresh_token};
          AdminService.tokenLogin($scope,inputObj,function(result){
              logger.info(JSON.stringify(result));
              sharedService.setCookie('accessToken',result.access_token);
              sharedService.setCookie('accessTokenExpireTime',result.exipiry_time);
              // $window.location.reload();
          });
      }else if(!accessTokenExpireTime && !remember){//过期未记住密码 - 退出
          logger.info('access_token过期未记住密码');
          logger.info(accessTokenExpireTime);
          $scope.msg = '登录已失效，请重新登录';
          launch($scope,dialogs,'login');
          sharedService.clearAllCookie();
          $window.location.href = '/login.html';
      }

      //角色分配
      if (sharedService.getCookie('accountExtra') === null || sharedService.getCookie('accountExtra') === undefined) {
          $scope.obj = {inviteCode:'',btn:true};
          launch($scope,dialogs,'allocateRole',sharedService);
      }else{
          //接口调用授权
          $scope.accessToken = sharedService.getCookie('accessToken');
          //从cookie中活取配件商信息
          $scope.accountExtra = sharedService.getCookie('accountExtra');
          //从cookie中活取用户信息
          $scope.account = sharedService.getCookie('account');
      }

      /**
       *  全局事件通知
       * @param  scope scope
       * @param  action event
       * @param  funciont callback function
       * @return void
       */
      $scope.$on('handleDataBroadcast', function(scope,action,result) {
       if (action === 'inquire') {
          $scope.page = result.page;
          $scope.pageTitle = result.pageTitle;
          $scope.pageBURL = result.pageBURL;
          $scope.pageBtitle = result.pageBtitle;
          $scope.pageSubtitle = result.pageSubtitle;
        }
       if (action === 'inquirePre') {
          $scope.page = result.page;
          $scope.pageTitle = result.pageTitle;
          $scope.pageBURL = result.pageBURL;
          $scope.pageBtitle = result.pageBtitle;
          $scope.pageSubtitle = result.pageSubtitle;
        }
      });

      //子页面切换
      $scope.accountExtra = sharedService.getCookie('accountExtra');
      $scope.pageSwitch = function(val) {
        $scope.page = val;
        switch(val) {
          case 'index' :
              $scope.pageTitle = $scope.accountExtra !== null ? $scope.accountExtra.name + '数据中心' :  '配件商数据中心';
              $scope.pageBURL = '#/';
              $scope.pageBtitle = '首页';
              $scope.pageSubtitle = '数据中心';
          break;
          case 'inquire' :
              $scope.pageTitle = '维修厂询价通知中心';
              $scope.pageBURL = '#/inquire';
              $scope.pageBtitle = '询价';
              $scope.pageSubtitle = '询价列表';
          break;
          case 'pending' :
              $scope.pageTitle = $scope.accountExtra.name + '报价订单';
              $scope.pageBURL = '#/pending';
              $scope.pageBtitle = '交易订单';
              $scope.pageSubtitle = '我的报价订单';
          break;
          case 'finish' :
              $scope.pageTitle = $scope.accountExtra.name + '成交采购单';
              $scope.pageBURL = '#/finish';
              $scope.pageBtitle = '交易采购单';
              $scope.pageSubtitle = '我的成交采购单';
          break;
          case 'profile' :
              $scope.pageTitle = '配件商个人中心';
              $scope.pageBURL = '/';
              $scope.pageBtitle = '个人信息';
              $scope.pageSubtitle = '';
          break;
        }
      };
      $scope.pageSwitch('inquire');
      //向前导航 - 询价详情
      $scope.prePage = function () {
        if ($scope.pageSubtitle === '询价详情') {
          var val = {page:'inquire',pageTitle:'维修厂询价通知中心',pageBURL:'#/inquire',pageBtitle:'询价',pageSubtitle:'询价列表'};
          sharedService.shareData('inquirePre',val);
          $window.location.href = '#/inquire';
        }
      };

      //退出清除所有cookie
      $scope.loginout = function () {
        sharedService.clearAllCookie();
        $window.location.href = '/login.html';
      };

      //锁屏，使用密码登录
      $scope.lock = function () {
        sharedService.setCookie('lock',true);
        $window.location.href = '/lock.html';
      };


}).controller('allocateRoleCtrl',function($scope,AdminService,sharedService,dialogs,logger,$window,$modalInstance,data){
      $scope.obj = data;
      $scope.$watch('obj.inviteCode', function(nval) {
          if (nval.length === 6) {
            $scope.obj.btn = false;
          }else{
            $scope.obj.btn = true;
          }
      });

      $scope.validate = function(){
          var inputObj = {access_token:sharedService.getCookie('accessToken'),invite_code:$scope.obj.inviteCode};
          /**
           * 使用验证码
           * @param  {[inputObj]}
           * @return {[Function]}       回调函数
           */
          AdminService.inviteCode($scope,inputObj,function(result){
            // logger.info(JSON.stringify(result));
            sharedService.setCookie('accessToken',result.access_token);
            sharedService.setCookie('accessTokenExpireTime',result.exipiry_time);
            sharedService.setCookie('account',result);
            if (result.account_extra !== undefined) {
                sharedService.setCookie('accountExtra',true);
                $window.location.reload();
            }
            $modalInstance.close();
          });
      };
}).controller('notifyCtrl',function($scope,sharedService,dialogs,logger,$modalInstance,$window,data){
  $scope.msg = data;
  $scope.ok = function(){
        $modalInstance.dismiss('Canceled');
  };
}).controller('loginCtrl',function($scope,sharedService,dialogs,logger,$modalInstance,$window,data){
  $scope.msg = data;
  $scope.ok = function(){
        sharedService.clearAllCookie();
        $window.location.href = 'login.html';
  };
});

