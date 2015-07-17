'use strict';

/**
 * @ngdoc function
 * @name WPAPP.uiService
 * @description UI模块
 * uiService of the WPAPP
 */

// angular.module('CHBV2APP').value('cgBusyDefaults',{
//   message:'加载中...',
//   backdrop: true,
//   //templateUrl: '../../template/loadingTemplate.html',
//   delay: 300,
//   minDuration: 700,
//   wrapperClass: 'my-class'
// });

angular.module('UserValidation', [])
.directive('validPhone', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                // Any way to read the results of a "required" angular validator here?
                var isBlank = viewValue === '';
                var invalidChars = !isBlank && !/^[0-9]+$/.test(viewValue);
                var invalidLen = !isBlank && !invalidChars && (viewValue.length !== 11);
                ctrl.$setValidity('isBlank', !isBlank);
                ctrl.$setValidity('invalidChars', !invalidChars);
                ctrl.$setValidity('invalidLen', !invalidLen);
                scope.phoneGood = !isBlank && !invalidChars && !invalidLen;
                scope.phoneNumber = viewValue;

            });
        }
    };
}).directive('validAuth', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                // Any way to read the results of a "required" angular validator here?
                var isBlank = viewValue === '';
                var invalidChars = !isBlank && !/^[0-9]+$/.test(viewValue);
                var invalidLen = !isBlank && !invalidChars && (viewValue.length !== 4);
                ctrl.$setValidity('isBlank', !isBlank);
                ctrl.$setValidity('invalidChars', !invalidChars);
                ctrl.$setValidity('invalidLen', !invalidLen);
                scope.authCode = !isBlank && !invalidChars && !invalidLen;
                scope.authNumber = viewValue;
                scope.authLength = viewValue.length;
                scope.authChars = !invalidChars;

            });
        }
    };
}).directive('validName', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                // Any way to read the results of a "required" angular validator here?
                var isBlank = viewValue === '';
                //var invalidChars = !isBlank && !/^[A-z0-9]+$/.test(viewValue)
                //var invalidLen = !isBlank && !invalidChars && (viewValue.length < 5 || viewValue.length > 20)
                ctrl.$setValidity('isBlank', !isBlank);
                //ctrl.$setValidity('invalidChars', !invalidChars)
                //ctrl.$setValidity('invalidLen', !invalidLen)
                scope.nameGood = !isBlank;//&& !invalidChars && !invalidLen
                scope.userName = viewValue;
            });
        }
    };
}).directive('validPassword', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                var isBlank = viewValue === '';
                var invalidLen = !isBlank && (viewValue.length < 6 || viewValue.length > 20);
                //var isWeak = !isBlank && !invalidLen && !/(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z])/.test(viewValue)
                ctrl.$setValidity('isBlank', !isBlank);
                ctrl.$setValidity('invalidLen', !invalidLen);
                //ctrl.$setValidity('isWeak', !isWeak)
                scope.passwordLength = viewValue.length;
                scope.passwordGood = !isBlank && !invalidLen;//&&!isWeak
                scope.userPassword = viewValue;

            });
        }
    };
}).directive('validPasswordC', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                var isBlank = viewValue === '';
                var noMatch = viewValue !== scope.myform.password.$viewValue;
                ctrl.$setValidity('isBlank', !isBlank);
                ctrl.$setValidity('noMatch', !noMatch);
                scope.passwordCGood = !isBlank && !noMatch;
            });
        }
    };
});

// Reddit constructor function to encapsulate HTTP and pagination logic
// app.factory('Reddit', function($http) {
//          var Reddit = function(scope,AdminService) {
//                    this.scope = scope;
//                    this.service = AdminService;
//                    this.items = [];
//                    this.busy = false;
//                    this.over = true;
//                    this.limit = 10;
//                    this.offset = 0;
//                    this.count = 0;
//           };

//          Reddit.prototype.nextPage = function() {
//                    if (this.busy) return;
//                    this.busy = true;
//                    this.service.getServiceList(this.scope,this.scope.userCarModel.auto_model_id,this.scope.service_type_id,this.scope.localCity.city_id,this.limit,this.offset,function(result){
//                             if (result.length > 0) {
//                                    for (var i = 0; i < result.length; i++) {
//                                         this.items.push(result[i]);
//                                     }
//                                      this.count++;
//                                      this.offset = this.limit*this.count;
//                                      this.busy = false;
//                             }else{
//                                     this.over = false;
//                                     return;
//                             };
//                    }.bind(this));
//          };
//           return Reddit;
// });