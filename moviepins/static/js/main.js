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
		var Movie = Backbone.Model.extend({
			defaults: {
				// title: 'not selected',
				// year: "not selected",
				// runtime: 'na',
				// synopsis: 'Only available for recent movies',
				// cast_1: 'na',
				// cast_2: 'na',
				// posters: {
				// 	posters: 'na'
				// },
				// a: {
				// 	one: '',
				// 	two: '',
				// 	three: '',
				// 	four: '',
				// 	five: ''
				// },
				// c: {
				// 	one: '',
				// 	two: '',
				// 	three: '',
				// 	four: '',
				// 	five: ''
				// },
				// formated: false
			},
		});
		var AutoCompleteItem = Backbone.Model.extend({
			defaults: {
				title: 'Search for something and select from the list'
			}
		})
		var AutoCompleteCollection = Backbone.Collection.extend({
			model: AutoCompleteItem
		})
		var AutoCompleteView = Backbone.View.extend({
			el: '.autocompletelist',
			initialize: function() {
				this.render()
				this.collection.on('add', this.render, this);
				this.collection.on('reset', this.render, this);
				// this.listenTo(this.collection, "change", this.render);
				var that = this
				$('#search-input input').keyup(function() {
					var input = $(this)
					delay(function() {
						gapi.client.moviepins.movies.search({
							'q': input.val()
						}).execute(function(resp) {
							autoCvalues = JSON.parse(resp.resp)
							that.collection.reset()
							for (var item in autoCvalues) {
								console.log(autoCvalues[item])
								that.collection.add(autoCvalues[item])
							}
						});
					}, 1000);
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
					console.log(that.collection.at(index.collectionIndex))
					pins.add(that.collection.at(index.collectionIndex));
					that.collection.reset();
				})
			}
		})
		autoCompleteCollection = new AutoCompleteCollection({
			model: AutoCompleteItem
		})
		AutoCompleteView = new AutoCompleteView({
			collection: autoCompleteCollection
		})
		var MoviePinCollection = Backbone.Collection.extend({
			model: MoviePin,
		});
		var DetailsView = Backbone.View.extend({
			el: '.details-slider',
			initialize: function() {
				this.listenTo(this.model, "change", this.render);
				// this.nodeTemplate = _.template($('#note-template').html());
			},
			render: function() {
				// console.log($('#details-slider-template').html())
				console.log(this.model.attributes)
				var template = _.template($('#details-slider-template').html());
				variables = this.model.attributes
				if (this.model.attributes.formated) {
                                        this.model.attributes.backdrop_path = moviedb_base + this.model.attributes.backdrop_path
                                        this.model.attributes.poster_path = moviedb_base + this.model.attributes.poster_path
                                        this.model.attributes.tagline = '';

					// if (variables.synopsis.length < 2) {
					// 	variables.synopsis = 'Only available for recent movies'
					// }
					// if (this.model.attributes.abridged_cast.length >= 2) {
					// 	variables.cast_1 = variables.abridged_cast[0].name
					// 	variables.cast_2 = variables.abridged_cast[1].name
					// }
					// a = variables.ratings.audience_score
					// if (a > 20) {
					// 	variables.a.one = 'color'
					// }
					// if (a > 40) {
					// 	variables.a.two = 'color'
					// }
					// if (a > 60) {
					// 	variables.a.three = 'color'
					// }
					// if (a > 80) {
					// 	variables.a.four = 'color'
					// }
					// if (a > 100) {
					// 	variables.a.five = 'color'
					// }
					// c = variables.ratings.critics_score
					// if (c > 20) {
					// 	variables.c.one = 'color'
					// }
					// if (c > 40) {
					// 	variables.c.two = 'color'
					// }
					// if (c > 60) {
					// 	variables.c.three = 'color'
					// }
					// if (c > 80) {
					// 	variables.c.four = 'color'
					// }
					// if (c > 100) {
					// 	variables.c.five = 'color'
					// }
				}
				else {
					this.model.attributes.formated = true;
				}
				this.$el.html(template(variables))
			}
		})
		var MapView = Backbone.View.extend({
			initialize: function() {
				// getCurrentPosition = function() {
				//                            if (navigator.geolocation) {
				//                                    navigator.geolocation.getCurrentPosition(this.setGoogleMaps);
				//                            } else {
				//                                    alert("Geolocation is not supported by this browser.")
				//                            }
				//            }
				var myLatlng = new google.maps.LatLng(37.789790, -122.444466);
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
				menuRight = $('#cbp-spmenu-s2')
				this.collection.bind('add', function(model) {
					map.setZoom(13);
					service = new google.maps.places.PlacesService(map);
					service.textSearch({
						query: model.attributes.locations,
						location: myLatlng,
						radius: 3000
					}, function(results, status) {
						console.log(results)
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
								console.log(model.attributes.release_year)
								

        //                                                         gapi.client.moviepins.movies.details({
								// 	'title': model.attributes.title,
								// 	'year': model.attributes.release_year
								// }).execute(function(resp) {
								// 	console.log(resp)
								// 	console.log(JSON.parse(resp.resp));
								// 	movie_details.set(JSON.parse(resp.resp));
								// 	$(menuRight).addClass('details-slider-open')
								// });
                                                                gettheDetails = function(type, id){
                                                                        $.ajax({
                                                                        url:moviedb_apibase + '/'+type+'/'+id,
                                                                        data:
                                                                                {
                                                                                        'api_key':moviedb_key,
                                                                                        'append_to_response':'credits,videos'
                                                                                }                         
                                                                        }).done(function(movie_detail){
                                                                                if (type == 'tv') {
                                                                                        movie_detail.title = movie_detail.name
                                                                                        movie_detail.runtime = 'Episode: '+movie_detail.episode_run_time
                                                                                };
                                                                                // z.clear().set(movie_detail);
                                                                                movie_details.set(movie_detail);
                                                                                $(menuRight).addClass('details-slider-open')
                                                                        }).fail(function(){
                                                                                alert("error")
                                                                        })
                                                                }

                                                                $.ajax({
                                                                        url: moviedb_apibase + "/search/movie",
                                                                        data: 
                                                                        {
                                                                                'api_key':moviedb_key, 
                                                                                'query':model.attributes.title,
                                                                                'year':model.attributes.release_year
                                                                        }
                                                                }).done(function(resp) {
                                                                        if(resp.results.length > 0){
                                                                                gettheDetails('movie', resp.results[0].id)
                                                                        }
                                                                        else{
                                                                                $.ajax({
                                                                                        url: moviedb_apibase + "/search/tv",
                                                                                        data: 
                                                                                        {
                                                                                                'api_key':moviedb_key, 
                                                                                                'query':model.attributes.title,
                                                                                                'year':model.attributes.release_year
                                                                                        }
                                                                                }).done(function(resp) {
                                                                                        if(resp.results.length > 0){
                                                                                                // result_id = resp.results[0].id
                                                                                                // result_type = 'tv'
                                                                                                gettheDetails('tv', resp.results[0].id)
                                                                                        }
                                                                                }).fail(function() {
                                                                                    alert( "error" );
                                                                                })
                                                                        }
                                                                }).fail(function() {
                                                                    alert( "error" );
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
			}
		}); //end of view
		var pins = new MoviePinCollection([], {
			model: MoviePin,
		});
		var movie_map = new MapView({
			collection: pins
		});
		var movie_details = new Movie()
		var details_view = new DetailsView({
			model: movie_details
		}).render();
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