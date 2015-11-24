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
  $scope.departTime = '';
  $scope.arrivalTime = '';
  $scope.lot = '';

  $scope.snapOpts = { disable: 'right' };
  $scope.username = '';
  $scope.usernameEmail = '';
  $scope.password = '';
  $scope.passw1 = '';
  $scope.passw2 = '';
  $scope.email = '';
  $scope.number = '';
  $scope.vehicle = '';
  $scope.vcolor = '';

  $scope.drivers =
  [
    {id:1, fName:'Hege',  lot: "F",          arrivalTime:"5:00pm" },
    {id:2, fName:'Kim',   lot: "Structure",  arrivalTime:"5:30pm" },
    {id:3, fName:'Sal',   lot: "Structure",  arrivalTime:"8:15pm" },
  ];

  $scope.passengers =
  [
    {id:5, fName:'John',   lot: "Overflow",  departTime:"9:05pm" },
    {id:6, fName:'Peter',  lot: "F",         departTime:"10:00pm" },
    {id:7, fName:'OhHai',  lot: "F",         departTime:"11:59pm" }
  ];

  $scope.displaySignUp = false;
  $scope.showRiderList = false;
  $scope.showDriverList = false;
  $scope.showAddDeparture = false;
  $scope.showAddParkingRequest = false;
  $scope.displayBottomSlider = false;
  $scope.welcomeScreen = true;

  $scope.error = false;
  $scope.incomplete = false;
  $scope.loggedIn = false;
  $scope.addPassenger = function()
  {

  }
  $scope.addDriver = function()
  {

  }
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
     $scope.showAddParkingRequest = false;
     $scope.showDriverList = false;
     $scope.displayBottomSlider = false;

     $scope.showRiderList = true;
  }
//---------------------------------------------------------------------------------------------------------------
  $scope.showDrivers = function ()
  {
     $scope.welcomeScreen = false;
     $scope.showAddDeparture = false;
     $scope.showAddParkingRequest = false;
     $scope.showRiderList = false;
     $scope.displayBottomSlider = false;

     $scope.showDriverList = true;
  }
//---------------------------------------------------------------------------------------------------------------
  $scope.displayRequestPickup = function ()
  {
     $scope.welcomeScreen = false;
     $scope.showRiderList = false;
     $scope.showDriverList = false;
     $scope.showAddParkingRequest = false;
     $scope.displayBottomSlider = false;

     $scope.showAddDeparture = true;
  }
//---------------------------------------------------------------------------------------------------------------
  $scope.displayRequestParking = function ()
  {
     $scope.welcomeScreen = false;
     $scope.showRiderList = false;
     $scope.showDriverList = false;
     $scope.showAddParkingRequest = false;
     $scope.displayBottomSlider = false;

     $scope.showAddParkingRequest = true;
  }
//---------------------------------------------------------------------------------------------------------------
  $scope.toggleBottomSlider = function ()
  {
     $scope.welcomeScreen = false;
     $scope.showRiderList = false;
     $scope.showDriverList = false;
     $scope.showAddDeparture = false;
     $scope.showAddParkingRequest = false;

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
      $scope.showAddParkingRequest = false;
      $scope.displayBottomSlider = false;
   };
//---------------------------------------------------------------------------------------------------------------
  $scope.login = function()
  {
     // should save username and email so they can be displayed on the left drawer
     // use username as key, and get first name, last name, and e-mail
     $scope.currentUserEmail = $scope.usernameEmail;
     $scope.loggedIn = true;
  };
//---------------------------------------------------------------------------------------------------------------
  $scope.signup = function()
  {
     // should push data to database if username is not taken
  };
 //---------------------------------------------------------------------------------------------------------------
  $scope.logout = function()
  {
    $scope.showRiderList = false;
    $scope.showDriverList = false;
    $scope.showAddDeparture = false;
    $scope.showAddParkingRequest = false;
    $scope.displayBottomSlider = false;
    $scope.loggedIn = false;

    $scope.currentUserEmail = '';
    $scope.usernameEmail = '';
    $scope.password = '';
  };
//---------------------------------------------------------------------------------------------------------------
  $scope.submitTime = function()
  {
     // takes the data from "Add departure time" and saves it to the table
     // should use the info of the user that is logged in (name, email, phone number?)
     // should take the "Lot" and "Time" that the user typed in the two fields
     $scope.welcomeScreen = true;
     $scope.showRiderList = false;
     $scope.showDriverList = false;
     $scope.showAddDeparture = false;
     $scope.displayBottomSlider = false;

     $scope.departTime = '';
     $scope.lot = '';
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
    // if all fields are still empty during create account
    if (!$scope.username.length || !$scope.passw1.length || !$scope.passw2.length
      || !$scope.email.length || !$scope.number.length || !$scope.vehicle.length
      || !$scope.vcolor.length )
    {
       $scope.incomplete = true;
    }

    //if fields are empty during add phase
    if ($scope.departTime.length) { $scope.incomplete = false; }
  };
//---------------------------------------------------------------------------------------------------------------
});
