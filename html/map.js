var MyMap;
var drivers = new Array();
var lots = new Array();
var showDrivers = true;
var showLots = true;
var passengers = new Array();
var drivers = new Array();
var me = -1;
var socket;


function tempLogin(){
	var users =  ["smashtilldawn.com","smashlawn.com"]
	var num = prompt("Test User Number (0,1,2,3,4......)", "");
	login(users[num],"");
	
	
}
function initializeMap() {
	var mapCanvas = document.getElementById('googlemaps');
	var mapOptions = {
		center: new google.maps.LatLng(34.0569172,-117.8217494),
		zoom: 17,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		streetViewControl: false,
		mapTypeControl: false,
		disableDefaultUI: true,
		draggable: false,
		zoomControl: false,
		scrollwheel: false,
		disableDoubleClickZoom: true,
		styles: [
			{
			elementType: "labels.icon",
			stylers: [{visibility: "off"}]
			}
		]
	}
	MyMap = new google.maps.Map(mapCanvas, mapOptions);
	initializeLots();
}
function disableUserInput(map){
	map.setOptions({draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true});
}
function enableUserInput(map){
	map.setOptions({draggable: true, zoomControl: true, scrollwheel: true, disableDoubleClickZoom: false});
}
function setShowDrivers(b){
	showDrivers = b;
		if(drivers.length == 0) return;
		if(b) {
			drivers.forEach(function(e){
				e.setMap(MyMap);
			});
		} else {
			drivers.forEach(function(e){
				e.removeMap();
			});
		}
}
function setShowLots(b){
	showLots = b;
		if(lots.length == 0) return;
		if(b) {
			lots.forEach(function(e){
				e.setMap(MyMap);
			});
		} else {
			lots.forEach(function(e){
				e.removeMap();
			});
		}
}
function addLot(lot){
	lots.push(lot);
	if(showLots) lot.setMap(MyMap);
}
function removeLot(lot){
		var index = lots.indexOf(lot);
		lot.removeMap();
		lots.splice(index, 1);
}
function addDriverToMap(driver){
		if(showDrivers) driver.setMap(MyMap);
}
function removeDriverFromMap(driver){
	driver.removeMap();
}
function addPassengerToMap(passenger){
	//TODO
}
function updateLocationGoogleMaps(user,lat,lng){
	user.setLatLng(lat,lng);
}
function loadSlider(){
		angular.element(document.getElementById('controller')).scope().toggleBottomSlider();
}
function initializeLots(){
	var data = getLotData();
	for(var i = 0; i < data.length; i++){
		var lot = new Lot(data[i].name,data[i].lat,data[i].lng);
		lots.push(lot);
	}
}
function getLotData(){
	return [
		{
			name: "J Lot",
			lat: 34.057220,
			lng: -117.828868
		},
		{
			name: "M Lot",
			lat: 34.055495, 
			lng: -117.828921
		},
		{
			name: "C Lot",
			lat: 34.058555, 
			lng: -117.819128
		},
		{
			name: "F8 Lot",
			lat: 34.059124, 
			lng: -117.817111
		},
		{
			name: "F9 Lot",
			lat: 34.060101, 
			lng: -117.815481
		},
		{
			name: "F5 Lot",
			lat: 34.061577, 
			lng: -117.815448
		},
		{
			name: "F10 Lot",
			lat: 34.060999, 
			lng: -117.814622
		},
		
		{
			name: "F3 Lot",
			lat: 34.062003, 
			lng: -117.816296
		},
		{
			name: "F1 Lot",
			lat: 34.062261, 
			lng: -117.816918
		},
		{
			name: "F2 Lot",
			lat: 34.061488, 
			lng: -117.817680
		},
		{
			name: "F4 Lot",
			lat: 34.060990, 
			lng: -117.817390
		},
		{
			name: "Parking Structure",
			lat: 34.060243, 
			lng: -117.816940
		}
	];
	
}
function Passenger(){
	this.user = {userid:0};
	this.lot = 0;
	this.lat = 0;
	this.lng = 0;
	this.time = 0;
	this.paired = new Array();
	this.setLatLng = function(lat,lng){
		this.lat = lat;
		this.lng = lng;
	};
}
function passengerBuilder(){
	passenger = new Passenger();
	this.withUserID = function(userid){
		passenger.user.userid = userid;
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
	this.user = {userid:0};
	this.time = 0;
	this.lat = 0;
	this.lng = 0;
	this.paired = new Array();
	this.marker = new google.maps.Marker({
		position: new google.maps.LatLng(this.lat, this.lng),
		icon: {
			url: "assets/imgs/car.png",
			scaledSize: new google.maps.Size(40, 40),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(0, 0)
		},
		animation: google.maps.Animation.DROP
	});
	this.setLatLng = function(lat,lng){
		this.lat = lat;
		this.lng = lng;
		// console.log(lat + ", " + lng);
		this.marker.setPosition(new google.maps.LatLng(lat,lng));
	};
	this.setMap = function(map){
		this.marker.setMap(map);
	};
	this.removeMap = function(){
		marker.setMap(null);
	}
	this.marker.addListener('click', loadSlider);
}
function driverBuilder(){
	driver = new Driver();
	this.withUserID = function(userid){
		driver.user.userid = userid;
		return this;
	}
	this.withTime = function(time){
		driver.time = time; 
		return this;
	}
	this.withLat = function(lat){
		driver.setLatLng(lat,driver.lng);
		return this;
	}
	this.withLng = function(lng){
		driver.setLatLng(driver.lat,lng);
		return this;
	}
	this.getDriver = function(){
		return driver;
	}
}
function Lot(name,lat,lng){
	var passengers = new Array();
	var name = name;
	var marker = new google.maps.Marker({
		map:MyMap,
		position: new google.maps.LatLng(lat, lng),
		icon: {
			url: "assets/imgs/parking.png",
			scaledSize: new google.maps.Size(40, 40),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(20, 20)
		}
	});
	marker.addListener('click', function(){
		console.log(name);
		console.log(passengers);
	});
	this.addPassenger = function(passenger){
		passengers.push(passenger);
	}
	this.getPassengers = function(){
		return passengers;
	}
	this.getName = function(){
		return name;
	}
}



//TEST COMMANDS
/////////////////////////////////////////////////////////////////////////////////
// login("smashtilldawn.com","");initiatePark("mytime");
//login("smashlawn.com","");initiatePark("mytime");
//initiatePark(14.24,124.44,"mytime");
// initiatePassenger(14.24,124.44,"mytime","F");
///////////////////////////////////////////////////////////////////////////////////

function initializeSocket(){
	socket = io.connect('http://www.p3rk.net:8001');
	socket.on('data', function(data){
		initializeUsers(data.passengers,data.drivers);
		socket.removeListener("data");
	});
	socket.on("location",function(data){
		updateLocation(data);
	});
	socket.on("newPassenger",function(data){
		addPassenger(data);
	});
	socket.on("newDriver",function(data){
		addDriver(data);
	});
}
function addDriver(data){
	var driver = getDriverFromData(data);
	if(!!me.user && driver.user.userid === me.user.userid){
		return;
	}
	addDriverToMap(driver);
	this.drivers.push(driver);
}
function addPassenger(data){
	var passenger = getPassengerFromData(data);
	if(!!me.user && passenger.user.userid === me.user.userid){
		return;
	}
	addPassengerToMap(passenger);
	var lot = getLotByName(data.lot);
	if(lot === -1) {
		console.log("Unable to find lot: " + lotName + ".")
		return;
	}
	lot.addPassenger(passenger);
}
function initializeUsers(passengers,drivers){
	passengers.forEach(function(passenger){
		addPassenger(passenger);
	});
	drivers.forEach(function(driver){
		addDriver(driver);
	});
};
function getPassengerFromData(passenger){
	return new passengerBuilder().withUserID(passenger.user.userid)
											.withLot(passenger.lot)
											.withTime(passenger.time)
											.getPassenger();
}
function getDriverFromData(driver){
	return new driverBuilder().withUserID(driver.user.userid)
											.withTime(driver.time)
											.withLat(driver.lat)
											.withLng(driver.lng)
											.getDriver();
}
function initiatePark(time){
	getMyLocation(function(data){
		
		socket.emit("park", {lat:data.lat,lng:data.lng,time:time});
	});
	
	socket.on("park",function(data){
		if(data.success){
			
			me = new driverBuilder().withLat(data.lat)
													.withLng(data.lng)
													.withTime(data.time)
													.getDriver();
			me.user = {userid:data.user.userid};
			drivers.push(me);
			addDriverToMap(me);
		}
		socket.removeListener("park");
	});
};
function initiatePickup(){
	var time = document.getElementById("time").value;
	var lotName = document.getElementById("lot").options[document.getElementById("lot").selectedIndex].value;
	var lot = getLotByName(lotName);
	if(lot === -1) {
		console.log("Unable to find lot: " + lotName + ".")
		return;
	}
	getMyLocation(function(data){
		socket.emit("pickup", {lat:data.lat,lng:data.lng,time:time,lot:lotName});
	});
	socket.on("pickup",function(data){
		if(data.success){
			me = new passengerBuilder().withLat(data.lat)
													.withLng(data.lng)
													.withTime(data.time)
													.withLot(data.lot)
													.getPassenger();
		}
		me.user = {userid: data.user.userid};
		lot.addPassenger(me);
		socket.removeListener("pickup");
	});
};
function login(callback){
	var email  = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	socket.emit("login", {email:email,password:password});
	socket.on("login", function(data){
		socket.removeListener("login");
		if(!data.success){
			if(!!callback) callback(false);
			console.log("Invalid login credentials provided.");
			return; 
		} else {
			if(!!callback) callback(true);
			var intervalID = setInterval(function(){
				updateMyLocation(intervalID);
			},1000);
		}
	});
};
function logout(){
	socket.close();
}
function updateMyLocation(intervalID){
	//for you when you are updating your location
	if(me == -1) return;
	
	if(!navigator.geolocation){
		alert('Please allow location sharing.');
	}
	navigator.geolocation.getCurrentPosition(
		function(position) {
			var data = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			if(!!data){
				socket.emit("location",data);
				
				updateLocationGoogleMaps(me,data.lat,data.lng);
			} 
			
		},
		function(error){
			console.log(error);
			clearInterval(intervalID);
		}, {
			 enableHighAccuracy: true
		}
	);
}
function getPassengerByID(id){
	for(var lotIndex = 0; lotIndex < lots.length; lotIndex++){
		var passengers = lots[lotIndex].getPassengers();
		for(var passengerIndex = 0; passengerIndex < passengers.length;passengerIndex++){
			if(passengers[passengerIndex].user.userid === id){
				return passengers[passengerIndex];
			}
		}
	}
	return -1;
}
function getDriverByID(id){
	for(var i = 0; i < drivers.length; i++){
		if(drivers[i].user.userid == id) return drivers[i];
	}
	return -1;
}
function updateLocation(data){
	//For other users who are updating their location. 
	var passenger = getPassengerByID(data.userid);
	var driver = getDriverByID(data.userid);
	if(passenger != -1){
		passenger.lat = data.lat;
		passenger.lng = data.lng;
		// updateLocationGoogleMaps(passenger,data.lat,data.lng);
	} else if(driver != -1){
		driver.lat = data.lat;
		driver.lng = data.lng;
		updateLocationGoogleMaps(driver,data.lat,data.lng);
	} else {
		console.log("User MIA for location update. (id = " + data.userid + ")");
	}
}
function getMyLocation(callback){
		//for you when you are updating your location
	if(!navigator.geolocation){
		alert('Please allow location sharing.');
	}
	navigator.geolocation.getCurrentPosition(
		function(position) {
			var data = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			callback(data);
		},
		function(error){
			console.log(error);
			//clearInterval(intervalID);
		}, {
			 enableHighAccuracy: true
		}
	);
}
function getLotByName(name){
	for(var i = 0; i < lots.length; i++){
		if(lots[i].getName() === name) return lots[i];
	}
	return -1;
}
function getPassengerList(){
	var passengers = new Array();
	lots.forEach(function(e){
		if(e.getPassengers().length != 0){
			e.getPassengers().forEach(function(e){
				passengers.push(e);
			});
		}
	});
	return passengers;
}
function getDriverListHTML(){
	var htmlArray= new Array();
	drivers.forEach(function(e){
		htmlArray.push({
			fname: e.user.name,
			departTime: e.time
		});
	});
	return htmlArray;
}
function getPassengerListHTML(){
	var htmlArray= new Array();
		getPassengerList().forEach(function(e){
			htmlArray.push({
				fname: e.user.name,
				departTime: e.time,
				lot: e.lot
			});
		});
	return htmlArray;
}


getDriverListHTML()

array = [
	{
		fname: "asasdsad",
		departTime: "asdasd"
	}
]




//make updateLocation edit local user data not just  remote data
//pair
//removeListeners all over the place
//updatePassengerLocationGoogleMaps(passenger,lat,lng);
//updateDriverLocationGoogleMaps(driver,lat,lng);
//TODO remove users when logout

