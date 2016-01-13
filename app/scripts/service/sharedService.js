'use strict';

/**
 * @ngdoc function
 * @name WPAPP.service:SharedServiceModule
 * @description 数据共享模块
 * # SharedServiceModule
 * SharedServiceModule of the WPAPP
 */

angular.module('SharedServiceModule', []).factory('sharedService', function($rootScope,$timeout,localStorageService) {
    var sharedService = {};
    var isSupported = localStorageService.isSupported && localStorageService.cookie.isSupported;
    //浏览器是否支持cookie
    sharedService.isSupported = function() {
        return localStorageService.isSupported && localStorageService.cookie.isSupported;
    };

    //set localStorage
    sharedService.setLocalStorage= function(key,value) {
        if (isSupported) {
            localStorageService.set(key,value);
        }
    };

    //get localStorage
    sharedService.getLocalStorage= function(key) {
        if (isSupported) {
            var result = localStorageService.get(key);
            if (!angular.equals(result,null)) {
                return result;
            }else{
                return null;
            }
        }
    };

    //remove localStorage
    sharedService.removeLocalStorage= function(key) {
        if (isSupported) {
            localStorageService.remove(key);
        }
    };

    //remove all localStorage
    sharedService.clearAllLocalStorage= function() {
        if (isSupported) {
            localStorageService.clearAll();
        }
    };

    //set user info
    sharedService.setCookie = function(key,value) {
        if (isSupported) {
                localStorageService.cookie.set(key,value);
        }
    };
    //return user info
    sharedService.getCookie = function(key) {
        if(isSupported) {
            var result = localStorageService.cookie.get(key);
            if (!angular.equals(result,null)) {
                return result;
            }else{
                return null;
            }
        }
    };

    sharedService.clearAllCookie = function() {
        if (isSupported) {
            localStorageService.cookie.clearAll();
        }
    };

    // receive share grid data request
    sharedService.shareData = function(action,data) {
        //broadcast data
        $rootScope.$broadcast('handleDataBroadcast',action,angular.copy(data));
    };

    sharedService.errorOcurs = function(error) {
      //The timer is setting for letting user can clicking the cancel button,
      //otherwise when user click the cancel button, the focusout event will trigger first,
      //the the error tip will come up and push the cancel button away
      $timeout(function(){
        $rootScope.$broadcast('handleErrorOcurs', error);
      }, 50);
    };
    sharedService.noError = function() {
      $timeout(function(){
        $rootScope.$broadcast('everyThingIsFine');
      }, 50);
    };
    return sharedService;
});
