


(function() {

	var bodyEl = document.body,
	content = document.querySelector( '.content-wrap' ),
	openbtn = document.getElementById( 'open-button' ),
	closebtn = document.getElementById( 'close-button' ),
	isOpen = false;

	function init() {
		initEvents();
	}

	function initEvents() {
		openbtn.addEventListener( 'click', toggleMenu );
		if( closebtn ) {
			closebtn.addEventListener( 'click', toggleMenu );
		}

		// close the menu element if the target it´s not the menu element or one of its descendants..
		content.addEventListener( 'click', function(ev) {
			var target = ev.target;
			if( isOpen && target !== openbtn ) {
				toggleMenu();
			}
		} );
	}

	function toggleMenu() {
		if( isOpen ) {
			classie.remove( bodyEl, 'show-menu' );
		}
		else {
			classie.add( bodyEl, 'show-menu' );
		}
		isOpen = !isOpen;
	}

	init();













	function initMaps(){
		getCurrentPosition = function(){
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(this.setGoogleMaps);
			} else {
				alert("Geolocation is not supported by this browser.")
			}

		}
		setGoogleMaps = function(position){

			var myLatlng = new google.maps.LatLng(37.7577,-122.4376);

			var mapOptions = {

				panControlOptions: {
		        // position: google.maps.ControlPosition.TOP_RIGHT
		    },
		    mapTypeControl: false,
		    zoomControl: true,
		    zoomControlOptions: {
		    	style: google.maps.ZoomControlStyle.SMALL,
				// position: google.maps.ControlPosition.TOP_RIGHT
			},
			center: myLatlng,
			// center: {lat:position.coords.latitude, lng: position.coords.longitude},
			zoom: 13

		};
		var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

		var contentString = '<div id="infoBoxHook">'+
		'<img class="cover-sm" src="images/walkingDead.jpg"><div class="moveinfo-sm">'+
		' <h3>Movie Title(2014)</h3>'+
		' <p class="text-muted">Sony Entertainment.</p>'+
		' <p>Jorge coloney, Emma watson</p>'+
		'  <p>Nullam quis risus eget <a href="javascript:void(0)">urna mollis ornare</a> vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh ultricies vehicula.</p>'+
		'</div></div>';

		var infowindow = new google.maps.InfoWindow({
			content: contentString,
			maxWidth: 400  });



		var marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			test: 'test',
			title: 'Hello World!'
		});

		google.maps.event.addListener(marker, 'mouseover', function() {//
			infowindow.open(map,marker);
		});

		google.maps.event.addListener(marker, 'mouseout', function() {
			infowindow.close();
		});






	}
	getCurrentPosition()



}
initMaps()

})();




