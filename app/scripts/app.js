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

// var myApp = angular.module('myApp', ['ngMap']);

 var scopeApp = angular.module('scopeApp', ['firebase', 'ngMap']);

/* var fireApp = angular.module('fireApp', ['firebase']);
fireApp.controller('dbController', function($scope, $firebaseObject) {
  var ref = new Firebase("https://popping-inferno-8627.firebaseio.com/data");
var syncObject = $firebaseObject(ref);
syncObject.$bindTo($scope,"data");
}); */

scopeApp.controller('scopeController', ['$scope', '$firebaseArray', '$firebaseObject' , 'NgMap' , function ($scope, $firebaseArray,$firebaseObject, NgMap) {
 var vm = this;   
var ref = new Firebase("https://popping-inferno-8627.firebaseio.com/");
var zipRef = new Firebase("https://uszipcodes.firebaseio.com/");

 
NgMap.getMap().then(function(map) {
    vm.map = map;
   console.log('markers', vm.map.markers);


var locationList;




var query = zipRef.orderByChild("state").equalTo("AZ");


$scope.locationArray = $firebaseArray(query);


console.log(vm.usaOverlay);
console.log($scope.locationArray);

vm.syncObject = $firebaseArray(ref);




vm.styleFunction = function(feature){
  var color = 'gray';
  if(feature.getProperty('isColorful')) {
    color = feature.getProperty('color');
  }
  return({
    fillColor: color,
    strokeColor: color,
    strokeWeight: 2,
  });
}

 vm.onClick= function(event) {
    event.feature.setProperty('isColorful', true);
  };

vm.onMouseover = function(event) {
  vm.map.data.revertStyle();
  vm.map.data.overrideStyle(event.feature, {strokeWeight: 8});
}

vm.onMouseout = function(event){
  vm.map.data.revertStyle();
}; 





vm.Test = "Test"



var GeoMap = "/images/gz_2010_us_050_00_500k.kml"
var file = "https://dl.dropboxusercontent.com/s/qa36ucvhcia6wmp/pin.png";

console.log(file);

var index = document.getElementById("$index");
console.log(index);

vm.customMarker = file;
vm.coolMap = GeoMap;


vm.syncObject.$loaded().then(function(){
 console.log(vm.syncObject.length); 
 console.log(vm.syncObject.$id);



vm.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyCqRfEpYBjnbhPJ9Bz5lD32LI5gJU0dlLc";

var pointArray = [];

var sampleShops;
sampleShops = $scope.sampleShops;

$scope.limit = 20;
$scope.searchStates = '';
 $scope.totalItems = vm.syncObject.length;
 $scope.PaginatedList = [];
 $scope.currentPage = 1;
$scope.maxSize = 5;



 $scope.$watch('currentPage + numPerPage', function() {
    var begin = (($scope.currentPage - 1) * $scope.limit)
    , end = begin + $scope.limit;
    
    $scope.PaginatedList = vm.syncObject.slice(begin, end);
  });




vm.showData = function(id){
 for (var i = 0; i < vm.syncObject.length; i++){
  if (this.id == vm.syncObject[i].$id){
    alert(vm.syncObject[i].name + ", " + vm.syncObject[i].Mobile + ", " + vm.syncObject[i].city);
  console.log(vm.syncObject[i]);
  console.log("Id's synced!");
  } else{
    console.log("Id's not synced")
    console.log(this.id);
    console.log(vm.syncObject[i].$id);
  } 
}
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

if(shops[recordKey].address === ""){
  shops[recordKey].address = "Delivery Only"
}

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
  console.log(vm.syncObject[0].$id);
  console.log(latLongArray);
  console.log(markerArray)  

 });

});
  }]);
var app =
angular
  .module('newMapsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
 //   'angular-bootstrap',
    'scopeApp'
 //   'myApp'
    
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