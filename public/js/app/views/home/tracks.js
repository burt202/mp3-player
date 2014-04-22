define([
    'underscore',
    'backbone',
    'marionette',
    'text!templates/home/tracks.html',
    'app/views/home/track'
], function (_, Backbone, Marionette, tpl, TrackView) {

    return Marionette.CompositeView.extend({
        template: _.template(tpl),
        tagName: 'table',
        itemView: TrackView,
        itemViewContainer: 'tbody',

        attributes: {
            id: 'tracks-cont'
        },

        emptyView: Marionette.ItemView.extend({
            tagName: 'tr',
            template: _.template('<td colspan="8" class="empty">No files</td>')
        })
    });
});