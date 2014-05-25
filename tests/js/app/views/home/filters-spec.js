var requirejs = require('requirejs');
require('../../../../init');

var Filters = requirejs('app/views/home/filters'),
	Vent = requirejs('app/views/home/vent');

describe('Filters', function () {
	var tracks = [
		{artist: 'foo', album: 'bar', genre: 'rock'},
		{artist: 'foo', album: 'another', genre: 'rock'},
		{artist: '123', album: 'here', genre: 'jazz'}
	];

	describe('Basic Instantiation', function() {
		it('should be able to be instantiated', function() {
			var filters = new Filters({
				tracks: tracks
			});

			expect(filters).toBeTruthy();
		});

		it('should be instantiated correctly', function() {
			spyOn(Filters.prototype, 'listenTo');
			var filters = new Filters({
				tracks: tracks
			});

			expect(filters.tracks).toEqual(tracks);
			expect(filters.listenTo).toHaveBeenCalledWith(Vent, 'filter:populate', filters.populateFilter);
			expect(filters.listenTo).toHaveBeenCalledWith(Vent, 'filter:reset', filters.resetFilter);
		});

		it('should have the correct attributes', function() {
			var filters = new Filters({
				tracks: tracks
			});

			expect(filters.attributes).toEqual({id: 'filters-cont'});
		});
	});

	describe('Template Data', function() {
		it('should return correct data', function() {
			var filters = new Filters({
				tracks: tracks
			});

			var result = filters.serializeData();

			expect(result).toEqual({
				artists: ['foo', '123'],
				albums: ['bar', 'another', 'here'],
				genres: ['rock', 'jazz']
			});
		});
	});

	describe('Filter Elements', function() {
		it('should trigger event on change', function() {
			spyOn(Vent, 'trigger');
			var filters = new Filters({
				tracks: tracks
			});

			filters.filterChanged(1, 2, 3, 4);

			expect(Vent.trigger).toHaveBeenCalledWith('filter:tracks', 1, 2, 3, 4);
		});

		it('should be able to be reset', function() {
			spyOn(Vent, 'trigger');
			var filters = new Filters({
				tracks: tracks
			});

			filters.render();
			filters.ui.artistFilter.find('option:eq(1)').prop('selected', true);

			expect(filters.ui.artistFilter.val()).toEqual('foo');
			filters.resetFilter('artist');
			expect(filters.ui.artistFilter.val()).toEqual('[All]');
		});

		it('should be able to be populated', function() {
			var filters = new Filters({
				tracks: tracks
			}),
			data = ['a', 'b', 'c'];

			filters.render();
			filters.populateFilter('artist', data);

			expect(filters.ui.artistFilter.val()).toEqual('[All]');
			expect(filters.ui.artistFilter.find('option').length).toEqual(4);
			expect(filters.ui.artistFilter.find('option:eq(1)').text()).toEqual('a');
			expect(filters.ui.artistFilter.find('option:eq(1)').val()).toEqual('a');
		});
	});
});
