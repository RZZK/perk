angular.module('app', ['snap']).controller('loginController', function($scope, $http)
{
  /*
    // this method is currently not loading data from json correctly
    $http.get('users.json')
    .success(function (data){ $scope.users = data; })
    .error(function (data){ $scope.users = [{id:0, fName:'Error', lName:'Could not load data'}]; });
  */
  $scope.fName = '';
  $scope.lName = '';
  $scope.departTime = '';
  $scope.lot = '';
  $scope.users =
  [
    {id:1, fName:'Hege', lot: "F", departTime:"5:00pm" },
    {id:2, fName:'Kim', lot: "Structure", departTime:"5:30pm" },
    {id:3, fName:'Sal', lot: "Structure", departTime:"8:15pm" },
    {id:4, fName:'Jack', lot: "Structure", departTime:"9:00pm" },
    {id:5, fName:'John', lot: "Overflow", departTime:"9:05pm" },
    {id:6, fName:'Peter', lot: "F", departTime:"10:00pm" },
    {id:7, fName:'Lollerskates', lot: "F", departTime:"11:59pm" }
  ];

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
  $scope.showAddDeparture = false;
  $scope.welcomeScreen = true;
  $scope.error = false;
  $scope.incomplete = false;
  $scope.loggedIn = false;
//---------------------------------------------------------------------------------------------------------------
  $scope.newUser = function(id)
  {
     if(id == 'signup') { $scope.displaySignUp = true; }
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
//---------------------------------------------------------------------------------------------------------------
  $scope.showRiders = function ()
  {
     $scope.welcomeScreen = false;
     $scope.showAddDeparture = false;
     $scope.showMenu = false;
     $scope.showRiderList = true;

  }
//---------------------------------------------------------------------------------------------------------------
  $scope.displayMenu = function () { $scope.showMenu = true; }
//---------------------------------------------------------------------------------------------------------------
  $scope.displayAddDeparture = function ()
  {
     $scope.welcomeScreen = false;
     $scope.showRiderList = false;
     $scope.showAddDeparture = true;
  }
//---------------------------------------------------------------------------------------------------------------
  $scope.login = function()
  {
     $scope.loggedIn = true;
    //$scope.users.push({id:id_counter, fName:$scope.fName, lName:$scope.lName})
  };
//---------------------------------------------------------------------------------------------------------------
  $scope.signup = function()
  {
    //$scope.users.push({id:id_counter, fName:$scope.fName, lName:$scope.lName})
  };
//---------------------------------------------------------------------------------------------------------------
  $scope.submitTime = function()
  {
    /*id_counter += 1;

    // add to data
    $scope.users.push({id:id_counter,
                        fName:$scope.fName,
                        lot:$scope.lot,
                        departTime:$scope.departTime})

    // clear fields and reset save button
    $scope.fName = null;
    $scope.lot = null;
    $scope.departTime = null;
    $scope.incomplete = true;*/
  };
//---------------------------------------------------------------------------------------------------------------
  $scope.$watch('passw1',function() {$scope.test();});
  $scope.$watch('passw2',function() {$scope.test();});
  $scope.$watch('username', function() {$scope.test();});
  $scope.$watch('email', function() {$scope.test();});
  $scope.$watch('number', function() {$scope.test();});
  $scope.$watch('vehicle', function() {$scope.test();});
  $scope.$watch('vcolor', function() {$scope.test();});
  $scope.$watch('lot', function() {$scope.test();});
  $scope.$watch('departTime', function() {$scope.test();});
//---------------------------------------------------------------------------------------------------------------
  $scope.test = function()
  {
    if ($scope.passw1 !== $scope.passw2) { $scope.error = true; } // if the passwords do not match, throw error
    else { $scope.error = false; } // no error

    $scope.incomplete = false;

    // if all fields are still empty
    if (!$scope.username.length || !$scope.passw1.length || !$scope.passw2.length
      || !$scope.email.length || !$scope.number.length || !$scope.vehicle.length
      || !$scope.vcolor.length )
    {
       $scope.incomplete = true;
    }

    //if fields are empty during add phase
    if ($scope.lot.length && $scope.departTime.length) { $scope.incomplete = false; }
  };
//---------------------------------------------------------------------------------------------------------------
});
