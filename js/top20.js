var app = angular.module('testTop20', [ 'angularCharts' ]);

// ======================================
//     CONTROLLERS
// ======================================
app.controller('Top20Controller', [ 'dataService', function( dataService ) {
    var self = this;

 // Loading status and Tabs initialization
    self.loadTrailerStatus = [ -1 ];
    self.loadMovieStatus = 'loading';   // can be equal to 'loading' or 'success' or 'error'
    self.currentTab = 'Top20';

 // Application data loading
    self.moviesData = [];
 /*
    //   >>>   This code should be used when the request to  http://www.myapifilms.com/imdb/top?callback=JSON_CALLBACK
    //   >>>   will be fixed on the service website

    dataService.loadData().then(
        function( movies ) {
            self.moviesData = movies;
            self.loadMovieStatus = 'success';
        },
        function( err ) {
            self.loadMovieStatus = 'error';
            console.log('Error when getting movie data');
        }
    );
 */
    //   >>>   Workaround for the http://www.myapifilms.com/imdb/top?callback=JSON_CALLBACK bug
    self.moviesData = dataService.loadData();
    self.loadMovieStatus = 'success';


 // Loading Favorite movies from localStorage, if present
    self.favMovies = [];
    self.favMovies = dataService.getFavoriteMovies();

 // Trailer URL for use in the video plugin
    self.trailerURL = '';

 // Loading trailers' information
    self.loadTrailerStatus[0] = 0;
    dataService.loadTrailersData( self.loadTrailerStatus );

}]);

app.controller('ChartController', [ 'dataService', function( dataService ) {
    var self = this;

    self.chartType = 'pie';
    self.chartData = dataService.getChartData();
    self.chartConfig = {
        labels: true,
        title: "",
        legend: {
            display: true,
            position: 'left'
        },
        innerRadius: 50,
        lineLegend: 'traditional'
    };
}]);



