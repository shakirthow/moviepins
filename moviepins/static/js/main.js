// function getMoreDetails() {
//                 menuRight = document.getElementById('cbp-spmenu-s2'),
//                         classie.toggle(menuRight, 'details-slider-open');
//         }
//         (function() {
//                 function detailsMenu() {
//                         menuRight = document.getElementById('cbp-spmenu-s2'),
//                                 showRight.onclick = function() {
//                                         $(menuRight).toggleClass('details-slider-open')
//                                 };
//                 }
//                 detailsMenu()
//                 function getMoreDetails() {
//                         menuRight = document.getElementById('cbp-spmenu-s2'),
//                                 classie.toggle(menuRight, 'details-slider-open');
//                 }
//                 function initMaps() {
//                         getCurrentPosition = function() {
//                                 if (navigator.geolocation) {
//                                         navigator.geolocation.getCurrentPosition(this.setGoogleMaps);
//                                 } else {
//                                         alert("Geolocation is not supported by this browser.")
//                                 }
//                         }
//                         setGoogleMaps = function(position) {
//                                 var myLatlng = new google.maps.LatLng(37.7577, -122.4376);
//                                 var mapOptions = {
//                                         // styles: [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":30},{"gamma":0.5},{"hue":"#435158"}]}],
//                                         panControlOptions: {
//                                                 position: google.maps.ControlPosition.TOP_RIGHT
//                                         },
//                                         mapTypeControl: false,
//                                         zoomControl: true,
//                                         zoomControlOptions: {
//                                                 style: google.maps.ZoomControlStyle.SMALL,
//                                                 position: google.maps.ControlPosition.TOP_RIGHT
//                                         },
//                                         center: myLatlng,
//                                         // center: {lat:position.coords.latitude, lng: position.coords.longitude},
//                                         zoom: 13
//                                 };
//                                 var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
//                                 var contentString = '<div class="info-box">' + '<img src="images/walkingDead.jpg"><div class="details">' + ' <h3>Movie Title(2014)</h3>' +
//                                         ' <p class="text-muted studio">Sony Entertainment.</p>' + ' <strong>Jorge coloney, Emma watson</strong>' +
//                                         '  <p>Nullam quis risus eget <a href="javascript:void(0)">urna mollis ornare</a> vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh ultricies vehicula.</p>' +
//                                         '<button  class="btn btn-default more-info" onclick="getMoreDetails()"><i class="fa fa-ellipsis-h"></i></button> </div>' + '</div>';
//                                 var infowindow = new google.maps.InfoWindow({
//                                         content: contentString,
//                                         maxWidth: 400
//                                 });
//                                 var marker = new google.maps.Marker({
//                                         position: myLatlng,
//                                         map: map,
//                                         test: 'test',
//                                         title: 'Hello World!'
//                                 });
//                                 // google.maps.event.addListener(marker, 'mouseover', function() { //
//                                 //         infowindow.open(map, marker);
//                                 // });
//                                 // google.maps.event.addListener(marker, 'mouseout', function() {
//                                 //         infowindow.close();
//                                 // });
//                                 google.maps.event.addListener(marker, 'click', function() {
//                                         infowindow.open(map, marker);
//                                 });
//                                 google.maps.event.addListenerOnce(map, 'idle', function() {
//                                         //loaded fully
//                                 });
//                         }
//                         getCurrentPosition()
//                 }
//                 initMaps()
//         })();
	var ROOT = 'https://moviepins.appspot.com/_ah/api';

