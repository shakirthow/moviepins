var API_ROOT = 'https://moviepins.appspot.com/_ah/api';
var moviedb_apibase = 'http://api.themoviedb.org/3';
var moviedb_key = '7bfb5aa6abb2c2a47d4bba0e1ff36ccc';
var moviedb_base = 'http://image.tmdb.org/t/p/w500';

function loadApiClient() {
        gapi.client.load('moviepins', 'v1.0', function() {
                init();
        }, API_ROOT);
}
var init = function() {
        //***********MODELS***********//
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
        //***********COLLECTIONS***********//
        var AutoCompleteCollection = Backbone.Collection.extend();
        var MoviePinCollection = Backbone.Collection.extend({
                model: MoviePin,
        });
        //***********VIEWS***********//
        var AutoCompleteView = Backbone.View.extend({
                el: '.autocompletelist',
                initialize: function() {
                        this.render();
                        this.collection.on('add', this.render, this);
                        this.collection.on('reset', this.render, this);
                        var searchMsgCont = $('#char-rem-cont');
                        var textRemCont = $('#char-rem-span');
                        var autoCompLoader = $('#autocomp-loader');
                        var charRem = $('#char-rem');
                        var searchEmpty = $('#search-empty');
                        var listContainer = $('.autocompletelist');
                        var that = this;
                        $('#search-input input').keyup(function(key) {
                                textRemCont.hide();
                                searchMsgCont.hide();
                                autoCompLoader.hide();
                                searchEmpty.hide();
                                var input = $(this);
                                listContainer.fadeOut();
                                if (((key.which == 13) && (input.val().length >= 3)) || (input.val().length >= 3)) {
                                        delay(function() {
                                                searchMsgCont.show();
                                                autoCompLoader.show();
                                                gapi.client.moviepins.movies.search({
                                                        'q': input.val()
                                                }).execute(function(resp) {
                                                        if (resp.code == 400){
                                                                alert('There was an error while trying to search "'+input.val()+'"')
                                                        }
                                                        else{
                                                                autoCvalues = JSON.parse(resp.resp);
                                                                that.collection.reset();
                                                                if (autoCvalues.length === 0) {
                                                                        autoCompLoader.hide();
                                                                        searchEmpty.show();
                                                                } else {
                                                                        searchEmpty.hide();
                                                                        autoCompLoader.hide();
                                                                        listContainer.fadeIn();
                                                                        for (var item in autoCvalues) {
                                                                                that.collection.add(autoCvalues[item]);
                                                                        }
                                                                }
                                                        }
                                                });
                                        }, 1000);
                                } else if ((key.which == 13) && (input.val().length < 3)) {
                                        searchMsgCont.show();
                                        textRemCont.show();
                                        autoCompLoader.hide();
                                        searchEmpty.hide();
                                        charRem.html(3 - input.val().length);
                                        // listContainer.fadeOut()
                                }
                        });
                        $('#search-input input').focus(function() {
                                $('#browse-container').fadeOut();
                                listContainer.fadeIn();
                        });
                },
                render: function() {
                        var template = _.template($('#autocomple-template').html());
                        variables = {
                                items: this.collection.models
                        };
                        this.$el.html(template(variables));
                        that = this;
                        var autocompletelist = $('.autocompletelist');
                        var searchInput = $('#search-input input');
                        $('.autocompleteItem').click(function() {
                                var index = $(this).data();
                                pins.reset();
                                markerManager.clearMarkers();
                                pins.add(that.collection.at(index.collectionIndex));
                                $('#char-rem-cont').hide();
                                that.collection.reset();
                        });
                        $(document).mouseup(function(e) {
                                if (!autocompletelist.is(e.target) && autocompletelist.has(e.target).length === 0 && e.target != searchInput[0]) {
                                        autocompletelist.fadeOut();
                                }
                        });
                }
        });
        var DetailsView = Backbone.View.extend({
                el: '.details-slider',
                initialize: function() {
                        this.model.attributes.uber.on('change', this.uberRender, this);
                        this.model.attributes.movie.on('change', this.render, this);
                        $(document).mouseup(function(e) {
                                if (!menuRight.is(e.target) && menuRight.has(e.target).length === 0) {
                                        menuRight.removeClass('details-slider-open');
                                }
                        });
                },
                render: function() {
                        var template = _.template($('#details-slider-template').html());
                        variables = this.model.attributes.movie.attributes;
                        if (variables.backdrop_path !== null) {
                                variables.backdrop_path = moviedb_base + variables.backdrop_path;
                                variables.poster_path = moviedb_base + variables.poster_path;
                                variables.tagline = '';
                        } else {
                                variables.backdrop_path = '/images/placeholder.png';
                        }
                        this.$el.html(template(variables));
                },
                uberRender: function() {
                        var obj = this.model.attributes.uber.attributes;
                        $("#uber").html('<div class="col-md-3 col-xs-3 col-sm-3 col-lg-3">' + '<img src="images/uber.jpg" width="50"></div>' +
                                '<div class="col-md-3 col-sm-3 col-xs-3 col-lg-3"><span><i class="fa fa-map-marker"></i><br>' + obj.distance +
                                ' mil</span></div>' + '<div class="col-md-3 col-sm-3 col-xs-3 col-lg-3"><span><i class="fa fa-clock-o"></i><br>' + ((obj.duration) /
                                        60).toFixed(2) + ' min</span></div>' +
                                '<div class="col-md-3 col-xs-3 col-sm-3 col-lg-3"><span><i class="fa fa-usd"></i><br>' + obj.estimate + '</span></div>');
                }
        });
        var MainView = Backbone.View.extend({
                initialize: function() {
                        var zoom = 13;
                        if (isMobile()) {
                                zoom = 10;
                        }
                        var mapOptions = {
                                // styles: [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":30},{"gamma":0.5},{"hue":"#435158"}]}],
                                panControlOptions: {
                                        position: google.maps.ControlPosition.BOTTOM_LEFT
                                },
                                mapTypeControl: false,
                                zoomControl: true,
                                zoomControlOptions: {
                                        style: google.maps.ZoomControlStyle.SMALL,
                                        position: google.maps.ControlPosition.BOTTOM_LEFT
                                },
                                center: myLocation.SFLocation,
                                zoom: zoom
                        };
                        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                        browseMovies.setMap(map);
                        myLocation.getLocation();
                        this.collection.bind('add', function(model) {
                                map.setZoom(zoom);
                                markerManager.addMarker(map, model.attributes);
                        });
                }
        }); //end of view
        //***********INITIALIZE***********//
        menuRight = $('#cbp-spmenu-s2');
        var movie_details = new Movie();
        var uber_data = new UberData();
        var detailsScreen = new DetailsScreen({
                movie: movie_details,
                uber: uber_data
        });
        var details_view = new DetailsView({
                model: detailsScreen
        });
        var myLocation = new MyLocation();
        var markerManager = new MarkerManager(movie_details, uber_data);
        var browseMovies = new BrowseMovies(markerManager);
        var autoCompleteCollection = new AutoCompleteCollection();
        var autoCompleteView = new AutoCompleteView({
                collection: autoCompleteCollection
        });
        var pins = new MoviePinCollection([], {
                model: MoviePin,
        });
        var main_view = new MainView({
                collection: pins
        });
}; //end init
//***********UTILITY FUNCTIONS***********//
var delay = (function() {
        var timer = 0;
        return function(callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
        };
})();

