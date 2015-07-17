'use strict';

/**
 * @ngdoc function
 * @name WPAPP.common function: dialogs / sort ...
 * @description 公共方法库
 * common function of the WPAPP
 */

function launch($scope,dialogs,type,sharedService){
  switch(type){
    case 'confirm':
      var dlg = dialogs.confirm();
      dlg.result.then(function(btn){
        $scope.confirmed = 'You confirmed "Yes."';
      },function(btn){
        $scope.confirmed = 'You confirmed "No."';
      });
      break;
    case 'notify':
      var dlg = dialogs.create('../templates/notify.html','notifyCtrl',$scope.msg,{size:'sm',keyboard: true,backdrop: true,windowClass: ''});
      break;
    case 'login':
      var dlg = dialogs.create('../templates/login.html','loginCtrl',$scope.msg,{size:'sm',keyboard: true,backdrop: true,windowClass: ''});
      break;
    case 'allocateRole':
      var dlg = dialogs.create('../templates/allocateRole.html','allocateRoleCtrl',$scope.obj,{size:'sm',keyboard: true,backdrop: true,windowClass: ''});
      dlg.result.then(function(val){

      },function(){

      });
      break;
    case 'addItem':
      var dlg = dialogs.create('../templates/addItem.html','addCtrl',$scope.quote,{size:'lg',keyboard: true,backdrop: true,windowClass: ''});
      dlg.result.then(function(val){
        sharedService.shareData('quote',val);
      },function(){
        if(angular.equals($scope.quote.price,0))
          $scope.quote.price = 1;
      });
      break;
  }
}

/**
 * [timer description]
 * @param  {[type]} $scope    [description]
 * @param  {[type]} $interval [description]
 * @return {[type]}           [description]
 */
function timer($scope,$interval){
  var time = $scope.countTime;
  var timer = $interval(function(){
        if ($scope.countTime === 0){
          $interval.cancel(timer);
          $scope.countTime = time;
          $scope.sendShow = !$scope.sendShow;
        }else {$scope.countTime--;}
   }, 1000);
}

/**
 * [formatDate description]
 * @param  {[type]} date [description]
 * @return {[type]}      [description]
 */
function formatDate(date) {
  function getStr(i) {
    return (i < 10) ? '0' + i : ''+ i;
  }
  var dateStr = getStr(date.getFullYear())+ '-'+
                getStr(1 + date.getMonth()) + '-'+
                getStr(date.getDate());
  return dateStr;
}

/**
 * sort_by sort filter data list by column order array.sort(sort_by('', false, function(a){return a.toUpperCase();}));
 * @param  {[type]} field   [description]
 * @param  {[type]} reverse [description]
 * @param  {[type]} primer  [description]
 * @return {[type]}         [description]
 */
function sortBy(field, reverse, primer){
  var key = primer ?
     function(x) {return primer(x[field]);} :
     function(x) {return x[field];};

  reverse = [-1, 1][+!!reverse];

  return function (a, b) {
     return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
  };
}

// wrapper function to  block element(indicate loading)
function blockUI (el, centerY) {
  var el = jQuery(el);
  el.block({
          message: '<img src="./media/image/fancybox_loading.gif" align=""><p>加载中...</p>',
          centerY: centerY !== undefined ? centerY : true,
          css: {
              top: '10%',
              width:'70px',
              opacity: 0.7,
              border: 'none',
              padding: '10px',
              backgroundColor: '#000'
          },
          overlayCSS: {
              backgroundColor: '#000',
              opacity: 0.5,
              cursor: 'wait'
          }
      });
}

function ajaxBlockUI (el,msg,centerY) {
  var el = jQuery(el);
  var msg = msg || '查询中...';
  el.block({
          message: '<img src="./media/image/fancybox_loading.gif" align=""><p>'+msg+'</p>',
          centerY: centerY !== undefined ? centerY : true,
          css: {
              width:'20%',
              marginTop: '100px',
              opacity: 0.7,
              border: 'none',
              paddingTop: '10px',
              backgroundColor: '#000'
          },
          overlayCSS: {
              backgroundColor: '#000',
              opacity: 0,
              cursor: 'wait'
          }
      });
}

// wrapper function to  un-block element(finish loading)
function unblockUI (el) {
  jQuery(el).unblock({
          onUnblock: function () {
              jQuery(el).removeAttr("style");
          }
      });
}
