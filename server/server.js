var mysql = require('mysql');

var my_client = mysql.createConnection({
host: 'localhost',
user: 'root',
port:'3306',
password: 'mysqlpassword',
database: 'perk'
});
my_client.connect();

// printUserList();
// addUser("Henry","broncor@yahoo.com","555-9696", "A effing Dragon");
// removeUser(10006);
// addPark("1000","2000","20000","11:28:50");
// printParkList();
// removePark('10000');
// userExists("Tom ","nunyabizznes","525-999","camry ");
// printPickupList();

function query(sql,callback){
	my_client.query(sql, function(x,y,z){
		if(!!x){
			console.log("///////////////////////////////SQL-ERROR////////////////////////////////////////");
			console.log(sql + "\n");
			console.log(x);
			console.log("///////////////////////////////SQL-ERROR////////////////////////////////////////");
			
		} else{
			if(!!callback) callback(x,y,z);
		}
	});
}
function disconnect(){
	my_client.end();
}
function addUser(name,email,phone,car,password){ 
	var sql = 'INSERT into users(name, email, phone, car, password) VALUES("'+name+'", "'+email+'", "'+phone+'","'+ car+'"," '+password+'")';
	userExists(name,email,phone,car,function(exists){
		if(!exists){
			console.log("SQL: ADDING USER -- name: " + name + " email: " + email);
			query(sql);
		}
		else console.log("SQL: CAN'T ADD: USER " + name + " ALREADY IN users");
	});
}
function removeUser(userID){
	var sql ='DELETE from users where userid =' + userID;
		userExists(userID,function(exists){
			if(exists){
				console.log("SQL: REMOVING USER -- userid: " + userID);
				query(sql);
			}
			else console.log("SQL: CAN'T DELETE: USER " + userID + " NOT IN users");
		});
}
// DONE CHECK THIS
function userExists(name,email,phone,car,callback){
	var sql = 'SELECT * from users where email="'+email + '";';
	query(sql,function(x,y,z){
		if(y.length === 0) callback(false);
		else callback(true);
	});
}
function userExists(userid,callback){
	var sql = 'SELECT * from users where userid="'+userid + '";';
	query(sql,function(x,y,z){
		if(y.length === 0) callback(false);
		else callback(true);
	});
}
function userExists(email,password,callback){
	var sql = 'SELECT * from users where email="' + email + '" AND password="' + password + '";';
		query(sql,function(x,y,z){
			if(y.length === 0) callback(false);
			else callback(true);
		});
}
function addPark(userID,lat,lng,time){
	var sql ='INSERT into park(userid,lat,lng,time) VALUES("'+userID+'",'+ lat+','+ lng+',"' +time+'")';
	userExistsInTable("park",userID,function(exists){
		if(!exists){
			query(sql);
		} else {
			console.log("SQL: CAN'T ADD: USER " + userID + " ALREADY IN park");
		}
	});
}
function removePark(userID){
	var sql ='DELETE from park where userid= '+userID;
	userExistsInTable("park",userID,function(exists){
		if(exists){
			query(sql);
		} else {
			console.log("SQL: CAN'T DETE: USER " + userID + " NOT IN park");
		}
	});
}
function addPickup(userID,lat,lng,time,lot){
	var sql = 'INSERT into pickup(userid,lat,lng,time,lot) VALUES('+userID+','+ lat+','+ lng+',"' +time+'","'+lot+'")';
	
	userExistsInTable("pickup",userID,function(exists){
		if(!exists){
			query(sql);	
		} else {
			console.log("SQL: CAN'T ADD: USER " + userID + " ALREADY IN pickup");
		}
	});
}
function removePickup(userID){
	var sql = 'DELETE from pickup where userid= '+userID;
	userExistsInTable("pickup",userID,function(exists){
		if(exists){
			query(sql);
		} else {
			console.log("SQL: CAN'T DELETE: USER " + userID + " NOT IN pickup");
		}
	});
}

function getPickupList(callback){ 
	var sql = 'SELECT * from pickup'
		return query(sql,function(x,y,z){
		callback(y);
	});
}
function getParkList(callback){ 
	var sql ='SELECT * from park'
		return query(sql,function(x,y,z){
		callback(y);
	});
}
function getUserList(callback){
	var sql ='SELECT * from users'
	return query(sql,function(x,y,z){
		callback(y);
	});
}
function getUser(email, password, callback){
	var sql = 'SELECT * from users where email="' + email + '" AND password="' + password + '";';
	query(sql, callback);
}
function printPickupList(){
	getPickupList(function(rows){
		console.log(rows);
	});
}
function printParkList(){
	getParkList(function(rows){
		console.log(rows);
	});
}
function printUserList(){
	getUserList(function(rows){
		console.log(rows);
	});
}
function userExistsInTable(table,userID,callback){
	var sql = 'SELECT * FROM ' + table + ' where userid= "'+userID + '";';
	query(sql,function(x,y,z){
		callback(y.length != 0);
	});
}