var isMobile = function() {
        if ($(window).width() < 480 || $(window).height() < 480) {
                return true;
        }
};

function MyLocation(){
        if (arguments.callee.instance) return arguments.callee.instance;
        arguments.callee.instance = this;
        this.latitude = null
        this.longitude= null
        currentLocation = null
        this.SFLocation  = new google.maps.LatLng(37.789790, -122.444466);
        this.map = null
        
}
MyLocation.prototype = {
        getLocation: function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.showPosition, this.showError);
            } else { 
                alert("Geolocation is not supported by this browser.")
            }
        },
        showPosition: function(position) {
            this.latitude =  position.coords.latitude;
            this.longitude =  position.coords.longitude;      
            currentLocation = new google.maps.LatLng(this.latitude, this.longitude);
            var m = new google.maps.Marker({
                position: currentLocation,
                icon: 'images/currentLocation.png'
                });
            m.setMap(map);
            ////console.log(map)
            ////console.log(currentLocation)
        },
        showError: function(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    alert("We'll need your location permission to point your location. You can change settings in your browser preferences")
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("We werent able to locate your device position.")
                    break;
                case error.TIMEOUT:
                    alert("The request for your location timmmed out")
                    break;
                case error.UNKNOWN_ERROR:
                    alert("Error occured when fetching your location")
                    break;
            }
        },
        // setMap: function(map){
        //         this.map = map;
        //         //console.log(this.map)
        //         this.getLocation()
        // }
}

