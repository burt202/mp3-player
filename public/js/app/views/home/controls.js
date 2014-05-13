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
            nextButton: '.next-btn',
            shuffleButton: '.shuffle-btn',
            seekSlider: '.seek-slider',
            currentTimeDisplay: '.current-time-disp',
            volumeSlider: '.volume-slider',
            volumeButton: '.volume-btn'
        },

        events: {
            'click @ui.pauseButton': 'pauseTrackClickEvent',
            'click @ui.nextButton': 'nextTrackClickEvent',
            'click @ui.shuffleButton': 'shuffleClickEvent',
            'change @ui.volumeSlider': 'changeVolumeChangeEvent',
            'click @ui.volumeButton': 'volumeButtonClickEvent',
            'mousedown @ui.seekSlider': 'seekSliderMouseDownEvent',
            'mouseup @ui.seekSlider': 'seekSliderMouseUpEvent'
        },

        initialize: function () {
            this.listenTo(Vent, 'track:play', this.playTrackEvent);
            this.shuffleMode = false;
        },

        onRender: function () {
            this.player = this.ui.audioElement.get(0);

            this.player.addEventListener('timeupdate', function () {
                this.updateTimeDisplay(this.player.currentTime);
                this.updateSeekSlider(this.player.currentTime);
            }.bind(this));

            this.player.addEventListener('ended', function () {
                this.nextTrack();
            }.bind(this));
        },

        playTrackEvent: function (track) {
            this.model = track;
            this.playTrack(track.get('path'));
        },

        pauseTrackClickEvent: function () {
            if (this.playState === 'playing') {
                this.pauseTrack();
            } else {
                this.playTrack();
            }
        },

        playTrack: function (path) {
            if (!this.playState) {
                this.ui.heading.hide();
                this.ui.interactions.fadeIn();
            }

            if (path) {
                this.ui.seekSlider.attr('max', this.model.get('length'));
                this.player.setAttribute('src', path);
            }

            this.ui.pauseButton.removeClass('fa-play').addClass('fa-pause');
            this.playState = 'playing';
            this.player.play();

            Vent.trigger('track:playing', this.model);
        },

        pauseTrack: function () {
            this.ui.pauseButton.removeClass('fa-pause').addClass('fa-play');
            this.playState = 'paused';
            this.player.pause();

            Vent.trigger('track:paused', this.model);
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

            if (parseFloat(value) === 0) {
                this.ui.volumeButton.removeClass('fa-volume-up fa-volume-down').addClass('fa-volume-off');
            } else if (parseFloat(value) < 0.5) {
                this.ui.volumeButton.removeClass('fa-volume-off fa-volume-up').addClass('fa-volume-down');
            } else {
                this.ui.volumeButton.removeClass('fa-volume-off fa-volume-down').addClass('fa-volume-up');
            }
        },

        volumeButtonClickEvent: function () {
            if (this.ui.volumeButton.hasClass('fa-volume-up') || this.ui.volumeButton.hasClass('fa-volume-down')) {
                this.mutePlayer();
            } else {
                this.unmutePlayer();
            }
        },

        mutePlayer: function () {
            this.playerVolume = this.player.volume;
            this.changeVolume(0);
            this.ui.volumeSlider.val(0);
        },

        unmutePlayer: function () {
            this.changeVolume(this.playerVolume);
            this.ui.volumeSlider.val(this.playerVolume);
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
        },

        nextTrackClickEvent: function () {
            this.nextTrack();
        },

        nextTrack: function () {
            Vent.trigger('track:find-next', this.model, this.shuffleMode);
        },

        shuffleClickEvent: function () {
            this.shuffleClick();
        },

        shuffleClick: function () {
            if (this.ui.shuffleButton.hasClass('active')) {
                this.ui.shuffleButton.removeClass('active');
                this.shuffleMode = false;
            } else {
                this.ui.shuffleButton.addClass('active');
                this.shuffleMode = true;
            }
        }
    });
});