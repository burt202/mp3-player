define([
    'underscore',
    'backbone',
    'marionette',
    'mp3s',
    'text!templates/home/content.html',
    'app/views/home/controls',
    'app/views/home/tracks'
], function (_, Backbone, Marionette, mp3s, tpl, ControlsView, TracksView) {

    return Marionette.Layout.extend({
        template: _.template(tpl),

        attributes: {
            id: 'content'
        },

        regions: {
            controls: '#controls',
            tracks: '#tracks'
        },

        onShow: function () {
            var tracks = new Backbone.Collection(mp3s),
                control = new Backbone.Model({state: null}),
                controlsView = new ControlsView({model: control}),
                tracksView = new TracksView({collection: tracks});

            this.controls.show(controlsView);
            this.tracks.show(tracksView);
        }
    });
});