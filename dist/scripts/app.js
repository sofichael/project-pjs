"use strict";function launch($scope,dialogs,type,sharedService){switch(type){case"confirm":var dlg=dialogs.confirm();dlg.result.then(function(btn){$scope.confirmed='You confirmed "Yes."'},function(btn){$scope.confirmed='You confirmed "No."'});break;case"notify":var dlg=dialogs.create("../templates/notify.html","notifyCtrl",$scope.msg,{size:"sm",keyboard:!0,backdrop:!0,windowClass:""});break;case"login":var dlg=dialogs.create("../templates/login.html","loginCtrl",$scope.msg,{size:"sm",keyboard:!0,backdrop:!0,windowClass:""});break;case"allocateRole":var dlg=dialogs.create("../templates/allocateRole.html","allocateRoleCtrl",$scope.obj,{size:"sm",keyboard:!0,backdrop:!0,windowClass:""});dlg.result.then(function(val){},function(){});break;case"addItem":var dlg=dialogs.create("../templates/addItem.html","addCtrl",$scope.quote,{size:"lg",keyboard:!0,backdrop:!0,windowClass:""});dlg.result.then(function(val){sharedService.shareData("quote",val)},function(){angular.equals($scope.quote.price,0)&&($scope.quote.price=1)})}}function timer($scope,$interval){var time=$scope.countTime,timer=$interval(function(){0===$scope.countTime?($interval.cancel(timer),$scope.countTime=time,$scope.sendShow=!$scope.sendShow):$scope.countTime--},1e3)}function formatDate(date){function getStr(i){return 10>i?"0"+i:""+i}var dateStr=getStr(date.getFullYear())+"-"+getStr(1+date.getMonth())+"-"+getStr(date.getDate());return dateStr}function sortBy(field,reverse,primer){var key=primer?function(x){return primer(x[field])}:function(x){return x[field]};return reverse=[-1,1][+!!reverse],function(a,b){return a=key(a),b=key(b),reverse*((a>b)-(b>a))}}function blockUI(el,centerY){var el=jQuery(el);el.block({message:'<img src="./media/image/fancybox_loading.gif" align=""><p>加载中...</p>',centerY:void 0!==centerY?centerY:!0,css:{top:"10%",width:"70px",opacity:.7,border:"none",padding:"10px",backgroundColor:"#000"},overlayCSS:{backgroundColor:"#000",opacity:.5,cursor:"wait"}})}function ajaxBlockUI(el,msg,centerY){var el=jQuery(el),msg=msg||"查询中...";el.block({message:'<img src="./media/image/fancybox_loading.gif" align=""><p>'+msg+"</p>",centerY:void 0!==centerY?centerY:!0,css:{width:"20%",marginTop:"100px",opacity:.7,border:"none",paddingTop:"10px",backgroundColor:"#000"},overlayCSS:{backgroundColor:"#000",opacity:0,cursor:"wait"}})}function unblockUI(el){jQuery(el).unblock({onUnblock:function(){jQuery(el).removeAttr("style")}})}var app=angular.module("WPAPP",["ui.bootstrap","ngRoute","DataServiceModule","LocalStorageModule","SharedServiceModule","dialogs.main","UserValidation","UtilityModule","CustomFilter"]).config(function($routeProvider){$routeProvider.when("/",{templateUrl:"views/inquire.html",controller:"InquireCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/finish",{templateUrl:"views/finish.html",controller:"FinishCtrl"}).when("/inquireDetail",{templateUrl:"views/inquireDetail.html",controller:"InquireDetailCtrl"}).when("/inquire",{templateUrl:"views/inquire.html",controller:"InquireCtrl"}).when("/profile",{templateUrl:"views/profile.html",controller:"ProfileCtrl"}).otherwise({redirectTo:"/"})}).config(function(localStorageServiceProvider){localStorageServiceProvider.setStorageCookieDomain(angular.equals(window.location.hostname,"localhost")||window.location.hostname.indexOf("local")>0||window.location.hostname.indexOf("192.168")>0?"":window.location.host.match(//)?"PRO":"DEV"),localStorageServiceProvider.setPrefix("WP").setStorageType("localStorage").setStorageCookie(30,"/").setNotify(!0,!0)}).service("Configuration",function(){return this.API=window.location.host.match(//)?{BASE_URL:"http://"}:{BASE_URL:"http://"}}).config(function($httpProvider){$httpProvider.defaults.transformRequest=function(obj){return JSON.stringify(obj)},$httpProvider.defaults.headers.post={"Content-Type":"application/x-www-form-urlencoded"}}).filter("orderObjectBy",function(){return function(items,field,reverse){var filtered=[];return angular.forEach(items,function(item){filtered.push(item)}),filtered.sort(function(a,b){return angular.equals(typeof a[field],"string")?parseInt(a[field])>parseInt(b[field])?1:-1:angular.equals(a[field],"string")?a[field]>b[field]?1:-1:a[field]>b[field]?1:-1}),reverse&&filtered.reverse(),filtered}}).run(function($http,sharedService){$http.defaults.headers.common.Authorization=sharedService.getCookie("token")});app.controller("FinishCtrl",function($scope,dialogs,sharedService,AdminService,logger,$window){ajaxBlockUI(angular.element(".page-container .container-fluid")),angular.element(".blockUI.blockMsg.blockElement").css({left:"40%",top:"10%"}),$scope.limit=50,$scope.offset=0,AdminService.accessoryShopPurchaseOrderLists($scope,$scope.accessToken,3,$scope.limit,$scope.offset,function(result){0!==result.purchase_order_list.length?($scope.orders=result.purchase_order_list,$scope.orderTabOn=0,$scope.purchaseOrder=result.purchase_order_list[0],$scope.accessoryItems=result.purchase_order_list[0].purchase_order_accessories[0].accessory_items):($scope.msg=result.error_msg||"暂无维修厂确认的采购单！",launch($scope,dialogs,"notify")),unblockUI(angular.element(".page-container .container-fluid"))}),$scope.orderTab=function(index){$scope.quotationSheetOn=0,$scope.orderTabOn=index,$scope.purchaseOrder=$scope.orders[index],$scope.accessoryItems=$scope.orders[index].purchase_order_accessories[0].accessory_items},$scope.quotationSheetOn=0,$scope.quotationSheetItemTab=function(index){$scope.quotationSheetOn=index,$scope.accessoryItems=$scope.orders[$scope.orderTabOn].purchase_order_accessories[index].accessory_items},$scope.itemOn=0,$scope.itemOnTab=function(index){$scope.itemOn=index}}),app.controller("IndexCtrl",function($scope,AdminService,sharedService,dialogs,$window,logger){sharedService.isSupported||($scope.msg="该浏览器不支持，请尝试使用其它浏览器访问系统！",launch($scope,dialogs,"notify")),!sharedService.getCookie("lock")==!1&&(window.location.href="lock.html"),$scope.$on("handleErrorOcurs",function(scope,result){if(601===result.error_code){var inputObj={refresh_token:sharedService.getCookie("account").refresh_token};AdminService.tokenLogin($scope,inputObj,function(result){sharedService.setCookie("accessToken",result.access_token),sharedService.setCookie("accessTokenExpireTime",result.exipiry_time)})}else 600===result.error_code?(unblockUI(angular.element(".page-container .container-fluid")),$scope.msg=result.error_msg||"报价失败",launch($scope,dialogs,"notify")):603===result.error_code||401===result.error_code?($scope.msg=result.error_msg||"登录未授权，请重新登录！",launch($scope,dialogs,"login")):($scope.msg="object"==typeof result?result.error_msg||"发生异常，请联系管理员":result||"发生异常，请联系管理员",launch($scope,dialogs,"notify"));unblockUI(angular.element(".page-container .container-fluid"))});var remember=sharedService.getCookie("remember"),accessTokenExpireTime=1e3*sharedService.getCookie("accessTokenExpireTime")>(new Date).getTime();if(!accessTokenExpireTime&&remember){logger.info("access_token过期记住密码");var inputObj={refresh_token:sharedService.getCookie("account").refresh_token};AdminService.tokenLogin($scope,inputObj,function(result){logger.info(JSON.stringify(result)),sharedService.setCookie("accessToken",result.access_token),sharedService.setCookie("accessTokenExpireTime",result.exipiry_time)})}else accessTokenExpireTime||remember||(logger.info("access_token过期未记住密码"),logger.info(accessTokenExpireTime),$scope.msg="登录已失效，请重新登录",launch($scope,dialogs,"login"),sharedService.clearAllCookie(),$window.location.href="/login.html");null===sharedService.getCookie("accountExtra")||void 0===sharedService.getCookie("accountExtra")?($scope.obj={inviteCode:"",btn:!0},launch($scope,dialogs,"allocateRole",sharedService)):($scope.accessToken=sharedService.getCookie("accessToken"),$scope.accountExtra=sharedService.getCookie("accountExtra"),$scope.account=sharedService.getCookie("account")),$scope.$on("handleDataBroadcast",function(scope,action,result){"inquire"===action&&($scope.page=result.page,$scope.pageTitle=result.pageTitle,$scope.pageBURL=result.pageBURL,$scope.pageBtitle=result.pageBtitle,$scope.pageSubtitle=result.pageSubtitle),"inquirePre"===action&&($scope.page=result.page,$scope.pageTitle=result.pageTitle,$scope.pageBURL=result.pageBURL,$scope.pageBtitle=result.pageBtitle,$scope.pageSubtitle=result.pageSubtitle)}),$scope.accountExtra=sharedService.getCookie("accountExtra"),$scope.pageSwitch=function(val){switch($scope.page=val,val){case"index":$scope.pageTitle=null!==$scope.accountExtra?$scope.accountExtra.name+"数据中心":"配件商数据中心",$scope.pageBURL="#/",$scope.pageBtitle="首页",$scope.pageSubtitle="数据中心";break;case"inquire":$scope.pageTitle="维修厂询价通知中心",$scope.pageBURL="#/inquire",$scope.pageBtitle="询价",$scope.pageSubtitle="询价列表";break;case"pending":$scope.pageTitle=$scope.accountExtra.name+"报价订单",$scope.pageBURL="#/pending",$scope.pageBtitle="交易订单",$scope.pageSubtitle="我的报价订单";break;case"finish":$scope.pageTitle=$scope.accountExtra.name+"成交采购单",$scope.pageBURL="#/finish",$scope.pageBtitle="交易采购单",$scope.pageSubtitle="我的成交采购单";break;case"profile":$scope.pageTitle="配件商个人中心",$scope.pageBURL="/",$scope.pageBtitle="个人信息",$scope.pageSubtitle=""}},$scope.pageSwitch("inquire"),$scope.prePage=function(){if("询价详情"===$scope.pageSubtitle){var val={page:"inquire",pageTitle:"维修厂询价通知中心",pageBURL:"#/inquire",pageBtitle:"询价",pageSubtitle:"询价列表"};sharedService.shareData("inquirePre",val),$window.location.href="#/inquire"}},$scope.loginout=function(){sharedService.clearAllCookie(),$window.location.href="/login.html"},$scope.lock=function(){sharedService.setCookie("lock",!0),$window.location.href="/lock.html"}}).controller("allocateRoleCtrl",function($scope,AdminService,sharedService,dialogs,logger,$window,$modalInstance,data){$scope.obj=data,$scope.$watch("obj.inviteCode",function(nval){$scope.obj.btn=6===nval.length?!1:!0}),$scope.validate=function(){var inputObj={access_token:sharedService.getCookie("accessToken"),invite_code:$scope.obj.inviteCode};AdminService.inviteCode($scope,inputObj,function(result){sharedService.setCookie("accessToken",result.access_token),sharedService.setCookie("accessTokenExpireTime",result.exipiry_time),sharedService.setCookie("account",result),void 0!==result.account_extra&&(sharedService.setCookie("accountExtra",!0),$window.location.reload()),$modalInstance.close()})}}).controller("notifyCtrl",function($scope,sharedService,dialogs,logger,$modalInstance,$window,data){$scope.msg=data,$scope.ok=function(){$modalInstance.dismiss("Canceled")}}).controller("loginCtrl",function($scope,sharedService,dialogs,logger,$modalInstance,$window,data){$scope.msg=data,$scope.ok=function(){sharedService.clearAllCookie(),$window.location.href="login.html"}}),app.controller("InquireCtrl",function($scope,AdminService,dialogs,sharedService,logger,$window){ajaxBlockUI(angular.element(".page-container .container-fluid")),angular.element(".blockUI.blockMsg.blockElement").css({left:"40%",top:"10%"}),$scope.records=[{id:5,name:"5条"},{id:10,name:"10条"},{id:20,name:"20条"},{id:50,name:"50条"}],$scope.record=$scope.records[0],$scope.limit=$scope.records[0].id,$scope.pages=[],$scope.currentPage=1,$scope.offset=0,$scope.handlePages=function(currentPage,totalPage){if($scope.pages.length=0,$scope.prevBtn=1===currentPage?!0:!1,$scope.nextBtn=currentPage===totalPage?!0:!1,5>=totalPage)for(var i=1;totalPage>=i;i++)$scope.pages.push(i);else currentPage>3?totalPage-2>=currentPage?$scope.pages=[currentPage-2,currentPage-1,currentPage,currentPage+1,currentPage+2]:totalPage-1>=currentPage?$scope.pages=[currentPage-3,currentPage-2,currentPage-1,currentPage,currentPage+1]:currentPage===totalPage&&($scope.pages=[currentPage-4,currentPage-3,currentPage-2,currentPage-1,currentPage]):3>=currentPage&&($scope.pages=[1,2,3,4,5])},void 0!==$scope.accessToken&&AdminService.accessoryShopQuotationSheetLists($scope,$scope.accessToken,$scope.limit,$scope.offset,!1,function(result){null===result.quotation_sheet_lists||0===result.quotation_sheet_lists.length?($scope.msg=result.error_msg||"暂无维修厂询价！",launch($scope,dialogs,"notify")):($scope.handlePages(1,Math.ceil(result.total/$scope.limit)),$scope.quotationSheetLists=result,angular.element("#inquireTable").removeClass("hidden")),unblockUI(angular.element(".page-container .container-fluid"))}),$scope.showRecord=function(record){$scope.limit=record,$scope.offset=0,ajaxBlockUI(angular.element(".page-container .container-fluid")),AdminService.accessoryShopQuotationSheetLists($scope,$scope.accessToken,$scope.limit,$scope.offset,!1,function(result){$scope.handlePages(1,Math.ceil(result.total/record)),$scope.quotationSheetLists=result,unblockUI(angular.element(".page-container .container-fluid"))})},$scope.changePage=function(page){$scope.currentPage=page,$scope.offset=(page-1)*$scope.limit,ajaxBlockUI(angular.element(".page-container .container-fluid")),AdminService.accessoryShopQuotationSheetLists($scope,$scope.accessToken,$scope.limit,$scope.offset,!1,function(result){$scope.quotationSheetLists=result,$scope.handlePages($scope.currentPage,Math.ceil(result.total/$scope.limit)),unblockUI(angular.element(".page-container .container-fluid"))})},$scope.prev=function(page){$scope.currentPage=page-1,$scope.offset=(page-2)*$scope.limit,ajaxBlockUI(angular.element(".page-container .container-fluid")),AdminService.accessoryShopQuotationSheetLists($scope,$scope.accessToken,$scope.limit,$scope.offset,!1,function(result){$scope.quotationSheetLists=result,$scope.handlePages($scope.currentPage,Math.ceil(result.total/$scope.limit)),unblockUI(angular.element(".page-container .container-fluid"))})},$scope.next=function(page){$scope.currentPage=page+1,$scope.offset=page*$scope.limit,ajaxBlockUI(angular.element(".page-container .container-fluid")),AdminService.accessoryShopQuotationSheetLists($scope,$scope.accessToken,$scope.limit,$scope.offset,!1,function(result){$scope.quotationSheetLists=result,$scope.handlePages($scope.currentPage,Math.ceil(result.total/$scope.limit)),unblockUI(angular.element(".page-container .container-fluid"))})},$scope.sort=function(column,reverse){$scope.column=column,$scope.reverse="undefined"===$scope.reverse?!0:!$scope.reverse,$scope.quotationSheetLists.quotation_sheet_lists.sort(sortBy(column,$scope.reverse,function(a){return parseInt(a)}))},$scope.reload=function(){ajaxBlockUI(angular.element(".page-container .container-fluid")),AdminService.accessoryShopQuotationSheetLists($scope,$scope.accessToken,$scope.limit,$scope.offset,!0,function(result){$scope.quotationSheetLists=result,$scope.handlePages($scope.currentPage,Math.ceil(result.total/$scope.limit)),unblockUI(angular.element(".page-container .container-fluid"))})},$scope.inquireDetail=function(inquirySheetId,quotationSheetId){sharedService.setCookie("inquirySheetId",inquirySheetId),sharedService.setCookie("quotationSheetId",quotationSheetId),$window.location.href="#/inquireDetail"}}),app.controller("InquireDetailCtrl",function($scope,logger,AdminService,sharedService,$window,dialogs){function assembleQuotationSheet(){for(var createQuotationSheet={access_token:$scope.accessToken,inquiry_sheet_id:$scope.inquirySheet.inquiry_sheet_id,quotation_sheet_items:[]},i=$scope.inquirySheetAccessoires.length-1;i>=0;i--){var quotationSheetItems={inquiry_sheet_accessory_item_id:$scope.inquirySheetAccessoires[i].inquiry_sheet_accessory_item_id,inquiry_sheet_accessory_items:$scope.inquirySheetAccessoires[i].quotation_sheet_items};createQuotationSheet.quotation_sheet_items.push(quotationSheetItems)}return createQuotationSheet}ajaxBlockUI(angular.element(".page-container .container-fluid")),angular.element(".blockUI.blockMsg.blockElement").css({left:"40%",top:"10%"}),$scope.inquirySheetId=sharedService.getCookie("inquirySheetId"),AdminService.accessoryShopQuotationSheetDetail($scope,$scope.accessToken,$scope.inquirySheetId,function(result){if($scope.motorRepairShop=result.motor_repair_shop,$scope.inquirySheet=result.inquiry_sheet,$scope.inquirySheetAccessoires=result.inquiry_sheet_accessoires,result.current_accessory_shop_is_quoted===!1)$scope.actionBtn="保存报价",$scope.actionMethod="POST";else{for(var i=0;i<$scope.inquirySheetAccessoires.length;i++)if("undefined"!=typeof $scope.inquirySheetAccessoires[i].quotation_sheet_items){$scope.accessoryItemOn=i,$scope.inquirySheetAccessoires[i].quotationSheetOn=$scope.inquirySheetAccessoires[i].quotation_sheet_items.length-1;break}$scope.actionBtn="更新报价",$scope.actionMethod="PUT"}var val={page:"inquire",pageTitle:$scope.motorRepairShop.motor_repair_shop_name+"询价详情",pageBURL:"#/inquire",pageBtitle:"询价",pageSubtitle:"询价详情"};sharedService.shareData("inquire",val),unblockUI(angular.element(".page-container .container-fluid")),angular.element(".blog-page").removeClass("hidden")}),$scope.accessoirySwitch=function(index){$scope.accessoryItemOn=index,"undefined"!=typeof $scope.inquirySheetAccessoires[index].quotation_sheet_items&&($scope.inquirySheetAccessoires[index].quotationSheetOn=$scope.inquirySheetAccessoires[index].quotation_sheet_items.length-1)};var isAddQuotation=!1;$scope.addQuotation=function(accessoryItemId){for(var i=$scope.inquirySheetAccessoires.length-1;i>=0;i--)if($scope.inquirySheetAccessoires[i].accessory_item_id===accessoryItemId){void 0===$scope.inquirySheetAccessoires[i].quotation_sheet_items&&($scope.inquirySheetAccessoires[i].quotation_sheet_items=[]);var accessoryItem={price:0,accessory_level:1,accessory_quality_gurantee_period:1,accessory_arrival:1,accessory_brand:"",accessory_unit:"",notes:""};$scope.inquirySheetAccessoires[i].quotation_sheet_items.push(accessoryItem),isAddQuotation=!0,$scope.inquirySheetAccessoires[i].quotationSheetOn=$scope.inquirySheetAccessoires[i].quotation_sheet_items.length-1;break}},$scope.delQutation=function(parentIndex,index){$scope.inquirySheetAccessoires[parentIndex].quotation_sheet_items.splice(index,1),$scope.inquirySheetAccessoires[parentIndex].quotationSheetOn=$scope.inquirySheetAccessoires[parentIndex].quotation_sheet_items.length-1},$scope.quotationSheetItemTab=function(accessoryItemId,index){for(var i=$scope.inquirySheetAccessoires.length-1;i>=0;i--)if($scope.inquirySheetAccessoires[i].accessory_item_id===accessoryItemId){$scope.inquirySheetAccessoires[i].quotationSheetOn=index;break}$scope.quotationSheetItemOn=index},$scope.optionSwitch=function(type,parentIndex,index,id){switch(type){case"level":$scope.inquirySheetAccessoires[parentIndex].quotation_sheet_items[index].accessory_level=id;break;case"quality":$scope.inquirySheetAccessoires[parentIndex].quotation_sheet_items[index].accessory_quality_gurantee_period=id;break;case"arrival":$scope.inquirySheetAccessoires[parentIndex].quotation_sheet_items[index].accessory_arrival=id}},$scope.$watch("inquirySheetAccessoires",function(nval,oval){nval!==oval&&void 0!==oval&&(isAddQuotation=!0)},!0),$scope.SaveOrmodifyQutation=function(method){var qutationPirce=!0;if(angular.element('input[type="number"]').each(function(index,el){/^[1-9][0-9]+$/.test(angular.element(el).val())||($scope.msg="报价价格不正确",launch($scope,dialogs,"notify"),qutationPirce=!1)}),qutationPirce&&!isAddQuotation&&"POST"===$scope.actionMethod)$scope.msg="请先添加报价单",launch($scope,dialogs,"notify");else if(qutationPirce&&!isAddQuotation&&"PUT"===$scope.actionMethod)$scope.msg="请先修改你的报价单",launch($scope,dialogs,"notify");else if(qutationPirce){ajaxBlockUI(angular.element(".page-container .container-fluid"),"保存中...");var quotationSheetObj=assembleQuotationSheet();quotationSheetObj.quotation_sheet_id="PUT"===method?sharedService.getCookie("quotationSheetId"):"",AdminService.accessoryShopQuotationSheet($scope,quotationSheetObj,method,function(result){unblockUI(angular.element(".page-container .container-fluid")),"POST"===method?($scope.inquirySheetAccessoires=result.inquiry_sheet_accessoires,$scope.inquirySheetAccessoires[0].quotationSheetOn=$scope.inquirySheetAccessoires[0].quotation_sheet_items.length-1,$scope.msg="保存报价成功",$scope.actionBtn="更新报价",$scope.actionMethod="PUT"):$scope.msg="修改报价成功",launch($scope,dialogs,"notify")})}}}),app.controller("MainCtrl",function($scope,localStorageService,sharedService,$window,dialogs,logger){blockUI(angular.element("body")),setTimeout(function(){unblockUI(angular.element("body"))},1e3)}),app.controller("PendingCtrl",function($scope,dialogs,AdminService,sharedService,logger){$scope.limit=10,$scope.offset=0,$scope.column="",$scope.sort=function(column,reverse){$scope.column=column,$scope.reverse="undefined"===$scope.reverse?!0:!$scope.reverse,$scope.inquires.sort(sortBy(column,$scope.reverse,function(a){return parseInt(a)}))}}),app.controller("ProfileCtrl",function($scope,AdminService,sharedService,$window,logger,dialogs){$scope.tab="account",$scope.switchTab=function(tab){$scope.tab=tab},$scope.tabAccount="info",$scope.switchTabAccount=function(tab){$scope.tabAccount=tab},$scope.tabHelp="about",$scope.switchTabHelp=function(tab){$scope.tabHelp=tab},$scope.collapse1="item_1_1",$scope.switchCollapse1=function(tab){$scope.collapse1=tab},$scope.collapse2="item_2_1",$scope.switchCollapse2=function(tab){$scope.collapse2=tab},$scope.changeName=!0,$scope.$watch("account.realname",function(nval,oval){void 0!==oval&&nval!==oval&&($scope.changeName=!1)}),$scope.modifyRealName=function(){var object={realname:$scope.account.realname,access_token:sharedService.getCookie("accessToken")};AdminService.realName($scope,object,function(result){1===result.status&&($scope.msg="修改成功",launch($scope,dialogs,"notify"),sharedService.setCookie("account",result),$scope.changeName=!0)})},$scope.originalPassword="",$scope.original=!1,$scope.$watch("originalPassword",function(nval){nval.length>=6&&($scope.original=!0)}),$scope.password="",$scope.password1=!1,$scope.$watch("password",function(nval){nval.length>=6&&($scope.password1=!0)}),$scope.changePwd=!0,$scope.rePassword="",$scope.rePassword1=!1,$scope.$watch("rePassword",function(nval){nval===$scope.password&&nval.length>=6?($scope.rePassword1=!0,$scope.changePwd=!1):($scope.rePassword1=!1,$scope.changePwd=!0)}),$scope.changePassword=function(){var object={access_token:sharedService.getCookie("accessToken"),origin_password:$scope.originalPassword,password:$scope.rePassword};AdminService.accountPassword($scope,object,function(result){1===result.status&&($scope.msg="修改成功",launch($scope,dialogs,"notify"),$scope.changePwd=!0)})}}),angular.module("CustomFilter",[]).filter("formatTime",function(){return function(myDate){var d,days,hours,minutes,myTime=new Date(myDate).getTime()/1e3,timeNow=parseInt((new Date).getTime()/1e3);return d=timeNow-myTime,days=parseInt(d/86400),hours=parseInt(d/3600),minutes=parseInt(d/60),days>0&&4>days?days+"天前":0>=days&&hours>0?hours+"小时前":0>=hours&&minutes>0?minutes+"分钟前":d>0&&60>=d?d+"秒前":myDate}}).filter("accessory",function(){return function(val,option){switch(option){case"level":return 1===val?"原厂件":2===val?"品牌件":"拆车件";case"quality":return 1===val?"无质保":"一个月";case"arrival":return 1===val?"现货":"空运"}}}),angular.module("UserValidation",[]).directive("validPhone",function(){return{require:"ngModel",link:function(scope,elm,attrs,ctrl){ctrl.$parsers.unshift(function(viewValue){var isBlank=""===viewValue,invalidChars=!isBlank&&!/^[0-9]+$/.test(viewValue),invalidLen=!isBlank&&!invalidChars&&11!==viewValue.length;ctrl.$setValidity("isBlank",!isBlank),ctrl.$setValidity("invalidChars",!invalidChars),ctrl.$setValidity("invalidLen",!invalidLen),scope.phoneGood=!isBlank&&!invalidChars&&!invalidLen,scope.phoneNumber=viewValue})}}}).directive("validAuth",function(){return{require:"ngModel",link:function(scope,elm,attrs,ctrl){ctrl.$parsers.unshift(function(viewValue){var isBlank=""===viewValue,invalidChars=!isBlank&&!/^[0-9]+$/.test(viewValue),invalidLen=!isBlank&&!invalidChars&&4!==viewValue.length;ctrl.$setValidity("isBlank",!isBlank),ctrl.$setValidity("invalidChars",!invalidChars),ctrl.$setValidity("invalidLen",!invalidLen),scope.authCode=!isBlank&&!invalidChars&&!invalidLen,scope.authNumber=viewValue,scope.authLength=viewValue.length,scope.authChars=!invalidChars})}}}).directive("validName",function(){return{require:"ngModel",link:function(scope,elm,attrs,ctrl){ctrl.$parsers.unshift(function(viewValue){var isBlank=""===viewValue;ctrl.$setValidity("isBlank",!isBlank),scope.nameGood=!isBlank,scope.userName=viewValue})}}}).directive("validPassword",function(){return{require:"ngModel",link:function(scope,elm,attrs,ctrl){ctrl.$parsers.unshift(function(viewValue){var isBlank=""===viewValue,invalidLen=!isBlank&&(viewValue.length<6||viewValue.length>20);ctrl.$setValidity("isBlank",!isBlank),ctrl.$setValidity("invalidLen",!invalidLen),scope.passwordLength=viewValue.length,scope.passwordGood=!isBlank&&!invalidLen,scope.userPassword=viewValue})}}}).directive("validPasswordC",function(){return{require:"ngModel",link:function(scope,elm,attrs,ctrl){ctrl.$parsers.unshift(function(viewValue){var isBlank=""===viewValue,noMatch=viewValue!==scope.myform.password.$viewValue;ctrl.$setValidity("isBlank",!isBlank),ctrl.$setValidity("noMatch",!noMatch),scope.passwordCGood=!isBlank&&!noMatch})}}}),angular.module("UtilityModule",[]).factory("logger",function(){var logger=function(){var logLevels={4:"NONE",3:"ERROR",2:"WARN",1:"INFO",0:"DEBUG"},logKey="WARN",logLevel=1,_log=function(message,level){if("undefined"!=typeof console&&(level>=logLevel&&console.log("["+logLevels[level]+"]: ",message),2===level||3===level)){var err=new Error;if(err.stack){var arr=err.stack.split("\n");"Error"===arr[0]?arr.splice(0,3):arr.splice(0,2),console.log("[stack]: ",arr.join("\n"))}}};return{error:function(message){_log(message,3)},warn:function(message){_log(message,2)},info:function(message){_log(message,1)},debug:function(message){_log(message,0)},getLogLevel:function(){return logKey},setLogLevel:function(inLogLevel){for(var p in logLevels)if(logLevels[p]===inLogLevel){logKey=inLogLevel,logLevel=p;break}"undefined"!=typeof console&&console.log&&console.log("Set log info:  "+inLogLevel)}}}();return logger}),angular.module("DataServiceModule",[]).factory("AdminService",function($http,$window,Configuration,sharedService,logger){function handleError(error,operation){var msg=operation+(error?JSON.stringify(error):"");logger.error(msg)}var REST_BASE_URL=Configuration.BASE_URL,URL_POST_TOKEN=REST_BASE_URL+"token",URL_GET_ACCOUNT_INFORMATION=REST_BASE_URL+"account_information",URL_PUT_ACCOUNT_PASSWORD=REST_BASE_URL+"account_password",URL_GET_ACCESSORY_SHOP_INFOMATION=REST_BASE_URL+"accessory-shop/infomation",URL_POST_ACCESSORY_SHOP_QUOTATION_SHEET=REST_BASE_URL+"accessory-shop/quotation-sheet",URL_GET_ACCESSORY_SHOP_QUOTATION_SHEET_LISTS=REST_BASE_URL+"accessory-shop/quotation-sheet-lists",URL_POST_TOKEN_LOGIN=REST_BASE_URL+"token_login",URL_GET_ACCESSORY_SHOP_QUOTATION_SHEET_DETAIL=REST_BASE_URL+"accessory-shop/quotation-sheet-detail",URL_GET_ACCESSORY_SHOP_PURCHASE_ORDER_LISTS=REST_BASE_URL+"accessory-shop/purchase-order-lists",URL_PUT_INVITE_CODE=REST_BASE_URL+"invitation/code",URL_PUT_REAL_NAME=REST_BASE_URL+"realname",URL_GET_ACCESSORY_ATTRIBUTES=REST_BASE_URL+"accessories/attributes",URL_GET_ACCESSORY_SHOP_PURCHASE_ORDER_DETAIL=REST_BASE_URL+"accessory-shop/purchase-order-detail",service={token:function(scope,inputObj,callback){logger.info('Executing token() from "AdminService".'),inputObj?this.httpPost(scope,URL_POST_TOKEN,inputObj,function(result){return logger.info("token() call successful."),callback(result.data),result.data},"API身份认证（Token）请求异常，请联系管理员!"):sharedService.errorOcurs("API身份验证 参数错误！")},accountInformation:function(scope,accessToken,callback){logger.info('Executing accountInformation() from "AdminService".'),accessToken?this.httpGet(scope,URL_GET_ACCOUNT_INFORMATION+"?access_token="+accessToken,function(result){return logger.info("accountInformation() call successful."),callback(result.data),result.data},"获取账户基本信息请求异常，请联系管理员!"):sharedService.errorOcurs("获取账户基本信息 参数错误！")},accountPassword:function(scope,inputObj,callback){logger.info('Executing accountPassword() from "AdminService".'),inputObj?this.httpPut(scope,URL_PUT_ACCOUNT_PASSWORD,inputObj,function(result){return logger.info("accountPassword() call successful."),callback(result.data),result.data},"修改密码请求异常，请联系管理员!"):sharedService.errorOcurs("修改密码 参数错误！")},accessoryShopInfomation:function(scope,accessoryShopId,callback){logger.info('Executing accessoryShop() from "AdminService".'),accessoryShopId?this.httpGet(scope,URL_GET_ACCESSORY_SHOP_INFOMATION+"?accessory_shop_id="+accessoryShopId,function(result){return logger.info("accessoryShop() call successful."),callback(result.data),result.data},"获取配件商基础信息请求异常，请联系管理员!"):sharedService.errorOcurs("获取配件商基础信息 参数错误！")},accessoryShopQuotationSheet:function(scope,inputObj,method,callback){logger.info('Executing accessoryShopQuotationSheet() from "AdminService"'),inputObj?"POST"===method?this.httpPost(scope,URL_POST_ACCESSORY_SHOP_QUOTATION_SHEET,inputObj,function(result){return logger.info("accessoryShopQuotationSheet() call successful."),callback(result.data),result.data},"配件商创建报价单请求异常，请联系管理员!"):this.httpPut(scope,URL_POST_ACCESSORY_SHOP_QUOTATION_SHEET,inputObj,function(result){return logger.info("accessoryShopQuotationSheet() call successful."),callback(result.data),result.data},"配件商创建报价单请求异常，请联系管理员!"):sharedService.errorOcurs("配件商创建报价单 参数错误！")},accessoryShopQuotationSheetLists:function(scope,accessToken,limit,offset,reload,callback){logger.info('Executing accessoryShopQuotationSheetLists() from "AdminService".'),accessToken&&limit?this.httpGet(scope,URL_GET_ACCESSORY_SHOP_QUOTATION_SHEET_LISTS+"?access_token="+accessToken+"&limit="+limit+"&offset="+offset,function(result){return logger.info("accessoryShopQuotationSheetLists() call successful."),callback(result.data),result.data},"获取配件商报价列表请求异常，请联系管理员!"):sharedService.errorOcurs("配件商报价列表 参数错误！")},tokenLogin:function(scope,inputObj,callback){logger.info('Executing tokenLogin() from "AdminService"'),inputObj?this.httpPost(scope,URL_POST_TOKEN_LOGIN,inputObj,function(result){return logger.info("tokenLogin() call successful."),callback(result.data),result.data},"TOKEN免密码登陆请求异常，请联系管理员!"):sharedService.errorOcurs("TOKEN免密码登陆 参数错误！")},accessoryShopQuotationSheetDetail:function(scope,accessToken,inquirySheetId,callback){logger.info('Executing accessoryShopQuotationSheetDetail() from "AdminService".'),accessToken&&inquirySheetId?this.httpGet(scope,URL_GET_ACCESSORY_SHOP_QUOTATION_SHEET_DETAIL+"?access_token="+accessToken+"&inquiry_sheet_id="+inquirySheetId,function(result){return logger.info("accessoryShopQuotationSheetDetail() call successful."),callback(result.data),result.data},"配件商报价单详情请求异常，请联系管理员!"):sharedService.errorOcurs("配件商报价单详情 参数错误！")},accessoryShopPurchaseOrderLists:function(scope,accessToken,status,limit,offset,callback){logger.info('Executing accessoryShopPurchaseOrderLists() from "AdminService".'),accessToken&&status?this.httpGet(scope,URL_GET_ACCESSORY_SHOP_PURCHASE_ORDER_LISTS+"?access_token="+accessToken+"&status="+status+"&limit="+limit+"&offset="+offset,function(result){return logger.info("accessoryShopPurchaseOrderLists() call successful."),callback(result.data),result.data},"配件商采购单列表请求异常，请联系管理员!"):sharedService.errorOcurs("配件商采购单列表 参数错误！")},inviteCode:function(scope,inputObj,callback){logger.info('Executing inviteCode() from "AdminService".'),inputObj?this.httpPut(scope,URL_PUT_INVITE_CODE,inputObj,function(result){return logger.info("inviteCode() call successful."),callback(result.data),result.data},"使用邀请码请求异常，请联系管理员!"):sharedService.errorOcurs("使用邀请码 参数错误！")},realName:function(scope,inputObj,callback){logger.info('Executing realName() from "AdminService".'),inputObj?this.httpPut(scope,URL_PUT_REAL_NAME,inputObj,function(result){return logger.info("realName() call successful."),callback(result.data),result.data},"修改用户姓名请求异常，请联系管理员!"):sharedService.errorOcurs("修改用户姓名参数错误！")},accessoryShopPurchaseOrderDetail:function(scope,accessToken,orderId,callback){logger.info('Executing accessoryShopPurchaseOrderDetail() from "AdminService".'),accessToken&&orderId?this.httpGet(scope,URL_GET_ACCESSORY_SHOP_PURCHASE_ORDER_DETAIL+"?access_token="+accessToken+"&order_id="+orderId,function(result){
return logger.info("accessoryShopPurchaseOrderDetail() call successful."),callback(result.data),result.data},"配件商采购单详情请求异常，请联系管理员!"):sharedService.errorOcurs("配件商采购单详情 参数错误！")},accessoryAttributes:function(scope,accessToken,callback){logger.info('Executing accessoryAttributes() from "AdminService".'),accessToken?this.httpGet(scope,URL_GET_ACCESSORY_ATTRIBUTES+"?access_token="+accessToken,function(result){return logger.info("accessoryAttributes() call successful."),callback(result.data),result.data},"配件属性接口请求异常，请联系管理员!"):sharedService.errorOcurs("配件属性接口 参数错误！")},httpGet:function(scope,url,cb,errMsg){return url+=url.indexOf("?")>0?"&time="+(new Date).valueOf():"?time="+(new Date).valueOf(),scope.myPromise=$http.get(url).then(function(result){angular.equals(result.data.status,1)?cb(result):sharedService.errorOcurs(result.data)},function(error){errMsg=errMsg||"HttpGet Exception",handleError(error,errMsg),sharedService.errorOcurs(errMsg)})},httpPost:function(scope,url,inputObj,cb,errMsg){return scope.myPromise=$http.post(url,inputObj).then(function(result){angular.equals(result.data.status,1)?cb(result):sharedService.errorOcurs(result.data)},function(error){errMsg=errMsg||"HtpPost Exception",handleError(error,errMsg),sharedService.errorOcurs(errMsg)})},httpPut:function(scope,url,inputObj,cb,errMsg){return scope.myPromise=$http.put(url,inputObj).then(function(result){angular.equals(result.data.status,1)?cb(result):sharedService.errorOcurs(result.data)},function(error){errMsg=errMsg||"HtpPut Exception",handleError(error,errMsg),sharedService.errorOcurs(errMsg)})}};return service}),angular.module("SharedServiceModule",[]).factory("sharedService",function($rootScope,$timeout,localStorageService){var sharedService={},isSupported=localStorageService.isSupported&&localStorageService.cookie.isSupported;return sharedService.isSupported=function(){return localStorageService.isSupported&&localStorageService.cookie.isSupported},sharedService.setLocalStorage=function(key,value){isSupported&&localStorageService.set(key,value)},sharedService.getLocalStorage=function(key){if(isSupported){var result=localStorageService.get(key);return angular.equals(result,null)?null:result}},sharedService.removeLocalStorage=function(key){isSupported&&localStorageService.remove(key)},sharedService.clearAllLocalStorage=function(){isSupported&&localStorageService.clearAll()},sharedService.setCookie=function(key,value){isSupported&&localStorageService.cookie.set(key,value)},sharedService.getCookie=function(key){if(isSupported){var result=localStorageService.cookie.get(key);return angular.equals(result,null)?null:result}},sharedService.clearAllCookie=function(){isSupported&&localStorageService.cookie.clearAll()},sharedService.shareData=function(action,data){$rootScope.$broadcast("handleDataBroadcast",action,angular.copy(data))},sharedService.errorOcurs=function(error){$timeout(function(){$rootScope.$broadcast("handleErrorOcurs",error)},50)},sharedService.noError=function(){$timeout(function(){$rootScope.$broadcast("everyThingIsFine")},50)},sharedService});
