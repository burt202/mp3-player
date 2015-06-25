'use strict';

define([
    'backbone'
], function (Backbone) {

    return Backbone.Collection.extend({
        sortAttribute: 'artist',
        sortDirection: 1,

        sortTracks: function (attr) {
            this.sortAttribute = attr;
            this.sort();
        },

        comparator: function(a, b) {
            var c = a.get(this.sortAttribute),
                d = b.get(this.sortAttribute);

            if (c === d) { return 0; }

            if (this.sortDirection === 1) {
                return c > d ? 1 : -1;
            } else {
                return c < d ? 1 : -1;
            }
        }
    });
});
