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
            pauseButton: '.pause-btn',
            currentTimeDisplay: '.current-time-disp'
        },

        events: {
            'click @ui.pauseButton': 'pauseTrackEvent'
        },

        initialize: function () {
            this.listenTo(Vent, 'track:dbl-clicked', this.playTrackEvent);
        },

        onRender: function () {
            this.player = this.ui.audioElement.get(0);

            this.player.addEventListener('timeupdate', function () {
                this.updateTimeDisplay(this.player.currentTime);
            }.bind(this));
        },

        playTrackEvent: function (track) {
            this.model = track;
            this.playTrack(track.get('path'));
        },

        pauseTrackEvent: function () {
            if (this.model.get('state') === 'playing') {
                this.ui.pauseButton.removeClass('fa-pause').addClass('fa-play');
                this.pauseTrack();
            } else if (this.player.src) {
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
                this.player.setAttribute('src', path);
            }

            this.model.set('state', 'playing');
            this.player.play();
        },

        pauseTrack: function () {
            this.model.set('state', 'paused');
            this.player.pause();
        },

        updateTimeDisplay: function (currentTime) {
            currentTime = this.round(currentTime, 0);

            var mins = Math.floor(currentTime / 60),
                seconds = currentTime % 60;

            if (seconds < 10) {
                seconds = '0' + seconds.toString();
            }

            this.ui.currentTimeDisplay.html(mins + ':' + seconds + '/' + this.model.get('length'));
        },

        round: function (num, length) {
            return parseFloat(Math.round(num * Math.pow(10, length)) / Math.pow(10, length));
        }
    });
});