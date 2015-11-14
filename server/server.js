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
prinParkList();

disconnect();

function query(sql){
	my_client.query(sql, function (err, rows, fields) {
		if (err) {
			console.log('can not connect');
			console.log(err);
			return;
		}
		return rows;
	});
}
function disconnect(){
	my_client.end();
}
function addUser(name,email,phone,car){
	var sql = 'INSERT into users( name, email, phone, car) VALUES(name, email, phone, car)';
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
// DONE CHECK THIS
function userExists(Uname,Uemail,Uphone,Ucar){
	var sql = 'SELECT count (email) from users where email=Uemail ';
	var result = query(sql);
	if(result == 0/*SOMETHING HERE*/) return false;
	else return true;
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
// DONE CHECK THIS
function getPickupList(){ //DO THESE FIRST SO YOU CAN USE THEM TO DEBUG
	var sql = 'SELECT * from pickup';
	console.log("Information for the pickup");
	return query(sql);
		
}
// DONE CHECK THIS
function getParkList(){ //DO THESE FIRST SO YOU CAN USE THEM TO DEBUG
	var sql ='SELECT * from park';
	console.log("Information for the park");
	return query(sql);
		
	

}
function printPickupList(){
	console.log(getPickupList());
}
function prinParkList(){
	console.log(getParkList());
}
function userExistsInTable(table,userID){
	var sql = 0/*SOMETHING HERE*/;
	var result = query(sql);
	if(result == 0/*SOMETHING HERE*/) return true;
	else return false;
}