//--------------------END SQL FUNCTIONS -----------------------------------------//


function User(userid,name,email,phone, picture,socket){
	this.socket = socket; 
	this.userid = userid;
	this.name = name;
	this.email = email;
	this.phone = phone;
	this.picture = picture;
}
function User(){
	this.socket = 0; 
	this.userid = 0;
	this.name = 0;
	this.email = 0;
	this.phone = 0;
	this.picture = 0;
}
function userBuilder(){
	user = new User();
	this.withUserID = function(userid){
		user.userid = userid;
		return this;
	};
	this.withName = function(name){
		user.name = name;
		return this;
	};
	this.withEmail = function(email){
		user.email = email;
		return this;
	};
	this.withPhone = function(phone){
		user.phone = phone;
		return this;
	};
	this.withPicture = function(picture){
		user.picture = picture;
		return this;
	};
	this.withSocket = function(socket){
		user.socket = socket;
		return this;
	}
	this.getUser = function(){
		return user;
	}
}
function Passenger(){
	this.user = 0;
	this.lot = 0;
	this.lat = 0;
	this.lng = 0;
	this.time = 0;
	this.paired = new Array();
}
function passengerBuilder(){
	passenger = new Passenger();
	this.withUser = function(user){
		passenger.user = user;
		return this;
	};
	this.withTime = function(time){
		passenger.time = time;
		return this;
	};
	this.withLat = function(lat){
		passenger.lat = lat;
		return this; 
	};
	this.withLng = function(lng){
		passenger.lng = lng;
		return this; 
	};
	this.withLot = function(lot){
		passenger.lot = lot;
		return this;
	};
	this.getPassenger = function(){
		return passenger;
	};
}
function Driver(){
	this.user = 0;
	this.time = 0;
	this.lat = 0;
	this.lng = 0;
	this.paired = new Array();
}
function driverBuilder(){
	driver = new Driver();
	this.withUser = function(user){
		driver.user = user;
		return this;
	}
	this.withTime = function(time){
		driver.time = time; 
		return this;
	}
	this.withLat = function(lat){
		driver.lat = lat;
		return this;
	}
	this.withLng = function(lng){
		driver.lng = lng;
		return this;
	}
	this.getDriver = function(){
		return driver;
	}
}
function indexOfUserByEmail(email){
	for(var i = 0; i < users.length; i++){
			if(users[i].email === email){
				return i;
			}
		}
		return -1;
}


var app = require('http').createServer();
var io = require('socket.io')(app);
app.listen(8001);

var users = new Array();
var passengers = new Array();
var drivers = new Array();
io.on('connection', function (socket) {
	console.log("socket " + socket.id + " opened.")
	socket.on("login", function(data){
		userLogin(data,socket);
	});
	socket.on('disconnect',function(){
		removeUserBySocket(socket);
		console.log("socket " + socket.id + " closed.");
	});
	socket.emit("data",{passengers:getClientFriendlyPassengerList(),drivers:getClientFriendlyDriverList()});
});
//pairUsers(driver,passenger)

//client on login,success
//client on login,fail
//client emit login
//client emit park
//client emit pickup
//client emit location

