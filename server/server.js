var mysql = require('mysql');

var my_client = mysql.createConnection({
host: 'localhost',
user: 'root',
port:'3306',
password: 'mysqlpassword',
database: 'perk'
});
my_client.connect();

//RUN METHODS AS TEST IN HERE
printPickupList()
disconnect();
function query(sql){
	my_client.query(sql,function(x,y,z){});
}
function query(sql,callback){
	my_client.query(sql, callback);
}
function disconnect(){
	my_client.end();
}
function addUser(name,email,phone,car){
	var sql = 0/*SOMETHING HERE*/;
	if(!userExists(name,email,phone,car)) query(sql);
	else console.log("CAN'T ADD: USER " + name + " ALREADY IN users");
	query(sql);
}
function removeUser(userID){
	var sql = 0/*SOMETHING HERE*/;
	if(userExistsInTable("users",userID)) query(sql);
	else console.log("CAN'T DELETE: USER " + userID + " NOT IN users");
	query(sql);
}
function userExists(name,email,phone,car){
	var sql = 0/*SOMETHING HERE*/;
	var result = query(sql);
	if(result == 0/*SOMETHING HERE*/) return true;
	else return false;
}
function addPark(userID,lat,lon,parkTime){
	var sql = 0/*SOMETHING HERE*/
	if(!userExistsInTable("park",userID)) query(sql);
	else console.log("CAN'T ADD: USER " + userID + " ALREADY IN park");
}
function removePark(userID){
	var sql = 0/*SOMETHING HERE*/;
	if(userExistsInTable("park",userID)) query(sql);
	else console.log("CAN'T DELETE: USER " + userID + " NOT IN park");
}
function addPickup(userID,lat,lon,time,lot){
	var sql = 0/*SOMETHING HERE*/;
	if(!userExistsInTable("pickup",userID)) query(sql);
	else console.log("CAN'T ADD: USER " + userID + " ALREADY IN pickup");
}
function removePickup(userID){
	var sql = 0/*SOMETHING HERE*/;
	if(userExistsInTable("pickup",userID)) query(sql);
	else console.log("CAN'T DELETE: USER " + userID + " NOT IN pickup");
}
function getPickupList(callback){ //DO THESE FIRST SO YOU CAN USE THEM TO DEBUG
	var sql = 'SELECT * from pickup'
	console.log("INformation for the pickup");
	query(sql,callback);
}
function getParkList(callback){ //DO THESE FIRST SO YOU CAN USE THEM TO DEBUG
	var sql ='SELECT * from park'
	console.log("Information for the park");
	return query(sql,callback);
		
	

}
function printPickupList(){
	getPickupList(function(err,rows,elem){
		console.log(rows);
	});
}
function printParkList(){
	getParkList(function(err,rows,elem){
		console.log(rows);
	});
}
function userExistsInTable(table,userID){
	var sql = 0/*SOMETHING HERE*/;
	var result = query(sql);
	if(result == 0/*SOMETHING HERE*/) return true;
	else return false;
}

//--------------------END SQL FUNCTIONS -----------------------------------------//


function User(name,email,phone, picture,socket){
	this.socket = socket; 
	this.loggedIn = false;
	this.name = name;
	this.email = email;
	this.phone = phone;
	this.picture = picture;
}
function Passenger(user,lat,lng,time){
	this.user = user;
	this.lat = lat;
	this.lon = lon;
	this.time = time;
}
function Driver(user,car,time){
	this.user = user;
	this.car = car;
	this.time = time;
}
function Car(lat,lng,model){
	this.lat = lat;
	this.lng = lng;
	this.model = model;
}
function getCurrentData(callback){
	getPickupList(function(x,pickupRows,z){
		getParkList(function(x2,parkRows,z2){
			var data = {
				pickup: pickupRows,
				park: parkRows
			};
			callback(data);
		});
	});
}



var app = require('http').createServer();
var io = require('socket.io')(app);
app.listen(8001);


io.on('connection', function (socket) {
	getCurrentData(function(data){
		socket.emit('currentData', data);
	}); 
	socket.on('addUser', function (data) {
		
	});
});