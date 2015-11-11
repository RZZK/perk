var mysql = require(‘mysql’);

var connection=mysql.createConnection({
host: ‘localhost’,
user: ‘root’,
password: ‘mysqlpassword’,
database: ‘perk’,
});

connection.connect();

///////////////// add user to database /////////////////////////

var post= {userEmail:email, userPhone:phone, userVehicle:vehicle, userName:name};

if(userExists=true)
{
 connection.query(‘INSERT into users VALUES ?’,post, function(err, result)        

}

else{
  console.log(“The information you have entered is already in our records”);

}
////////////////// end addUser /////////////////////////////////////////


////////////////// userExist ////////////////////////////////////////
var userExist= connection.query(function(cEmail, cPhone)    {
boolean mark=true;

var counter=‘SELECT  COUNT (where email = cEmail’)
from users 

if(counter=0)
{
    return mark;
}
else{
   mark=false;
   return mark;
}

/////////////////////// end userExist ///////////////////////

//////////////// addToPark ///////////////////////////////
if(userExist)
{
 var id= Select userid from users where email=Cemail;

 var postPark={userid:id, lat:cLat, lon:cLon;, parkTime:cTime};

   connection.query(‘INSERT into park VALUES ?’,postPark,       function(err, result)        
}
else{
 // user is not in the user table,
   not sure on how to handle the error
}

////////////////////// end addToPark///////////////////

////////////// addToPickUp ////////////////////////////
var addToPickUp(connection.query(function() {
if(userExist)
{
 var id= Select userid from users where email=Cemail;

 var postPick={userid:id, lat:cLat, lon:cLon;, pickTime:cTime, lotNumber:cLot};

   connection.query(‘INSERT into park VALUES ?’,postPick,  function(err, result)        
}

else{
 // user is not in the user table,
   not sure on how to handle the error
}

});
////////////// end addToPickUp ////////////////////////////

/////////// deleteFromPickUp ////////////////////////////

 

function doStuff()
{
  //do some things
  setTimeout(continueExecution, 100000) //wait 100 seconds before continuing
}

function continueExecution()
{
   //finish doing things after the pause
}