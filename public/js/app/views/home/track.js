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

        doubleClickedEvent: function () {
            Vent.trigger('track:dbl-clicked', this.model);
        },

        serializeData: function () {
            var baseData = Marionette.ItemView.prototype.serializeData.call(this);
            baseData.size = this.bytesToMegaBytes(baseData.size);
            baseData.length = Helpers.formatMinutesAndSeconds(baseData.length);
            return baseData;
        },

        bytesToMegaBytes: function (size) {
            return Helpers.round((size / 1024) / 1024, 1);
        }
    });
});