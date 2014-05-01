define([
    'underscore',
    'marionette',
    'text!templates/home/status-bar.html'
], function (_, Marionette, tpl) {

    return Marionette.ItemView.extend({
        template: _.template(tpl),

        attributes: {
            id: 'status-bar-cont'
        },

        initialize: function (options) {
            console.log(options);
        }
    });
});