var mysql = require('mysql');

var my_client = mysql.createConnection({
host: 'localhost',
user: 'root',
port:'3306',
password: 'mysqlpassword',
database: 'perk'
});
my_client.connect();

function query(sql){
		return my_client.query(sql, function (err, rows, fields) {
        if (err) {
                console.log('can not connect');
                console.log(err);
                return;
			}
	}
}
function disconnect(){
	my_client.disconnect();
}
function addUser(name,email,phone,car){
	var sql = /*SOMETHING HERE*/;
	if(!userExists(name,email,phone,car)) query(sql);
	else console.log("CAN'T ADD: USER " + name + " ALREADY IN users");
	query(sql);
}
function removeUser(userID){
	var sql = /*SOMETHING HERE*/;
	if(userExistsInTable("users",userID) query(sql);
	else console.log("CAN'T DELETE: USER " + userID + " NOT IN users");
	query(sql);
}
function userExists(name,email,phone,car){
	var sql = /*SOMETHING HERE*/;
	var result = query(sql);
	if(result == /*SOMETHING HERE*/) return true;
	else return false;
}
function addPark(userID,lat,lon,parkTime){
	var sql = /*SOMETHING HERE*/
	if(!userExistsInTable("park",userID)) query(sql);
	else console.log("CAN'T ADD: USER " + userID + " ALREADY IN park");
}
function removePark(userID){
	var sql = /*SOMETHING HERE*/;
	if(userExistsInTable("park",userID)) query(sql);
	else console.log("CAN'T DELETE: USER " + userID + " NOT IN park");
}
function addPickup(userID,lat,lon,time,lot){
	var sql = /*SOMETHING HERE*/;
	if(!userExistsInTable("pickup",userID)) query(sql);
	else console.log("CAN'T ADD: USER " + userID + " ALREADY IN pickup");
}
function removePickup(userID){
	var sql = /*SOMETHING HERE*/;
	if(userExistsInTable("pickup",userID)) query(sql);
	else console.log("CAN'T DELETE: USER " + userID + " NOT IN pickup");
}
function getPickupList(){
	var sql = /*SOMETHING HERE*/;
	return query(sql);
}
function getParkList(){
	var sql = /*SOMETHING HERE*/;
	return query(sql);
}
function userExistsInTable(table,userID){
	var sql = /*SOMETHING HERE*/;
	var result = query(sql);
	if(result == /*SOMETHING HERE*/) return true;
	else return false;
}