function BrowseMovies(manager) {
        this.typeSel = $('#browse-type');
        this.valSel = $('#browse-val');
        this.browseMenu = $('#browse-open');
        this.container = $('#browse-container');
        this.map = null;
        this._initEvents();
        this.manager = manager;
}
BrowseMovies.prototype = {
        setMap: function(map) {
                this.map = map;
        },
        _initEvents: function() {
                var self = this;
                this.typeSel.change(function() {
                        self.valSel.find('option').remove().end().append('<option>Select a ' + self.typeSel.val() + ' </option>').val('null');
                        gapi.client.moviepins.movies.browse({
                                'q': self.typeSel.val()
                        }).execute(function(resp) {
                                if (resp.code == 400){
                                        alert('There was an error while trying to search "'+input.val()+'"')
                                }
                                else{

                                        selectValues = JSON.parse(resp.resp);
                                        selectValues.sort(function(a, b) {
                                                if (a[self.typeSel.val()] < b[self.typeSel.val()]) return -1;
                                                if (a[self.typeSel.val()] > b[self.typeSel.val()]) return 1;
                                                return 0;
                                        })
                                        $.each(selectValues, function(key, value) {
                                                self.valSel.append($("<option></option>").attr("value", value[self.typeSel.val()]).text(value[
                                                        self.typeSel.val()]));
                                        });
                                }
                        });
                });
                this.valSel.change(function() {
                        t = self.typeSel.val();
                        v = self.valSel.val();
                        params = {};
                        params[t] = v;
                        var zoom = 13;
                        if (isMobile()) {
                                zoom = 10;
                        }
                        gapi.client.moviepins.movies.find(params).execute(function(resp) {
                                if (resp.code == 400){
                                        alert('There was an error while trying to search "'+input.val()+'"')
                                }
                                else{

                                        self.map.setZoom(zoom);
                                        self.manager.clearMarkers();
                                        self.manager.addMarkerCollection(self.map, JSON.parse(resp.resp));
                                }
                        });
                });
                this.browseMenu.click(function() {
                        self.container.fadeToggle();
                });
                $(document).mouseup(function(e) {
                        if (!self.container.is(e.target) && self.container.has(e.target).length === 0) {
                                self.container.fadeOut();
                        }
                });
        }
};

