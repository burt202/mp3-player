define([
    'underscore',
    'marionette',
    'app/views/home/vent',
    'text!templates/home/status-bar.html',
    'app/views/shared/helpers'
], function (_, Marionette, Vent, tpl, Helpers) {

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

            return Helpers.formatSize(size, 2);
        },

        formatTime: function (time) {
            var units = Helpers.secondsToTime(time),
                formatted = '';

            _.each(units, function (value, key) {
                if (value > 0) {
                    formatted += value + key.charAt(0);
                }
            });

            return formatted;
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