// ======================================
//     SERVICES: Data service
// ======================================
app.factory('dataService', [ '$http', '$q', function( $http, $q ) {

  // Data models
    var movies = [     // Model schema and example
        {
            urlPoster: 'http://ia.media-imdb.com/images/M/MV5BODU4MjU4NjIwNl5BMl5BanBnXkFtZTgwMDU2MjEyMDE@._V1_SX214_AL_.jpg',
            title: 'UUU',
            year: '1999',
            rating: '9.3',
            genres: ['Drama', 'Basic'],
            countries: ['USA', 'Germany'],
            directors: [ {name: 'Frank', pageURL: 'http://www.imdb.com/name/nm0001104/'} ],
            idIMDB: '',
            ranking: 1,
            favorite: false,
            trailer: {
                qualities: [
                    { quality: "240p", videoURL: "http://www.imdb.com/video/imdb/vi1317709849/imdb/single?vPage=1" },
                    { quality: "480p", videoURL: "http://www.imdb.com/video/imdb/vi1317709849/imdb/single?vPage=1" },
                    { quality: "720p", videoURL: "http://www.imdb.com/video/imdb/vi1317709849/imdb/single?vPage=1" }
                ],
                videoURL: "http://www.imdb.com/video/imdb/vi1317709849"
            },
        }
    ];

    var moviesYears = [];
    var favoriteMovies = [];


  // Top20 initial data processing method
    var prepareMoviesData = function( initialData ) {
        if ( initialData ) {
            movies = [];

            for ( var i=0, len=initialData.length; i<len; i++ ) {
                movies[ i ] = {};
                movies[ i ].urlPoster = initialData[ i ].urlPoster || '';
                movies[ i ].title = initialData[ i ].title || '';
                movies[ i ].year = initialData[ i ].year || '1800';
                movies[ i ].rating = initialData[ i ].rating || '';
                movies[ i ].idIMDB = initialData[ i ].idIMDB || '';
                movies[ i ].ranking = initialData[ i ].ranking || '';

                moviesYears.push( movies[ i ].year );

                movies[ i ].genres = [];
                for ( var k=0, len1=initialData[ i ].genres.length; k<len1; k++ ) {
                    movies[ i ].genres[ k ] = initialData[ i ].genres[ k ] || '';
                }

                movies[ i ].countries = [];
                for ( var k=0, len1=initialData[ i ].countries.length; k<len1; k++ ) {
                    movies[ i ].countries[ k ] = initialData[ i ].countries[ k ] || '';
                }

                movies[ i ].directors = [];
                for ( var k=0, len1=initialData[ i ].directors.length; k<len1; k++ ) {
                    movies[ i ].directors[ k ] = {};
                    movies[ i ].directors[ k ].name = initialData[ i ].directors[ k ].name || '';
                    movies[ i ].directors[ k ].pageURL = 'http://www.imdb.com/name/' + initialData[ i ].directors[ k ].nameId +'/';
                }

                movies[ i ].trailer = {};
                movies[ i ].trailer.qualities = [];
                movies[ i ].trailer.videoURL = '';

                movies[ i ].favorite = false;

            }   // end of the main "for" loop
        }       // end of "if"

        initialData = null;

        return movies;
    };


    return   {
       loadData: function() {
/*
            $http.jsonp( 'http://www.myapifilms.com/imdb/top?callback=JSON_CALLBACK&format=JSONP&start=1&end=5&data=F' )
                     .then( function(response) {
                                    //alert("Success TOP20");   return 11;
                                    return prepareMoviesData( response.data );
                                },
                                function(error) { alert("Error TOP20 = " + error.status); return $q.reject( error ); }
                     );
*/
            return prepareMoviesData( app.rawData );
        },   // end of "loadData"


        loadTrailersData:  function( counter ) {
            var url;

            for ( var i=0, len=movies.length; i<len; i++ ) {
                url = '';
                (function( n ) {
                    url = 'http://www.myapifilms.com/imdb?callback=JSON_CALLBACK&idIMDB=' + movies[ n ].idIMDB + '&trailer=1&format=JSONP';
                    $http.jsonp( url,
                            { transformResponse:  function( data ) {
                                  if ( data.trailer ) {
                                      movies[ n ].trailer.qualities = angular.copy( data.trailer.qualities ) || [];
                                      movies[ n ].trailer.videoURL = data.trailer.videoURL || '';
                                  }
                                  return {};
                              }
                            }
                     )
                    .then( function(response) { return true; },
                              function(error) {
                                  var str = '';
                                  for (var key in error)  str += (key + ' = ' + error[ key ] + ', ');
                                  console.log("Trailer n=" + n + " loading error: " + str);
                                  return $q.reject( error );
                              }
                    )
                    .finally( function(){
                            counter[0] += 100 / len;
                            if ( counter[0] >= 100 )  counter[0] = -1;
                        }
                    );

                }( i ));
            }

        },   // end of "loadTrailersData"


      //   >>> CHART data preparation
        getChartData:  function() {
            var moviesByDecades = {};

            moviesYears.sort();
            for ( var k=0, len=moviesYears.length, decade=''; k<len; k++ ) {
                if ( moviesYears[ k ].length === 4 ) {
                    decade = moviesYears[ k ].slice(0, 3);
                    moviesByDecades[ decade ] = moviesByDecades[ decade ] ? (moviesByDecades[ decade ] + 1) : 1;
                }
            }

            var chartData = {};
            chartData.series = [];
            chartData.data = [];
            var point = { x: '', y: [], tooltip: '' };
            var series = '', x = '';

            for (var key in moviesByDecades) {
                series = key + '0-' + key + '9';
                x = key + '0';
                chartData.series.push( series );
                point = { x: x, y: [ moviesByDecades[key] ], tooltip: series };
                chartData.data.push( point );
            }

            return ( key !== undefined? chartData : {} );

        },   // end of "getChartData"


      //   >>> Favorite Movies
        getFavoriteMovies:  function() {
            // Check local Storage
            if ( window.localStorage ) {
                var buf = localStorage.getItem( 'myFavMovies' );
                if ( buf ) {
                    favoriteMovies = angular.fromJson( buf );
                }
            }

            // Synchronize checkboxes
            var len1=movies.length;
            for ( var i=0, len=favoriteMovies.length; i<len; i++ ) {
                for ( var k=0; k<len1; k++ ) {
                    if ( favoriteMovies[ i ].idIMDB === movies[ k ].idIMDB )  break;
                }
                if ( k < len1 )  movies[ k ].favorite = true;
            }

            return favoriteMovies;
        },

        addFavoriteMovie:  function( movie ) {
            favoriteMovies.push( angular.copy( movie ) );

            if ( window.localStorage ) {
                var buf = angular.toJson( favoriteMovies );
                localStorage.setItem( 'myFavMovies', buf );
            }
        },

        removeFavoriteMovie:  function( movie ) {
            // Remove a fav movie
            for ( var i=0, len=favoriteMovies.length; i<len; i++ ) {
                if ( movie.idIMDB === favoriteMovies[ i ].idIMDB )  break;
            }
            if ( i < len )
                favoriteMovies.splice( i, 1 );

            // Reset the checkbox
            for ( var k=0, len1=movies.length; k<len1; k++ ) {
                if ( movie.idIMDB === movies[ k ].idIMDB )  break;
            }
            if ( k < len1 )
                movies[ k ].favorite = false;

            // Save a local copy of the fav movies list
            if ( window.localStorage ) {
                var buf = angular.toJson( favoriteMovies );
                localStorage.setItem( 'myFavMovies', buf );
            }
        },

    };   // end of "return"
}]);



// ======================================
//     DIRECTIVES
// ======================================
app.directive('loading', [ function() {
    return {
                restrict: 'A',
                templateUrl: 'views/loading.html'
   };
}]);

app.directive('moviesList', [ 'dataService', '$sce', function( dataService, $sce ) {
    return {
                restrict: 'A',
                scope: {
                    moviesData: '=moviesData',
                    trailerUrl: '=trailerUrl',
                },
                templateUrl: 'views/movies-list.html',
                link: function($scope, $elem, $attrs) {
                    $scope.getTrailerURL = function( videoURL ) {
                        var reg = /http\:\/\/www\.imdb\.com\/video\/imdb\/vi\d+/;
                        $scope.trailerUrl = $sce.trustAsResourceUrl( videoURL.match(reg)[0] + '/imdb/embed?autoplay=true&width=480' );
                    };

                    $scope.addFavMovie = function(movie) { dataService.addFavoriteMovie( movie ) };
                    $scope.removeFavMovie = function(movie) { dataService.removeFavoriteMovie( movie ) };
                }
   };
}]);

app.directive('modalDialog', [ function() {
    return {
                restrict: 'A',
                scope: {
                    modalDialogId: '@modalDialogId',
                    trailerUrl: '=trailerUrl'
                },
                templateUrl: 'views/modal-dialog.html',
                link: function($scope, $elem, $attrs) {
                    // ...
                }
   };
}]);