function MarkerManager(movieModel, uberModel) {
        if (arguments.callee.instance) return arguments.callee.instance;
        arguments.callee.instance = this;
        this.markers = [];
        this.SFLoc = new google.maps.LatLng(37.789790, -122.444466);
        this.movieModel = movieModel;
        this.uberModel = uberModel;
        // this.map  = null 
}
MarkerManager.prototype = {
        addMarker: function(map, model) {
                this.map = map;
                this.model = model;
                this.searchLocation(model);
        },
        addMarkerCollection: function(map, modelList) {
                this.map = map;
                this.map.setCenter(this.SFLoc);
                for (var i = modelList.length - 1; i >= 0; i--) {
                        this.model = modelList[i];
                        this.searchLocation(this.model);
                }
        },
        clearMarkers: function() {
                for (var i = 0; i < this.markers.length; i++) {
                        this.markers[i].setMap(null);
                }
        },
        searchLocation: function(movieModel) {
                var self = this;
                service = new google.maps.places.PlacesService(this.map);
                service.textSearch({
                        query: movieModel.locations + ', SF',
                        location: self.SFLoc,
                        radius: 3000
                }, function(results, status) {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                                self.placeMarker(results[0].geometry.location, movieModel);
                        }
                });
        },
        placeMarker: function(location, model) {
                var self = this;
                //console.log(location)
                var marker = new google.maps.Marker({
                        position: location,
                        map: self.map,
                        title: model.title,
                        release_year: model.release_year,
                        production_company: model.production_company,
                        actor_1: model.actor_1,
                        year: model.release_year
                });
                marker.setMap(this.map);
                this.markers.push(marker);
                this.markerEvent(marker);
        },
        uberEstimates: function(from, to) {
                var self = this;
                gapi.client.moviepins.uber.estimate({
                        'end_latitude': to.k,
                        'end_longitude': to.D,
                        'start_latitude': from.k,
                        'start_longitude': from.D
                }).execute(function(resp) {
                        // console.log(resp)
                        if(resp.code == 404){
                                $('#uber').html('Looks like you are too far away to calculate the price and distance')
                        }
                        else{
                            self.uberModel.set(JSON.parse(resp.resp));    
                        }
                        
                });
        },
        addInfoWindow: function(marker) {
                var contentString = '<div> <h5>:(  We dont have additional information on this title </h5>' + '<br><strong>Title: </strong>' + marker.title +
                        '<br><strong>Year: </strong>' + marker.release_year + '<br><strong>Production Company: </strong>' + marker.production_company +
                        '<br><strong>Main Actor: </strong>' + marker.actor_1 + '</div>';
                var infowindow = new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 300
                });
                infowindow.open(this.map, marker);
        },
        markerEvent: function(marker) {
                        var self = this;
                        google.maps.event.addListener(marker, 'click', function() {
                                self.map.setZoom(16);
                                self.map.setCenter(marker.getPosition());
                                if(currentLocation != null){
                                	self.uberEstimates(currentLocation, marker.getPosition());
                                }
                                else{
                                	$('#uber').html('The browser was not able to locate you!')
                                }
                                gettheDetails = function(type, id) {
                                        $.ajax({
                                                url: moviedb_apibase + '/' + type + '/' + id,
                                                data: {
                                                        'api_key': moviedb_key,
                                                        'append_to_response': 'credits,videos'
                                                }
                                        }).done(function(movie_detail) {
                                                if (type == 'tv') {
                                                        movie_detail.title = movie_detail.name;
                                                        movie_detail.runtime = 'Episode: ' + movie_detail.episode_run_time;
                                                }
                                                self.movieModel.set(movie_detail);
                                                $(menuRight).addClass('details-slider-open');
                                                //console.log(movie_detail);
                                                $('.trailerLink').on('show.bs.modal', function(e) {
                                                        if (movie_detail.videos.results.length > 0) {
                                                                $('.trailerLink .modal-content').html(
                                                                        '<iframe id="ytplayer" type="text/html" width="600" height="412" src="https://www.youtube.com/embed/' +
                                                                        movie_detail.videos.results[0].key +
                                                                        '?autoplay=1"frameborder="0" allowfullscreen>');
                                                        }
                                                });
                                                $('.trailerLink').on('hidden.bs.modal', function(e) {
                                                        $('.trailerLink .modal-content').html('');
                                                });
                                        }).fail(function() {
                                                alert("error");
                                        });
                                };
                                $.ajax({
                                        url: moviedb_apibase + "/search/movie",
                                        data: {
                                                'api_key': moviedb_key,
                                                'query': self.model.title,
                                                'year': self.model.release_year
                                        }
                                }).done(function(resp) {
                                        var detailsFound = false;
                                        if (resp.results.length > 0) {
                                                detailsFound = true;
                                                gettheDetails('movie', resp.results[0].id);
                                        } else {
                                                $.ajax({
                                                        url: moviedb_apibase + "/search/tv",
                                                        data: {
                                                                'api_key': moviedb_key,
                                                                'query': self.model.title,
                                                                'year': self.model.release_year
                                                        }
                                                }).done(function(resp) {
                                                        if (resp.results.length > 0) {
                                                                detailsFound = true;
                                                                gettheDetails('tv', resp.results[0].id);
                                                        }
                                                }).fail(function() {
                                                        alert("error");
                                                });
                                        }
                                        if (!detailsFound) {
                                                self.addInfoWindow(marker);
                                        }
                                }).fail(function(e) {
                                        alert("error");
                                });
                        });
                } //End marker event 
};