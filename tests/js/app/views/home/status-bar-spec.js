var requirejs = require('../../../../specrunner-requirejs');
require('../../../../specrunner-jquery');

var Backbone = requirejs('backbone'),
	StatusBar = requirejs('app/views/home/status-bar'),
	Helpers = requirejs('app/views/shared/helpers'),
	Vent = requirejs('app/views/home/vent');

describe('Status Bar', function () {
	var tracks = [
		{artist: 'foo', album: 'bar', genre: 'rock', length: 100, size: 6000},
		{artist: 'foo', album: 'another', genre: 'rock', length: 110, size: 400},
		{artist: '123', album: 'here', genre: 'jazz', length: 140, size: 230}
	];

	describe('Basic Instantiation', function() {
		it('should be able to be instantiated', function() {
			var statusBar = new StatusBar({
				tracks: tracks
			});

			expect(statusBar).toBeTruthy();
		});

		it('should be instantiated correctly', function() {
			spyOn(StatusBar.prototype, 'listenTo');
			var statusBar = new StatusBar({
				tracks: tracks
			});

			expect(statusBar.tracks).toEqual(tracks);
			expect(statusBar.listenTo).toHaveBeenCalledWith(Vent, 'track:playing', statusBar.trackPlaying);
			expect(statusBar.listenTo).toHaveBeenCalledWith(Vent, 'track:paused', statusBar.trackPaused);
			expect(statusBar.listenTo).toHaveBeenCalledWith(Vent, 'collection:reset', statusBar.updateInfo);
		});

		it('should have the correct attributes', function() {
			var statusBar = new StatusBar({
				tracks: tracks
			});

			expect(statusBar.attributes).toEqual({id: 'status-bar-cont'});
		});
	});

	describe('Double Click Event', function() {
		it('should locate track if there is one to locate', function() {
			spyOn(Vent, 'trigger');
			var statusBar = new StatusBar({
				tracks: tracks
			});

			statusBar.trackToLocate = 'here';
			statusBar.doubleClickedEvent();

			expect(Vent.trigger).toHaveBeenCalledWith('track:locate', 'here');
		});

		it('should not locate track if there isnt one to locate', function() {
			spyOn(Vent, 'trigger');
			var statusBar = new StatusBar({
				tracks: tracks
			});

			statusBar.doubleClickedEvent();

			expect(Vent.trigger).not.toHaveBeenCalled();
		});
	});

	describe('Template Data', function() {
		it('should return correct data', function() {
			var statusBar = new StatusBar({
				tracks: tracks
			});

			spyOn(statusBar, 'getTotalPlaytime').andReturn('foo');
			spyOn(statusBar, 'getTotalSize').andReturn('bar');
			var result = statusBar.serializeData();

			expect(statusBar.getTotalPlaytime).toHaveBeenCalledWith(statusBar.tracks);
			expect(statusBar.getTotalSize).toHaveBeenCalledWith(statusBar.tracks);
			expect(result).toEqual({
				total: 3,
				playtime: 'foo',
				size: 'bar',
				grammar: 'Tracks'
			});
		});

		it('should return correct data when tracks has only one item', function() {
			var statusBar = new StatusBar({
				tracks: [{}]
			});

			spyOn(statusBar, 'getTotalPlaytime').andReturn('foo');
			spyOn(statusBar, 'getTotalSize').andReturn('bar');
			var result = statusBar.serializeData();

			expect(statusBar.getTotalPlaytime).toHaveBeenCalledWith(statusBar.tracks);
			expect(statusBar.getTotalSize).toHaveBeenCalledWith(statusBar.tracks);
			expect(result).toEqual({
				total: 1,
				playtime: 'foo',
				size: 'bar',
				grammar: 'Track'
			});
		});
	});

	describe('Totals', function() {
		it('should return total playtime', function() {
			var statusBar = new StatusBar({
				tracks: tracks
			});

			spyOn(statusBar, 'formatTime').andReturn('foo');
			var result = statusBar.getTotalPlaytime(statusBar.tracks);

			expect(statusBar.formatTime).toHaveBeenCalledWith(350);
			expect(result).toEqual('foo');
		});

		it('should return total size', function() {
			var statusBar = new StatusBar({
				tracks: tracks
			});

			spyOn(Helpers, 'formatSize').andReturn('foo');
			var result = statusBar.getTotalSize(statusBar.tracks);

			expect(Helpers.formatSize).toHaveBeenCalledWith(6630, 2);
			expect(result).toEqual('foo');
		});
	});

	describe('Track Playing / Paused', function() {
		it('should update display when track is played', function() {
			var statusBar = new StatusBar({
				tracks: tracks
			});

			spyOn(statusBar, 'updateDisplay');
			statusBar.trackPlaying('foo');

			expect(statusBar.trackToLocate).toEqual('foo');
			expect(statusBar.updateDisplay).toHaveBeenCalledWith('foo', 'Playing');
		});

		it('should update display when track is paused', function() {
			var statusBar = new StatusBar({
				tracks: tracks
			});

			spyOn(statusBar, 'updateDisplay');
			statusBar.trackPaused('foo');

			expect(statusBar.updateDisplay).toHaveBeenCalledWith('foo', 'Paused');
		});
	});

	describe('Update Display', function() {
		it('should be updated when track is played or paused', function() {
			var statusBar = new StatusBar({
				tracks: tracks
			}),
			model = new Backbone.Model({
				artist: 'abc',
				title: '123'
			});

			statusBar.render();
			statusBar.updateDisplay(model, 'text');

			expect(statusBar.ui.display.html()).toEqual('text: abc - 123');
		});
	});

	describe('Update Info', function() {
		it('should be updated when collection changes', function() {
			var statusBar = new StatusBar({
				tracks: tracks
			}),
			collection = [{}];

			spyOn(statusBar, 'getTotalPlaytime').andReturn('qwerty');
			spyOn(statusBar, 'getTotalSize').andReturn('abc123');
			statusBar.render();
			statusBar.updateInfo(collection);

			expect(statusBar.ui.info.html()).toEqual('1 Track | Total Playtime: qwerty | Total Size: abc123');
		});

		it('should be update info correctly when collection has more than one item', function() {
			var statusBar = new StatusBar({
				tracks: tracks
			}),
			collection = [{}, {}];

			spyOn(statusBar, 'getTotalPlaytime').andReturn('qwerty');
			spyOn(statusBar, 'getTotalSize').andReturn('abc123');
			statusBar.render();
			statusBar.updateInfo(collection);

			expect(statusBar.ui.info.html()).toEqual('2 Tracks | Total Playtime: qwerty | Total Size: abc123');
		});
	});
});
