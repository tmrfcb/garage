'use strict'
app.controller('garageController', ['$scope' ,'$location','garageProvider','filterFilter','Flash' ,'message' , function($scope ,$location, garageProvider , filterFilter ,Flash ,message){
    $scope.query = {} ;
    $scope.currentPage = 1; //current page
    $scope.maxSize = 5; //pagination max size
    $scope.entryLimit = 5; //max rows for data table
    $scope.confirm = {};
    $scope.confirmLevel = {};
    $scope.vehicle = {};
    $scope.newLevel = {};
    $scope.getVehiclesList = function (next) {
        var initResult = garageProvider.getVehiclesList();
        initResult.success(function (response) {
            $scope.vehicles = response;
            $scope.filtredList = response;
            $scope.noOfPages = Math.ceil($scope.vehicles.length/$scope.entryLimit);
            next();
        }).error(function (response) {
            console.log('loading error getVehiclesList:' +response)
        });
    };
    $scope.getParkingData = function (next) {
        var initResult = garageProvider.getParkingData();
        initResult.success(function (response) {
            $scope.parking = response;
            $scope.buildSlotByLevel();
            next();
        }).error(function (response) {
            console.log('loading error getVehiclesList:' +response)
        });
    };


    $scope.vehiclesFiltredBy = function (filter , value){
        $scope.query = {};
        $scope.currentPage = 1 ;
        if(filter)
            $scope.query[filter] = value;
    };
    $scope.buildSlotByLevel = function() {
        $scope.slots = {};
        if($scope.parking)
            angular.forEach($scope.parking.levels, function(level){
                 var slots = [];
                for(var i =1 ; i<=level.nb_slot ; i++)
                    slots.push(i);
                $scope.slots[level.level] = slots ;
            })
    };

    $scope.setAvailability = function (){
        $scope.occupied = {};
        $scope.availableLevels = $scope.parking.levels ;
        angular.forEach($scope.parking.levels, function(level) {
            var list = _.filter($scope.vehicles, {level: level.level});
            $scope.occupied[level.level] = [];
            angular.forEach(list, function(item) {
                $scope.occupied[level.level].push(item.slot);
                $scope.slots[level.level] =  _.without( $scope.slots[level.level], item.slot);
            });
            if($scope.slots[level.level] === 0) {
                $scope.availableLevels = _.without($scope.availableLevels, _.findWhere($scope.availableLevels , {level : level.level}));
            }

        });
    };

    $scope.selectPage =function(page){
        $scope.currentPage = $scope.currentPage + page ;
    };
    $scope.$watch('query', function(term) {
        if($scope.vehicles) {
            $scope.filtredList = filterFilter($scope.vehicles, term);
            $scope.noOfPages = Math.ceil($scope.filtredList.length/$scope.entryLimit);
        }
    });

    $scope.addVehicle = function (){
        $scope.vehicles.push($scope.vehicle);
        Flash.create('success', message.successAddVehicle);
        $scope.filtredList =$scope.vehicles ;
        $scope.vehicle = {};
        $scope.setAvailability();

    };

    $scope.vehicleDelete = function(license) {
        $scope.vehicles = _.without($scope.vehicles , _.findWhere($scope.vehicles , {licensePlate : license}));
        $scope.filtredList =$scope.vehicles ;
        Flash.create('success', message.successDeleteVehicle);
        $scope.setAvailability();
    };
    $scope.addLevel = function() {
        var max = _.max(_.pluck($scope.parking.levels, "level")) ;
        var level = max+1 ;
        $scope.newLevel.level = level;
        $scope.newLevel.label ='Level '+level;
        $scope.newLevel.id =level;
        $scope.parking.levels.push($scope.newLevel);
        Flash.create('success', message.successAddLevel);
        $scope.newLevel = {};
        $scope.buildSlotByLevel();
        $scope.setAvailability();
    }
    $scope.levelDelete = function(level) {
        $scope.parking.levels = _.without($scope.parking.levels , _.findWhere($scope.parking.levels , {level : level}));
        Flash.create('success', message.successDeleteLevel);
        $scope.setAvailability();
    };


    $scope.isActive = function (route) {
        return route === $location.path()
    }

    async.parallel([
        function (next) {
            $scope.getVehiclesList(next);
        },
        function (next) {
            $scope.getParkingData(next);
        }
    ], function (next) {
        $scope.setAvailability();
    });

}])
