define([
    'underscore',
    'backbone',
    'marionette',
    'mp3s',
    'text!templates/home/content.html',
    'app/views/home/tracks'
], function (_, Backbone, Marionette, mp3s, tpl, TracksView) {

    return Marionette.Layout.extend({
        template: _.template(tpl),

        attributes: {
            id: 'content'
        },

        regions: {
            tracks: '#tracks'
        },

        onShow: function () {
            var tracks = new Backbone.Collection(mp3s),
                tracksView = new TracksView({collection: tracks});

            this.tracks.show(tracksView);
        }
    });
});