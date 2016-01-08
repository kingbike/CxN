(function() {
  'use strict';
/**
 * @ngdoc function
 * @name hosen.controller:peripheralCtrl
 * @description
 * # peripheralCtrl
 * Controller of the hosen
 */
angular.module('hosen')
  .controller('peripheralCtrl', ['$scope','$rootScope', '$location', '$anchorScroll', '$http', 'AuthenticationService' , '$window',
  function ($scope, $rootScope , $location, $anchorScroll, $http, AuthenticationService, $window) {
    
    $scope.navbar = {
      title: "CxN Boutique",
      peripheral : '最新商品',
      groupBuying : '會員團購專區',
      signIn : '登入',
      registerTitle : '加入會員' 
    };
    
    $scope.product = {
      pricing : "CxN Boutique",
      name : '最新商品',
      short_description  : '會員團購專區',
      rating_count  : '登入' 
    };
    
    var vm = this;
  
    vm.IsClothes = true;
    vm.IsShoes = false;
   
    $rootScope.$watch('globals', function(newVal, oldVal) {
            vm.IsLogin = ($rootScope.globals.currentUser);
            if(vm.IsLogin) {
                $scope.navbar.IsLogin = true;
                $scope.navbar.signIn = '登出' ;
                $scope.navbar.username = $rootScope.globals.currentUser.username;
            } else {
               $scope.navbar.signIn = '登入' ;
               $scope.navbar.IsLogin = false;
            }
    }, true); 

    $scope.signInOut = function() {
       if(!vm.IsLogin){
          $location.url('/signin');
       }
       else{
          AuthenticationService.ClearCredentials();
          $http({
                //url: 'http://cxn.com.tw:8888/api/logout',
                url: 'http://122.116.108.112:8888/api/logout',
                method: "POST",
                withCredentials: true,
                headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                }
          }).success(function (response) {   
              console.log('response = ' + response) ;
               //vm.clothesItems = response;
          }).error(function(error) {
              console.log('Error: ' + error);
          });
       }
    };
    
    $scope.gotoRegister = function() {
       $location.url('/register');
    };
    
    
    $scope.gotoGroupBuying = function() {
        if(vm.IsLogin){
          $location.url('/groupbuying');
        } else {
          setTimeout(function() {
            $window.alert('請先登入!');
          });
          $location.url('/signin');
        }
    };

    $scope.setCategory = function(value) {
 
      if(value === 'clothes'){
        vm.IsClothes = true;
        vm.IsShoes = false;
        vm.IsAccessory = false;
        
        $http({
                //url: 'http://cxn.com.tw:8888/api/getClothesProducts',
                url: 'http://122.116.108.112:8888/api/getClothesProducts',
                
                method: "GET",
                withCredentials: true,
                headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                }
          }).success(function (response) {   
              
               vm.clothesItems = response;
          }).error(function(error) {
              
          });
          
      }else if(value === 'shoes'){
         vm.IsClothes = false;
         vm.IsShoes = true;
         vm.IsAccessory = false;
         
         $http({
                //url: 'http://cxn.com.tw:8888/api/getShoesProducts',
                url: 'http://122.116.108.112:8888/api/getShoesProducts',
                method: "GET",
                withCredentials: true,
                headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                }
          }).success(function (response) {   
              
               vm.shoesItems = response;
          }).error(function(error) {
              
          });
          
      }else if(value === 'accessory'){
         vm.IsClothes = false;
         vm.IsShoes = false;
         vm.IsAccessory = true;

         
         $http({
                //url: 'http://cxn.com.tw:8888/api/getAccessoryProducts',
                url: 'http://122.116.108.112:8888/api/getAccessoryProducts',
                method: "GET",
                withCredentials: true,
                headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                }
          }).success(function (response) {   
               vm.accessoryItems = response;
          }).error(function(error) {
              
              vm.accessoryItems = []; 
          });
                
      }
       
    };
    
    var picIndex = 0;
    vm.imageUrl = '';
    vm.enlargeImageUrlPics = [] ; 
    $scope.enlargeImageUrl = function(url, id, long_description, name) {
       vm.imageUrl = url;
       vm.enlargeImageUrlPic = url.slice(0, url.indexOf(','));
       
       //vm.enlargeImageUrlPics = url;
       
       vm.name = name;
       vm.long_description = long_description;
       //$rootScope.imageId_reviewNum = $rootScope.imageId + 1 ;
       picIndex = 0 ;
        
       $http({
                url: 'http://122.116.108.112:8888/api/itemReview',
                method: "POST",
                withCredentials: true,
                headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                },
                params: {
                  'id' : id
            }
        }).success(function (response) {   
              //vm.accessoryItems = response;
        }).error(function(error) {
            
        });
    };
    
    $scope.redirectProduct = function(id) {
        //$location.url('http://122.116.108.112:8888/api/productDetail?id=1');
        //$location.hash('/id');
        $http({
                url: 'http://122.116.108.112:8888/api/productDetail',
                method: "GET",
                withCredentials: true,
                headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                },
                params: {
                  'id' : id
            }
        }).success(function (response) {   
              //$location.url('/id');
        }).error(function(error) {
            
        });
    };
    
    $scope.changeModalPic = function() {
      //console.log('click!');
       var vStr = vm.imageUrl.split(',');
       vm.enlargeImageUrlPic = vStr[(picIndex + 1)% vStr.length] ; 
       picIndex = picIndex + 1;    
    };
    
  }]);
})();
