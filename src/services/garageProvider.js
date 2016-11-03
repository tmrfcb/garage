'use strict';
app.factory('garageProvider', function ($http) {
    var service = {};
    service.getVehiclesList = function () {
        var url = 'api/Vehicles.json';
        console.log(url);
        return $http.get(url);
    };
    service.getParkingData = function () {
        var url = 'api/parking.json';
        console.log(url);
        return $http.get(url);
    };
    return service ;
});