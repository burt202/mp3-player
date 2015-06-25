'use strict';

define([
    'underscore',
    'marionette',
    'jquery',
    'app/views/home/vent',
    'text!templates/home/filters.html'
], function (_, Marionette, $, Vent, tpl) {

    return Marionette.ItemView.extend({
        template: _.template(tpl),
        className: 'clearfix',

        attributes: {
            id: 'filters-cont'
        },

        ui: {
            artistFilter: '#artist-filter-select',
            albumFilter: '#album-filter-select',
            genreFilter: '#genre-filter-select'
        },

        events: {
            'change @ui.artistFilter': 'filterChangedEvent',
            'change @ui.albumFilter': 'filterChangedEvent',
            'change @ui.genreFilter': 'filterChangedEvent'
        },

        initialize: function (options) {
            this.tracks = options.tracks;

            this.listenTo(Vent, 'filter:populate', this.populateFilter);
            this.listenTo(Vent, 'filter:reset', this.resetFilter);
        },

        serializeData: function () {
            return {
                artists: _.uniq(_.pluck(this.tracks, 'artist')),
                albums: _.uniq(_.pluck(this.tracks, 'album')),
                genres: _.uniq(_.pluck(this.tracks, 'genre'))
            };
        },

        filterChangedEvent: function (e) {
            var type = $(e.target).data('type');
            this.filterChanged(this.ui.artistFilter.val(), this.ui.albumFilter.val(), this.ui.genreFilter.val(), type);
        },

        filterChanged: function (artist, album, genre, type) {
            Vent.trigger('filter:tracks', artist, album, genre, type);
        },

        resetFilter: function (type) {
            var filter = this.ui[type + 'Filter'];
            filter.find('option').prop('selected', false).first().prop('selected', 'selected');
        },

        populateFilter: function (type, data) {
            var filter = this.ui[type + 'Filter'];

            filter.empty().append($('<option>', {
                value: '[All]',
                text: '[All]',
                selected: true
            }));

            _.each(data, function (i) {
                filter.append($('<option>', {
                    value: i,
                    text: i
                }));
            });
        }
    });
});
