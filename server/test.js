var mysql = require('mysql');

var my_client = mysql.createConnection({
host: 'localhost',
user: 'root',
port:'3306',
password: 'mysqlpassword',
database: 'perk'
});
my_client.connect();
 
var sql = 'select * from users';
 
my_client.query(sql, function (err, rows, fields) {
        if (err) {
                console.log('can not connect');
                console.log(err);
                return;
        }
 
        for (var i in rows) {
                console.log(rows[i]);
        }
});
my_client.end();

//var x = connection.query('SELECT EXISTS(SELECT 1 from users where email="smashtilldawn.com")');    
//console.log(x);

