define([
    'underscore',
    'marionette',
    'app/views/home/vent',
    'text!templates/home/status-bar.html'
], function (_, Marionette, Vent, tpl) {

    return Marionette.ItemView.extend({
        template: _.template(tpl),

        attributes: {
            id: 'status-bar-cont'
        },

        ui: {
            display: '.state',
            info: '.info'
        },

        events: {
            'dblclick': 'doubleClickedEvent'
        },

        initialize: function (options) {
            this.tracks = options.tracks;

            this.listenTo(Vent, 'track:playing', this.trackPlaying);
            this.listenTo(Vent, 'track:paused', this.trackPaused);
            this.listenTo(Vent, 'collection:reset', this.updateInfo);
        },

        doubleClickedEvent: function () {
            if (this.trackToLocate) {
                Vent.trigger('track:locate', this.trackToLocate);
            }
        },

        serializeData: function () {
            return {
                total: this.tracks.length,
                playtime: this.getTotalPlaytime(this.tracks),
                size: this.getTotalSize(this.tracks),
                grammar: this.tracks.length === 1 ? 'Track' : 'Tracks'
            };
        },

        getTotalPlaytime: function (tracks) {
            var playtime = 0;

            _.each(tracks, function (track) {
                playtime += track.length;
            });

            return this.formatTime(playtime);
        },

        getTotalSize: function (tracks) {
            var size = 0;

            _.each(tracks, function (track) {
                size += track.size;
            });

            return this.formatSize(size, 2);
        },

        formatTime: function (time) {
            var weeks = Math.floor(time / 604800),
                days = Math.floor(time / 86400),
                hours = Math.floor((time % 86400) / 3600),
                minutes = Math.floor(((time % 86400) % 3600) / 60),
                seconds = ((time % 86400) % 3600) % 60,
                units = [],
                formatted = '';

            units.push({value: weeks, text: 'w'});
            units.push({value: days, text: 'd'});
            units.push({value: hours, text: 'h'});
            units.push({value: minutes, text: 'm'});
            units.push({value: seconds, text: 's'});

            _.each(units, function (unit) {
                if (unit.value > 0) {
                    formatted += unit.value + unit.text;
                }
            });

            return formatted;
        },

        formatSize: function (bytes, precision) {
            var kilobyte = 1024,
                megabyte = kilobyte * 1024,
                gigabyte = megabyte * 1024,
                terabyte = gigabyte * 1024;

            if ((bytes >= 0) && (bytes < kilobyte)) {
                return bytes + 'b';
            } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
                return (bytes / kilobyte).toFixed(precision) + 'kb';
            } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
                return (bytes / megabyte).toFixed(precision) + 'mb';
            } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
                return (bytes / gigabyte).toFixed(precision) + 'gb';
            } else if (bytes >= terabyte) {
                return (bytes / terabyte).toFixed(precision) + 'tb';
            } else {
                return bytes + 'b';
            }
        },

        trackPlaying: function (model) {
            this.trackToLocate = model;
            this.updateDisplay(model, 'Playing');
        },

        trackPaused: function (model) {
            this.updateDisplay(model, 'Paused');
        },

        updateDisplay: function (model, mode) {
            this.ui.display.html(mode + ': ' + model.get('artist') + ' - ' + model.get('title'));
        },

        updateInfo: function (collection) {
            var playtime = this.getTotalPlaytime(collection),
                size = this.getTotalSize(collection),
                grammar = collection.length === 1 ? 'Track' : 'Tracks';

            this.ui.info.html(collection.length + ' ' + grammar + ' | Total Playtime: ' + playtime + ' | Total Size: ' + size);
        }
    });
});