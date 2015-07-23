var app = angular.module('testTop20', [ 'angularCharts' ]);


app.controller('Top20Controller', [ 'dataService', '$sce', function( dataService, $sce ) {
    var self = this;

// Loading status and Tabs initialization
    self.loadTrailerStatus = [ -1 ];
    self.loadMovieStatus = 'loading';   // is equal to 'loading' or 'success' or 'error'
    self.currentTab = 'Top20';

// Application data loading
    self.moviesData = [];
/*
    dataService.loadData().then(
        function( movies ) {
            self.loadMovieStatus = 'success';
            self.moviesData = movies;
        },
        function( err ) {
            self.loadMovieStatus = 'error';
            console.log('Error when getting movie data');
        }
    );
*/
    self.loadMovieStatus = 'success';
    self.moviesData = dataService.loadData();

    self.loadTrailerStatus[0] = 0;
    dataService.loadTrailersData( self.loadTrailerStatus );

// Trailer URL preparation
    self.trailerURL = '';
    self.getTrailerURL = function( videoURL ) {
        var reg = /http\:\/\/www\.imdb\.com\/video\/imdb\/vi\d+/;
        var url = $sce.trustAsResourceUrl( videoURL.match(reg)[0] + '/imdb/embed?autoplay=true&width=480' );
        return url;
    };


//===============================================
//     Add / Delete
//===============================================
/*
    self.addTimeSpan = function( dayName, tsFrom, tsUntil ) {
        // Find the active day of the week
        for ( var i=0, len1=self.regData.openingHours.length; i<len1; i++ )
            if ( dayName === self.regData.openingHours[ i ].dayName ) break;

        // Find the active time span
        var selectedDay = self.regData.openingHours[ i ];
        for ( var j=0, len2=selectedDay.hours.length; j<len2; j++ )
            if ( tsFrom === selectedDay.hours[ j ].from  &&  tsUntil === selectedDay.hours[ j ].until ) break;

        // Add a new time span after the active one  OR  the first one into an empty array of time spans
        if ( j < len2  ||  len2 === 0 ) {
            var buf = {from: '', until: ''};
            selectedDay.hours.splice( j+1, 0, buf );
        }
    };

    self.deleteTimeSpan = function( dayName, tsFrom, tsUntil ) {
        // Find the active day of the week
        for ( var i=0, len1=self.regData.openingHours.length; i<len1; i++ )
            if ( dayName === self.regData.openingHours[ i ].dayName ) break;

        // Find the active time span
        var selectedDay = self.regData.openingHours[ i ];
        for ( var j=0, len2=selectedDay.hours.length; j<len2; j++ )
            if ( tsFrom === selectedDay.hours[ j ].from  &&  tsUntil === selectedDay.hours[ j ].until ) break;

        // Delete the active time span
        if ( j < len2 )
            selectedDay.hours.splice( j, 1 );
    };
*/
}]);


app.factory('dataService', [ '$http', '$q', function( $http, $q ) {

  // Data models
    var movies = [     // Model schema
        {
            urlPoster: 'http://ia.media-imdb.com/images/M/MV5BODU4MjU4NjIwNl5BMl5BanBnXkFtZTgwMDU2MjEyMDE@._V1_SX214_AL_.jpg',
            title: 'UUUU',
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
    var moviesByDecades = {};


  // Data processing methods
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


        // Movies by decades
        moviesYears.sort();
        for ( var k=0, len=moviesYears.length, decade=''; k<len; k++ ) {
            if ( moviesYears[ k ].length === 4 ) {
                decade = moviesYears[ k ].slice(0, 3);
                moviesByDecades[ decade ] = moviesByDecades[ decade ] ? (moviesByDecades[ decade ] + 1) : 1;
            }
        }

        initialData = null;

        return movies;
    };


    return   {
       loadData: function() {
/*
            $http.jsonp( 'http://www.myapifilms.com/imdb/top?callback=JSON_CALLBACK&format=JSONP&start=1&end=5&data=F' )
                     .then( function(response) { 
									alert("Success TOP20");   return 11; 
									//return prepareMoviesData( response.data );
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
                                  var str = 'Error: ';
                                  for (var key in error)  str += (key + ' = ' + error[ key ] + ', ');
                                  alert("Trailer loading = " + str);
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


        getChartData:  function() {
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

        }   // end of "getChartData"

    };   // end of "return"

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
//     DIRECTIVES
// ======================================

app.directive('loading', [ function() {
    return {
                restrict: 'A',
                templateUrl: 'views/loading.html'
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
                    //
                }
   };
}]);




/*
app.factory('loadingInterceptor', ['$q', function($q) {
    return {
        request: function(config) {
            console.log('Request made with ', config);
            return config;
        },

        requestError: function(rejection) {
            console.log('Request error due to ', rejection);
            return $q.reject(rejection);
        },

        response: function(response) {
            console.log('Response from server ', response);
            return response || $q.when(response);     // Return a promise
        },

        responseError: function(rejection) {
            console.log('Error in response ', rejection);
            return $q.reject(rejection);
        }
    };
}]);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('loadingInterceptor');
}]);
*/
