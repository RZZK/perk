angular.module('app', []).controller('loginController', function($scope, $http)
{
  /*
    // this method is currently not loading data from json correctly
    $http.get('users.json')
    .success(function (data){ $scope.users = data; })
    .error(function (data){ $scope.users = [{id:0, fName:'Error', lName:'Could not load data'}]; });
  */

  $scope.displaySignUp = false;
  $scope.error = false;
  $scope.incomplete = false;

  $scope.newUser = function(id)
  {
     if(id == 'signup') { $scope.displaySignUp = true; }
     else { $scope.displaySignUp = false; }
  };

  $scope.login = function()
  {
    id_counter += 1;
    $scope.users.push({id:id_counter, fName:$scope.fName, lName:$scope.lName})

  };

  $scope.$watch('passw1',function() {$scope.test();});
  $scope.$watch('passw2',function() {$scope.test();});
  $scope.$watch('fName', function() {$scope.test();});
  $scope.$watch('lName', function() {$scope.test();});

  $scope.test = function()
  {
    if ($scope.passw1 !== $scope.passw2) { $scope.error = true; } // if the passwords do not match, throw error
    else { $scope.error = false; } // no error

    $scope.incomplete = false;

    // if the fields are still empty
    if ($scope.edit && (!$scope.fName.length || !$scope.lName.length ||!$scope.passw1.length || !$scope.passw2.length))
    {
       $scope.incomplete = true;
    }
  };
});
