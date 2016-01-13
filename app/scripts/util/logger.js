'use strict';

/**
 * @ngdoc function
 * @name weipeiApp.logger:logger js
 * @description
 * # logger for develop
 * logger of the weipei
 */

angular.module('UtilityModule', []).factory('logger', function () {
    var logger = (function () {
        var logLevels = { '4': 'NONE', '3': 'ERROR', '2': 'WARN', '1': 'INFO', '0': 'DEBUG'};
        var logKey = 'WARN';
        var logLevel = 1;
        //Logging Utility
        var _log = function (message, level) {
             //return;
             if(typeof console === 'undefined'){
                    return;
             }
             if (level >= logLevel) {
                    console.log('[' + logLevels[level] + ']: ', message);
             }
             if (level === 2 || level === 3) {
                    //Note: Error or Warn, output call stack, only avail on WebKit/FireFox
                    var err = new Error();
                    if (err.stack) {
                        //Note: IE will be skipped.
                        var arr = err.stack.split('\n');
                        //Note: skip frame of logger self.
                        if (arr[0] === 'Error') {
                            //Note:Webkit
                            arr.splice(0, 3);
                        } else {
                            //Note:Mozilla
                            arr.splice(0, 2);
                        }
                        console.log('[stack]: ', arr.join('\n'));
                    }
             }
         };
        //Public Variables and Methods
        return {
            error: function (message) {
                _log(message, 3);
            },
            warn: function (message) {
                _log(message, 2);
            },
            info: function (message) {
                _log(message, 1);
            },
            debug: function (message) {
                _log(message, 0);
            },
            getLogLevel: function () {
                return logKey;
            },
            setLogLevel: function (inLogLevel) {
                for (var p in logLevels) {
                    if (logLevels[p] === inLogLevel) {
                        logKey = inLogLevel;
                        logLevel = p;
                        break;
                    }
                }
                if ((typeof console !== 'undefined') && console.log){
                    console.log('Set log info:  '+ inLogLevel);
                }
            }
        };
    })();
    return logger;
});