define([
    'underscore',
    'backbone',
    'marionette',
    'app/views/home/vent',
    'text!templates/home/tracks.html',
    'app/views/home/track'
], function (_, Backbone, Marionette, Vent, tpl, TrackView) {

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
        }),

        initialize: function () {
            this.listenTo(Vent, 'track:find-next', this.findNext);
        },

        findNext: function (track, shuffleMode) {
            var nextTrack;

            if (shuffleMode) {
/*                if (this.fileOrder.length === 1) { return; }

                while (nextIndex === this.getCurrentPlayingIndex(this.playingId))
                {
                    nextIndex = _.random(0, (this.fileOrder.length - 1));
                }*/
            } else {
                nextTrack = this.getNextModelInCollection(track);
            }

            if (nextTrack) {
                Vent.trigger('track:play', nextTrack);
            }
        },

        getNextModelInCollection: function (track) {
            var index = this.collection.indexOf(track);
            if ((index + 1) === this.collection.length) {
                return null;
            }
            return this.collection.at(index + 1);
        }
    });
});