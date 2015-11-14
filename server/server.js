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

printParkList();
addUser("Henry","broncobuster@yahoo.com","555-9696", "A effing Dragon");
addPark("1000","2000","20000","11:28:50");
printParkList();
removePark('10000');
userExists("Tom ","nunyabizznes","525-999","camry ");
printPickupList();

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
	var sql = 'INSERT into users( name, email, phone, car) VALUES('+name+', '+email+', '+phone+','+ car+')';
	if(userExists(name,email,phone,car)==false) query(sql);
	else console.log("CAN'T ADD: USER " + name + " ALREADY IN users");
	query(sql);
}
function removeUser(userID){
	var sql ='DELETE from users where userid ='+userid;
	if(userExistsInTable("users",userID)) query(sql);
	else console.log("CAN'T DELETE: USER " + userID + " NOT IN users");
	query(sql);
}
// DONE CHECK THIS
function userExists(name,email,phone,car){
	var sql = 'SELECT count (*) from users where email='+email;
	console.log(result);
	var result = query(sql);
	console.log(result);
	if(result == 0) return false;
	else return true;
}
function addPark(userID,lat,lon,parkTime){
	var sql ='INSERT into park(userid,lat,lon,parkTime) VALUES('+userID+','+ lat+','+ lon+',' +parkTime+')';
	if(!userExistsInTable("park",userID)) query(sql);
	else console.log("CAN'T ADD: USER " + userID + " ALREADY IN park");
}
function removePark(userID){
	var sql ='DELETE from park where parkid= '+userID;
	if(userExistsInTable("park",userID)) query(sql);
	else console.log("CAN'T DELETE: USER " + userID + " NOT IN park");
}
function addPickup(userID,lat,lon,time,lot){
	var sql = 'INSERT into pickup(userid,lat,lon,parkTime, lot) VALUES('+userid+','+ lat+','+ lon+',' +parkTime+','+lot+')';
	if(!userExistsInTable("pickup",userID)) query(sql);
	else console.log("CAN'T ADD: USER " + userID + " ALREADY IN pickup");
}
function removePickup(userID){
	var sql = 'DELETE from pickup where pickupid= '+userid;
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
	var sql = 'SELECT COUNT (userid) from '+table+' where userid= '+userID;
	var result = query(sql);
	if(result == 0/*SOMETHING HERE*/) return false;
	else return true;
}