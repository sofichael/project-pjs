'use strict';

/**
 * @ngdoc weipeiApp web app v1.0.0
 * @description chb web app v1.0.0
 * # sofichael@126.com add 2015/4/27
 *
 * Main module of the application.
 */

//NOTE: This should be the first function executed.
var app = angular.module('WPAPP', [
    'ui.bootstrap',
    'ngRoute',
    'DataServiceModule',
    'LocalStorageModule',
    'SharedServiceModule',
    'dialogs.main',
    'UserValidation',
    'UtilityModule',
    'CustomFilter'
    ]).config(function ($routeProvider) {
        $routeProvider
        // .when('/', { templateUrl: 'views/main.html', controller: 'MainCtrl'})
        .when('/', { templateUrl: 'views/inquire.html', controller: 'InquireCtrl'})
        .when('/about', { templateUrl: 'views/about.html', controller: 'AboutCtrl'})
        .when('/finish', { templateUrl: 'views/finish.html', controller: 'FinishCtrl'})
        .when('/inquireDetail', { templateUrl: 'views/inquireDetail.html', controller: 'InquireDetailCtrl'})
        .when('/inquire', { templateUrl: 'views/inquire.html', controller: 'InquireCtrl'})
        .when('/profile', { templateUrl: 'views/profile.html', controller: 'ProfileCtrl'})
        .otherwise({ redirectTo: '/'});
}).config(function(localStorageServiceProvider) {
        if (angular.equals(window.location.hostname,'localhost') || window.location.hostname.indexOf('local') > 0 || window.location.hostname.indexOf('192.168') > 0) {
            localStorageServiceProvider.setStorageCookieDomain('');
        }else if (window.location.host.match(/pjs\.weipei\.cc/)) {
            localStorageServiceProvider.setStorageCookieDomain('PRO');
        }else{
            localStorageServiceProvider.setStorageCookieDomain('DEV');
        }
        localStorageServiceProvider
        .setPrefix('WP')
        .setStorageType('localStorage')
        .setStorageCookie(30, '/')
        .setNotify(true, true);
}).service('Configuration', function() {
        if (window.location.host.match(/pjs\.weipei\.cc/)){
            return this.API = { BASE_URL:'http://'};
        } else{
            return this.API = { BASE_URL:'http://'};
        }
}).config(function ($httpProvider) {
        $httpProvider.defaults.transformRequest = function(obj){
             return JSON.stringify(obj);
         };
        $httpProvider.defaults.headers.post = {
            'Content-Type': 'application/x-www-form-urlencoded'
         };
}).filter('orderObjectBy', function() {
        return function(items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function(item) {
                filtered.push(item);
            });
            filtered.sort(function (a, b) {
                if (angular.equals(typeof(a[field]),'string'))  return (parseInt(a[field]) > parseInt(b[field]) ? 1 : -1);
                else if (angular.equals(a[field],'string'))  return (a[field] > b[field] ? 1 : -1);
                else return (a[field] > b[field] ? 1 : -1);
            });
            if(reverse) filtered.reverse();
            return filtered;
        };
}).run(function($http,sharedService) {
        $http.defaults.headers.common.Authorization = sharedService.getCookie('token');
});
