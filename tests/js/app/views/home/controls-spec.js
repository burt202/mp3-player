var requirejs = require('requirejs');
require('../../../../init');

var Controls = requirejs('app/views/home/controls'),
    Vent = requirejs('app/views/home/vent'),
    Helpers = requirejs('app/views/shared/helpers'),
    Backbone = requirejs('backbone');

describe('Controls', function () {
    var fakePlayer,
        track;

    beforeEach(function () {
        fakePlayer = {
            addEventListener: jasmine.createSpy(),
            setAttribute: jasmine.createSpy(),
            play: jasmine.createSpy(),
            pause: jasmine.createSpy(),
            volume: 1,
            currentTime: 2
        };

        track = new Backbone.Model({
            path: 'foo',
            length: 123
        });
    });

    afterEach(function () {
        fakePlayer = null;
        track = null;
    });

    describe('Basic Instantiation', function() {
        it('should be able to be instantiated', function() {
            var controls = new Controls();

            expect(controls).toBeTruthy();
        });

        it('should be instantiated correctly', function() {
            spyOn(Controls.prototype, 'listenTo');
            var controls = new Controls();

            expect(controls.shuffleMode).toEqual(false);
            expect(controls.listenTo).toHaveBeenCalledWith(Vent, 'track:play', controls.playTrackEvent);
        });

        it('should have the correct attributes', function() {
            var controls = new Controls();

            expect(controls.attributes).toEqual({id: 'controls-cont'});
        });

        it('should define player on render', function() {
            var controls = new Controls();

            spyOn(controls, 'setupPlayerEvents');
            controls.render();

            expect(controls.player).toBeDefined();
            expect(controls.setupPlayerEvents).toHaveBeenCalled();
        });
    });

    describe('Player Events', function() {
        it('should setup player event listeners', function() {
            var controls = new Controls();

            controls.player = fakePlayer;
            controls.setupPlayerEvents();

            expect(controls.player.addEventListener).toHaveBeenCalledWith('timeupdate', jasmine.any(Function));
            expect(controls.player.addEventListener).toHaveBeenCalledWith('ended', jasmine.any(Function));
        });
    });

    describe('Play & Pause', function() {
        describe('Play Track Event', function() {
            it('should call playTrack with path', function() {
                var controls = new Controls();

                spyOn(controls, 'playTrack');
                controls.playTrackEvent(track);

                expect(controls.model).toEqual(track);
                expect(controls.playTrack).toHaveBeenCalledWith('foo');
            });
        });

        describe('Pause Track Event', function() {
            it('should call pauseTrack when track is playing', function() {
                var controls = new Controls();

                spyOn(controls, 'playTrack');
                spyOn(controls, 'pauseTrack');
                controls.playState = 'playing';
                controls.pauseTrackClickEvent();

                expect(controls.pauseTrack).toHaveBeenCalled();
                expect(controls.playTrack).not.toHaveBeenCalled();
            });

            it('should call playTrack when track is not playing', function() {
                var controls = new Controls();

                spyOn(controls, 'playTrack');
                spyOn(controls, 'pauseTrack');
                controls.playState = 'paused';
                controls.pauseTrackClickEvent();

                expect(controls.playTrack).toHaveBeenCalled();
                expect(controls.pauseTrack).not.toHaveBeenCalled();
            });
        });

        describe('Playing A Track', function() {
            it('should hide heading when first track is played', function() {
                var controls = new Controls();

                controls.render();
                spyOn(controls.ui.heading, 'hide');
                spyOn(controls.ui.interactions, 'fadeIn');
                controls.player = fakePlayer;
                controls.playTrack();

                expect(controls.ui.heading.hide).toHaveBeenCalled();
                expect(controls.ui.interactions.fadeIn).toHaveBeenCalled();
            });

            it('should set player src and slider and play the selected track', function() {
                var controls = new Controls();

                controls.render();
                controls.model = track;
                controls.player = fakePlayer;
                spyOn(controls.ui.seekSlider, 'attr');
                spyOn(controls.ui.pauseButton, 'addClass').andCallThrough();
                spyOn(controls.ui.pauseButton, 'removeClass').andCallThrough();
                spyOn(Vent, 'trigger');
                controls.playTrack('path');

                expect(controls.ui.seekSlider.attr).toHaveBeenCalledWith('max', 123);
                expect(controls.player.setAttribute).toHaveBeenCalledWith('src', 'path');
                expect(controls.ui.pauseButton.removeClass).toHaveBeenCalledWith('fa-play');
                expect(controls.ui.pauseButton.addClass).toHaveBeenCalledWith('fa-pause');
                expect(controls.playState).toEqual('playing');
                expect(controls.player.play).toHaveBeenCalled();
                expect(Vent.trigger).toHaveBeenCalledWith('track:playing', controls.model);
            });

            it('should not set player src when no path is passed', function() {
                var controls = new Controls();

                controls.render();
                controls.player = fakePlayer;
                spyOn(controls.ui.seekSlider, 'attr');
                controls.playTrack();

                expect(controls.ui.seekSlider.attr).not.toHaveBeenCalled();
                expect(controls.player.setAttribute).not.toHaveBeenCalled();
            });
        });

        describe('Pausing A Track', function() {
            it('should pause the track correctly', function() {
                var controls = new Controls();

                controls.render();
                controls.player = fakePlayer;
                spyOn(controls.ui.pauseButton, 'addClass').andCallThrough();
                spyOn(controls.ui.pauseButton, 'removeClass').andCallThrough();
                spyOn(Vent, 'trigger');
                controls.pauseTrack();

                expect(controls.ui.pauseButton.removeClass).toHaveBeenCalledWith('fa-pause');
                expect(controls.ui.pauseButton.addClass).toHaveBeenCalledWith('fa-play');
                expect(controls.playState).toEqual('paused');
                expect(controls.player.pause).toHaveBeenCalled();
                expect(Vent.trigger).toHaveBeenCalledWith('track:paused', controls.model);
            });
        });
    });

    describe('Volume Controls', function() {
        describe('Change Volume Event', function() {
            it('should call changeVolume with event target value', function() {
                var controls = new Controls();

                spyOn(controls, 'changeVolume');
                controls.changeVolumeChangeEvent({target: {value: 99}});

                expect(controls.changeVolume).toHaveBeenCalled();
            });
        });

        describe('When Volume Is Changed', function() {
            it('should change icon when volume is changed to 0', function() {
                var controls = new Controls();

                controls.render();
                controls.player = fakePlayer;
                spyOn(controls.ui.volumeButton, 'addClass').andCallThrough();
                spyOn(controls.ui.volumeButton, 'removeClass').andCallThrough();
                controls.changeVolume(0);

                expect(controls.player.volume).toEqual(0);
                expect(controls.ui.volumeButton.removeClass).toHaveBeenCalledWith('fa-volume-up fa-volume-down');
                expect(controls.ui.volumeButton.addClass).toHaveBeenCalledWith('fa-volume-off');
            });

            it('should change icon when volume is changed to be between 0 and 0.5', function() {
                var controls = new Controls();

                controls.render();
                controls.player = fakePlayer;
                spyOn(controls.ui.volumeButton, 'addClass').andCallThrough();
                spyOn(controls.ui.volumeButton, 'removeClass').andCallThrough();
                controls.changeVolume(0.3);

                expect(controls.player.volume).toEqual(0.3);
                expect(controls.ui.volumeButton.removeClass).toHaveBeenCalledWith('fa-volume-off fa-volume-up');
                expect(controls.ui.volumeButton.addClass).toHaveBeenCalledWith('fa-volume-down');
            });

            it('should change icon when volume is changed to be between 0.5 and 1', function() {
                var controls = new Controls();

                controls.render();
                controls.player = fakePlayer;
                spyOn(controls.ui.volumeButton, 'addClass').andCallThrough();
                spyOn(controls.ui.volumeButton, 'removeClass').andCallThrough();
                controls.changeVolume(0.8);

                expect(controls.player.volume).toEqual(0.8);
                expect(controls.ui.volumeButton.removeClass).toHaveBeenCalledWith('fa-volume-off fa-volume-down');
                expect(controls.ui.volumeButton.addClass).toHaveBeenCalledWith('fa-volume-up');
            });
        });

        describe('Volume Button Click Event', function() {
            it('should call mutePlayer if player is not muted', function() {
                var controls = new Controls();

                controls.render();
                spyOn(controls, 'mutePlayer');

                controls.ui.volumeButton.addClass('fa-volume-up');
                controls.volumeButtonClickEvent();
                controls.ui.volumeButton.removeClass('fa-volume-up').addClass('fa-volume-down');
                controls.volumeButtonClickEvent();

                expect(controls.mutePlayer.calls.length).toEqual(2);
            });

            it('should call unmutePlayer if player is muted', function() {
                var controls = new Controls();

                controls.render();
                spyOn(controls, 'unmutePlayer');

                controls.changeVolume(0);
                controls.volumeButtonClickEvent();

                expect(controls.unmutePlayer).toHaveBeenCalled();
            });
        });

        describe('Muting The Player', function() {
            it('should mute player correctly', function() {
                var controls = new Controls();

                controls.render();
                controls.player = fakePlayer;
                spyOn(controls.ui.volumeSlider, 'val');
                spyOn(controls, 'changeVolume');

                controls.mutePlayer();

                expect(controls.playerVolume).toEqual(1);
                expect(controls.changeVolume).toHaveBeenCalledWith(0);
                expect(controls.ui.volumeSlider.val).toHaveBeenCalledWith(0);
            });
        });

        describe('Unmuting The Player', function() {
            it('should unmute player correctly', function() {
                var controls = new Controls();

                controls.render();
                controls.playerVolume = 0.9;
                spyOn(controls.ui.volumeSlider, 'val');
                spyOn(controls, 'changeVolume');

                controls.unmutePlayer();

                expect(controls.changeVolume).toHaveBeenCalledWith(0.9);
                expect(controls.ui.volumeSlider.val).toHaveBeenCalledWith(0.9);
            });
        });
    });

    describe('Time Display', function() {
        it('should get updated correctly', function() {
            var controls = new Controls();

            controls.render();
            controls.model = track;
            spyOn(Helpers, 'secondsToTime').andReturn({minutes: 1, seconds: 2});
            spyOn(Helpers, 'formatMinutesAndSeconds').andReturn(999);
            spyOn(controls.ui.currentTimeDisplay, 'html');
            controls.updateTimeDisplay(789.45);

            expect(Helpers.secondsToTime).toHaveBeenCalledWith(789);
            expect(Helpers.secondsToTime).toHaveBeenCalledWith(123);
            expect(Helpers.formatMinutesAndSeconds).toHaveBeenCalledWith(1, 2);
            expect(Helpers.formatMinutesAndSeconds.calls.length).toEqual(2);
            expect(controls.ui.currentTimeDisplay.html).toHaveBeenCalledWith('999/999');
        });
    });

    describe('Slider', function() {
        it('should get its value updated when seekPressed flag is not true', function() {
            var controls = new Controls();

            controls.render();
            spyOn(controls.ui.seekSlider, 'val');
            controls.updateSeekSlider(789.45);

            expect(controls.ui.seekSlider.val).toHaveBeenCalledWith(789);
        });

        it('should not get its value updated when seekPressed flag is true', function() {
            var controls = new Controls();

            controls.render();
            controls.seekPressed = true;
            spyOn(controls.ui.seekSlider, 'val');
            controls.updateSeekSlider(789.45);

            expect(controls.ui.seekSlider.val).not.toHaveBeenCalled();
        });

        it('should set seekPressed flag on mouse down', function() {
            var controls = new Controls();

            controls.seekPressed = false;
            controls.seekSliderMouseDownEvent();

            expect(controls.seekPressed).toBe(true);
        });

        it('should unset seekPressed flag and set player current time on mouse up', function() {
            var controls = new Controls();

            controls.seekPressed = true;
            controls.player = fakePlayer;
            controls.seekSliderMouseUpEvent({target: {value: 888}});

            expect(controls.player.currentTime).toEqual(888);
            expect(controls.seekPressed).toBe(false);
        });
    });

    describe('Next & Shuffle Buttons', function() {
        describe('Next Track Event', function() {
            it('should call nextTrack function', function() {
                var controls = new Controls();

                spyOn(controls, 'nextTrack');
                controls.nextTrackClickEvent();

                expect(controls.nextTrack).toHaveBeenCalled();
            });
        });

        describe('When Next Track Is Clicked', function() {
            it('should trigger track:find-next event', function() {
                var controls = new Controls();

                controls.model = track;
                spyOn(Vent, 'trigger');
                controls.nextTrack();

                expect(Vent.trigger).toHaveBeenCalledWith('track:find-next', controls.model, controls.shuffleMode);
            });
        });

        describe('When Shuffle Tracks Is Clicked', function() {
            it('should call shuffleClick function', function() {
                var controls = new Controls();

                spyOn(controls, 'shuffleClick');
                controls.shuffleClickEvent();

                expect(controls.shuffleClick).toHaveBeenCalled();
            });
        });

        describe('Shuffling Tracks', function() {
            it('should set shuffleMode to false if shuffling is on', function() {
                var controls = new Controls();

                controls.render();
                controls.shuffleMode = true;
                controls.ui.shuffleButton.addClass('active');
                spyOn(controls.ui.shuffleButton, 'removeClass');
                controls.shuffleClick();

                expect(controls.shuffleMode).toBe(false);
                expect(controls.ui.shuffleButton.removeClass).toHaveBeenCalledWith('active');
            });

            it('should set shuffleMode to true if shuffling is off', function() {
                var controls = new Controls();

                controls.render();
                controls.shuffleMode = false;
                spyOn(controls.ui.shuffleButton, 'addClass');
                controls.shuffleClick();

                expect(controls.shuffleMode).toBe(true);
                expect(controls.ui.shuffleButton.addClass).toHaveBeenCalledWith('active');
            });

        });
    });
});
