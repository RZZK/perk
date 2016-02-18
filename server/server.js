process.stdout.write("\u001b[2J\u001b[0;0H");
console.log("--------------------------------SERVER STARTED--------------------------------")
console.log("------------------------------------------------------------------------------")
var mysql = require('mysql');

var my_client = mysql.createConnection({
host: 'localhost',
user: 'perk',
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
function getTempUser (callback){
	var sql = "SELECT email,passowrd FROM users WHERE email LIKE perkuser";
	return query(sql,function(x,y,z){
		callback(y);
	})
}



//--------------------END SQL FUNCTIONS -----------------------------------------//

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

var nonusers = new Array();
var users = new Array();
var passengers = new Array();
var drivers = new Array();
io.on('connection', function (socket) {
	console.log("socket " + socket.id + " opened.")
	nonusers.push(socket);
	socket.on("loginWithoutAccount",function(){
		loginWithoutAccount(socket);
	});
	socket.on("login", function(data){
		userLogin(data,socket);
	});
	socket.on('disconnect',function(){
		removeUserBySocket(socket);
		console.log("socket " + socket.id + " closed.");
	});
	socket.emit("data",{passengers:getClientFriendlyPassengerList(),drivers:getClientFriendlyDriverList()});
});
function loginWithoutAccount(socket){
		removeFromNonUsers(socket);
		var userid = parseInt(10000 * Math.random());
		var name = "anon" + parseInt(100 * Math.random());
		var phone = parseInt(10000000 * Math.random());
		var email = parseInt(100000 * Math.random()) + "@perk.com";
		var password = parseInt(10000000* Math.random());
		user = new userBuilder().withUserID(userid)
								.withName(name)
								.withPhone(phone)
								.withEmail(email)
								.withPicture("")
								.withSocket(socket).getUser();
		
		users.push(user);
		console.log("#" + user.userid + " logged in.");
		socket.emit("loginWithoutAccount",{email:email,password:password});
		
		socket.on("pickup", function(data){
			initiatePickup(data,user)
		});
		socket.on("park", function(data){
			initiatePark(data,user)
		});
}
function userLogin(data,socket){
	var user;
	if(indexOfUserByEmail(data.email) != -1){
		socket.emit("login",{success:false});
		console.log(data.email + " already logged in.");
		return;
	}
	getUser(data.email,data.password,function(x,y,z){
		if(y.length == 0){
			socket.emit("login",{success:false});
			return;
		}
		socket.emit("login",{success:true});
		removeFromNonUsers(socket);
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
	if(indexOfPassengerByID(user.userid) != -1){
		user.socket.emit("park",{success:false})
		return;
	}
	if(indexOfDriverByID(user.userid) != -1){
		user.socket.emit("park",{success:false})
		return;
	}
	var driver = new driverBuilder().withUser(user)
														.withLat(data.lat)
														.withLng(data.lng)
														.withTime(data.time)
														.getDriver();
	var driverForClient = getClientFriendlyDriver(driver);
	
	driverForClient.success = true;
	user.socket.emit("park",driverForClient);	
	drivers.push(driver);
	broadcastNewDriver(driver);
	console.log("#" + user.userid + " added to drivers.");
	user.socket.on("location",function(data){
		updateLocation(driver,data);
	});
	user.socket.on("pair",function(data){
		driverPair(driver,data);
	});
	user.socket.on("cancel",function(){
		removeDriver(driver);
	});
	user.socket.on("unpair",function(e){
		console.log("#" + user.userid + " unpairing from #" + e + ".")
		for(var i = 0; i < driver.paired.length; i++){
			if(driver.paired[i] == e){
				driver.paired.splice(i,1);
			}
		}
	});
}
function initiatePickup(data,user){
	//input format: [lat:14.415,lng:124241.124214,time:'23:41:44',lot: 'F']
	if(indexOfPassengerByID(user.userid) != -1){
		socket.emit("pickup",{succes:false})
		return;
	}
	if(indexOfDriverByID(user.userid) != -1){
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
	user.socket.emit("pickup",passengerForClient);		
	
	passengers.push(passenger);
	broadcastNewPassenger(getClientFriendlyPassenger(passenger));
	
	console.log("#" + user.userid + " added to passengers.");
	
	user.socket.on("location",function(data){
		updateLocation(passenger,data);
	});
	user.socket.on("pair",function(data){
		passengerPair(passenger,data);
	});
	user.socket.on("cancel",function(){
		removePassenger(passenger);
	});
	user.socket.on("unpair",function(e){
		console.log("#" + user.userid + " unpairing from #" + e + ".")
		for(var i = 0; i < passenger.paired.length; i++){
			if(passenger.paired[i] == e){
				passenger.paired.splice(i,1);
			}
		}
	});
}
function updateLocation(user,data){
	user.lat = data.lat;
	
	user.lng = data.lng;
	data.userid = user.user.userid;
	users.forEach(function(elem){
		if(user.socket !== elem.socket) elem.socket.emit("location",data);
	});
}
function broadcastNewPassenger(passenger){
	var pass = getClientFriendlyPassenger(passenger);
	users.forEach(function(usr){
		if(passenger.user.socket !== usr.socket) usr.socket.emit("newPassenger",pass);
	});
	nonusers.forEach(function(usr){
		if(passenger.user.socket !== usr) usr.emit("newPassenger",pass);
	});
}
function broadcastNewDriver(driver){
	var drive = getClientFriendlyDriver(driver);
	users.forEach(function(usr){
		if(driver.user.socket !== usr.socket) usr.socket.emit("newDriver",drive);
	});
	nonusers.forEach(function(usr){
		if(driver.user.socket !== usr) usr.emit("newDriver",drive);
	});
}
function driverPair(driver,data){
	//data format: {userid:userid}
	console.log(driver.user.userid + " -> " + data);
	var passenger = getPassengerByID(data);
	if(passenger == -1){
		console.log("Tried to add passenger that doesn't exist.")
		return; 
	}
	driver.paired.push(data);
	var index = -1;
	for(var i = 0; i < passenger.paired.length; i++){
		if(passenger.paired[i] == driver.user.userid){
			index = i;
			break;
		}
	}
	if(index != -1){
		pairUsers(driver,passenger);
	}
}
function passengerPair(passenger,data){
	console.log(passenger.user.userid + " -> " + data);
	var driver = getDriverByID(data);
	if(driver == -1){
		console.log("Tried to add driver that doesn't exist.");
		return; 
	}
	passenger.paired.push(data);
	var index = -1;
	for(var i = 0; i < driver.paired.length; i++){
		if(driver.paired[i] == passenger.user.userid){
			index = i;
			break;
		}
	}
	if(index != -1){
		pairUsers(driver,passenger);
	}
}
function getPassengerByID(id){
	for(var i = 0; i < passengers.length; i++){
		if(passengers[i].user.userid == id) return passengers[i];
	}
	return -1;
}
function getDriverByID(id){
	for(var i = 0; i < drivers.length; i++){
		if(drivers[i].user.userid == id) return drivers[i];
	}
	return -1;
}
function getUserByID(id){
	for(var i = 0; i < users.length; i++){
		if(users[i].userid === id) return users[i];
	}
	return -1;
}
function removeUserBySocket(socket){
	removeFromNonUsers(socket);
	var disconnectionMessage = ""; 
	if(users.length === 0 ) disconnectionMessage = "#??? disconnected";
	else{
		for(var i = 0; i < drivers.length; i++){
			if(drivers[i].user.socket === socket) {
				broadcastRemoveDriver(drivers[i].user.userid);
				drivers.splice(i,1);
				disconnectionMessage += "\nRemoving them from drivers.";
				break;
			}
		}
		for(var i = 0; i < passengers.length; i++){
			if(passengers[i].user.socket === socket) {
				broadcastRemovePassenger(passengers[i].user.userid);
				disconnectionMessage += "\nRemoving them from passengers.";
				passengers.splice(i,1);
				break;
			}
		}
		for(var i = 0; i < users.length;i++){
			var u = users[i]
			if(u.socket === socket){
					users.splice(i,1);
					disconnectionMessage = "#" + u.userid + " disconnected" + disconnectionMessage;
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
	var driverIndex = -1;
	for(var i = 0; i < passenger.paired.length; i++){
		if(passenger.paired[i] == driver.user.userid){
			driverIndex = i;
			break;
		}
	}
	var passengerIndex = -1;
	for(var i = 0; i < driver.paired.length; i++){
		if(driver.paired[i] == passenger.user.userid){
			passengerIndex = i;
			break;
		}
	}
	if(passengerIndex == -1) return;
	if(driverIndex == -1) return;
	console.log("#" + driver.user.userid + " and #" + passenger.user.userid + " paired.");
	driver.user.socket.emit("pair",getPairedFriendlyPassenger(passenger));
	passenger.user.socket.emit("pair",getPairedFriendlyDriver(driver));
	driver.user.socket.on("chat",function(e){
		passenger.user.socket.emit("chat",e);
	});
	passenger.user.socket.on("chat",function(e){
		driver.user.socket.emit("chat",e);
	});
	removeDriver(driver);
	removePassenger(passenger);
	
}
function indexOfPassengerByID(userid){
	passengers.forEach(function(e,i){
		if(e.user.userid === userid) return i;
	});
	return -1;
}
function indexOfDriverByID(userid){
	drivers.forEach(function(e,i){
		if(e.user.userid === userid) return i;
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
													.withLat(passenger.lat)
													.withLng(passenger.lng)
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
function getPairedFriendlyDriver(driver){
	var user = getPairedFriendlyUser(driver.user);
	return new driverBuilder().withUser(user)
											.withLat(driver.lat)
											.withLng(driver.lng)
											.withTime(driver.time)
											.getDriver();
}
function getPairedFriendlyPassenger(passenger){
	var user = getPairedFriendlyUser(passenger.user);
	return new passengerBuilder().withUser(user)
													.withLat(passenger.lat)
													.withLng(passenger.lng)
													.withLot(passenger.lot)
													.withTime(passenger.time)
													.getPassenger();
}
function getPairedFriendlyUser(user){
	
		return new userBuilder().withName(user.name)
										.withUserID(user.userid)
										.withEmail(user.email)
										.withPhone(user.phone)
										.withPicture(user.picture)
										.getUser();
}
function removeDriver(driver){
	var index = getDriverIndexByID(driver.user.userid);
	if(index != -1){
		drivers.splice(index,1);
		broadcastRemoveDriver(driver.user.userid);
		console.log("#" + driver.user.userid +" unlisted from drivers.");
	}
}
function removePassenger(passenger){
	var index = getPassengerIndexByID(passenger.user.userid);
	if(index != -1){
		passengers.splice(index,1);
		broadcastRemovePassenger(passenger.user.userid);
		console.log("#" + passenger.user.userid +" unlisted from passengers.");
	}
}
function broadcastRemoveDriver(userid){
	users.forEach(function(usr){
		usr.socket.emit("removeDriver",userid);
	});
	nonusers.forEach(function(usr){
		usr.emit("removeDriver",userid);
	});
}
function broadcastRemovePassenger(userid){
	users.forEach(function(usr){
		usr.socket.emit("removePassenger",userid);
	});
	nonusers.forEach(function(usr){
		usr.emit("removePassenger",userid);
	});
}
function getDriverIndexByID(userid){
	for(var i = 0; i < drivers.length; i++){
		if(drivers[i].user.userid == userid) return i; 
	}
	return -1;
}
function getPassengerIndexByID(userid){
	for(var i = 0; i < passengers.length; i++){
		if(passengers[i].user.userid == userid) return i; 
	}
	return -1;
}
function currentTime(){
	var date = new Date();
	var hours = date.getHours();
	var min = date.getMinutes();
	var time = hours + ":" + min;
	return time;
}
function convertTime(time){
	var hour = time.split(":")[0];
	var min = parseInt(time.split(":")[1].substring(0,2));
	var index = time.indexOf("PM");
	if(hour == 12 && index == -1){
		return "00:" + min;
	} 
	if (hour == 12){
		return "12:" + min;
	}
	if (index == -1){
		return hour + ":" + min;
	}
	return (hour + 12) + ":" + min;
}
function removeFromNonUsers(socket){
	for(var i = 0; i < nonusers.length; i++){
		if(nonusers[i] === socket){
			nonusers.splice(i,1);
		}
	}
}
