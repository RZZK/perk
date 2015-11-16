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
function Passenger(userid,lat,lng,lot,time){
	this.userid = userid;
	this.lot = lot;
	this.lat = lat;
	this.lng = lng;
	this.time = time;
}
function Driver(userid,car,time){
	this.userid = userid;
	this.car = car;
	this.time = time;
}
function Car(lat,lng,model){
	this.lat = lat;
	this.lng = lng;
	this.model = model;
}
function getCurrentData(callback){
	getPickupList(function(pickupRows){
		getParkList(function(parkRows){
			getUserList(function(userRows){
				var data = {
				pickup: pickupRows,
				park: parkRows,
				users: userRows
			};
			callback(data);
			})
			
		});
	});
}
function indexOfSocket(socket){
		for(var i = 0; i < users.length; i++){
			if(users[i].socket == socket){
				return i;
			}
		}
		return -1;
}
function indexOfUserIDInPassengers(userid){
	for(var i = 0; i < passengers.length; i++){
			if(passengers[i].userid == userid){
				return i;
			}
		}
		return -1;
}
function indexOfUserIDInDrivers(userid){
	for(var i = 0; i < drivers.length; i++){
			if(drivers[i].userid == userid){
				return i;
			}
		}
		return -1;
}
function removeUserBySocket(socket){
	var index = indexOfSocket(socket);
		if(index != -1){
			removePassengerByID(users[index].userid);
			removeDriverByID(users[index].userid);
			console.log("#" + users[index].userid + " disconnected.");
			users.splice(index,1);
		}  else {
			console.log("#??? disconnected.");
		}
}
function removePassengerByID(userid){
	var index = indexOfUserIDInPassengers(userid);
	if(index != -1){
			console.log("#" + passengers[index].userid + " removed from passengers.");
			removePickup(userid);
			passengers.splice(index,1);
		} 
}
function removeDriverByID(userid){
	var index = indexOfUserIDInDrivers(userid);
	if(index != -1){
			console.log("#" + drivers[index].userid + " removed from drivers.");
			removePark(userid);
			drivers.splice(index,1);
		} 
}
function indexOfSocketInDrivers(socket){
	var index = indexOfSocket();
	return indexOfUserIDInDrivers(users[index]);
}
function indexOfSocketInPassengers(socket){
	var index = indexOfSocket();
	return indexOfUserIDInPassengers(users[index]);
}
function getUserBySocket(socket){
	var index = indexOfSocket(socket);
	if(index == -1) console.log("getUserBySocket could not find Socket.");
	return users[index];
}
function sendNewUserToSocket(socket,user){
	socket.emit("new-user",user);
}
function sendNewPassengerToSocket(socket,passenger){
	socket.emit("new-passenger",passenger)
}
function sendNewDriverToSocket(socket,driver){
	socket.emit("new-driver",driver);
}
function indexOfUserByEmail(email){
	for(var i = 0; i < users.length; i++){
		console.log(users[i].email);
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
	getCurrentData(function(data){
		socket.emit('initial', data);
	});
	socket.on('login', function (data) {
		//input format [username:hello,password;goodbye]
		if(indexOfUserByEmail(data.email) != -1){
			console.log(data.email + " already logged in.");
			return;
		}
		getUser(data.email,data.password, function(x,y,z){
			if(y.length != 0){
				var user = y[0];
				users.push(new userBuilder().withUserID(user.userid)
														.withName(user.name)
														.withPhone(user.phone)
														.withEmail(user.email)
														.withPicture(user.picture)
														.withSocket(user.socket).getUser());
				socket.emit("login", user);
				console.log("#" + user.userid + " logged in.");
			}
			else{
				console.log("Incorrect Login Provided.");
			}
		});
	});
	socket.on("pickup",function(data){
		//input format: [lat:14.415,lng:124241.124214,lot: 'F',time:'23:41:44']
		var indexOfUser = indexOfSocket(socket);
		if(indexOfUser == -1) return;
		var indexOfPassenger = indexOfSocketInPassengers(socket);
		if(indexOfPassenger == -1){
			var user = getUserBySocket(socket); 
			var passenger = new Passenger(user.userid,data.lat,data.lng,data.lot,data.time);
			passengers.push(passenger);
			users.forEach(function(usr){
				sendNewPassengerToSocket(usr.socket,passenger);
			});
			addPickup(user.userid,data.lat,data.lng,data.time,data.lot);
			console.log("#" + user.userid + " added to passengers.");
		} else {
			console.log("User already in pickup table.");
		}
	});
	socket.on("park",function(data){
		//input format: [lat:14.415,lng:124241.124214,time:'23:41:44']
		var indexOfUser = indexOfSocket(socket);
		if(indexOfUser == -1) return;
		var indexOfDriver = indexOfSocketInDrivers(socket);
		if(indexOfDriver == -1){
			var user = getUserBySocket(socket); 
			var driver = new Driver(user.userid, new Car(data.lat,data.lng,user.model),data.time);
			drivers.push(driver);
			users.forEach(function(usr){
				sendNewDriverToSocket(usr.socket,driver);
			});
			addPark(user.userid,data.lat,data.lng,data.time);
			console.log("#" + user.userid + " added to drivers.");
		} else {
			console.log("User already in park table.");
		}
	});
	socket.on("location",function(data){
		//data format: {lat:12323.34,lng:1244.5}
		var indexOfUser = indexOfSocket(socket);
		var indexOfDriver = indexOfSocketInDrivers(socket);
		var indexOfPassenger = indexOfSocketInPassengers(socket);
		if(indexOfUser == -1) return;
		if(indexOfDriver != -1){
			drivers[i].lat = data.lat;
			drivers[i].lng = data.lng;
			socket.emit("driver-move",drivers[i]);
		} else if(indexOfPassenger != -1){
			passenger[i].lat = data.lat;
			passenger[i].lng = data.lng;
			socket.emit("passenger-move",passengers[i]);
		} else {
			socket.emit("location","User not found.")
		}
	});
	socket.on('pair',function(data){
	});
	socket.on('disconnect',function(){
		removeUserBySocket(socket);
	});
	
});
//Client socket commands
// passenger-move {lat:12323.34,lng:1244.5}
//driver-move {lat:12323.34,lng:1244.5}
//pickup [lat:14.415,lng:124241.124214,time:'23:41:44']
//park [lat:14.415,lng:124241.124214,time:'23:41:44']
//login [username:hello,password;goodbye]


//TODO stop getCurrentData from sharing users passwords
