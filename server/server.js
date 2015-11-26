process.stdout.write("\u001b[2J\u001b[0;0H");
console.log("--------------------------------SERVER STARTED--------------------------------")
console.log("------------------------------------------------------------------------------")
var mysql = require('mysql');

var my_client = mysql.createConnection({
host: 'localhost',
user: 'root',
port:'3306',
password: 'mysqlpassword',
database: 'perk'
});
my_client.connect();

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
	var sql = 'INSERT into users(name, email, phone, car, password) VALUES("'+name+'", "'+email+'", "'+phone+'","'+ car+'"," md5('+password+')")';
	userExists(name,email,phone,car,function(exists){
		if(!exists){
			console.log("SQL: ADDING USER -- name: " + name + " email: " + email);
			query(sql);
		}
		else console.log("SQL: CAN'T ADD: USER " + name + " ALREADY IN users");
	});
}
function removeUser(userID){
	var sql ='DELETE from users where userid =' + userID +';'
		userExists(userID,function(exists){
			if(exists){
				console.log("SQL: REMOVING USER -- userid: " + userID);
				query(sql);
			}
			else console.log("SQL: CAN'T DELETE: USER " + userID + " NOT IN users");
		});
}
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
	var sql = 'SELECT * FROM ' + table + ' where userid= "'+userID + '";'
	query(sql,function(x,y,z){
		callback(y.length != 0);
	});
}

function listClients (callback){
var sql ='SELECT name, userid FROM users'
return query(sql,function(x,y,z){
		callback(y);
		
	});

}



//--------------------END SQL FUNCTIONS -----------------------------------------//

