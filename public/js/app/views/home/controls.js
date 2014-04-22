define([
    'underscore',
    'marionette',
    'app/views/home/vent',
    'text!templates/home/controls.html',
    'app/views/shared/helpers'
], function (_, Marionette, Vent, tpl, Helpers) {

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
            seekSlider: '.seek-slider',
            currentTimeDisplay: '.current-time-disp',
            volumeSlider: '.volume-slider',
            volumeButton: '.volume-btn'
        },

        events: {
            'click @ui.pauseButton': 'pauseTrackClickEvent',
            'change @ui.volumeSlider': 'changeVolumeChangeEvent',
            'click @ui.volumeButton': 'volumeButtonClickEvent',
            'mousedown @ui.seekSlider': 'seekSliderMouseDownEvent',
            'mouseup @ui.seekSlider': 'seekSliderMouseUpEvent'
        },

        initialize: function () {
            this.listenTo(Vent, 'track:dbl-clicked', this.playTrackEvent);
        },

        onRender: function () {
            this.player = this.ui.audioElement.get(0);

            this.player.addEventListener('timeupdate', function () {
                this.updateTimeDisplay(this.player.currentTime);
                this.updateSeekSlider(this.player.currentTime);
            }.bind(this));
        },

        playTrackEvent: function (track) {
            this.model = track;
            this.playTrack(track.get('path'));
        },

        pauseTrackClickEvent: function () {
            if (this.model.get('state') === 'playing') {
                this.pauseTrack();
            } else {
                this.playTrack();
            }
        },

        playTrack: function (path) {
            if (!this.model.get('state')) {
                this.ui.heading.hide();
                this.ui.interactions.fadeIn();
            }

            if (path) {
                this.ui.seekSlider.attr('max', this.model.get('length'));
                this.player.setAttribute('src', path);
            }

            this.ui.pauseButton.removeClass('fa-play').addClass('fa-pause');
            this.model.set('state', 'playing');
            this.player.play();
        },

        pauseTrack: function () {
            this.ui.pauseButton.removeClass('fa-pause').addClass('fa-play');
            this.model.set('state', 'paused');
            this.player.pause();
        },

        updateTimeDisplay: function (currentTime) {
            var timeElapsed = Helpers.formatSeconds(Helpers.round(currentTime)),
                trackLength = Helpers.formatSeconds(this.model.get('length'));

            this.ui.currentTimeDisplay.html(timeElapsed + '/' + trackLength);
        },

        changeVolumeChangeEvent: function (e) {
            this.changeVolume(e.target.value);
        },

        changeVolume: function (value) {
            this.player.volume = value;
        },

        volumeButtonClickEvent: function () {
            if (this.ui.volumeButton.hasClass('fa-volume-up')) {
                this.mutePlayer();
            } else {
                this.unmutePlayer();
            }
        },

        mutePlayer: function () {
            this.playerVolume = this.player.volume;
            this.changeVolume(0);
            this.ui.volumeSlider.val(0);
            this.ui.volumeButton.removeClass('fa-volume-up').addClass('fa-volume-off');
        },

        unmutePlayer: function () {
            this.changeVolume(this.playerVolume);
            this.ui.volumeSlider.val(this.playerVolume);
            this.ui.volumeButton.removeClass('fa-volume-off').addClass('fa-volume-up');
        },

        updateSeekSlider: function (currentTime) {
            if (this.seekPressed) {
                return;
            }

            this.ui.seekSlider.val(Helpers.round(currentTime));
        },

        seekSliderMouseDownEvent: function () {
            this.seekPressed = true;
        },

        seekSliderMouseUpEvent: function (e) {
            this.player.currentTime = e.target.value;
            this.seekPressed = false;
        }
    });
});