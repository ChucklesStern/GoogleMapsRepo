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
var stateRef = new Firebase("https://statenames.firebaseio.com/");

 
NgMap.getMap().then(function(map) {
    vm.map = map;
   console.log('markers', vm.map.markers);


var locationList;



vm.stateQuery = $firebaseArray(stateRef);
vm.stateOption;
vm.chosenState;

vm.selectState = function(state){
vm.chosenState = state;
};

console.log(vm.chosenState);



vm.lookState = function(urState){
  console.log(urState);
  console.log("lookState executed!");
  var stateObj = urState;
  var fullObj;
  console.log("stateObj");
  console.log(stateObj);
  for (var i = 0; i < vm.stateQuery.length; i++){
  if(stateObj == vm.stateQuery[i].abbreviatedName){
   fullObj = vm.stateQuery[i].fullName;
   console.log(fullObj);
  }
}
  vm.fireUpLocation(fullObj, stateObj);

}

vm.fireUpLocation = function(fullObj, stateObj) {

var addPop = function(syncObject,locationArray){
  console.log(locationArray[0]._id);
  console.log(syncObject[0].zip);
  console.log("AddPop Fired!");
for (var i = 0; i < syncObject.length; i++){
  for (var j = 0; j < locationArray.length; j++) {
    if( syncObject[i].zip == locationArray[j]._id){
  syncObject[i].pop = locationArray[j].pop
  console.log("Match! Pop should be amended");
  console.log(syncObject[i]);
  console.log(locationArray[j]);
  } 
    }
  }
  console.log("Zips Added");
  console.log(syncObject);
    console.log(locationArray);
}


var getLocation = function(stateObj) {
  console.log("stateObj");
  console.log(stateObj);
var query = zipRef.orderByChild("state").equalTo(stateObj);
$scope.locationArray = [];
$scope.locationArray2 = $firebaseArray(query);
$scope.locationArray = $scope.locationArray2;
console.log("locationArray");
console.log($scope.locationArray);
 $scope.locationArray2.$loaded.then(function(){
console.log($scope.locationArray[0]);
});
console.log($scope.locationArray.length);
addPop(vm.syncObject,$scope.locationArray);
}

console.log("fullObj");
console.log(fullObj);
console.log(vm.usaOverlay);
console.log($scope.locationArray);

var preSyncObject = ref.orderByChild("state").equalTo(fullObj);
vm.syncObject = [];
vm.syncObject2 = $firebaseArray(preSyncObject);
vm.syncObject = vm.syncObject2;
console.log("vm.syncObject");
console.log(vm.syncObject);

getLocation(stateObj);
vm.syncObject.$loaded.then(function(){
  $scope.locationArray.$loaded.then(function(){
addPop(vm.syncObject,$scope.locationArray);
});
});
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
  vm.map.data.overrideStyle(event.feature,{'isColorful': false})
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

  console.log("full Obj");
  console.log(fullObj);




vm.popSelectorArray = [20000, 30000, 40000, 50000];
vm.optionA;
vm.testArray = [];




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

};


//Need to fix this function as well as map update/ 4/28 
vm.selectPop = function(option) {
  vm.testArray = [];

  console.log("selected Pop");
  console.log(option);
  console.log("testArray");
  console.log(vm.testArray);
  console.log("syncObject before");
  console.log(vm.syncObject.length);
for (var i = 0; i < vm.syncObject.length; i++) {
//  var item = vm.syncObject[i];
  if(vm.syncObject[i].pop < option) {
    vm.syncObject.splice(i,1);
    console.log(vm.syncObject[i]);
//   vm.testArray.push(vm.syncObject[i]);
  }

}
console.log("syncObject After");
 console.log(vm.syncObject.length);
google.maps.event.trigger(vm.map,'resize');
}


var unattached = function() {
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

};


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
};



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