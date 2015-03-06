var API_ROOT = 'https://moviepins.appspot.com/_ah/api';
var moviedb_apibase = 'http://api.themoviedb.org/3'
var moviedb_key = '7bfb5aa6abb2c2a47d4bba0e1ff36ccc'
var moviedb_base = 'http://image.tmdb.org/t/p/w500'

function loadApiClient() {
	gapi.client.load('moviepins', 'v1.0', function() {
		init()
	}, API_ROOT);
}
var init = function() {
		var markers = [];
		var MoviePin = Backbone.Model.extend({
			defaults: {
				actor_1: 'not available',
				actor_2: 'not available',
				actor_3: 'not available'
			}
		});
		var DetailsScreen = Backbone.Model.extend();
		var Movie = Backbone.Model.extend();
		var UberData = Backbone.Model.extend();


		var AutoCompleteCollection = Backbone.Collection.extend()
		var AutoCompleteView = Backbone.View.extend({
			el: '.autocompletelist',
			initialize: function() {
				this.render()
				this.collection.on('add', this.render, this);
				this.collection.on('reset', this.render, this);
				// this.listenTo(this.collection, "change", this.render);
				var searchMsgCont = $('#char-rem-cont');
				var textRemCont = $('#char-rem-span');
				var autoCompLoader = $('#autocomp-loader')
				var charRem = $('#char-rem');
				var searchEmpty = $('#search-empty')
				var that = this
				$('#search-input input').keyup(function() {
					textRemCont.hide()
					searchMsgCont.show()
					autoCompLoader.show()
					searchEmpty.hide()
					var input = $(this)
					if(input.val().length >= 3){
						delay(function() {
							gapi.client.moviepins.movies.search({
								'q': input.val()
							}).execute(function(resp) {
								autoCvalues = JSON.parse(resp.resp)
								that.collection.reset()
								if(autoCvalues.length == 0){
									autoCompLoader.hide();
									searchEmpty.show();
								}
								else{
									searchEmpty.hide();
									autoCompLoader.hide();
									for (var item in autoCvalues) {
										// console.log(autoCvalues[item])
										that.collection.add(autoCvalues[item])
									}
								}

							});
						}, 1000);
					}
					else{
						searchMsgCont.show();
						textRemCont.show();
						autoCompLoader.hide()
						searchEmpty.hide();
						charRem.html(3 - input.val().length)
					}
				});
			},
			render: function() {
				// alert($('#autocomple-template').html(),{items: this.collection})
				var template = _.template($('#autocomple-template').html());
				variables = {
					items: this.collection.models
				}
				this.$el.html(template(variables));
				that = this
				$('.autocompleteItem').click(function() {
					var index = $(this).data()
						// console.log(index.collectionIndex)
					pins.reset();
					markers = clearMarkers(markers)
					// console.log(that.collection.at(index.collectionIndex))
					pins.add(that.collection.at(index.collectionIndex));
					that.collection.reset();
				})
			}
		})
		autoCompleteCollection = new AutoCompleteCollection()
		AutoCompleteView = new AutoCompleteView({
			collection: autoCompleteCollection
		})
		var MoviePinCollection = Backbone.Collection.extend({
			model: MoviePin,
		});
		var DetailsView = Backbone.View.extend({
			el: '.details-slider',
			initialize: function() {

				this.model.attributes.uber.on('change', this.uberRender, this);
				this.model.attributes.movie.on('change', this.render, this);
			},
			render: function() {
				var template = _.template($('#details-slider-template').html());

				variables = this.model.attributes.movie.attributes
				variables.backdrop_path = moviedb_base + variables.backdrop_path
				variables.poster_path = moviedb_base + variables.poster_path
				variables.tagline = '';

				this.$el.html(template(variables))

			},
			uberRender: function(){
				var obj = this.model.attributes.uber.attributes
				$("#uber").html(
					'<div class="col-md-3 col-sm-3 col-lg-3">'+
					'<img src="images/uber.jpg" width="50"></div>'+
					'<div class="col-md-3 col-sm-3 col-lg-3"><span><i class="fa fa-map-marker"></i><br>'+obj.distance+' mil</span></div>'+
					'<div class="col-md-3 col-sm-3 col-lg-3"><span><i class="fa fa-clock-o"></i><br>'+((obj.duration)/60).toFixed(2)+' min</span></div>'+
					'<div class="col-md-3 col-sm-3 col-lg-3"><span><i class="fa fa-usd"></i><br>'+obj.estimate+'</span></div>'
					);
			}
		})

		

		var MapView = Backbone.View.extend({
			initialize: function() {
				var myLatlng = mylocation()
				var mapOptions = {
					// styles: [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":30},{"gamma":0.5},{"hue":"#435158"}]}],
					panControlOptions: {
						position: google.maps.ControlPosition.BOTTOM_CENTER
					},
					mapTypeControl: false,
					zoomControl: true,
					zoomControlOptions: {
						style: google.maps.ZoomControlStyle.SMALL,
						position: google.maps.ControlPosition.BOTTOM_CENTER
					},
					center: myLatlng,
					// center: {lat:position.coords.latitude, lng: position.coords.longitude},
					zoom: 13
				}
				var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
				menuRight = $('#cbp-spmenu-s2')

				this.collection.bind('add', function(model) {
					map.setZoom(13);
					service = new google.maps.places.PlacesService(map);
					service.textSearch({
						query: model.attributes.locations,
						location: myLatlng,
						radius: 3000
					}, function(results, status) {
						// console.log(results)
						if (status == google.maps.places.PlacesServiceStatus.OK) {
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
							marker.setMap(map);
							markers.push(marker)
							google.maps.event.addListener(marker, 'click', function() {
								map.setZoom(16);
								map.setCenter(marker.getPosition());
								var from = mylocation()
								var to = marker.getPosition()
								gapi.client.moviepins.uber.estimate({
									'end_latitude': to.k,
									'end_longitude': to.D,
									'start_latitude':from.k,
									'start_longitude':from.D
								}).execute(function(resp) {
									uber_data.set(JSON.parse(resp.resp))
								});

								gettheDetails = function(type, id) {
									$.ajax({
										url: moviedb_apibase + '/' + type + '/' + id,
										data: {
											'api_key': moviedb_key,
											'append_to_response': 'credits,videos'
										}
									}).done(function(movie_detail) {
										if (type == 'tv') {
											movie_detail.title = movie_detail.name
											movie_detail.runtime = 'Episode: ' + movie_detail.episode_run_time
										};
										// z.clear().set(movie_detail);
										movie_details.set(movie_detail);
										$(menuRight).addClass('details-slider-open')
									}).fail(function() {
										alert("error")
									})
									
							

					

								}
								$.ajax({
									url: moviedb_apibase + "/search/movie",
									data: {
										'api_key': moviedb_key,
										'query': model.attributes.title,
										'year': model.attributes.release_year
									}
								}).done(function(resp) {
									if (resp.results.length > 0) {
										gettheDetails('movie', resp.results[0].id)
									}
									else {
										$.ajax({
											url: moviedb_apibase + "/search/tv",
											data: {
												'api_key': moviedb_key,
												'query': model.attributes.title,
												'year': model.attributes.release_year
											}
										}).done(function(resp) {
											if (resp.results.length > 0) {
												gettheDetails('tv', resp.results[0].id)
											}
										}).fail(function() {
											alert("error");
										})
									}
								}).fail(function() {
									alert("error");
								})
							});
							// var markerCluster = new MarkerClusterer(map, markers);
						}
						else {
							console.log('Can get rid of by enabling billing ' + status)
						}
					});
					// })(model);
				});

				//Add event handlers to dom elemnts
				$( "#search-container input" ).focus(function() {
				  menuRight.removeClass('details-slider-open')
				}); 
			}
		}); //end of view
		var pins = new MoviePinCollection([], {
			model: MoviePin,
		});
		var movie_map = new MapView({
			collection: pins
		});

		var movie_details = new Movie()
		var uber_data = new UberData()
		var detailsScreen = new DetailsScreen({movie: movie_details, uber: uber_data})


		var details_view = new DetailsView({
				model: detailsScreen
			})
			// gapi.client.moviepins.movies.find({
			// 	'title': 'Foul Play'
			// }).execute(function(resp) {
			// 	model_obj = JSON.parse(resp.resp)
			// 	for (var i = model_obj.length - 1; i >= 0; i--) {
			// 		pins.add(model_obj[i]);
			// 	}
			// });
	} //end init
	//utility functions
var delay = (function() {
	var timer = 0;
	return function(callback, ms) {
		clearTimeout(timer);
		timer = setTimeout(callback, ms);
	};
})();
var clearMarkers = function(marker_array) {
	for (var i = 0; i < marker_array.length; i++) {
		marker_array[i].setMap(null);
	}
	return []
}
var mylocation = function(){
	var myLatlng = new google.maps.LatLng(37.789790, -122.444466);
	return myLatlng
}
console.log(mylocation())