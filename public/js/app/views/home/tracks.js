define([
    'underscore',
    'backbone',
    'marionette',
    'jquery',
    'app/views/home/vent',
    'text!templates/home/tracks.html',
    'app/views/home/track'
], function (_, Backbone, Marionette, $, Vent, tpl, TrackView) {

    return Marionette.CompositeView.extend({
        template: _.template(tpl),
        tagName: 'table',
        itemView: TrackView,
        itemViewContainer: 'tbody',

        attributes: {
            id: 'tracks-cont'
        },

        ui: {
            tableHeading: 'th'
        },

        events: {
            'click @ui.tableHeading': 'sortByEvent'
        },

        collectionEvents: {
            'sort': 'render'
        },

        emptyView: Marionette.ItemView.extend({
            tagName: 'tr',
            template: _.template('<td colspan="8" class="empty">No files</td>')
        }),

        initialize: function () {
            this.listenTo(Vent, 'track:find-next', this.findNext);
            this.listenTo(Vent, 'track:locate', this.locateTrack);
        },

        serializeData: function () {
            return {
                sortColumn: this.collection.sortAttribute
            };
        },

        findNext: function (track, shuffleMode) {
            var nextTrack,
                currentIndex = this.collection.indexOf(track);

            if (shuffleMode) {
                nextTrack = this.getRandomModelInCollection(currentIndex);
            } else {
                nextTrack = this.getNextModelInCollection(currentIndex);
            }

            if (nextTrack) {
                Vent.trigger('track:play', nextTrack);
            }
        },

        getNextModelInCollection: function (index) {
            if ((index + 1) === this.collection.length) {
                return null;
            }
            return this.collection.at(index + 1);
        },

        getRandomModelInCollection: function (index) {
            var nextIndex = index;

            if (this.collection.length === 1) {
                return null;
            }

            while (nextIndex === index) {
                nextIndex = _.random(0, (this.collection.length - 1));
            }

            return this.collection.at(nextIndex);
        },

        locateTrack: function (track) {
            var trackRow = this.$('#track' + track.id),
                rowHeight = trackRow.outerHeight(),
                index = trackRow.index();

            this.$el.closest('#tracks').scrollTop(index * rowHeight);
        },

        sortByEvent: function (e) {
            var headerCell = $(e.target);
            this.sortBy(headerCell, headerCell.data('sort'));
        },

        sortBy: function (el, column) {
            var newSort = column,
                currentSort = this.collection.sortAttribute;

            if (newSort === currentSort) {
                this.collection.sortDirection *= -1;
            } else {
                this.collection.sortDirection = 1;
            }

            this.ui.tableHeading.removeClass('active');
            el.addClass('active');
            this.collection.sortTracks(newSort);
        }
    });
});