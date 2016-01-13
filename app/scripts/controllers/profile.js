'use strict';

/**
 * @ngdoc function
 * @name WPAPP.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the WPAPP
 */
app.controller('ProfileCtrl', function ($scope,AdminService,sharedService,$window,logger,dialogs) {

  //导航tab切换
  $scope.tab = 'account';
  $scope.switchTab = function(tab){
      $scope.tab = tab;
  };

  //个人信息切换
  $scope.tabAccount = 'info';
  $scope.switchTabAccount = function(tab){
      $scope.tabAccount = tab;
  };

  //帮助切换
  $scope.tabHelp = 'about';
  $scope.switchTabHelp = function(tab){
      $scope.tabHelp = tab;
  };
  $scope.collapse1 = 'item_1_1';
  $scope.switchCollapse1 = function(tab){
      $scope.collapse1 = tab;
  };
  $scope.collapse2 = 'item_2_1';
  $scope.switchCollapse2 = function(tab){
      $scope.collapse2 = tab;
  };

  //修改用户信息
  $scope.changeName = true;
  $scope.$watch('account.realname', function(nval,oval) {
      if (oval !== undefined && nval !== oval) {
          $scope.changeName = false;
      }
  });


  //TODO 替换cookie值
  $scope.modifyRealName = function(){
    var object = {realname : $scope.account.realname,
                  access_token : sharedService.getCookie('accessToken')};
    AdminService.realName($scope,object,function (result) {
      if (result.status === 1) {
          $scope.msg = '修改成功';
          launch($scope,dialogs,'notify');
          sharedService.setCookie('account',result);
          $scope.changeName = true;
      }
    });
  };

  //修改密码
  $scope.originalPassword = '';
  $scope.original = false;
  $scope.$watch('originalPassword', function(nval) {
    if (nval.length >= 6) {
        $scope.original = true;
    }
  });

  $scope.password = '';
  $scope.password1 = false;
  $scope.$watch('password', function(nval) {
    if (nval.length >= 6) {
        $scope.password1 = true;
    }
  });
  $scope.changePwd = true;
  $scope.rePassword = '';
  $scope.rePassword1 = false;
  $scope.$watch('rePassword', function(nval) {
    if (nval === $scope.password && nval.length >= 6) {
        $scope.rePassword1 = true;
        $scope.changePwd = false;
    }else{
        $scope.rePassword1 = false;
        $scope.changePwd = true;
    }
  });

  $scope.changePassword = function () {
    var object = {
                  'access_token' : sharedService.getCookie('accessToken'),
                  'origin_password' : $scope.originalPassword,
                  'password' : $scope.rePassword
                };
    AdminService.accountPassword($scope,object,function (result) {
      if (result.status === 1) {
          $scope.msg = '修改成功';
          launch($scope,dialogs,'notify');
          $scope.changePwd = true;
      }
    });
  };
});
