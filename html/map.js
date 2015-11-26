var MyMap;
var drivers = new Array();
var lots = new Array();
var showDrivers = true;
var showLots = true;
var passengers = new Array();
var drivers = new Array();
var me = -1;
var socket;
var connected = false;
var requesting = false;
var locationIntervalID = -1;

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
		minZoom: 16,
		styles: [
			{
			elementType: "labels.icon",
			stylers: [{visibility: "off"}]
			}
		]
	}
	MyMap = new google.maps.Map(mapCanvas, mapOptions);
	MyMap.addListener("click",function(){
		angular.element(document.getElementById('controller')).scope().disableBottomSlider();
	});
	MyMap.addListener("dragstart",function(){
		angular.element(document.getElementById('controller')).scope().disableBottomSlider();
	});
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
		user.name = name;
	}
	this.getName = function(){
		return user.name;
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
		user.userid = userid;
	}
	this.getID = function(){
		return user.userid;
	}
	this.setLot = function(newLot){
		lot = newLot;
	}
	this.getLot = function(){
		return lot;
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
}
function Driver(){
	var user = {userid:0};
	var time = 0;
	var lat = 0;
	var lng = 0;
	var paired = new Array();
	var marker = new google.maps.Marker({
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
		lat = lat;
		lng = lng;
		// console.log(lat + ", " + lng);
		marker.setPosition(new google.maps.LatLng(lat,lng));
	};
	this.setMap = function(map){
		marker.setMap(map);
	};
	this.removeMap = function(){
		marker.setMap(null);
	}
	marker.addListener('click', function(){
		angular.element(document.getElementById('controller')).scope().toggleBottomSlider();
		$(bottomSlider1).html(user.name);
		$(bottomSlider2).html("Seeking parking at: " + time);
		$(bottomSlider3).html("<button onclick='carClick()'> Pair with " + user.name+ "</button>")
		$(bottomSlider4).html(user.userid);
	});
	this.setName = function(name){
		user.name = name;
	}
	this.getName = function(){
		return user.name;
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
				passengers.splice(i,1);
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
		user.userid = userid;
	}
	this.getID = function(){
		return user.userid;
	}
}
function driverBuilder(){
	driver = new Driver();
	this.withUserID = function(userid){
		driver.setID(userid);
		return this;
	}
	this.withTime = function(time){
		driver.setTime(time);
		return this;
	}
	this.withLat = function(lat){
		driver.setLatLng(lat,driver.getLng());
		return this;
	}
	this.withLng = function(lng){
		driver.setLatLng(driver.getLat(),lng);
		return this;
	}
	this.getDriver = function(){
		return driver;
	}
	this.withName = function(name){
		driver.setName(name);
		return this;
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
		angular.element(document.getElementById('controller')).scope().toggleBottomSlider();
		$(bottomSlider1).html(name);
		var s = "";
		if(passengers.length != 1) s+="s"
		$(bottomSlider2).html(passengers.length + " user" + s + " seeking pickup");
		$(bottomSlider3).html("<button onclick='parkingLotClick()'> Get a ride to " + name + "</button>")
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
	this.removePassenger = function(userid){
		var index = getPassengerIndexByID(userid)
		if(index != -1){
			passengers.splice(index,1);
		}
	}
}
function parkingLotClick(){
	var name = $(bottomSlider1).html();
	var lot = getLotByName(name);
	angular.element(document.getElementById('controller')).scope().displayRequestPickup();
	angular.element(document.getElementById('controller')).scope().refresh();
	addBlur();
	document.getElementById("lot").value = name;
}
function carClick(){
	var userid = $(bottomSlider4).html();
	console.log(userid)
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
		connected = true;
		initializeUsers(data.passengers,data.drivers);
		socket.removeListener("data");
	});
	socket.on("location",updateLocation);
	socket.on("newPassenger",addPassenger);
	socket.on("newDriver",addDriver);
	socket.on("removeDriver",removeDriver);
	socket.on("removePassenger",removePassenger);
}
function addDriver(data){
	var driver = getDriverFromData(data);
	if(!!me.user && driver.getID() === me.user.userid){
		return;
	}
	addDriverToMap(driver);
	this.drivers.push(driver);
}
function addPassenger(data){
	var passenger = getPassengerFromData(data);
	if(!!me.user && passenger.getID() === me.user.userid){
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
											.withName(passenger.user.name)
											.getPassenger();
}
function getDriverFromData(driver){
	return new driverBuilder().withUserID(driver.user.userid)
											.withTime(driver.time)
											.withLat(driver.lat)
											.withLng(driver.lng)
											.withName(driver.user.name)
											.getDriver();
}
function initiatePark(){
	var time = document.getElementById("time2").value;
	console.log(time);
	getMyLocation(function(data){
		
		socket.emit("park", {lat:data.lat,lng:data.lng,time:time});
	});
	
	socket.on("park",function(data){
		if(data.success){
			
			me = new driverBuilder().withLat(data.lat)
													.withLng(data.lng)
													.withTime(data.time)
													.withUserID(data.user.userid)
													.withName(data.user.name)
													.getDriver();
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
													.withName(data.user.name)
													.withUserID(data.user.userid)
													.getPassenger();
		}
		lot.addPassenger(me);
		socket.removeListener("pickup");
	});
};
function login(callback){
	var email  = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	if(!connected) {
		alert("Unable to find server.");
		return;
	}
	socket.emit("login", {email:email,password:password});
	socket.on("login", function(data){
		socket.removeListener("login");
		if(!data.success){
			alert("Unable to Login (Password Incorrect or User Already Logged In.)");
			if(!!callback) callback(false);
			console.log("Invalid login credentials provided.");
			return; 
		} else {
			if(!!callback) callback(true);
			removeBlur();
			angular.element(document.getElementById('controller')).scope().login();
			locationIntervalID = setInterval(function(){
				updateMyLocation();
			},1000);
		}
	});
};
function logout(){
	socket.close();
}
function updateMyLocation(){
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
			clearInterval(locationIntervalID);
		}, {
			 enableHighAccuracy: true
		}
	);
}
function getPassengerByID(id){
	for(var lotIndex = 0; lotIndex < lots.length; lotIndex++){
		var passengers = lots[lotIndex].getPassengers();
		for(var passengerIndex = 0; passengerIndex < passengers.length;passengerIndex++){
			if(passengers[passengerIndex].getID() === id){
				return passengers[passengerIndex];
			}
		}
	}
	return -1;
}
function getDriverByID(id){
	for(var i = 0; i < drivers.length; i++){
		if(drivers[i].getID() == id) return drivers[i];
	}
	return -1;
}
function updateLocation(data){
	//For other users who are updating their location. 
	var passenger = getPassengerByID(data.userid);
	var driver = getDriverByID(data.userid);
	if(passenger != -1){
		passenger.setLatLng(data.lat,data.lng);
		// updateLocationGoogleMaps(passenger,data.lat,data.lng);
	} else if(driver != -1){
		driver.setLat(data.lat);
		driver.setlng(data.lng);
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
			fName: e.getName(),
			departTime: e.getTime()
		});
	});
	return htmlArray;
}
function getPassengerListHTML(){
	var htmlArray= new Array();
		getPassengerList().forEach(function(e){
			htmlArray.push({
				fName: e.getName(),
				departTime: e.getTime(),
				lot: e.getLot()
			});
		});
	return htmlArray;
}
function currentlyRequesting(){
	if(me == -1 || (getPassengerByID(me.getID()) == -1 && getDriverByID(me.getID()) == -1))
		return false;
	return true;
}
function cancelRequest(){
	angular.element(document.getElementById('controller')).scope().returnToMap();
	clearInterval(locationIntervalID);
	removeDriver(me.getID());
	removePassenger(me.getID());
	socket.emit("cancel");
	me = -1;
	
}
function removeDriver(userid){
	var driver = getDriverByID(userid);
	var index = getDriverIndexByID(userid);
	if(index != -1){
		drivers.splice(index,1);
		removeDriverFromMap(driver);
	}
}
function removePassenger(userid){
	var passenger = getPassengerByID(userid);
	var lotIndex = getPassengerLotIndexByID(userid);
	if(lotIndex != -1){
		lots[lotIndex].removePassenger(userid);
	}
}
function getDriverIndexByID(id){
	for(var i = 0; i < drivers.length; i++){
		if(drivers[i].getID() == id) return i;
	}
	return -1;
}
function getPassengerIndexByID(id){
	for(var lotIndex = 0; lotIndex < lots.length; lotIndex++){
		var passengers = lots[lotIndex].getPassengers();
		for(var passengerIndex = 0; passengerIndex < passengers.length;passengerIndex++){
			if(passengers[passengerIndex].getID() === id){
				return passengerIndex;
			}
		}
	}
	return -1;
}
function getPassengerLotIndexByID(id){
	for(var lotIndex = 0; lotIndex < lots.length; lotIndex++){
		var passengers = lots[lotIndex].getPassengers();
		for(var passengerIndex = 0; passengerIndex < passengers.length;passengerIndex++){
			if(passengers[passengerIndex].getID() === id){
				return lotIndex;
			}
		}
	}
	return -1;
}


//make updateLocation edit local user data not just  remote data
//pair
//removeListeners all over the place
//updatePassengerLocationGoogleMaps(passenger,lat,lng);
//updateDriverLocationGoogleMaps(driver,lat,lng);
//TODO remove users when logout

