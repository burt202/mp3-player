define([
    'underscore',
    'marionette',
    'text!templates/home/track.html'
], function (_, Marionette, tpl) {

    return Marionette.ItemView.extend({
        template: _.template(tpl),
        tagName: 'tr'
    });
});