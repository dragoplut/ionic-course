'use strict';

angular.module('songhop.services', [])
    .factory('User', function () {

        var o = {
            favorites: []
        };

        o.addSongToFavorites = function (song) {
            if (!song) return false;

            o.favorites.unshift(song);
        };

        o.removeSongFromFavorites = function (song, index) {
            if (!song) return false;
            o.favorites.splice(index, 1);
        };

        return o;
    });
