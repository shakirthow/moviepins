$(document).ready(function() {
	$.material.init();
	initMaps()

});


function getLocation() {

}
function showPosition(position) {
	x.innerHTML = "Latitude: " + position.coords.latitude + 
	"<br>Longitude: " + position.coords.longitude; 
}

function initMaps(){
	getCurrentPosition = function(){
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(this.setGoogleMaps);
		} else {
			alert("Geolocation is not supported by this browser.")
		}

	}
	setGoogleMaps = function(position){


		var mapOptions = {
			mapTypeControl: true,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.DEFAULT,
				mapTypeIds: []
			},
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL
			},


			center: { lat: 37.7577, lng: -122.4376},
			// center: {lat:position.coords.latitude, lng: position.coords.longitude},
			zoom: 12

		};
		var map = new google.maps.Map(document.getElementById('map-canvas'),
			mapOptions);
	}
	getCurrentPosition()


}