function loadApiClient(){
	gapi.client.load('moviepins', 'v1.0', function() {
		init()
		// gapi.client.moviepins.circle.fetch({
		// 	'name':'Test'
		// }).execute(function(resp) {
		//   console.log(resp);
		// });
	}, ROOT);
}
// ?name=Test&email=shakir@gmail.com
var init = function() {
		// $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
		// 	options.url = 'https://moviepins.appspot.com/_ah/api/moviepins/v1.0/'
		// });
		var MoviePin = Backbone.Model.extend({
			defaults: {
				actor_1: 'not available',
				actor_2: 'not available',
				actor_3: 'not available'
			}
		});
		var Movie = Backbone.Model.extend();


		var MoviePinCollection = Backbone.Collection.extend({
			model: MoviePin,
			// initialize: function(models, options) {
			// 	// this.bind('add', function(model) {
			// 	// 	 alert("Oh snap, we have a model!");
			// 	// });
			// 	this.options = options;
			// 	this.fetch();
			// },
			// url: function() {
			// 	return ROOT+this.options.apipath + "?" + this.options.params;
			// }
		});
		var DetailsView = Backbone.View.extend({
			el: '.details-slider',
			initialize: function(){
				this.listenTo(this.model, "change", this.render);
			}
			render: function(){
				var movie = new Movie()
				var that = this
				followingMovies.fetch({
					data: {
						name: 'Test',
						email: 'shakir@gmail.com'
					},
					sucess:function(){
						that.$el.html('content here')
						console.log('sucess')
					},
					error: function () {
						console.log('err')
					},
					complete: function(data){
						console.log(data.responseJSON)
					}
				})
			}
		})

		var MapView = Backbone.View.extend({
			// el: '.page',
			// render: function(){
			// 	var followingMovies = new FollowingMovies()
			// 	var that = this
			// 	followingMovies.fetch({
			// 		data: {
			// 			name: 'Test',
			// 			email: 'shakir@gmail.com'
			// 		},
			// 		sucess:function(){
			// 			that.$el.html('content here')
			// 			console.log('sucess')
			// 		},
			// 		error: function () {
			// 			console.log('err')
			// 		},
			// 		complete: function(data){
			// 			console.log(data.responseJSON)
			// 		}
			// 	})
			// }
			initialize: function() {
				var myLatlng = new google.maps.LatLng(37.7577, -122.4376);
				var mapOptions = {
					// styles: [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":30},{"gamma":0.5},{"hue":"#435158"}]}],
					panControlOptions: {
						position: google.maps.ControlPosition.TOP_RIGHT
					},
					mapTypeControl: false,
					zoomControl: true,
					zoomControlOptions: {
						style: google.maps.ZoomControlStyle.SMALL,
						position: google.maps.ControlPosition.TOP_RIGHT
					},
					center: myLatlng,
					// center: {lat:position.coords.latitude, lng: position.coords.longitude},
					zoom: 13
				}
				var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
				this.collection.bind('add', function(model) {
					// (function(model) {
						service = new google.maps.places.PlacesService(map);
						service.textSearch({
							query: model.attributes.locations,
							location: myLatlng,
							radius: 3000
						}, function(results, status) {
							if (status == google.maps.places.PlacesServiceStatus.OK) {
								markers = [];
								var marker = new google.maps.Marker({
									position: results[0].geometry.location,
									map: map,
									title: model.attributes.title,
									release_year: model.attributes.release_year,
									production_company: model.attributes.production_company,
									actor_1: model.attributes.actor_1,
									//icon: 'images/marker.png', 
									year: model.attributes.release_year
								});

								markers.push(marker)
								google.maps.event.addListener(marker,'click',function() {
								  	map.setZoom(16);
								  	map.setCenter(marker.getPosition());
								  	console.log(this.title)

									gapi.client.moviepins.movies.details({
										'title':'Foul Play',
										'year':'1978'
									}).execute(function(resp) {
										console.log(resp.resp)
									  	console.log(JSON.parse(resp.resp));
									});	

								});
								// var markerCluster = new MarkerClusterer(map, markers);
							}
							else{
								console.log('Can get rid of by enabling billing '+status)
							}
						});
					// })(model);
				});
			}
		}); //end of view


		var pins = new MoviePinCollection([], {
			model: MoviePin,
		});

		var movie_map = new MapView({
			collection: pins
		});

		gapi.client.moviepins.movies.find({
			'title':'Foul Play'
		}).execute(function(resp) {
			model_obj = JSON.parse(resp.resp)
			for (var i = model_obj.length - 1; i >= 0; i--) {
				pins.add(model_obj[i]);
			};
		});


		// var Router = Backbone.Router.extend({
		// 	routes: {
		// 		'': 'home'
		// 	}
		// })
		// var mapView = new MapView();
		// var router = new Router();
		// router.on('route:home', function() {
		// 	mapView.render();
		// })
		// Backbone.history.start()
	} //end init
