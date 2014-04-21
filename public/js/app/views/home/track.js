define([
    'underscore',
    'marionette',
    'app/views/home/vent',
    'text!templates/home/track.html'
], function (_, Marionette, Vent, tpl) {

    return Marionette.ItemView.extend({
        template: _.template(tpl),
        tagName: 'tr',

        events: {
            'dblclick': 'doubleClickedEvent'
        },

        doubleClickedEvent: function () {
            Vent.trigger('track:dbl-clicked', this.model);
        }
    });
});