define([
    'underscore',
    'backbone',
    'marionette',
    'mp3s',
    'text!templates/home/content.html',
    'app/views/home/controls',
    'app/views/home/tracks',
    'app/views/home/status-bar',
    'app/collections/tracks'
], function (_, Backbone, Marionette, mp3s, tpl, ControlsView, TracksView, StatusBarView, TrackCollection) {

    return Marionette.Layout.extend({
        template: _.template(tpl),

        attributes: {
            id: 'content'
        },

        regions: {
            controls: '#controls',
            tracks: '#tracks',
            statusBar: '#status-bar'
        },

        onShow: function () {
            var tracks = new TrackCollection(mp3s),
                control = new Backbone.Model(),
                controlsView = new ControlsView({model: control}),
                tracksView = new TracksView({collection: tracks}),
                statusBarView = new StatusBarView({tracks: mp3s});

            this.controls.show(controlsView);
            this.tracks.show(tracksView);
            this.statusBar.show(statusBarView);
        }
    });
});