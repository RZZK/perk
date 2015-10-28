angular.module('myApp', []).controller('userCtrl', function($scope, $http) 
{
  var id_counter = 7;

  $scope.fName = '';
  $scope.lName = '';
  $scope.passw1 = '';
  $scope.passw2 = '';
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

  /*
    // this method is currently not loading data from json correctly
    $http.get('users.json')
    .success(function (data){ $scope.users = data; })
    .error(function (data){ $scope.users = [{id:0, fName:'Error', lName:'Could not load data'}]; });
  */

  $scope.edit = true;
  $scope.error = false;
  $scope.incomplete = false; 
//---------------------------------------------------------------------------------------------------------------
  $scope.editEntry = function(id) 
  {
    if (id == 'new') 
    {
      $scope.edit = true;
      $scope.incomplete = true;
      $scope.fName = '';
      $scope.lName = '';
      } 
    else 
    {
      $scope.edit = false;
      $scope.fName = $scope.users[id-1].fName;
      $scope.lName = $scope.users[id-1].lName; 
    }
  };
//---------------------------------------------------------------------------------------------------------------
  $scope.submitTime = function() 
  {
    id_counter += 1;

    // add to data
    $scope.users.push({id:id_counter, 
                        fName:$scope.fName, 
                        lot:$scope.lot,
                        departTime:$scope.departTime})

    // clear fields and reset save button
    $scope.fName = null;
    $scope.lot = null;
    $scope.departTime = null;
    $scope.incomplete = true;
  };
//---------------------------------------------------------------------------------------------------------------
  $scope.$watch('passw1',function() {$scope.test();});
  $scope.$watch('passw2',function() {$scope.test();});
  $scope.$watch('fName', function() {$scope.test();});
  $scope.$watch('lName', function() {$scope.test();});
  $scope.$watch('lot', function() {$scope.test();});
  $scope.$watch('departTime', function() {$scope.test();});
//---------------------------------------------------------------------------------------------------------------
  $scope.test = function() 
  {
    if ($scope.passw1 !== $scope.passw2) { $scope.error = true; } // if the passwords do not match, throw error
    else { $scope.error = false; } // no error

    $scope.incomplete = false;

    // if the fields are still empty during edit phase
    if ($scope.edit && (!$scope.fName.length || !$scope.lName.length ||!$scope.passw1.length || !$scope.passw2.length)) 
    {
       $scope.incomplete = true;
    }

    //if fields are empty during add phase
    if ($scope.fName.length && $scope.lot.length&& $scope.departTime.length) 
    {
       $scope.incomplete = false;
    }
  };
//---------------------------------------------------------------------------------------------------------------
}); // end of js