var mysql = require('mysql');

var connection=mysql.createConnection({
host: 'localhost',
user: 'root',
password: 'mysqlpassword',
database: 'perk'
});

connection.connect();
console.log(userExist("smashtilldawn.com");
////////////////// add user to database /////////////////////////
function addUser (email, phone, vehicle, name){
	var post= {userEmail:email, userPhone:phone, userVehicle:vehicle, userName:name};
	if(userExists=true)
	{
		connection.query('INSERT into users VALUES ?',post, function(err, result){});      
	}else{
		console.log("The information you have entered is already in our records");
	}	
}

////////////////// end addUser /////////////////////////////////////////


////////////////// userExist ////////////////////////////////////////
function userExist(Cemail){

var x = connection.query('SELECT EXISTS(SELECT 1 from users where Cemail=email)')    
console.log(x);

if(counter=0)
{
    return mark;
} else{
	mark=false;
	return mark;
}

}

/////////////////////// end userExist ///////////////////////

//////////////// addToPark ///////////////////////////////

function addToPark(latitude, longitude, pTime){
	if(userExist(cEmail))
	{
		var id= 'Select userid from users where Cemail=email'
		var postPark={userid:id, lat:latiude, lon:longitude, parkTime:pTime};
		connection.query('INSERT into park VALUES ?',postPark, function(err, result){});  
	}
	
	else
	{
		console.log("Something went wrong *jumps out 10th floor window*");
	}	
		


}
////////////////////// end addToPark///////////////////

////////////// addToPickUp ////////////////////////////
function addToPickUp(latitude,longitude, pTime, clotnumber)
{
	if(userExist) 
	{
		var id= 'Select userid from users where Cemail=email'
		var postPick={userid:id, lat:latitude, lon:longitude, parkTime:pTime, lotnumber:clotnumber};
		connection.query('INSERT into pickup VALUES ?',postPick, function(err, result){});
	}
	else
	{
		 console.log("Something went wrong *jumps out of 10th floor window");

	}

}
////////////// end addToPickUp ////////////////////////////

/////////// deleteFromPickUp ////////////////////////////

 function deleteFromPickUp(

function doStuff()
{
  //do some things
  setTimeout(continueExecution, 100000) //wait 100 seconds before continuing
}

function continueExecution()
{
   //finish doing things after the pause
}

console.log("hi");
