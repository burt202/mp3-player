var requirejs = require('requirejs');
require('../../../../init');

var Track = requirejs('app/views/home/track'),
	Vent = requirejs('app/views/home/vent'),
	Backbone = requirejs('backbone');

describe('Track', function () {
	var model = new Backbone.Model({
			id: 'foo',
			length: 245,
			size: 300000
		});

	describe('Basic Instantiation', function() {
		it('should be able to be instantiated', function() {
			var track = new Track({
				model: model
			});

			expect(track).toBeTruthy();
		});

		it('should be instantiated correctly', function() {
			spyOn(Track.prototype, 'listenTo');
			var track = new Track({
				model: model
			});

			expect(track.listenTo).toHaveBeenCalledWith(jasmine.any(Object), 'track:playing', track.trackPlaying);
		});

		it('should have the correct attributes', function() {
			spyOn(Track.prototype, 'listenTo');
			var track = new Track({
				model: model
			});

			var attributes = track.attributes();

			expect(attributes).toEqual({id: 'trackfoo'});
		});
	});

	describe('Double Click Event', function() {
		it('should trigger track:play event', function() {
			var track = new Track({
				model: model
			});

			spyOn(Vent, 'trigger');
			track.doubleClickedEvent();

			expect(Vent.trigger).toHaveBeenCalledWith('track:play', track.model);
		});
	});

	describe('Template Data', function() {
		it('should trigger track:play event', function() {
			var track = new Track({
				model: model
			});

			var result = track.serializeData();

			expect(result).toEqual({
				id: 'foo',
				length: '4:05',
				size: '293.0kb'
			});
		});
	});

	describe('Track Playing', function() {
		it('should add active class if track passed equal current model', function() {
			var track = new Track({
				model: model
			});

			track.trackPlaying(model);

			expect(track.$el.hasClass('active')).toBe(true);
		});

		it('should remove active class when track passed does not equal current model', function() {
			var track = new Track({
				model: model
			});

			track.trackPlaying(model);
			expect(track.$el.hasClass('active')).toBe(true);
			track.trackPlaying({});
			expect(track.$el.hasClass('active')).toBe(false);
		});
	});
});