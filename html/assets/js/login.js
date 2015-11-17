angular.module('app', ['snap']).controller('loginController', function($scope, $http)
{
  /*
    // this method is currently not loading data from json correctly
    $http.get('users.json')
    .success(function (data){ $scope.users = data; })
    .error(function (data){ $scope.users = [{id:0, fName:'Error', lName:'Could not load data'}]; });
  */
  $scope.currentUserName = '';
  $scope.currentUserEmail = '';
  $scope.fName = '';
  $scope.lName = '';
  $scope.departTime = '';
  $scope.lot = '';

  $scope.snapOpts = { disable: 'right' };
  $scope.username = '';
  $scope.passw1 = '';
  $scope.passw2 = '';
  $scope.email = '';
  $scope.number = '';
  $scope.vehicle = '';
  $scope.vcolor = '';

  $scope.users =
  [
    {id:1, fName:'Hege',   email:'demo@cpp.edu', lot: "F", departTime:"5:00pm" },
    {id:2, fName:'Kim',    email:'demo@cpp.edu', lot: "Structure", departTime:"5:30pm" },
    {id:3, fName:'Sal',    email:'demo@cpp.edu', lot: "Structure", departTime:"8:15pm" },
    {id:4, fName:'Jack',   email:'demo@cpp.edu', lot: "Structure", departTime:"9:00pm" },
    {id:5, fName:'John',   email:'demo@cpp.edu', lot: "Overflow", departTime:"9:05pm" },
    {id:6, fName:'Peter',  email:'demo@cpp.edu', lot: "F", departTime:"10:00pm" },
    {id:7, fName:'Lollerskates', email:'demo@cpp.edu', lot: "F", departTime:"11:59pm" }
  ];

  $scope.displaySignUp = false;
  $scope.showRiderList = false;
  $scope.showDriverList = false;
  $scope.showAddDeparture = false;
  $scope.displayBottomSlider = false;
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
     $scope.showDriverList = false;
     $scope.displayBottomSlider = false;

     $scope.showRiderList = true;
  }
//---------------------------------------------------------------------------------------------------------------
  $scope.showDrivers = function ()
  {
     $scope.welcomeScreen = false;
     $scope.showAddDeparture = false;
     $scope.showRiderList = false;
     $scope.displayBottomSlider = false;

     $scope.showDriverList = true;
  }
//---------------------------------------------------------------------------------------------------------------
  $scope.displayAddDeparture = function ()
  {
     $scope.welcomeScreen = false;
     $scope.showRiderList = false;
     $scope.showDriverList = false;
     $scope.displayBottomSlider = false;

     $scope.showAddDeparture = true;
  }
//---------------------------------------------------------------------------------------------------------------
  $scope.toggleBottomSlider = function ()
  {
     $scope.welcomeScreen = false;
     $scope.showRiderList = false;
     $scope.showDriverList = false;
     $scope.showAddDeparture = false;

     $scope.displayBottomSlider = true;
     $scope.$apply();
  }
//---------------------------------------------------------------------------------------------------------------
   $scope.returnToMap = function()
   {
      $scope.welcomeScreen = true;
      $scope.showRiderList = false;
      $scope.showDriverList = false;
      $scope.showAddDeparture = false;
      $scope.displayBottomSlider = false;
   };
//---------------------------------------------------------------------------------------------------------------
  $scope.login = function()
  {
     // should save username and email so they can be displayed on the left drawer
     // use username as key, and get first name, last name, and e-mail
     $scope.currentUserName = $scope.username;
     $scope.currentUserEmail = $scope.email;

     $scope.loggedIn = true;
    //$scope.users.push({id:id_counter, fName:$scope.fName, lName:$scope.lName})
  };
//---------------------------------------------------------------------------------------------------------------
  $scope.signup = function()
  {
     // should push data to database if username is not taken
  };
 //---------------------------------------------------------------------------------------------------------------
  $scope.logout = function() { $scope.loggedIn = false; };
//---------------------------------------------------------------------------------------------------------------
  $scope.submitTime = function()
  {
     // takes the data from "Add departure time" and saves it to the table
     // should use the info of the user that is logged in (name, email, phone number?)
     // should take the "Lot" and "Time" that the user typed in the two fields
  };
  $scope.refresh = function() { $scope.$apply(); };
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
