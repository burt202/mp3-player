define([
    'underscore',
    'marionette',
    'text!templates/home/filters.html'
], function (_, Marionette, tpl) {

    return Marionette.ItemView.extend({
        template: _.template(tpl),
        className: 'clearfix',

        attributes: {
            id: 'filters-cont'
        },

        initialize: function (options) {
            this.tracks = options.tracks;
        },

        serializeData: function () {
            return {
                artists: _.uniq(_.pluck(this.tracks, 'artist')),
                albums: _.uniq(_.pluck(this.tracks, 'album')),
                genres: _.uniq(_.pluck(this.tracks, 'genre'))
            };
        }
    });
});
