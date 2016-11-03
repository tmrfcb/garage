'use strict'
app.controller('itemIndex', ['$scope','itemProvider', function($scope ){

}])
.controller('itemCreate', ['$scope','itemProvider', function($scope, itemProvider){
        $scope.items = itemProvider.getItems();
        $scope.createItem = function () {
            itemProvider.createItem();
        }
}])
.controller('itemEdit', ['$scope','itemProvider', function($scope){

}])
.controller('itemList', ['$scope','itemProvider', function($scope, itemProvider){
        $scope.items = itemProvider.getItems();
        $scope.removeItem = function (item) {
            itemProvider.removeItem(item);
        }

}]);