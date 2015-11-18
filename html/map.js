var MyMap;
var drivers = new Array();
var lots = new Array();
var showDrivers = true;
var showLots = false;
var passengers = new Array();
var drivers = new Array();
var me = -1;
var socket;

initializeSocket();
login("smashtilldawn.com","",function(data){});
initiatePark("mytime");
function initializeMap() {
	var mapCanvas = document.getElementById('googlemaps');
	var mapOptions = {
		center: new google.maps.LatLng(34.0569172,-117.8217494),
		zoom: 16,
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
			scaledSize: new google.maps.Size(50, 50),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(0, 0)
		},
		animation: google.maps.Animation.DROP
	});
	this.setLatLng = function(lat,lng){
		this.lat = lat;
		this.lng = lng;
		var pos = new google.maps.LatLng(lat,lng);
		console.log(pos);
		this.marker.setPosition(pos);
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




//TEST COMMANDS
/////////////////////////////////////////////////////////////////////////////////
// login("smashtilldawn.com","");
//login("smashlawn.com","");
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
	addDriverToMap(driver);
	this.drivers.push(driver);
}
function addPassenger(data){
	var passenger = getPassengerFromData(data);
	addPassengerToMap(passenger);
	this.passengers.push(passenger);
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
		}
		socket.removeListener("park");
	});
};
function initiatePassenger(lat,lng,time,lot){
	socket.emit("pickup", {lat:lat,lng:lng,time:time,lot:lot});
	socket.on("pickup",function(data){
		if(data.success){
			me = new passengerBuilder().withLat(lat)
													.withLng(lng)
													.withTime(time)
													.withLot(lot)
													.getPassenger();
		}
		passengers.push(me);
		socket.removeListener("pickup");
	});
};
function login(email,password,callback){
	socket.emit("login", {email:email,password:password});
	socket.on("login", function(data){
		socket.removeListener("login");
		if(!data.success){
			callback(false);
			console.log("Invalid login credentials provided.");
			//TODO angular connection
			
			return; 
		} else {
			callback(true);
			//TODO angular connection
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
			//clearInterval(intervalID);
		}, {
			 enableHighAccuracy: true
		}
	);
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
		// updateLocationGoogleMaps(driver,data.lat,data.lng);
		//TODO fix updateLocationGoogleMaps so it doesn't remove the icon
	} else {
		console.log("User MIA for location update.");
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


//make updateLocation edit local user data not just  remote data
//pair
//removeListeners all over the place
//updatePassengerLocationGoogleMaps(passenger,lat,lng);
//updateDriverLocationGoogleMaps(driver,lat,lng);


