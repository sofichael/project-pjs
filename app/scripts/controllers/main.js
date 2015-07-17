'use strict';

/**
 * @ngdoc function
 * @name WPAPP.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the WPAPP
 */
app.controller('MainCtrl', function ($scope,localStorageService,sharedService,$window,dialogs,logger) {

      // $window.location.href = '#/inquire';
      blockUI(angular.element('body'));
      setTimeout(function() {
          unblockUI(angular.element('body'));
      }, 1000);

  });