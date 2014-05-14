define([
    'underscore',
    'marionette',
    'app/views/home/vent',
    'text!templates/home/track.html',
    'app/views/shared/helpers'
], function (_, Marionette, Vent, tpl, Helpers) {

    return Marionette.ItemView.extend({
        template: _.template(tpl),
        tagName: 'tr',

        events: {
            'dblclick': 'doubleClickedEvent'
        },

        attributes: function () {
            return {
                id: 'track' + this.model.id
            };
        },

        initialize: function () {
            this.listenTo(Vent, 'track:playing', this.trackPlaying);
        },

        doubleClickedEvent: function () {
            Vent.trigger('track:play', this.model);
        },

        serializeData: function () {
            var baseData = Marionette.ItemView.prototype.serializeData.call(this);
            baseData.size = this.bytesToMegaBytes(baseData.size);
            baseData.length = Helpers.formatSeconds(baseData.length);
            return baseData;
        },

        bytesToMegaBytes: function (size) {
            return Helpers.round((size / 1024) / 1024, 1);
        },

        trackPlaying: function (track) {
            if (track === this.model) {
                this.$el.addClass('active');
            } else if (this.$el.hasClass('active')) {
                this.$el.removeClass('active');
            }
        }
    });
});