function userLogin(data,socket){
	var user;
	if(indexOfUserByEmail(data.email) != -1){
		console.log(data.email + " already logged in.");
		return;
	}
	getUser(data.email,data.password,function(x,y,z){
		if(y.length == 0){
			socket.emit("login",{success:false});
			return;
		}
		socket.emit("login",{success:true});
		
		var userData = y[0];
		user = new userBuilder().withUserID(userData.userid)
														.withName(userData.name)
														.withPhone(userData.phone)
														.withEmail(userData.email)
														.withPicture(userData.picture)
														.withSocket(socket).getUser();
		users.push(user);
		console.log("#" + user.userid + " logged in.");
		
		socket.on("pickup", function(data){
			initiatePickup(data,user)
		});
		socket.on("park", function(data){
			initiatePark(data,user)
		});
	});
}
function initiatePark(data,user){
	//input format: [lat:14.415,lng:124241.124214,time:'23:41:44']
	if(indexOfPassengerByID(user.userid) != -1){
		user.socket.emit("park","Could not add to Drivers because user is in passengers.")
		return;
	}
	if(indexOfDriverByID(user.userid) != -1){
		user.socket.emit("park","Could not add to Drivers because user is already in drivers.")
		return;
	}
	var driver = new driverBuilder().withUser(user)
														.withLat(data.lat)
														.withLng(data.lng)
														.withTime(data.time)
														.getDriver();
	drivers.push(driver);
	broadcastNewDriver(driver);
	console.log("#" + user.userid + " added to drivers.");
	
	user.socket.on("location",function(data){
		updateLocation(driver,data);
	});
	user.socket.on("pair",function(data){
		driverPair(driver,data);
	});
}
function initiatePickup(data,user){
	//input format: [lat:14.415,lng:124241.124214,time:'23:41:44',lot: 'F']
	if(indexOfPassengerByID(user.userid) != -1){
		socket.emit("park","Could not add to Passengers because user is in passengers.")
		return;
	}
	if(indexOfDriverByID(user.userid) != -1){
		socket.emit("park","Could not add to Passengers because user is already in drivers.")
		return;
	}
	var passenger = new passengerBuilder().withUser(user)
																	.withLot(data.lot)
																	.withLat(data.lat)
																	.withLng(data.lng)
																	.withTime(data.time)
																	.getPassenger();
	passengers.push(passenger);
	broadcastNewPassenger(passenger)
	console.log("#" + user.userid + " added to passengers.");
	
	user.socket.on("location",function(data){
		updateLocation(passenger,data);
	});
	user.socket.on("pair",function(data){
		passengerPair(passenger,data);
	});
}
function updateLocation(driver,data){
	//data format: {lat:12323.34,lng:1244.5}
	driver = data.lat;
	driver = data.lng;
	data.userid = driver.userid;
	users.forEach(function(elem){
		elem.socket.emit("location",data);
	});
}
function broadcastNewPassenger(passenger){
	var pass = getClientFriendlyPassenger(passenger);
	users.forEach(function(usr){
		usr.socket.emit("newPassenger",pass);
	});
}
function broadcastNewDriver(driver){
	var drive = getClientFriendlyDriver(driver);
	users.forEach(function(usr){
		usr.socket.emit("newDriver",drive);
	});
}
function driverPair(driver,data){
	//data format: {userid:userid}
	var passenger = getPassengerByID(data.userid);
	if(passenger === -1){
		console.log("Tried to add passenger that doesn't exist.'")
		return; 
	}
	driver.paired.push(data.userid);
	var index = passenger.paired.indexOf(driver.user.userid);
	if(index != -1){
		pairUsers(driver,passenger);
	}
}
function passengerPair(passenger,data){
	//data format: {userid:userid}
	var driver = getDriverByID(data.userid);
	if(driver === -1){
		console.log("Tried to add passenger that doesn't exist.'")
		return; 
	}
	passenger.paired.push(data.userid);
	var index = driver.paired.indexOf(passenger.user.userid);
	if(index != -1){
		pairUsers(driver,passenger);
	}
}
function getPassengerByID(id){
	passengers.forEach(function(p,i){
		if(p.user.userid === id) return i;
	});
	return -1;
}
function getDriverByID(id){
	drivers.forEach(function(p,i){
		if(p.user.userid === id) return i;
	});
	return -1;
}
function removeUserBySocket(socket){
	var disconnectionMessage = ""; 
	if(users.length === 0 ) disconnectionMessage = "#??? disconnected";
	drivers.forEach(function(d,i){
		if(d.user.socket === socket) {
			drivers.splice(i,1);
			disconnectionMessage += "\nRemoving them from drivers.";
		}
	});
	passengers.forEach(function(p,i){
		if(p.user.socket === socket) passengers.splice(i,1);
		disconnectionMessage += "\nRemoving them from passengers.";
	});
	users.forEach(function(u,i){
		if(u.socket === socket){
			users.splice(i,1);
			disconnectionMessage = "#" + u.userid + " disconnected" + disconnectionMessage;
		} else if(i === users.length - 1 ) {
			disconnectionMessage = "#??? disconnected" + disconnectionMessage;
		}
	});
	console.log(disconnectionMessage);
}
function pairUsers(driver,passenger){
}
function indexOfPassengerByID(userid){
	passengers.forEach(function(e,i){
		if(e.userid === userid) return i;
	});
	return -1;
}
function indexOfDriverByID(userid){
	drivers.forEach(function(e,i){
		if(e.userid === userid) return i;
	});
	return -1;	
}
function getClientFriendlyUser(user){
	return new userBuilder().withName(user.name)
										.withUserID(user.userid)
										.getUser();
}
function getClientFriendlyPassenger(passenger){
	var user = getClientFriendlyUser(passenger.user);
	return new passengerBuilder().withUser(user)
													.withLot(passenger.lot)
													.withTime(passenger.time)
													.getPassenger();
}
function getClientFriendlyDriver(driver){
	var user = getClientFriendlyUser(driver.user);
	return new driverBuilder().withUser(user)
											.withLat(driver.lat)
											.withLng(driver.lng)
											.withTime(driver.time)
											.getDriver();
}
function getClientFriendlyDriverList(){
	var friendlyDrivers = new Array();
	drivers.forEach(function(ele){
		friendlyDrivers.push(getClientFriendlyDriver(ele));
	});
	return friendlyDrivers;
}
function getClientFriendlyPassengerList(){
	var friendlyPassengers = new Array();
	passengers.forEach(function(ele){
		friendlyPassengers.push(getClientFriendlyPassenger(ele));
	});
	return friendlyPassengers;
}