var app = angular.module('testTop20', []);


app.controller('Top20Controller', [ 'dataService', function( dataService ) {
    var self = this;

// Application data loading
    self.loadMovieStatus = 'loading';   // 'loading' or 'success' or 'error'
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


// Tab selection initiation
    self.currentTab = "Top20";


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

        return movies;
    };


    return   {
       loadData: function() {
/*
            $http.jsonp( 'http://www.myapifilms.com/imdb/top?callback=JSON_CALLBACK&format=JSONP&start=1&end=5&data=F',
//            $http.jsonp( 'http://www.myapifilms.com/imdb?callback=JSON_CALLBACK&idIMDB=tt0111161&format=JSONP',
//            $http.jsonp( 'http://www.myapifilms.com/imdb?callback=JSON_CALLBACK&idIMDB=tt0110912&format=JSONP',
                                { transformResponse:    function(data, headers) {
                                        alert("Data2 = " + data.year + ' ' + data.simplePlot + ' ' + data.title );
                                        return data;
                                    }
                                }
                            )
                            .then( function(response) { alert("URA2"); return 11; },
                                      function(error) { alert("Error2 = " + error.status); return $q.reject( error ); }
                            );
*/

            return prepareMoviesData( app.rawData );
            //return movies;
        },   // end of "loadData"

    };

}]);



