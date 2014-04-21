define([
    'underscore',
    'marionette',
    'app/views/home/vent',
    'text!templates/home/controls.html'
], function (_, Marionette, Vent, tpl) {

    return Marionette.ItemView.extend({
        template: _.template(tpl),

        attributes: {
            id: 'controls-cont'
        },

        ui: {
            heading: '.heading',
            interactions: '.interactions',
            audioElement: '.player',
            pauseButton: '.pause-btn'
        },

        events: {
            'click @ui.pauseButton': 'pauseTrackEvent'
        },

        initialize: function () {
            this.listenTo(Vent, 'track:dbl-clicked', this.playTrackEvent);
        },

        onRender: function () {
            this.ui.audioElement = this.ui.audioElement.get(0);
        },

        playTrackEvent: function (track) {
            this.model = track;
            this.playTrack(track.get('path'));
        },

        pauseTrackEvent: function () {
            if (this.model.get('state') === 'playing') {
                this.ui.pauseButton.removeClass('fa-pause').addClass('fa-play');
                this.pauseTrack();
            } else if (this.ui.audioElement.src) {
                this.ui.pauseButton.removeClass('fa-play').addClass('fa-pause');
                this.playTrack();
            }
        },

        playTrack: function (path) {
            if (!this.model.get('state')) {
                this.ui.heading.hide();
                this.ui.interactions.fadeIn();
            }

            if (path) {
                this.ui.audioElement.setAttribute('src', path);
            }

            this.model.set('state', 'playing');
            this.ui.audioElement.play();
        },

        pauseTrack: function () {
            this.model.set('state', 'paused');
            this.ui.audioElement.pause();
        }
    });
});