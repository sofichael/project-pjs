'use strict';

/**
 * @ngdoc function
 * @name WPAPP.uiFilter
 * @description UI模块
 * uiFilter of the WPAPP
 */


angular.module('CustomFilter', [])
.filter('formatTime',function(){
      return function(myDate){
          var myTime = new Date(myDate).getTime()/1000;
          var timeNow = parseInt(new Date().getTime()/1000);
          var d,days,hours,minutes;
          d = timeNow - myTime;
          days = parseInt(d/86400);
          hours = parseInt(d/3600);
          minutes = parseInt(d/60);
          if(days > 0 && days < 4){
              return days + '天前';
          }else if(days <= 0 && hours > 0){
              return hours + '小时前';
          }else if(hours <= 0 && minutes > 0){
              return minutes + '分钟前';
          }else if(d > 0 && d<=60){
              return d + '秒前';
          }else{
              return myDate;
            }
      };
}).filter('accessory',function(){
      return function(val,option){
          switch (option) {
              case 'level' :
                      if (val === 1) return '原厂件';
                      else if(val === 2) return '品牌件';
                      else return '拆车件';
                      break;
              case 'quality' :
                      if (val === 1) return '无质保';
                      else return '一个月';
                      break;
              case 'arrival' :
                      if (val === 1) return '现货';
                      else return '空运';
                      break;
          }
      };
});