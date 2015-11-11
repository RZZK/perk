var MyMap;
var drivers = new Array();
var lots = new Array();
var showDrivers = false; 
var showLots = false; 


function initialize() {
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
	//addDriver(new Driver(new User("asd","asd","asd","asd"),new Car(34.0569172,-117.8217494,"Mustang"),"time"));
	setShowDrivers(true);
	addLot(new Lot(34.0569172,-117.8217494));
	setShowLots(true);
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
function addDriver(driver){
		if(showDrivers) driver.setMap(MyMap);
		drivers.push(driver);
}
function removeDriver(driver){
	var index = drivers.indexOf(driver);
	driver.removeMap();
	drivers.splice(index, 1);
}
function User(name,email,phone, picture){
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
	this.setMap = function(map){
		car.setMap(map);
	}
	this.removeMap = function(){
		car.removeMap();
	}
}
function Car(lat,lng,model){
	this.lat = lat;
	this.lng = lng;
	this.model = model;
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
		marker(setPosition(new google.maps.LatLng(lat,lng)));
	};
	this.setMap = function(map){
		this.marker.setMap(map);
	};
	this.removeMap = function(){
		marker.setMap(null);
	}
}
function Lot(lat,lng){
	this.lat = lat;
	this.lng = lng;
	this.marker = new google.maps.Marker({
		position: new google.maps.LatLng(this.lat, this.lng),
		animation: google.maps.Animation.DROP,
		icon: {
			url: "assets/imgs/parking.png",
			scaledSize: new google.maps.Size(50, 50), 
			origin: new google.maps.Point(0,0), 
			anchor: new google.maps.Point(0, 0)
		}
	});
	this.addPassenger = function(passenger){
		this.passengers.push(passenger);
	};
	this.removePassenger = function(passenger){
		var index = array.indexOf(passenger);
		this.passengers.splice(index, 1);
	};
	this.setMap = function(map){
		this.marker.setMap(map);
	};
	this.removeMap = function(){
		this.marker.setMap(null);
	};
}