app.directive('loading', [ function() {
    return {
                restrict: 'A',
                templateUrl: 'views/loading.html'
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

app.rawData = JSON.parse( '[{"countries":["USA"],"directors":[{"name":"Frank Darabont","nameId":"nm0001104"}],"filmingLocations":["St. Croix","U.S. Virgin Islands"],"genres":["Crime","Drama"],"idIMDB":"tt0111161","languages":["English"],"metascore":"80/100","originalTitle":"","plot":"Andy Dufresne is a young and successful banker whose life changes drastically when he is convicted and sentenced to life imprisonment for the murder of his wife and her lover. Set in the 1940s, the film shows how Andy, with the help of his friend Red, the prison entrepreneur, turns out to be a most unconventional prisoner.","ranking":1,"rated":"R","rating":"9.3","releaseDate":"19941014","runtime":["142 min"],"simplePlot":"Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.","title":"The Shawshank Redemption","urlIMDB":"http://www.imdb.com/title/tt0111161","urlPoster":"http://ia.media-imdb.com/images/M/MV5BODU4MjU4NjIwNl5BMl5BanBnXkFtZTgwMDU2MjEyMDE@._V1_SX214_AL_.jpg","votes":"1,487,843","writers":[{"name":"Stephen King","nameId":"nm0000175"},{"name":"Frank Darabont","nameId":"nm0001104"}],"year":"1994"},{"countries":["USA"],"directors":[{"name":"Francis Ford Coppola","nameId":"nm0000338"}],"filmingLocations":["NY Eye and Ear Infirmary","2nd Avenue & East 13th Street","New York City","New York","USA"],"genres":["Crime","Drama"],"idIMDB":"tt0068646","languages":["English","Italian","Latin"],"metascore":"100/100","originalTitle":"","plot":"When the aging head of a famous crime family decides to transfer his position to one of his subalterns, a series of unfortunate events start happening to the family, and a war begins between all the well-known families leading to insolence, deportation, murder and revenge, and ends with the favorable successor being finally chosen.","ranking":2,"rated":"R","rating":"9.2","releaseDate":"19720324","runtime":["175 min"],"simplePlot":"The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.","title":"The Godfather","urlIMDB":"http://www.imdb.com/title/tt0068646","urlPoster":"http://ia.media-imdb.com/images/M/MV5BMjEyMjcyNDI4MF5BMl5BanBnXkFtZTcwMDA5Mzg3OA@@._V1_SX214_AL_.jpg","votes":"1,020,276","writers":[{"name":"Mario Puzo","nameId":"nm0701374"},{"name":"Francis Ford Coppola","nameId":"nm0000338"}],"year":"1972"},{"countries":["USA"],"directors":[{"name":"Francis Ford Coppola","nameId":"nm0000338"}],"filmingLocations":["2045 N. Hibiscus Drive","North Miami","Florida","USA"],"genres":["Crime","Drama"],"idIMDB":"tt0071562","languages":["English","Italian","Spanish","Latin","Sicilian"],"metascore":"80/100","originalTitle":"","plot":"The continuing saga of the Corleone crime family tells the story of a young Vito Corleone growing up in Sicily and in 1910s New York; and follows Michael Corleone in the 1950s as he attempts to expand the family business into Las Vegas, Hollywood and Cuba.","ranking":3,"rated":"R","rating":"9.1","releaseDate":"19741220","runtime":["200 min"],"simplePlot":"The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.","title":"The Godfather: Part II","urlIMDB":"http://www.imdb.com/title/tt0071562","urlPoster":"http://ia.media-imdb.com/images/M/MV5BNDc2NTM3MzU1Nl5BMl5BanBnXkFtZTcwMTA5Mzg3OA@@._V1_SX214_AL_.jpg","votes":"687,576","writers":[{"name":"Francis Ford Coppola","nameId":"nm0000338"},{"name":"Mario Puzo","nameId":"nm0701374"}],"year":"1974"},{"countries":["USA","UK"],"directors":[{"name":"Christopher Nolan","nameId":"nm0634240"}],"filmingLocations":["Times Square","Causeway Bay","Hong Kong"],"genres":["Action","Crime","Drama"],"idIMDB":"tt0468569","languages":["English","Mandarin"],"metascore":"82/100","originalTitle":"","plot":"Batman raises the stakes in his war on crime. With the help of Lieutenant Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the city streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as The Joker.","ranking":4,"rated":"PG-13","rating":"9.0","releaseDate":"20080718","runtime":["152 min"],"simplePlot":"When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, the caped crusader must come to terms with one of the greatest psychological tests of his ability to fight injustice.","title":"The Dark Knight","urlIMDB":"http://www.imdb.com/title/tt0468569","urlPoster":"http://ia.media-imdb.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SY317_CR0,0,214,317_AL_.jpg","votes":"1,461,320","writers":[{"name":"Jonathan Nolan","nameId":"nm0634300"},{"name":"Christopher Nolan","nameId":"nm0634240"}],"year":"2008"},{"countries":["USA"],"directors":[{"name":"Quentin Tarantino","nameId":"nm0000233"}],"filmingLocations":["1435 Flower Street","Glendale","California","USA"],"genres":["Crime","Drama"],"idIMDB":"tt0110912","languages":["English","Spanish","French"],"metascore":"94/100","originalTitle":"","plot":"Jules Winnfield and Vincent Vega are two hitmen who are out to retrieve a suitcase stolen from their employer, mob boss Marsellus Wallace. Wallace has also asked Vincent to take his wife Mia out a few days later when Wallace himself will be out of town. Butch Coolidge is an aging boxer who is paid by Wallace to lose his next fight. The lives of these seemingly unrelated people are woven together comprising of a series of funny, bizarre and uncalled-for incidents.","ranking":5,"rated":"R","rating":"8.9","releaseDate":"19941014","runtime":["154 min"],"simplePlot":"The lives of two mob hit men, a boxer, a gangster\'s wife, and a pair of diner bandits intertwine in four tales of violence and redemption.","title":"Pulp Fiction","urlIMDB":"http://www.imdb.com/title/tt0110912","urlPoster":"http://ia.media-imdb.com/images/M/MV5BMjE0ODk2NjczOV5BMl5BanBnXkFtZTYwNDQ0NDg4._V1_SY317_CR4,0,214,317_AL_.jpg","votes":"1,157,470","writers":[{"name":"Quentin Tarantino","nameId":"nm0000233"},{"name":"Roger Avary","nameId":"nm0000812"}],"year":"1994"},{"countries":["USA"],"directors":[{"name":"Steven Spielberg","nameId":"nm0000229"}],"filmingLocations":["Józefa","Kraków","Malopolskie","Poland"],"genres":["Biography","Drama","History"],"idIMDB":"tt0108052","languages":["English","Hebrew","German","Polish"],"metascore":"93/100","originalTitle":"","plot":"Oskar Schindler is a vainglorious and greedy German businessman who becomes an unlikely humanitarian amid the barbaric Nazi reign when he feels compelled to turn his factory into a refuge for Jews. Based on the true story of Oskar Schindler who managed to save about 1100 Jews from being gassed at the Auschwitz concentration camp, it is a testament for the good in all of us.","ranking":6,"rated":"R","rating":"8.9","releaseDate":"19940204","runtime":["195 min"],"simplePlot":"In Poland during World War II, Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.","title":"Schindler\'s List","urlIMDB":"http://www.imdb.com/title/tt0108052","urlPoster":"http://ia.media-imdb.com/images/M/MV5BMzMwMTM4MDU2N15BMl5BanBnXkFtZTgwMzQ0MjMxMDE@._V1_SX214_AL_.jpg","votes":"755,419","writers":[{"name":"Thomas Keneally","nameId":"nm0447745"},{"name":"Steven Zaillian","nameId":"nm0001873"}],"year":"1993"},{"countries":["USA"],"directors":[{"name":"Sidney Lumet","nameId":"nm0001486"}],"filmingLocations":["New York County Courthouse - 60 Centre Street","New York City","New York","USA"],"genres":["Crime","Drama","Mystery"],"idIMDB":"tt0050083","languages":["English"],"metascore":"","originalTitle":"","plot":"The defense and the prosecution have rested and the jury is filing into the jury room to decide if a young Spanish-American is guilty or innocent of murdering his father. What begins as an open and shut case of murder soon becomes a mini-drama of each of the jurors\' prejudices and preconceptions about the trial, the accused, and each other. Based on the play, all of the action takes place on the stage of the jury room.","ranking":7,"rated":"NOT RATED","rating":"8.9","releaseDate":"195704","runtime":["96 min"],"simplePlot":"A dissenting juror in a murder trial slowly manages to convince the others that the case is not as obviously clear as it seemed in court.","title":"12 Angry Men","urlIMDB":"http://www.imdb.com/title/tt0050083","urlPoster":"http://ia.media-imdb.com/images/M/MV5BODQwOTc5MDM2N15BMl5BanBnXkFtZTcwODQxNTEzNA@@._V1_SX214_AL_.jpg","votes":"380,707","writers":[{"name":"Reginald Rose","nameId":"nm0741627"}],"year":"1957"},{"countries":["Italy","Spain","West Germany","USA"],"directors":[{"name":"Sergio Leone","nameId":"nm0001466"}],"filmingLocations":["Almería","Andalucía","Spain"],"genres":["Western"],"idIMDB":"tt0060196","languages":["Italian"],"metascore":"90/100","originalTitle":"Il buono, il brutto, il cattivo","plot":"Blondie (The Good) is a professional gunslinger who is out trying to earn a few dollars. Angel Eyes (The Bad) is a hit man who always commits to a task and sees it through, as long as he is paid to do so. And Tuco (The Ugly) is a wanted outlaw trying to take care of his own hide. Tuco and Blondie share a partnership together making money off Tuco\'s bounty, but when Blondie unties the partnership, Tuco tries to hunt down Blondie. When Blondie and Tuco come across a horse carriage loaded with dead bodies, they soon learn from the only survivor (Bill Carson) that he and a few other men have buried a stash of gold in a cemetery. Unfortunately Carson dies and Tuco only finds out the name of the cemetery, while Blondie finds out the name on the grave. Now the two must keep each other alive in order to find the gold. Angel Eyes (who had been looking for Bill Carson) discovers that Tuco and Blondie meet with Carson and knows they know the location of the gold. All he needs is for the two to ...","ranking":8,"rated":"NOT RATED","rating":"8.9","releaseDate":"19680308","runtime":["161 min"],"simplePlot":"A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.","title":"The Good, the Bad and the Ugly","urlIMDB":"http://www.imdb.com/title/tt0060196","urlPoster":"http://ia.media-imdb.com/images/M/MV5BOTQ5NDI3MTI4MF5BMl5BanBnXkFtZTgwNDQ4ODE5MDE@._V1_SX214_AL_.jpg","votes":"444,768","writers":[{"name":"Luciano Vincenzoni","nameId":"nm0898812"},{"name":"Sergio Leone","nameId":"nm0001466"}],"year":"1966"},{"countries":["USA","New Zealand"],"directors":[{"name":"Peter Jackson","nameId":"nm0001392"}],"filmingLocations":["Camperdown Studios","Camperdown Road","Miramar","Wellington","New Zealand"],"genres":["Adventure","Fantasy"],"idIMDB":"tt0167260","languages":["English","Quenya","Old English","Sindarin"],"metascore":"94/100","originalTitle":"","plot":"While Frodo & Sam continue to approach Mount Doom to destroy the One Ring, unaware of the path Gollum is leading them, the former Fellowship aid Rohan & Gondor in a great battle in the Pelennor Fields, Minas Tirith and the Black Gates as Sauron wages his last war against Middle-Earth.","ranking":9,"rated":"PG-13","rating":"8.9","releaseDate":"20031217","runtime":["201 min"],"simplePlot":"Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.","title":"The Lord of the Rings: The Return of the King","urlIMDB":"http://www.imdb.com/title/tt0167260","urlPoster":"http://ia.media-imdb.com/images/M/MV5BMjE4MjA1NTAyMV5BMl5BanBnXkFtZTcwNzM1NDQyMQ@@._V1_SX214_AL_.jpg","votes":"1,066,563","writers":[{"name":"J.R.R. Tolkien","nameId":"nm0866058"},{"name":"Fran Walsh","nameId":"nm0909638"}],"year":"2003"},{"countries":["USA","Germany"],"directors":[{"name":"David Fincher","nameId":"nm0000399"}],"filmingLocations":["421 W. Eighth Street","Los Angeles","California","USA"],"genres":["Drama"],"idIMDB":"tt0137523","languages":["English"],"metascore":"66/100","originalTitle":"","plot":"A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground fight clubs forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.","ranking":10,"rated":"R","rating":"8.9","releaseDate":"19991015","runtime":["139 min"],"simplePlot":"An insomniac office worker, looking for a way to change his life, crosses paths with a devil-may-care soap maker, forming an underground fight club that evolves into something much, much more...","title":"Fight Club","urlIMDB":"http://www.imdb.com/title/tt0137523","urlPoster":"http://ia.media-imdb.com/images/M/MV5BMjIwNTYzMzE1M15BMl5BanBnXkFtZTcwOTE5Mzg3OA@@._V1_SX214_AL_.jpg","votes":"1,167,384","writers":[{"name":"Chuck Palahniuk","nameId":"nm0657333"},{"name":"Jim Uhls","nameId":"nm0880243"}],"year":"1999"},{"countries":["New Zealand","USA"],"directors":[{"name":"Peter Jackson","nameId":"nm0001392"}],"filmingLocations":["Arrowtown Recreational Reserve","Arrowtown","Otago","New Zealand"],"genres":["Adventure","Fantasy"],"idIMDB":"tt0120737","languages":["English","Sindarin"],"metascore":"92/100","originalTitle":"","plot":"An ancient Ring thought lost for centuries has been found, and through a strange twist in fate has been given to a small Hobbit named Frodo. When Gandalf discovers the Ring is in fact the One Ring of the Dark Lord Sauron, Frodo must make an epic quest to the Cracks of Doom in order to destroy it! However he does not go alone. He is joined by Gandalf, Legolas the elf, Gimli the Dwarf, Aragorn, Boromir and his three Hobbit friends Merry, Pippin and Samwise. Through mountains, snow, darkness, forests, rivers and plains, facing evil and danger at every corner the Fellowship of the Ring must go. Their quest to destroy the One Ring is the only hope for the end of the Dark Lords reign!","ranking":11,"rated":"PG-13","rating":"8.8","releaseDate":"20011219","runtime":["178 min"],"simplePlot":"A meek hobbit of the Shire and eight companions set out on a journey to Mount Doom to destroy the One Ring and the dark lord Sauron.","title":"The Lord of the Rings: The Fellowship of the Ring","urlIMDB":"http://www.imdb.com/title/tt0120737","urlPoster":"http://ia.media-imdb.com/images/M/MV5BNTEyMjAwMDU1OV5BMl5BanBnXkFtZTcwNDQyNTkxMw@@._V1_SY317_CR1,0,214,317_AL_.jpg","votes":"1,091,765","writers":[{"name":"J.R.R. Tolkien","nameId":"nm0866058"},{"name":"Fran Walsh","nameId":"nm0909638"}],"year":"2001"},{"countries":["USA"],"directors":[{"name":"Irvin Kershner","nameId":"nm0449984"}],"filmingLocations":["Banks","Oregon","USA"],"genres":["Action","Adventure","Fantasy","Sci-Fi"],"idIMDB":"tt0080684","languages":["English"],"metascore":"79/100","originalTitle":"","plot":"After the Rebel base on the icy planet Hoth is taken over by the empire, Han, Leia, Chewbacca, and C-3PO flee across the galaxy from the Empire. Luke travels to the forgotten planet of Dagobah to receive training from the Jedi master Yoda, while Vader endlessly pursues him.","ranking":12,"rated":"PG","rating":"8.8","releaseDate":"19800620","runtime":["124 min"],"simplePlot":"After the rebels have been brutally overpowered by the Empire on their newly established base, Luke Skywalker takes advanced Jedi training with Master Yoda, while his friends are pursued by Darth Vader as part of his plan to capture Luke.","title":"Star Wars: Episode V - The Empire Strikes Back","urlIMDB":"http://www.imdb.com/title/tt0080684","urlPoster":"http://ia.media-imdb.com/images/M/MV5BMjE2MzQwMTgxN15BMl5BanBnXkFtZTcwMDQzNjk2OQ@@._V1_SY317_CR0,0,214,317_AL_.jpg","votes":"695,199","writers":[{"name":"Leigh Brackett","nameId":"nm0102824"},{"name":"Lawrence Kasdan","nameId":"nm0001410"}],"year":"1980"},{"countries":["USA"],"directors":[{"name":"Robert Zemeckis","nameId":"nm0000709"}],"filmingLocations":["Monument Valley","Arizona","USA"],"genres":["Drama","Romance"],"idIMDB":"tt0109830","languages":["English"],"metascore":"82/100","originalTitle":"","plot":"Forrest Gump is a simple man with a low I.Q. but good intentions. He is running through childhood with his best and only friend Jenny. His \'mama\' teaches him the ways of life and leaves him to choose his destiny. Forrest joins the army for service in Vietnam, finding new friends called Dan and Bubba, he wins medals, creates a famous shrimp fishing fleet, inspires people to jog, starts a ping-pong craze, create the smiley, write bumper stickers and songs, donating to people and meeting the president several times. However, this is all irrelevant to Forrest who can only think of his childhood sweetheart Jenny Curran. Who has messed up her life. Although in the end all he wants to prove is that anyone can love anyone.","ranking":13,"rated":"PG-13","rating":"8.8","releaseDate":"19940706","runtime":["142 min"],"simplePlot":"Forrest Gump, while not intelligent, has accidentally been present at many historic moments, but his true love, Jenny Curran, eludes him.","title":"Forrest Gump","urlIMDB":"http://www.imdb.com/title/tt0109830","urlPoster":"http://ia.media-imdb.com/images/M/MV5BMTQwMTA5MzI1MF5BMl5BanBnXkFtZTcwMzY5Mzg3OA@@._V1_SX214_AL_.jpg","votes":"1,068,310","writers":[{"name":"Winston Groom","nameId":"nm0343165"},{"name":"Eric Roth","nameId":"nm0744839"}],"year":"1994"},{"countries":["USA","UK"],"directors":[{"name":"Christopher Nolan","nameId":"nm0634240"}],"filmingLocations":["Bedfordshire","England","UK"],"genres":["Action","Mystery","Sci-Fi","Thriller"],"idIMDB":"tt1375666","languages":["English","Japanese","French"],"metascore":"74/100","originalTitle":"","plot":"Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable. Cobb\'s rare ability has made him a coveted player in this treacherous new world of corporate espionage, but it has also made him an international fugitive and cost him everything he has ever loved. Now Cobb is being offered a chance at redemption. One last job could give him his life back but only if he can accomplish the impossible-inception. Instead of the perfect heist, Cobb and his team of specialists have to pull off the reverse: their task is not to steal an idea but to plant one. If they succeed, it could be the perfect crime. But no amount of careful planning or expertise can prepare the team for the dangerous enemy that seems to predict their every move. An enemy that only Cobb could have seen coming.","ranking":14,"rated":"PG-13","rating":"8.8","releaseDate":"20100716","runtime":["148 min"],"simplePlot":"A thief who steals corporate secrets through use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.","title":"Inception","urlIMDB":"http://www.imdb.com/title/tt1375666","urlPoster":"http://ia.media-imdb.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX214_AL_.jpg","votes":"1,260,605","writers":[{"name":"Christopher Nolan","nameId":"nm0634240"}],"year":"2010"},{"countries":["USA"],"directors":[{"name":"Milos Forman","nameId":"nm0001232"}],"filmingLocations":["Depoe Bay","Oregon","USA"],"genres":["Drama"],"idIMDB":"tt0073486","languages":["English"],"metascore":"79/100","originalTitle":"","plot":"McMurphy has a criminal past and has once again gotten himself into trouble and is sentenced by the court. To escape labor duties in prison, McMurphy pleads insanity and is sent to a ward for the mentally unstable. Once here, McMurphy both endures and stands witness to the abuse and degradation of the oppressive Nurse Ratched, who gains superiority and power through the flaws of the other inmates. McMurphy and the other inmates band together to make a rebellious stance against the atrocious Nurse.","ranking":15,"rated":"R","rating":"8.7","releaseDate":"19751121","runtime":["133 min"],"simplePlot":"Upon admittance to a mental institution, a brash rebel rallies the patients to take on the oppressive head nurse.","title":"One Flew Over the Cuckoo\'s Nest","urlIMDB":"http://www.imdb.com/title/tt0073486","urlPoster":"http://ia.media-imdb.com/images/M/MV5BMTk5OTA4NTc0NF5BMl5BanBnXkFtZTcwNzI5Mzg3OA@@._V1_SY317_CR12,0,214,317_AL_.jpg","votes":"602,594","writers":[{"name":"Lawrence Hauben","nameId":"nm0369142"},{"name":"Bo Goldman","nameId":"nm0325743"}],"year":"1975"},{"countries":["USA","New Zealand"],"directors":[{"name":"Peter Jackson","nameId":"nm0001392"}],"filmingLocations":["Camperdown Studios","Camperdown Road","Miramar","Wellington","New Zealand"],"genres":["Adventure","Fantasy"],"idIMDB":"tt0167261","languages":["English","Sindarin","Old English"],"metascore":"88/100","originalTitle":"","plot":"While Frodo and Sam, now accompanied by a new guide, continue their hopeless journey towards the land of shadow to destroy the One Ring, each member of the broken fellowship plays their part in the battle against the evil wizard Saruman and his armies of Isengard.","ranking":16,"rated":"PG-13","rating":"8.7","releaseDate":"20021218","runtime":["179 min"],"simplePlot":"While Frodo and Sam edge closer to Mordor with the help of the shifty Gollum, the divided fellowship makes a stand against Sauron\'s new ally, Saruman, and his hordes of Isengard.","title":"The Lord of the Rings: The Two Towers","urlIMDB":"http://www.imdb.com/title/tt0167261","urlPoster":"http://ia.media-imdb.com/images/M/MV5BMTAyNDU0NjY4NTheQTJeQWpwZ15BbWU2MDk4MTY2Nw@@._V1_SY317_CR1,0,214,317_AL_.jpg","votes":"960,386","writers":[{"name":"J.R.R. Tolkien","nameId":"nm0866058"},{"name":"Fran Walsh","nameId":"nm0909638"}],"year":"2002"},{"countries":["USA"],"directors":[{"name":"Martin Scorsese","nameId":"nm0000217"}],"filmingLocations":["2409 Thirty Second Street","Astoria","Queens","New York City","New York","USA"],"genres":["Biography","Crime","Drama"],"idIMDB":"tt0099685","languages":["English","Italian"],"metascore":"89/100","originalTitle":"","plot":"Henry Hill is a small time gangster, who takes part in a robbery with Jimmy Conway and Tommy De Vito, two other gangsters who have set their sights a bit higher. His two partners kill off everyone else involved in the robbery, and slowly start to climb up through the hierarchy of the Mob. Henry, however, is badly affected by his partners\' success, but will he stoop low enough to bring about the downfall of Jimmy and Tommy?","ranking":17,"rated":"R","rating":"8.7","releaseDate":"19900921","runtime":["146 min"],"simplePlot":"Henry Hill and his friends work their way up through the mob hierarchy.","title":"Goodfellas","urlIMDB":"http://www.imdb.com/title/tt0099685","urlPoster":"http://ia.media-imdb.com/images/M/MV5BMTY2OTE5MzQ3MV5BMl5BanBnXkFtZTgwMTY2NTYxMTE@._V1_SX214_AL_.jpg","votes":"639,993","writers":[{"name":"Nicholas Pileggi","nameId":"nm0683380"},{"name":"Nicholas Pileggi","nameId":"nm0683380"}],"year":"1990"},{"countries":["USA","Australia"],"directors":[{"name":"Andy Wachowski","nameId":"nm0905152"},{"name":"Lana Wachowski","nameId":"nm0905154"}],"filmingLocations":["AON Tower","Kent Street","Sydney","New South Wales","Australia"],"genres":["Action","Sci-Fi"],"idIMDB":"tt0133093","languages":["English"],"metascore":"73/100","originalTitle":"","plot":"Thomas A. Anderson is a man living two lives. By day he is an average computer programmer and by night a hacker known as Neo. Neo has always questioned his reality, but the truth is far beyond his imagination. Neo finds himself targeted by the police when he is contacted by Morpheus, a legendary computer hacker branded a terrorist by the government. Morpheus awakens Neo to the real world, a ravaged wasteland where most of humanity have been captured by a race of machines that live off of the humans\' body heat and electrochemical energy and who imprison their minds within an artificial reality known as the Matrix. As a rebel against the machines, Neo must return to the Matrix and confront the agents: super-powerful computer programs devoted to snuffing out Neo and the entire human rebellion.","ranking":18,"rated":"R","rating":"8.7","releaseDate":"19990331","runtime":["136 min"],"simplePlot":"A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.","title":"The Matrix","urlIMDB":"http://www.imdb.com/title/tt0133093","urlPoster":"http://ia.media-imdb.com/images/M/MV5BMTkxNDYxOTA4M15BMl5BanBnXkFtZTgwNTk0NzQxMTE@._V1_SX214_AL_.jpg","votes":"1,064,702","writers":[{"name":"Andy Wachowski","nameId":"nm0905152"},{"name":"Lana Wachowski","nameId":"nm0905154"}],"year":"1999"},{"countries":["USA"],"directors":[{"name":"George Lucas","nameId":"nm0000184"}],"filmingLocations":["Tikal National Park","Guatemala"],"genres":["Action","Adventure","Fantasy","Sci-Fi"],"idIMDB":"tt0076759","languages":["English"],"metascore":"92/100","originalTitle":"Star Wars","plot":"A young boy from Tatooine sets out on an adventure with an old Jedi named Obi-Wan Kenobi as his mentor to save Princess Leia from the ruthless Darth Vader and Destroy the Death Star built by the Empire which has the power to destroy the entire galaxy.","ranking":19,"rated":"PG","rating":"8.7","releaseDate":"19770525","runtime":["121 min"],"simplePlot":"Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a wookiee and two droids to save the universe from the Empire\'s world-destroying battle-station, while also attempting to rescue Princess Leia from the evil Darth Vader.","title":"Star Wars: Episode IV - A New Hope","urlIMDB":"http://www.imdb.com/title/tt0076759","urlPoster":"http://ia.media-imdb.com/images/M/MV5BMTU4NTczODkwM15BMl5BanBnXkFtZTcwMzEyMTIyMw@@._V1_SX214_AL_.jpg","votes":"764,842","writers":[{"name":"George Lucas","nameId":"nm0000184"}],"year":"1977"},{"countries":["Japan"],"directors":[{"name":"Akira Kurosawa","nameId":"nm0000041"}],"filmingLocations":["Japan"],"genres":["Drama"],"idIMDB":"tt0047478","languages":["Japanese"],"metascore":"99/100","originalTitle":"Shichinin no samurai","plot":"A veteran samurai, who has fallen on hard times, answers a village\'s request for protection from bandits. He gathers 6 other samurai to help him, and they teach the townspeople how to defend themselves, and they supply the samurai with three small meals a day. The film culminates in a giant battle when 40 bandits attack the village.","ranking":20,"rated":"UNRATED","rating":"8,7","releaseDate":"19561119","runtime":["207 min"],"simplePlot":"A poor village under attack by bandits recruits seven unemployed samurai to help them defend themselves.","title":"A hét szamuráj","urlIMDB":"http://www.imdb.com/title/tt0047478","urlPoster":"http://ia.media-imdb.com/images/M/MV5BMTc5MDY1MjU5MF5BMl5BanBnXkFtZTgwNDM2OTE4MzE@._V1_SY317_CR6,0,214,317_AL_.jpg","votes":"204 954","writers":[{"name":"Akira Kurosawa","nameId":"nm0000041"},{"name":"Shinobu Hashimoto","nameId":"nm0368074"}],"year":"1954"}]' );