function User(){
	var socket = 0; 
	var userid = 0;
	var name = 0;
	var email = 0;
	var phone = 0;
	var picture = 0;
	this.setSocket = function(newSocket){
		socket = newSocket;
	}
	this.setID = function(newID){
		userid = newID;
	}
	this.setName = function(newName){
		name = newName;
	}
	this.setEmail = function(newEmail){
		email = newEmail;
	}
	this.setPhone = function(newPhone){
		phone = newPhone;
	}
	this.setPicture = function(newPicture){
		picture = newPicture;
	}
	this.getID = function(){
		return userid;
	}
	this.getSocket = function(){
		return socket;
	}
	this.getName = function(){
		return name;
	}
	this.getEmail = function(){
		return email;
	}
	this.getPhone = function(){
		return phone;
	}
	this.getPicture = function(){
		return picture;
	}
}
function userBuilder(){
	user = new User();
	this.withUserID = function(userid){
		user.setID(userid);
		return this;
	};
	this.withName = function(name){
		user.setName(name);
		return this;
	};
	this.withEmail = function(email){
		user.setEmail(email);
		return this;
	};
	this.withPhone = function(phone){
		user.setPhone(phone);
		return this;
	};
	this.withPicture = function(picture){
		user.setPicture(picture);
		return this;
	};
	this.withSocket = function(socket){
		user.setSocket(socket);
		return this;
	}
	this.getUser = function(){
		return user;
	}
}
function Passenger(){
	var user = {userid:0};
	var lot = 0;
	var lat = 0;
	var lng = 0;
	var time = 0;
	var paired = new Array();
	this.setLatLng = function(newLat,newLng){
		lat = newLat;
		lng = newLng;
	};
	this.setName = function(name){
		user.setName(name);
	}
	this.getName = function(){
		return user.getName();
	}
	this.setTime = function(newTime){
		time = newTime;
	}
	this.getTime = function(){
		return time;
	}
	this.addPaired = function(driver){
		paired.push(driver);
	}
	this.removePaired = function(driver){
		paired.forEach(function(e,i){
			if(e.getID() === driver.getID()){
				paired.splice(i,1);
			}
		})
	}
	this.getPaired = function(){
		return paired;
	};
	this.getLat = function(){
		return lat;
	}
	this.getLng = function(){
		return lng;
	}
	this.setID = function(userid){
		user.setID(userid);
	}
	this.getID = function(){
		return user.getID();
	}
	this.setLot = function(newLot){
		lot = newLot;
	}
	this.getLot = function(){
		return lot;
	}
	this.setUser = function(newUser){
		user = newUser;
	}
	this.getUser = function(){
		return user;
	}
}
function passengerBuilder(){
	passenger = new Passenger();
	this.withUserID = function(userid){
		passenger.setID(userid);
		return this;
	};
	this.withTime = function(time){
		passenger.setTime(time);
		return this;
	};
	this.withLat = function(lat){
		passenger.setLatLng(lat,passenger.getLng())
		return this; 
	};
	this.withLng = function(lng){
		passenger.setLatLng(passenger.getLat(),lng);
		return this; 
	};
	this.withLot = function(lot){
		passenger.setLot(lot);
		return this;
	};
	this.getPassenger = function(){
		return passenger;
	};
	this.withName = function(name){
		passenger.setName(name);
		return this;
	}
	this.withUser = function(user){
		passenger.setUser(user);
		return this;
	}
}
function Driver(){
	var user = {userid:0};
	var time = 0;
	var lat = 0;
	var lng = 0;
	var paired = new Array();
	this.setLatLng = function(lat,lng){
		lat = lat;
		lng = lng;
	};
	this.setName = function(name){
		user.setName(name);
	}
	this.getName = function(){
		return user.getName()
	}
	this.setTime = function(newTime){
		time = newTime;
	}
	this.getTime = function(){
		return time;
	}
	this.addPaired = function(passenger){
		paired.push(passenger);
	}
	this.removePaired = function(passenger){
		paired.forEach(function(e,i){
			if(e.getID() === passenger.getID()){
				paired.splice(i,1);
			}
		})
	}
	this.getPaired = function(){
		return paired;
	};
	this.getLat = function(){
		return lat;
	}
	this.getLng = function(){
		return lng;
	}
	this.setID = function(userid){
		user.setID(userid);
	}
	this.getID = function(){
		return user.getID();
	}
	this.setUser = function(newUser){
		user = newUser;
	}
	this.getUser = function(){
		return user;
	}
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
			if(users[i].getEmail() === email){
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
		socket.emit("login",{success:false});
		console.log(data.getEmail() + " already logged in.");
		return;
	}
	getUser(data.email, data.password,function(x,y,z){
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
		console.log("#" +  + " logged in.");
		
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
	if(indexOfPassengerByID(user.getID()) != -1){
		user.getSocket().emit("park",{success:false})
		return;
	}
	if(indexOfDriverByID(user.getID()) != -1){
		user.getSocket().emit("park",{success:false})
		return;
	}
	var driver = new driverBuilder().withUser(user)
														.withLat(data.lat)
														.withLng(data.lng)
														.withTime(data.time)
														.getDriver();
	var driverForClient = getClientFriendlyDriver(driver);
	
	driverForClient.success = true;
	user.getSocket().emit("park",driverForClient);	
	drivers.push(driver);
	broadcastNewDriver(driver);
	console.log("#" + user.getID() + " added to drivers.");
	user.getSocket().on("location",function(data){
		updateLocation(driver,data);
		
	});
	user.getSocket().on("pair",function(data){
		driverPair(driver,data);
	});
	user.getSocket().on("cancel",function(){
		removeDriver(driver);
	});
}
function initiatePickup(data,user){
	//input format: [lat:14.415,lng:124241.124214,time:'23:41:44',lot: 'F']
	if(indexOfPassengerByID(user.getID()) != -1){
		socket.emit("pickup",{succes:false})
		return;
	}
	if(indexOfDriverByID(user.getID()) != -1){
		socket.emit("pickup",{succes:false})
		return;
	}
	var passenger = new passengerBuilder().withUser(user)
																	.withLot(data.lot)
																	.withLat(data.lat)
																	.withLng(data.lng)
																	.withTime(data.time)
																	.getPassenger();
	var passengerForClient = getClientFriendlyPassenger(passenger);
	passengerForClient.success = true;
	user.getSocket().emit("pickup",passengerForClient);		
	
	passengers.push(passenger);
	broadcastNewPassenger(passenger);
	
	console.log("#" + user.getID()+ " added to passengers.");
	
	user.getSocket().on("location",function(data){
		updateLocation(passenger,data);
	});
	user.getSocket().on("pair",function(data){
		passengerPair(passenger,data);
	});
	user.getSocket().on("cancel",function(){
		removePassenger(passenger);
	});
}
function updateLocation(client,data){
	client.setLatLng(data.lat,data.lng)
	data.setID(client.getID());
	users.forEach(function(elem){
		if(user.getSocket() !== elem.getSocket()) elem.getSocket().emit("location",data);
	});
}
function broadcastNewPassenger(passenger){
	var pass = getClientFriendlyPassenger(passenger);
	users.forEach(function(usr){
		if(passenger.user.getSocket() !== usr.getSocket()) usr.getSocket().emit("newPassenger",pass);
	});
}
function broadcastNewDriver(driver){
	var drive = getClientFriendlyDriver(driver);
	users.forEach(function(usr){
		if(driver.user.getSocket() !== usr.getSocket()) usr.getSocket().emit("newDriver",drive);
	});
}
function driverPair(driver,data){
	//data format: {userid:userid}
	var passenger = getPassengerByID(data.getID());
	if(passenger === -1){
		console.log("Tried to add passenger that doesn't exist.'")
		return; 
	}
	driver.getPaired().push(data.getID());
	var index = passenger.getPaired().indexOf(driver.getID());
	if(index != -1){
		pairUsers(driver,passenger);
	}
}
function passengerPair(passenger,data){
	//data format: {userid:userid}
	var driver = getDriverByID(data.getID());
	if(driver === -1){
		console.log("Tried to add passenger that doesn't exist.'")
		return; 
	}
	passenger.getPaired().push(data.getID());
	var index = driver.getPaired().indexOf(passenger.getID());
	if(index != -1){
		pairUsers(driver,passenger);
	}
}
function getPassengerByID(id){
	for(var i = 0; i < passengers.length; i++){
		if(passengers[i].getID()=== id) return passengers[i];
	}
	return -1;
}
function getDriverByID(id){
	for(var i = 0; i < drivers.length; i++){
		if(drivers[i].getID() === id) return drivers[i];
	}
	return -1;
}
function getUserByID(id){
	for(var i = 0; i < users.length; i++){
		if(users[i].getID() === id) return users[i];
	}
	return -1;
}
function removeUserBySocket(socket){
	var disconnectionMessage = ""; 
	if(users.length === 0 ) disconnectionMessage = "#??? disconnected";
	else{
		for(var i = 0; i < drivers.length; i++){
			if(drivers[i].user.getSocket() === socket) {
				broadcastRemoveDriver(drivers[i].getID());
				drivers.splice(i,1);
				disconnectionMessage += "\nRemoving them from drivers.";
				break;
			}
		}
		for(var i = 0; i < passengers.length; i++){
			if(passengers[i].user.getSocket() === socket) {
				broadcastRemovePassenger(passengers[i].getID());
				disconnectionMessage += "\nRemoving them from passengers.";
				passengers.splice(i,1);
				break;
			}
		}
		for(var i = 0; i < users.length;i++){
			var u = users[i]
			if(u.getSocket() === socket){
					users.splice(i,1);
					disconnectionMessage = "#" + u.getID() + " disconnected" + disconnectionMessage;
					break;
				} 
				if(i === users.length - 1 ) {
					disconnectionMessage = "#??? disconnected" + disconnectionMessage;
				}
		}
	}
	console.log(disconnectionMessage);
}
function pairUsers(driver,passenger){
	if(driver.getPaired().indexOf(passenger.getID()) == -1) return;
	if(passenger.getPaired().indexOf(driver.getID()) == -1) return;
	console.log("#" + driver.getID() + " and #" + passenger.getID() + " paired.");
	driver.user.getSocket().emit("pair",getPairedFriendlyPassenger(passenger));
	passenger.user.getSocket().emit("pair",getPairedFriendlyDriver(driver))
	
	removeUserBySocket(driver.user.getSocket());
	removeUserBySocket(passenger.user.getSocket());
	
}
function indexOfPassengerByID(userid){
	passengers.forEach(function(e,i){
		if(e.getID() === userid) return i;
	});
	return -1;
}
function indexOfDriverByID(userid){
	drivers.forEach(function(e,i){
		if(e.getID() === userid) return i;
	});
	return -1;	
}
function getClientFriendlyUser(user){
	console.log(user);
	return new userBuilder().withName(user.getName())
										.withUserID(user.getID())
										.getUser();
}
function getClientFriendlyPassenger(passenger){
	var user = getClientFriendlyUser(passenger.getUser());
	return new passengerBuilder().withUser(user)
													.withLat(passenger.getLat())
													.withLng(passenger.getLng())
													.withLot(passenger.getLot())
													.withTime(passenger.getTime())
													.getPassenger();
}
function getClientFriendlyDriver(driver){
	var user = getClientFriendlyUser(driver.getUser());
	return new driverBuilder().withUser(user)
											.withLat(driver.getLat())
											.withLng(driver.getLng())
											.withTime(driver.getTime())
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
function getPairedFriendlyDriver(passenger){
	var user = getPairedFriendlyUser(driver.user);
	return new driverBuilder().withUser(user)
											.withLat(driver.lat)
											.withLng(driver.lng)
											.withTime(driver.time)
											.getDriver();
}
function getPairedFriendlyPassenger(driver){
	var user = getPairedFriendlyUser(passenger.user);
	return new passengerBuilder().withUser(user)
													.withLat(passenger.lat)
													.withLng(passenger.lng)
													.withLot(passenger.lot)
													.withTime(passenger.time)
													.getPassenger();
}
function getPairedFriendlyUser(user){
	
		return new userBuilder().withName(user.getName())
										.withUserID(user.getID())
										.withEmail(user.getEmail())
										.withPhone(user.getPhone())
										.withPicture(user.getPicture())
										.getUser();
}
function removeDriver(driver){
	var index = getDriverByID(driver.getID());
	if(index != -1){
		drivers.splice(i,1);
		broadcastRemoveDriver(driver.getID());
		console.log("#" + driver.getID() +" unlisted from drivers.");
	}
}
function removePassenger(passenger){
	var index = getPassengerByID(passenger.getID());
	if(index != -1){
		passengers.splice(index,1);
		broadcastRemovePassenger(passenger.getID());
		console.log("#" + passenger.getID() +" unlisted from passengers.");
	}
}
function broadcastRemoveDriver(userid){
	users.forEach(function(usr){
		usr.getSocket().emit("removeDriver",userid);
	});
}
function broadcastRemovePassenger(userid){
	users.forEach(function(usr){
		usr.getSocket().emit("removePassenger",userid);
	});
}
