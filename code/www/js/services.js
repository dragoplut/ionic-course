'use strict';

angular.module('songhop.services', [])

    .factory('User', function () {
        /**
         * Add & remove current song in favorites
         */
        var o = {
            favorites: [],
            newFavorites: 0
        };
        o.addSongToFavorites = function (song) {
            if (!song) return false;
            o.favorites.unshift(song);
            o.newFavorites++;
        };
        o.removeSongFromFavorites = function (song, index) {
            if (!song) return false;
            o.favorites.splice(index, 1);
        };
        o.favoriteCount = function () {
            return o.newFavorites;
        };
        return o;
    })

    .factory('Recommendations', function ($q, $http, SERVER) {
        var media,
            o = {
            queue: []
        };
        /**
         * Get song from server. (song details & 30 sec. demo from Spotify)
         * @returns {*}
         */
        o.getNextSongs = function () {
            return $http({
                method: 'GET',
                url: SERVER.url + '/recommendations'
            }).success(function(data){
                o.queue = o.queue.concat(data);
                console.info(o.queue);
            });
        };
        o.nextSong = function () {
            o.queue.shift();
            o.haltAudio();
            if (o.queue.length <= 3){
                o.getNextSongs();
            }
        };
        o.playFavoriteSong = function (id) {
            //return $http({
            //    method: 'GET',
            //    url: SERVER.url + '/recommendations?where={"song_id":' + id + '}'
            //}).success(function(data){
            //    o.queue.unshift(data);
            //    o.playCurrentSong();
            //    console.info(data);
            //});
            console.info(id);
        };
        o.playCurrentSong = function () {
            if (o.playing) return;
            var defer = $q.defer();
            media = new Audio(o.queue[0].preview_url);
            media.addEventListener('loadeddata', function () {
                defer.resolve();
            });
            media.play();
            o.playing = true;
            return defer.promise;
        };
        o.haltAudio = function () {
            if (media) {
                media.pause();
                o.playing = false;
            }
        };
        o.init = function () {
            if (o.queue.length === 0) {
                return o.getNextSongs();
            } else {
                return o.playCurrentSong();
            }
        };
        return o;
    });
