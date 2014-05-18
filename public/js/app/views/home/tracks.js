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
            'sort': 'render',
            'reset': 'collectionResetEvent'
        },

        emptyView: Marionette.ItemView.extend({
            tagName: 'tr',
            template: _.template('<td colspan="8" class="empty">No files</td>')
        }),

        initialize: function () {
            this.listenTo(Vent, 'track:find-next', this.findNext);
            this.listenTo(Vent, 'track:locate', this.locateTrack);
            this.listenTo(Vent, 'filter:tracks', this.filterTracks);

            this.originalCollection = this.collection.toJSON();
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
        },

        filterTracks: function (artist, album, genre, type) {
            switch (type) {
            case 'artist':
                this.filterByArtist(artist);
                break;
            case 'album':
                this.filterByAlbum(album, artist);
                break;
            case 'genre':
                this.filterByGenre(genre);
                break;
            }
        },

        filterByArtist: function (artist) {
            var filterArtist = _.escape(artist),
                filteredFiles;

            if (filterArtist === '[All]') {
                this.resetTrackListing();
            } else {
                filteredFiles = _.where(this.originalCollection, {artist: filterArtist});
                this.collection.reset(filteredFiles);

                Vent.trigger('filter:populate', 'album', _.uniq(_.pluck(filteredFiles, 'album')));
                Vent.trigger('filter:reset', 'genre');
            }
        },

        filterByAlbum: function (album, artist) {
            var filterAlbum = _.escape(album),
                filterArtist = _.escape(artist),
                filteredFiles;

            if (filterArtist === '[All]' && filterAlbum === '[All]') {
                this.resetTrackListing();
                return;
            }

            if (filterArtist === '[All]') {
                filteredFiles = _.where(this.originalCollection, {album: filterAlbum});
                this.collection.reset(filteredFiles);
            } else if (filterAlbum === '[All]') {
                filteredFiles = _.where(this.originalCollection, {artist: filterArtist});
                this.collection.reset(filteredFiles);
            } else {
                filteredFiles = _.where(this.originalCollection, {artist: filterArtist, album: filterAlbum});
                this.collection.reset(filteredFiles);
            }

            Vent.trigger('filter:reset', 'genre');
        },

        filterByGenre: function (genre) {
            var filterGenre = _.escape(genre),
                filteredFiles;

            if (filterGenre === '[All]') {
                this.resetTrackListing();
            } else {
                filteredFiles = _.where(this.originalCollection, {genre: filterGenre});
                this.collection.reset(filteredFiles);
            }

            Vent.trigger('filter:reset', 'artist');
            Vent.trigger('filter:reset', 'album');
        },

        resetTrackListing: function () {
            this.collection.reset(this.originalCollection);
        },

        collectionResetEvent: function (collection) {
            Vent.trigger('collection:reset', collection.toJSON());
        }
    });
});