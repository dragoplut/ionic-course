angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $timeout, $ionicLoading, User, Recommendations) {
    /**
     * Shows & hide loading icon, depend on server response.
     */

    var showLoading = function () {
        $ionicLoading.show({
            template: '<i class="ion-loading-c"></i>',
            noBackdrop: true
        });
    };
    var hideLoading = function () {
        $ionicLoading.hide();
    };
    showLoading();

    var favoriteSongCheck = function () {
        if (!User.favorites) return true;
        //console.info('1: Check favorited. ' + User.favorites);
        for (var i = 0; i < User.favorites.length; i++) {
            if (User.favorites[i].open_url === $scope.currentSong.open_url) {
                //$scope.favoritedStyle = 'favorited-song';
                console.info('2: Found in favorites. ' + $scope.currentSong.open_url);
                return false;
            }
        }
        return true;
    };

    Recommendations.init().then(function(){
        $scope.currentSong = Recommendations.queue[0];
        //hideLoading();
        return true; // Recommendations.playCurrentSong()
    }).then(function () {
        $scope.currentSong.loaded = true;
        hideLoading();
    });

    /**
     * Skip or add to favorites current song.
     * @param bool
     */

    $scope.sendFeedback = function (bool) {
        if (bool) {
            $scope.favoritedStyle = 'favorited-song';
            //console.info($scope.currentSong);
            if (!favoriteSongCheck()) return console.info('Duplicate song!');
            return User.addSongToFavorites($scope.currentSong);
        }
        $scope.currentSong.rated = bool;
        $scope.currentSong.hide = true;
        $scope.favoritedStyle = '';

        Recommendations.nextSong();

        $timeout(function () {
            $scope.currentSong = Recommendations.queue[0];
        }, 250);

        Recommendations.playCurrentSong().then(function () {
            $scope.currentSong.loaded = true;
            //console.info($scope.currentSong.loaded);
        });
    };

    /**
     * Pre-loading of next song img to browsers cache
     * @returns {*}
     */

    $scope.nextAlbumImg = function () {
        if (Recommendations.queue.length > 1) {
            return Recommendations.queue[1].image_large;
        }
        return '';
    };

    $scope.playCurrent = function () {
        Recommendations.playCurrentSong();
    };
    $scope.haltCurrent = function () {
        Recommendations.haltAudio();
    }

})


/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope, $location, User, Recommendations) {
    $scope.username = User.username;
    $scope.favorites = User.favorites;
    $scope.removeSong = function (song, index) {
        User.removeSongFromFavorites(song, index);
    };
    //$scope.playSong = function (song) {
    //    Recommendations.playFavoriteSong(song);
    //};
    $scope.logout = function () {
        User.destroySession();
        $location.path('index.html');
    }
})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($window, $scope, Recommendations, User) {
    $scope.favCount = User.favoriteCount;
    $scope.openSong = function (song) {
        $window.open(song.open_url, '_system');
    };
    /**
     * Pause if on favorite page & restart currently playing song if returns.
     */
    $scope.enteringFavorites = function () {
        User.newFavorites = 0;
        Recommendations.haltAudio();
    };
    $scope.leavingFavorites = function () {
        Recommendations.init();
    }

})

/*
Controller for splash page (sign in page)
*/ 

.controller('SplashCtrl', function ($scope, $state, User) {
    $scope.submitForm = function (username, signingUp) {
        User.auth(username, signingUp).then(function () {
            $state.go('tab.discover');
        }, function () {
            alert('Something is wrong, try another name.');
        });
    };
});