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

scopeApp.controller('scopeController', ['$scope', '$firebaseArray', '$firebaseObject', 'NgMap', '$timeout', function($scope, $firebaseArray, $firebaseObject, NgMap, $timeout, $uibModal) {
    var vm = this;
    var ref = new Firebase("https://popping-inferno-8627.firebaseio.com/");
    var zipRef = new Firebase("https://uszipcodes.firebaseio.com/");
    var stateRef = new Firebase("https://statenames.firebaseio.com/");


    NgMap.getMap().then(function(map) {
        vm.map = map;

        console.log('markers', vm.map.markers);


    });
        var locationList;



        vm.stateQuery = $firebaseArray(stateRef);
        vm.stateOption;
        vm.chosenState;
        var syncObject = [];

        vm.selectState = function(state) {
            vm.chosenState = state;
            console.log(vm.chosenState);
        };

        



        vm.lookState = function(urState) {
           
        

            console.log(urState);
            console.log("lookState executed!");
            var stateObj = urState;
            var fullObj;
            console.log("stateObj");
            console.log(stateObj);

            for (var i = 0; i < vm.stateQuery.length; i++) {
                if (stateObj == vm.stateQuery[i].abbreviatedName) {
                    fullObj = vm.stateQuery[i].fullName;
                    console.log(fullObj);
                }
            }
            vm.fireUpLocation(fullObj, stateObj);

        }

        vm.fireUpLocation = function(fullObj, stateObj) {




            var addPop = function(syncObject, locationArray) {
                console.log("AddPop Fired!");
                console.log(syncObject);
                for (var i = 0; i < syncObject.length; i++) {
                    for (var j = 0; j < locationArray.length; j++) {
                        if (syncObject[i].zip == locationArray[j]._id) {
                            syncObject[i].pop = locationArray[j].pop
                            console.log("Match! Pop should be amended");
                            console.log(syncObject[i]);
                        }
                    }
                }
                console.log("Zips Added");
                console.log(syncObject);
                console.log(locationArray);


                assignMapCoords(syncObject);
            }


            var getLocation = function(stateObj) {
                console.log("stateObj");
                console.log(stateObj);
                var query = zipRef.orderByChild("state").equalTo(stateObj);

                $scope.locationArray2 = $firebaseArray(query);
                var locationArray = [];
                var matchA = false;
                var matchB = false;
                console.log("locationArray");
                console.log($scope.locationArray2);

                $scope.locationArray2.$loaded().then(function() {

                    for (var object in $scope.locationArray2) {
                        if ($scope.locationArray2[object].$id)
                        //console.log($scope.locationArray2[object]);
                            locationArray.push($scope.locationArray2[object]);
                    }
                    console.log(locationArray.length);
                    matchA = true;
                })
                console.log("fullObj");
                console.log(fullObj);

                var preSyncObject = ref.orderByChild("state").equalTo(fullObj);

                
                vm.syncObject2 = $firebaseArray(preSyncObject);

                vm.syncObject2.$loaded().then(function() {

                    for (var object in vm.syncObject2) {
                        if (vm.syncObject2[object].$id)
                            syncObject.push(vm.syncObject2[object]);
                    }
                    console.log("vm.syncObject");
                    console.log(syncObject);
                    matchB = true;
                })
              

            }
            getLocation(stateObj);

            $scope.locationArray2.$loaded().then(function(syncObject, locationArray) {
                return $timeout(function(syncObject, locationArray) {
                  var syncObject = [];
                  var locationArray = [];
                 
                    for (var object in vm.syncObject2) {
                        if (vm.syncObject2[object].$id)
                            syncObject.push(vm.syncObject2[object]);
                    }
                    for (var object in $scope.locationArray2) {
                        if ($scope.locationArray2[object].$id)
                        //console.log($scope.locationArray2[object]);
                            locationArray.push($scope.locationArray2[object]);
                    }
                      console.log(locationArray);
                console.log(syncObject);
                    addPop(syncObject, locationArray)
                }, 3000);
            })
        }
        vm.styleFunction = function(feature) {
            var color = 'gray';
            if (feature.getProperty('isColorful')) {
                color = feature.getProperty('color');
            }
            return ({
                fillColor: color,
                strokeColor: color,
                strokeWeight: 2,
            });
        }

        vm.onClick = function(event) {
            event.feature.setProperty('isColorful', true);

        };

        vm.onMouseover = function(event) {
            vm.map.data.revertStyle();
            vm.map.data.overrideStyle(event.feature, { strokeWeight: 8 });
           vm.map.data.overrideStyle(event.feature, { 'isColorful': false })
        }

        vm.onMouseout = function(event) {
            vm.map.data.revertStyle();
        };





        vm.Test = "Test"



        var GeoMap = "/images/gz_2010_us_050_00_500k.kml"
        var file = "https://dl.dropboxusercontent.com/s/qa36ucvhcia6wmp/pin.png";

        console.log(file);

        var index = document.getElementById("$id");
        console.log(index);

        vm.customMarker = file;
        vm.coolMap = GeoMap;






        vm.popSelectorArray = [20000, 30000, 40000, 50000];
        vm.optionA;
        vm.testArray = [];


        var assignMapCoords = function(syncObject) {
          
     var markerArray = [];
            var latLongArray = [];
            $scope.markerArray = markerArray;
            var shops;
            console.log("syncObject")
            console.log(syncObject);
            shops = syncObject;

            for (var i = 0; i < shops.length; i++) {

                markerArray.push([shops[i]["lat"], shops[i]["long"]]);

            }

            for (var i = 0; i < shops.length; i++) {

            //    var recordKey = shops.$keyAt(shops[i]);
            //    var recordActual = shops.$getRecord(recordKey);
                shops[i].latLongArray = markerArray[i];

        //        if (shops[recordKey].address === "") {
          //          shops[recordKey].address = "Delivery Only"
         //       }

                if (shops[i].address === "") {
                    shops[i].address = "Delivery Only"
                }

              //  shops.$save(recordKey).then(function(ref) {
                //        ref.key() === shops[recordKey].$id;
                  //  })
                    //recordActual.$save({latLongArray: markerArray[i]}).then(function(ref){

                //  shops.$indexFor(id); // returns location in the array
            }
            // shops[i].latLongArray = markerArray[i];
            console.log("shops");
            console.log(shops);
            console.log(shops[0]);
            vm.mapInfo = [];
            var markerArray2 = [];
            var markerCluster;
            for (var shop in shops){
                vm.mapInfo.push(shops[shop]);
                var latlng = new google.maps.LatLng(shops[shop].latLongArray[0], shops[shop].latLongArray[1])
                    var marker = new Marker({
    position: latlng,
    map: vm.map,
    title: shops[shop].name,
    animation: google.maps.Animation.DROP,
    icon: {
            path: SQUARE_PIN,
        fillColor: '#00CCBB',
        fillOpacity: 1,
        strokeColor: '',
        strokeWeight: 0

    },
    map_icon_label: '<span class="map-icon map-icon-convenience-store"></span>'
  });
                    markerArray2.push(marker);
                    
            }
              if (markerCluster != null) {
                console.log(markerCluster);
              markerCluster = new MarkerClusterer(vm.map, null)
            } else {
                google.maps.event.trigger(vm.map, 'resize');
                for (var shops in markerArray2){
                    marker.setMap(null);
                    vm.map.marker = null;
                }
                markerCluster = new MarkerClusterer(vm.map, markerArray2);
            }
          //  var markerCluster = new MarkerClusterer(vm.map, markerArray2)
             console.log(vm.mapInfo);
            console.log(vm.mapInfo[0]);
            $scope.markerArray = markerArray;
            
         
      

            var unattached = function() {
                vm.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCqRfEpYBjnbhPJ9Bz5lD32LI5gJU0dlLc";

                var pointArray = [];

                var sampleShops;
                sampleShops = $scope.sampleShops;

                $scope.limit = 20;
                $scope.searchStates = '';
                $scope.totalItems = syncObject.length;
                $scope.PaginatedList = [];
                $scope.currentPage = 1;
                $scope.maxSize = 5;



                $scope.$watch('currentPage + numPerPage', function() {
                    var begin = (($scope.currentPage - 1) * $scope.limit),
                        end = begin + $scope.limit;

                    $scope.PaginatedList = syncObject.splice(begin, end);
                });

            };
            unattached();
      
        };

        //Need to fix this function as well as map update/ 4/28 
        vm.selectPop = function(option) {
            vm.mapInfo = $scope.PaginatedList;
            vm.testArray = [];
            console.log("selected Pop");
            console.log(option);
            console.log("testArray");
            console.log(vm.testArray);
            console.log("mapInfo before");
            console.log(vm.mapInfo.length);
            for (var store in vm.mapInfo) {
                //  var item = vm.syncObject[i];
                if (vm.mapInfo[store].pop >= option) {
                   vm.testArray.push(vm.mapInfo[store]);
                   console.log(vm.mapInfo[store]);
                    //   vm.testArray.push(vm.syncObject[i]);
                }

            }
            vm.mapInfo = [];
            for(var store in vm.testArray){
                vm.mapInfo.push(vm.testArray[store]);
            }
            console.log("syncObject After");
            console.log(syncObject.length);
            console.log("vm.mapInfo After");
            console.log(vm.mapInfo);
            console.log(vm.mapInfo.length);


        }





        vm.showData = function(p) {
            console.log(p);
    



     
            for (var i = 0; i < vm.mapInfo.length; i++) {
                if (this.id == vm.mapInfo[i].$id) {
                   // alert(vm.mapInfo[i].name + ", " + vm.mapInfo[i].Mobile + ", " + vm.mapInfo[i].city);
                    var p = vm.mapInfo[i];
                    console.log(p);
                    console.log("Id's synced!");
                    var latlng = new google.maps.LatLng(p.latLongArray[0], p.latLongArray[1])
                    console.log("latlong")
                    console.log(latlng);
                   
                        vm.map.panTo(latlng);
   var infowindow = new google.maps.InfoWindow({})     
        infowindow.setContent(p.name, p.address, p.city, p.state);
        infowindow.open(vm.map,marker)
    
                } else {
                    console.log("Id's not synced")
                    console.log(this.id);
                    console.log(vm.mapInfo[i].$id);
                }
            }

        };
//put vm.map }); here

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
    .config(function($routeProvider) {
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
