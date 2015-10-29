angular.module('app', ['snap']).controller('loginController', function($scope, $http)
{
  /*
    // this method is currently not loading data from json correctly
    $http.get('users.json')
    .success(function (data){ $scope.users = data; })
    .error(function (data){ $scope.users = [{id:0, fName:'Error', lName:'Could not load data'}]; });
  */
  $scope.snapOpts = { disable: 'right' };
  $scope.username = '';
  $scope.passw1 = '';
  $scope.passw2 = '';
  $scope.email = '';
  $scope.number = '';
  $scope.vehicle = '';
  $scope.vcolor = '';

  $scope.displaySignUp = false;
  $scope.showRiderList = false;
  $scope.showMenu = true;
  $scope.error = false;
  $scope.incomplete = false;
  $scope.loggedIn = false;

  $scope.newUser = function(id)
  {
     if(id == 'signup') { $scope.displaySignUp = false; }
     else
     {
        $scope.displaySignUp = false;
        $scope.username = null;
        $scope.passw1 = null;
        $scope.passw2 = null;
        $scope.email = null;
        $scope.number = null;
        $scope.vehicle = null;
        $scope.vcolor = null;
     }
  };

  $scope.showRiders = function ()
  {
     $scope.showRiderList = true;
     $scope.showMenu = false;
  }
  $scope.displayMenu = function () { $scope.showMenu = true; }
  $scope.login = function()
  {
     $scope.loggedIn = true;
    //$scope.users.push({id:id_counter, fName:$scope.fName, lName:$scope.lName})
  };

  $scope.signup = function()
  {
    //$scope.users.push({id:id_counter, fName:$scope.fName, lName:$scope.lName})
  };

  $scope.$watch('passw1',function() {$scope.test();});
  $scope.$watch('passw2',function() {$scope.test();});
  $scope.$watch('username', function() {$scope.test();});
  $scope.$watch('email', function() {$scope.test();});
  $scope.$watch('number', function() {$scope.test();});
  $scope.$watch('vehicle', function() {$scope.test();});
  $scope.$watch('vcolor', function() {$scope.test();});

  $scope.test = function()
  {
    if ($scope.passw1 !== $scope.passw2) { $scope.error = true; } // if the passwords do not match, throw error
    else { $scope.error = false; } // no error

    $scope.incomplete = false;

    // if all fields are still empty
    if (!$scope.username.length || !$scope.passw1.length || !$scope.passw2.length
      || !$scope.email.length || !$scope.number.length || !$scope.vehicle.length
      || !$scope.vcolor.length)
    {
       $scope.incomplete = true;
    }
  };
});
