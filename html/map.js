var MyMap;
var drivers = new Array();
var lots = new Array();
var showDrivers = true;
var showLots = true;
var passengers = new Array();
var drivers = new Array();
var me = new dummyUser();
var socket;
var connected = false;
var requesting = false;
var locationIntervalID = -1;
var pairedMarker = -1;

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
			},
			{
				featureType: "poi",
				elementType: "labels.text",
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
	this.setName = function(name){
		this.user.name = name;
	};
	this.getName = function(){
		return this.user.name;
	};
	this.setTime = function(newTime){
		this.time = newTime;
	};
	this.getTime = function(){
		return this.time;
	};
	this.addPaired = function(driverid){
		console.log(this);
		if(this.isAwaitingPairFrom(driverid)) return;
		if(this.getID() == driverid) return; 
		if(getDriverIndexByID(driverid) == -1) return;
		this.paired.push(driverid);
		socket.emit("pair",driverid);
	}
	this.removePaired = function(passenger){
		for(var i = 0; i < this.paired.length; i++){
			if(this.paired[i] == passenger){
				socket.emit("unpair",passenger);
				this.paired.splice(i,1);
			}
		}
	}
	this.getPaired = function(){
		return this.paired;
	};
	this.getLat = function(){
		return this.lat;
	};
	this.getLng = function(){
		return this.lng;
	};
	this.setID = function(userid){
		this.user.userid = userid;
	};
	this.getID = function(){
		return this.user.userid;
	};
	this.setLot = function(lot){
		this.lot = lot;
	};
	this.getLot = function(){
		return this.lot;
	};
	this.isAwaitingPairFrom = function(userid){
		for(var i = 0; i < this.paired.length; i++){
			if(this.paired[i] == userid) return true;
		}
		return false;
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
	this.withName = function(name){
		passenger.user.name = name;
		return this;
	}
}
function Driver(){
	this.user = {userid:0};
	this.time = 0;
	this.lat = 0;
	this.lng = 0;
	this.paired = new Array();
	this.marker = new google.maps.Marker({
		position: new google.maps.LatLng(this.lat, this.lng),
		user: {userid: this.user.userid},
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
		this.marker.setPosition(new google.maps.LatLng(this.lat,this.lng));
	};
	this.setMap = function(map){
		this.marker.setMap(map);
	};
	this.removeMap = function(){
		this.marker.setMap(null);
	}
	this.markerListener = this.marker.addListener('click', function(){
		var driver = getDriverByID(this.user.userid);
		angular.element(document.getElementById('controller')).scope().toggleBottomSlider();
		$(bottomSlider1).html(driver.getName());
		$(bottomSlider2).html("Seeking parking at: " + driver.getTime());
		if(me.getID() == driver.getID()){
			$(bottomSlider3).html("You are currently awaiting passengers.");
		} else if(!me.isAwaitingPairFrom(driver.getID())){
			$(bottomSlider3).html("<button class='btn' onclick='carClick()'> Pair with " + driver.getName()+ "</button>")
		} else {
			$(bottomSlider3).html("<button class='btn btn-warning' onclick='carClick()'>Cancel Request</button>")
		}
		$(bottomSlider4).html(driver.getID());
	});
	this.setName = function(name){
		this.user.name = name;
	}
	this.getName = function(){
		return this.user.name;
	}
	this.setTime = function(newTime){
		this.time = newTime;
	}
	this.getTime = function(){
		return this.time;
	}
	this.addPaired = function(passenger){
		if(this.isAwaitingPairFrom(passenger)) return;
		if(this.getID() == passenger) return; 
		if(getPassengerIndexByID(passenger) == -1) return;
		this.paired.push(passenger);
		socket.emit("pair",passenger);
	}
	this.removePaired = function(passenger){
		for(var i = 0; i < this.paired.length; i++){
			if(this.paired[i] == passenger){
				socket.emit("unpair",passenger);
				this.paired.splice(i,1);
			}
		}
	}
	this.getPaired = function(){
		return this.paired;
	};
	this.getLat = function(){
		return this.lat;
	}
	this.getLng = function(){
		return this.lng;
	}
	this.setID = function(userid){
		this.marker.user.userid = userid;
		this.user.userid = userid;
	}
	this.getID = function(){
		return this.user.userid;
	}
	this.isAwaitingPairFrom = function(userid){
		for(var i = 0; i < this.paired.length; i++){
			if(this.paired[i] == userid) return true;
		}
		return false;
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
		if(typeof me.getLot === "function" && me.getLot() === name){
			$(bottomSlider3).html("<button class='btn btn-danger' onclick='parkingLotClick()'>Cancel Request</button>")
		} else {
			$(bottomSlider3).html("<button class='btn' onclick='parkingLotClick()'> Get a ride to the " + name + "</button>")
		}
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
	this.removeMap = function(){
		marker.setMap(null);
	}
}
function parkingLotClick(){
	var name = $(bottomSlider1).html();
	var lot = getLotByName(name);
	if(me.getLot() === name){
			$(bottomSlider3).html("<button class='btn btn-danger' onclick='parkingLotClick()'>Cancel Request</button>")
	} else {
			$(bottomSlider3).html("<button class='btn' onclick='parkingLotClick()'> Get a ride to " + name + "</button>")
	}
	angular.element(document.getElementById('controller')).scope().displayRequestPickup();
	angular.element(document.getElementById('controller')).scope().refresh();
	addBlur();
	document.getElementById("lot").value = name;
}
function dummyUser(){
	this.setName = function(name){
	}
	this.getName = function(){
	}
	this.setTime = function(newTime){
	}
	this.getTime = function(){
	}
	this.addPaired = function(passenger){
	}
	this.removePaired = function(passenger){
	}
	this.getPaired = function(){
	};
	this.getLat = function(){
	}
	this.getLng = function(){
	}
	this.setID = function(userid){
	}
	this.getID = function(){
	}
	this.setLatLng = function(){
		
	}
	this.isAwaitingPairFrom = function(id){
		return false;
	};
	this.getLot = function(){};
}
function carClick(){
	var userid = $(bottomSlider4).html();
	var paired = me.isAwaitingPairFrom(userid);
	if(getPassengerIndexByID(me.getID()) === -1){
		alert("You must first request a pickup.");
		addBlur();
		angular.element(document.getElementById('controller')).scope().displayRequestPickup();
		angular.element(document.getElementById('controller')).scope().refresh();
		return;
	}
	if(paired){
		$(bottomSlider3).html("<button class='btn' onclick='carClick()'> Pair with " + driver.getName()+ "</button>")
	} else {
		$(bottomSlider3).html("<button class='btn btn-warning' onclick='carClick()'>Cancel Request</button>")
	}
	carClickList(userid);
}
function parkingLotClickList(id){
	if(getDriverIndexByID(me.getID()) == -1){
		alert("You must first request parking first.");
		addBlur();
		angular.element(document.getElementById('controller')).scope().displayRequestParking();
		angular.element(document.getElementById('controller')).scope().refresh();
	return;
	}
	var paired = me.isAwaitingPairFrom(id);
	if(paired) {
		me.removePaired(id);
	} else {
		me.addPaired(id);
	}
	angular.element(document.getElementById('controller')).scope().initializeUsers();
}
function carClickList(id){
	if(getPassengerIndexByID(me.getID()) === -1){
		alert("You must first request a pickup.");
		addBlur();
		angular.element(document.getElementById('controller')).scope().displayRequestPickup();
		angular.element(document.getElementById('controller')).scope().refresh();
		return;
	}
	var paired = me.isAwaitingPairFrom(id);
	if(paired) {
		me.removePaired(id);
	} else {
		me.addPaired(id);
	}
	angular.element(document.getElementById('controller')).scope().initializeUsers();
}
//TEST COMMANDS
/////////////////////////////////////////////////////////////////////////////////
// login("smashtilldawn.com","");initiatePark("mytime");
//login("smashlawn.com","");initiatePark("mytime");
//initiatePark(14.24,124.44,"mytime");
// initiatePassenger(14.24,124.44,"mytime","F");
///////////////////////////////////////////////////////////////////////////////////

function initializeSocket(){
	socket = io.connect('http://www.zkysar.com:8001');
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
	if(driver.getID() === me.getID()){
		return;
	}
	addDriverToMap(driver);
	drivers.push(driver);
}
function addPassenger(data){
	var passenger = getPassengerFromData(data);
	if(passenger.getID() === me.getID()){
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
		console.log(driver);
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
	var time = convertTime(document.getElementById("time2").value);
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
			socket.on("pair",function(id){
				pairWith(id);
			});
		}
		socket.removeListener("park");
	});
};
function initiatePickup(){
	var time = convertTime(document.getElementById("time").value);
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
			socket.on("pair",function(id){
				pairWith(id);
			});
			me.user = {
					userid:data.user.userid,
					name:data.user.name
			};
			lot.addPassenger(me);
		}
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
			if(passengers[passengerIndex].user.userid === id){
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
		passenger.lat = data.lat;
		passenger.lng = data.lng;
		// updateLocationGoogleMaps(passenger,data.lat,data.lng);
	} else if(driver != -1){
		driver.lat = data.lat;
		driver.lng = data.lng;
		updateLocationGoogleMaps(driver,data.lat,data.lng);
	} else if(pariedMarker != -1){
		if(data.userid == pairedMarker.user){
 			pairedMarker.setPosition(new google.maps.LatLng(data.lat,data.lng));
		} 
	} else{
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
		if(e.getID() == me.getID()) return;
		var pair = me.isAwaitingPairFrom(e.getID());
		htmlArray.push({
			fName: e.user.name,
			arrivalTime: e.time,
			status: pair,
			userid: e.user.userid
		});
	});
	return htmlArray;
}
function getPassengerListHTML(){
	var htmlArray= new Array();
		getPassengerList().forEach(function(e){
		if(e.getID() == me.getID()) return;
			var pair = me.isAwaitingPairFrom(e.getID());
			htmlArray.push({
				fName: e.getName(),
				departTime: e.getTime(),
				status: pair,
				lot: e.getLot(),
				userid: e.user.userid
			});
		});
	return htmlArray;
}
function currentlyRequesting(){
	if(!me.user || (getPassengerByID(me.user.userid) == -1 && getDriverByID(me.user.userid) == -1))
		return false;
	return true;
}
function cancelRequest(){
	angular.element(document.getElementById('controller')).scope().returnToMap();
	clearInterval(locationIntervalID);
	removeDriver(me.getID());
	removePassenger(me.getID());
	socket.emit("cancel");
	me = new dummyUser();
	
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
			if(passengers[passengerIndex].user.userid === id){
				return lotIndex;
			}
		}
	}
	return -1;
}
function pairWith(pair){
	var driver = (!!me.marker);
	
	angular.element(document.getElementById('controller')).scope().returnToMap();
	angular.element(document.getElementById('controller')).scope().toggleBottomSlider();
	angular.element(document.getElementById('controller')).scope().refresh();
	
	$(bottomSlider1).html("Name: " + pair.user.name);
	$(bottomSlider2).html("Phone: " + pair.user.phone);
	if(driver){
		$(bottomSlider3).html("Please wait for " + pair.user.name + " to call you with further information.");
	} else {
		$(bottomSlider3).html("Please call " + pair.user.name + " at " + pair.time + " to organize the pickup.");
	}
	// $(bottomSlider3).html("<form onsubmit='chat()'><input id='chat' type='text' style='display:inline; width:50%' placeholder='Enter Message'></input><div style='display:inline'>  </div><input class='btn' type='submit' style='display:inline'></input></form>");
	// $(bottomSlider4).css("display","inline");
	MyMap.panTo(new google.maps.LatLng(pair.lat,pair.lng));
	setShowLots(false);
	google.maps.event.clearListeners(MyMap, 'dragstart');
	google.maps.event.clearListeners(MyMap, 'click');
	for(var i = 0; i < drivers.length; i++){
			drivers[i].removeMap();
	}
	if(driver){
		pariedMarker = new google.maps.Marker({
			position: new google.maps.LatLng(pair.lat, pair.lng),
			icon: {
				url: "assets/imgs/passenger.png",
				scaledSize: new google.maps.Size(40, 40),
				origin: new google.maps.Point(0,0),
				anchor: new google.maps.Point(0, 0)
			},
			map: MyMap,
			user: pair.user.userid,
			animation: google.maps.Animation.DROP
		});
	} else {
		pariedMarker = new google.maps.Marker({
			position: new google.maps.LatLng(pair.lat, pair.lng),
			icon: {
				url: "assets/imgs/car.png",
				scaledSize: new google.maps.Size(40, 40),
				origin: new google.maps.Point(0,0),
				anchor: new google.maps.Point(0, 0)
			},
			map: MyMap,
			user: pair.user.userid,
			animation: google.maps.Animation.DROP
		});
	}
	//if i am a driver add user to map 
}
function convertTime(time){
	hour = parseInt(time.substring(0,2));
	if(hour > 12) {
		time = (hour - 12) + time.substring(2,5) + " PM";
	} else if(hour < 1) {
		time = 12 + time.substring(2,5) + " AM";
	} else if(hour < 10){
		time = time.substring(1) + " AM";
	} else if (hour == 12){
		time = 12 + time.substring(2,5) + " PM";
	}else {
		time = time + " AM"
	}
	return time;
}
function currentTime(){
	var date = new Date();
	var hours = date.getHours();
	var min = date.getMinutes();
	var time = hours + ":" + min;
	if(min < 10){ 
		time = hours + ":0" + min;
	} 
	if ( hours < 10) {
		time = "0" + time;
	}
	document.getElementById("time2").value = time;
	document.getElementById("time").value = time;
}
function chat(){
	var message = document.getElementById("chat").value;
	document.getElementById("chat").value = "";
	socket.emit("chat",message);
	console.log(message);
}
function animateBottomSlider(){
	for(var i = -150; i < 0; i++){
		document.getElementById("bottomSlider").style.bottom = i + "px"
	}
	// document.getElementById("bottomSlider").classList.remove("bottomSliderDown");
	// document.getElementById("bottomSlider").classList.add("bottomSliderUp");
	
}
function animateBottomSlider(){
	var bottom = -150;
	document.getElementById("bottomSlider").style.bottom = bottom + "px";
	var myInverval = setInterval(function(){
		document.getElementById("bottomSlider").style.bottom = bottom + "px";
		bottom+=2;
		if(bottom > -3) clearInterval(myInverval);
	},1);
	var myInverval2= setInterval(function(){
		document.getElementById("bottomSlider").style.bottom = bottom + "px";
		bottom+=2;
		if(bottom > -2) clearInterval(myInverval2);
	},1);
	var myInverval3 = setInterval(function(){
		document.getElementById("bottomSlider").style.bottom = bottom + "px";
		document.getElementById("bottomSlider").style.boxShadow = "0px -" + parseInt((150 + bottom) / 30) + "px 5px rgba(0, 0, 0, 0.3)"
		bottom+=2;
		if(bottom > -1) clearInterval(myInverval3);
	},1);
	
}
function loginWithoutAccount(){
	socket.emit("loginWithoutAccount");
	socket.on("loginWithoutAccount", function(data){
		socket.removeListener("loginWithoutAccount");
		document.getElementById("username").value = data.username;
		document.getElementById("password").value = data.password
		removeBlur();
			angular.element(document.getElementById('controller')).scope().login();
			locationIntervalID = setInterval(function(){
				updateMyLocation();
			},1000);
	});
}
//removeListeners all over the place

