'use strict';

/**
 * @ngdoc overview
 * @name newMapsApp
 * @description
 * # newMapsApp
 *
 * Main module of the application.
 */
var vm = this;

 var myApp = angular.module('myApp', ['ngMap']);

 var scopeApp = angular.module('scopeApp', ['firebase']);

/* var fireApp = angular.module('fireApp', ['firebase']);

fireApp.controller('dbController', function($scope, $firebaseObject) {
  var ref = new Firebase("https://popping-inferno-8627.firebaseio.com/data");

var syncObject = $firebaseObject(ref);

syncObject.$bindTo($scope,"data");


}); */

scopeApp.controller('scopeController', ['$scope', '$firebaseArray', function ($scope, $firebaseArray) {
    
var ref = new Firebase("https://popping-inferno-8627.firebaseio.com/");
var vm = this;
vm.syncObject = $firebaseArray(ref);

vm.syncObject.$loaded().then(function(){
 console.log(vm.syncObject.length); 




    $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyCqRfEpYBjnbhPJ9Bz5lD32LI5gJU0dlLc";

var pointArray = [];

var sampleShops;
sampleShops = $scope.sampleShops;


vm.showData = function(){
  alert(vm.syncObject);
  console.log(vm.syncObject);
}

var markerArray =[];
var latLongArray = [];
$scope.markerArray = markerArray;
var shops;
shops = vm.syncObject;

for (var i = 0; i < shops.length; i++){

  markerArray.push([shops[i]["lat"],shops[i]["long"]]);

  }

for (var i = 0; i < shops.length; i++){

var recordKey = shops.$keyAt(shops[i]);
var recordActual = shops.$getRecord(recordKey);
shops[recordKey].latLongArray = markerArray[i];

shops.$save(recordKey).then(function(ref){
  ref.key() === shops[recordKey].$id;
})
//recordActual.$save({latLongArray: markerArray[i]}).then(function(ref){

//  shops.$indexFor(id); // returns location in the array
}
   // shops[i].latLongArray = markerArray[i];

$scope.markerArray = markerArray;

console.log($scope.googleMapsUrl);
 console.log(vm.syncObject);
  console.log(latLongArray);
  console.log(markerArray)  

});
  }]);

angular
  .module('newMapsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'scopeApp',
    'myApp'
    
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

 
