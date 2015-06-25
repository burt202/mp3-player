'use strict';

var requirejs = require('../../../../specrunner-requirejs');
require('../../../../specrunner-jquery');

var Tracks = requirejs('app/views/home/tracks'),
    Vent = requirejs('app/views/home/vent'),
    Backbone = requirejs('backbone'),
    _ = requirejs('underscore'),
    TracksCollection = requirejs('app/collections/tracks');

describe('Tracks', function () {
    var collection;

    beforeEach(function () {
        collection = new TracksCollection([
            {id: 1, artist: 'Clutch', title: 'Power Player', album: 'From Beale Street To Oblivion', genre: 'Rock', year: 2007, length: '3:05', size: '10.3mb', bitrate: 320},
            {id: 2, artist: 'Clutch', title: 'The Yeti', album: 'The Elephant Riders', genre: 'Rock', year: 1998, length: '5:00', size: '11.3mb', bitrate: 320},
            {id: 3, artist: 'Pearl Jam', title: 'Even Flow', album: 'Ten', genre: 'Rock', year: 1991, length: '5:25', size: '8.3mb', bitrate: 320},
            {id: 4, artist: 'Porcupine Tree', title: 'Futile', album: 'Futile', genre: 'Progressive Rock', year: 2006, length: '6:04', size: '12.3mb', bitrate: 320},
            {id: 5, artist: 'Porcupine Tree', title: 'Collapse', album: 'Futile', genre: 'Progressive Rock', year: 2006, length: '1:40', size: '9.3mb', bitrate: 320}
        ]);
    });

    afterEach(function () {
        collection = null;
    });

    describe('Basic Instantiation', function() {
        it('should be able to be instantiated', function() {
            var tracks = new Tracks({
                collection: collection
            });

            expect(tracks).toBeTruthy();
        });

        it('should be instantiated correctly', function() {
            spyOn(Tracks.prototype, 'listenTo');
            var tracks = new Tracks({
                collection: collection
            });

            expect(tracks.listenTo).toHaveBeenCalledWith(Vent, 'track:find-next', tracks.findNext);
            expect(tracks.listenTo).toHaveBeenCalledWith(Vent, 'track:locate', tracks.locateTrack);
            expect(tracks.listenTo).toHaveBeenCalledWith(Vent, 'filter:tracks', tracks.filterTracks);
            expect(tracks.originalCollection).toEqual(tracks.collection.toJSON());
        });

        it('should have the correct attributes', function() {
            var tracks = new Tracks({
                collection: collection
            });

            expect(tracks.attributes).toEqual({id: 'tracks-cont'});
        });
    });

    describe('Template Data', function() {
        it('should return correct data', function() {
            var tracks = new Tracks({
                collection: collection
            });

            var result = tracks.serializeData();

            expect(result).toEqual({
                sortColumn: 'artist'
            });
        });
    });

    describe('Finding Next Track To Play', function() {
        describe('Find Next Event', function() {
            it('should call getRandomModelInCollection when shuffleMode is set', function() {
                var tracks = new Tracks({
                    collection: collection
                });

                spyOn(tracks, 'getRandomModelInCollection').andReturn('foo');
                spyOn(Vent, 'trigger');
                tracks.findNext(tracks.collection.at(0), true);

                expect(tracks.getRandomModelInCollection).toHaveBeenCalledWith(0);
                expect(Vent.trigger).toHaveBeenCalledWith('track:play', 'foo');
            });

            it('should call getNextModelInCollection when shuffleMode is not set', function() {
                var tracks = new Tracks({
                    collection: collection
                });

                spyOn(tracks, 'getNextModelInCollection').andReturn('bar');
                spyOn(Vent, 'trigger');
                tracks.findNext(tracks.collection.at(0), false);

                expect(tracks.getNextModelInCollection).toHaveBeenCalledWith(0);
                expect(Vent.trigger).toHaveBeenCalledWith('track:play', 'bar');
            });

            it('should call not trigger track:play event when no next track is found and shuffleMode is set', function() {
                var tracks = new Tracks({
                    collection: collection
                });

                spyOn(tracks, 'getRandomModelInCollection').andReturn(null);
                spyOn(Vent, 'trigger');
                tracks.findNext(tracks.collection.at(0), true);

                expect(Vent.trigger).not.toHaveBeenCalled();
            });

            it('should call not trigger track:play event when no next track is found and shuffleMode is not set', function() {
                var tracks = new Tracks({
                    collection: collection
                });

                spyOn(tracks, 'getNextModelInCollection').andReturn(null);
                spyOn(Vent, 'trigger');
                tracks.findNext(tracks.collection.at(0), false);

                expect(Vent.trigger).not.toHaveBeenCalled();
            });
        });

        describe('Find Next Track By Sequence', function() {
            it('should return next model in collection', function() {
                var tracks = new Tracks({
                    collection: collection
                });

                var result = tracks.getNextModelInCollection(0);

                expect(result).toBe(tracks.collection.at(1));
            });

            it('should return null if at the end of the collection', function() {
                var tracks = new Tracks({
                    collection: collection
                });

                var result = tracks.getNextModelInCollection(4);

                expect(result).toBe(null);
            });
        });

        describe('Find Next Track By Random', function() {
            it('should return null if collection length is 1', function() {
                var tracks = new Tracks({
                    collection: new Backbone.Collection([{}])
                });

                var result = tracks.getRandomModelInCollection(0);

                expect(result).toBe(null);
            });

            it('should return null if collection length is 0', function() {
                var tracks = new Tracks({
                    collection: new Backbone.Collection([])
                });

                var result = tracks.getRandomModelInCollection(0);

                expect(result).toBe(null);
            });

            it('should return random model in collection', function() {
                var tracks = new Tracks({
                    collection: collection
                });

                spyOn(_, 'random').andReturn(2);
                var result = tracks.getRandomModelInCollection(0);

                expect(result).toBe(tracks.collection.at(2));
            });
        });
    });

    describe('Locating Track', function() {
        it('should return track row by track id', function() {
            var tracks = new Tracks({
                collection: collection
            });

            tracks.render();
            var result = tracks.getTrackRowById(2);

            expect(result).toEqual(tracks.$('#track2'));
        });

        it('should scroll track to now playing', function() {
            var tracks = new Tracks({
                collection: collection
            });

            tracks.render();
            var tracksCont = tracks.$el.closest('#tracks');
            var trackRow = tracks.$('#track2');
            spyOn(tracks, 'getTrackRowById').andReturn(trackRow);
            spyOn(tracks.$el, 'closest').andReturn(tracksCont);
            spyOn(trackRow, 'outerHeight').andReturn(30);
            spyOn(trackRow, 'index').andReturn(2);
            spyOn(tracksCont, 'scrollTop');
            tracks.locateTrack(tracks.collection.at(1));

            expect(tracksCont.scrollTop).toHaveBeenCalledWith(60);
        });
    });

    describe('Sorting Tracks', function() {
        it('should sort collection by column passed in', function() {
            var tracks = new Tracks({
                collection: collection
            });

            tracks.render();
            spyOn(tracks.collection, 'sortTracks');
            tracks.sortBy(tracks.ui.tableHeading.eq(1), 'title');

            expect(tracks.ui.tableHeading.eq(0).hasClass('active')).toBe(false);
            expect(tracks.ui.tableHeading.eq(1).hasClass('active')).toBe(true);
            expect(tracks.collection.sortDirection).toEqual(1);
            expect(tracks.collection.sortTracks).toHaveBeenCalledWith('title');
        });

        it('should reverse sort if column passed matches collection sortAttribute', function() {
            var tracks = new Tracks({
                collection: collection
            });

            tracks.render();
            spyOn(tracks.collection, 'sortTracks');
            tracks.sortBy(tracks.ui.tableHeading.eq(0), 'artist');

            expect(tracks.collection.sortDirection).toEqual(-1);
            expect(tracks.collection.sortTracks).toHaveBeenCalledWith('artist');
        });
    });

    describe('Filtering Tracks', function() {
        describe('Filter Event', function() {
            it('should call filterByArtist', function() {
                var tracks = new Tracks({
                    collection: collection
                });

                spyOn(tracks, 'filterByArtist');
                tracks.filterTracks('abc', '123', 'foo', 'artist');

                expect(tracks.filterByArtist).toHaveBeenCalledWith('abc');
            });

            it('should call filterByAlbum', function() {
                var tracks = new Tracks({
                    collection: collection
                });

                spyOn(tracks, 'filterByAlbum');
                tracks.filterTracks('abc', '123', 'foo', 'album');

                expect(tracks.filterByAlbum).toHaveBeenCalledWith('123', 'abc');
            });

            it('should call filterByGenre', function() {
                var tracks = new Tracks({
                    collection: collection
                });

                spyOn(tracks, 'filterByGenre');
                tracks.filterTracks('abc', '123', 'foo', 'genre');

                expect(tracks.filterByGenre).toHaveBeenCalledWith('foo');
            });
        });

        describe('Filter By Artist', function() {
            it('should reset collection if filter value is [All]', function() {
                var tracks = new Tracks({
                    collection: collection
                });

                spyOn(tracks, 'resetTrackListing');
                spyOn(Vent, 'trigger');
                tracks.filterByArtist('[All]');

                expect(tracks.resetTrackListing).toHaveBeenCalled();
                expect(Vent.trigger).toHaveBeenCalledWith('filter:populate', 'album', [
                    'From Beale Street To Oblivion',
                    'The Elephant Riders',
                    'Ten',
                    'Futile'
                ]);
            });

            it('should reset collection with filtered list and trigger relevant events', function() {
                var tracks = new Tracks({
                    collection: collection
                });

                spyOn(tracks.collection, 'reset');
                spyOn(Vent, 'trigger');
                tracks.filterByArtist('Pearl Jam');

                expect(tracks.collection.reset).toHaveBeenCalledWith([tracks.collection.at(2).toJSON()]);
                expect(Vent.trigger).toHaveBeenCalledWith('filter:populate', 'album', ['Ten']);
                expect(Vent.trigger).toHaveBeenCalledWith('filter:reset', 'genre');
            });
        });

        describe('Filter By Album', function() {
            it('should reset collection if both artist and album filter values are [All]', function() {
                var tracks = new Tracks({
                    collection: collection
                });

                spyOn(tracks, 'resetTrackListing');
                tracks.filterByAlbum('[All]', '[All]');

                expect(tracks.resetTrackListing).toHaveBeenCalled();
            });

            it('should reset collection with filtered list by album if artist value is [All] but album filter value is not [All]', function() {
                var tracks = new Tracks({
                    collection: collection
                });

                spyOn(tracks.collection, 'reset');
                spyOn(Vent, 'trigger');
                tracks.filterByAlbum('Futile', '[All]');

                expect(tracks.collection.reset).toHaveBeenCalledWith([tracks.collection.at(3).toJSON(), tracks.collection.at(4).toJSON()]);
                expect(Vent.trigger).toHaveBeenCalledWith('filter:reset', 'genre');
            });

            it('should reset collection with filtered list by artist if artist value is not [All] but album filter value is [All]', function() {
                var tracks = new Tracks({
                    collection: collection
                });

                spyOn(tracks.collection, 'reset');
                spyOn(Vent, 'trigger');
                tracks.filterByAlbum('[All]', 'Clutch');

                expect(tracks.collection.reset).toHaveBeenCalledWith([tracks.collection.at(0).toJSON(), tracks.collection.at(1).toJSON()]);
                expect(Vent.trigger).toHaveBeenCalledWith('filter:reset', 'genre');
            });

            it('should reset collection with filtered list by artist and album if both are not [All]', function() {
                var tracks = new Tracks({
                    collection: collection
                });

                spyOn(tracks.collection, 'reset');
                spyOn(Vent, 'trigger');
                tracks.filterByAlbum('Futile', 'Porcupine Tree');

                expect(tracks.collection.reset).toHaveBeenCalledWith([tracks.collection.at(3).toJSON(), tracks.collection.at(4).toJSON()]);
                expect(Vent.trigger).toHaveBeenCalledWith('filter:reset', 'genre');
            });
        });

        describe('Filter By Genre', function() {
            it('should reset collection if filter value is [All]', function() {
                var tracks = new Tracks({
                    collection: collection
                });

                spyOn(Vent, 'trigger');
                spyOn(tracks, 'resetTrackListing');
                tracks.filterByGenre('[All]');

                expect(tracks.resetTrackListing).toHaveBeenCalled();
                expect(Vent.trigger).toHaveBeenCalledWith('filter:reset', 'artist');
                expect(Vent.trigger).toHaveBeenCalledWith('filter:reset', 'album');
            });

            it('should reset collection with filtered list and trigger relevant events', function() {
                var tracks = new Tracks({
                    collection: collection
                });

                spyOn(tracks.collection, 'reset');
                spyOn(Vent, 'trigger');
                tracks.filterByGenre('Progressive Rock');

                expect(tracks.collection.reset).toHaveBeenCalledWith([tracks.collection.at(3).toJSON(), tracks.collection.at(4).toJSON()]);
                expect(Vent.trigger).toHaveBeenCalledWith('filter:reset', 'artist');
                expect(Vent.trigger).toHaveBeenCalledWith('filter:reset', 'album');
            });
        });

        describe('Resetting Collection', function() {
            it('should reset collection with original set against view', function() {
                var tracks = new Tracks({
                    collection: collection
                });

                spyOn(tracks.collection, 'reset');
                tracks.resetTrackListing();

                expect(tracks.collection.reset).toHaveBeenCalledWith(tracks.originalCollection);
            });

            it('should trigger event when collection is reset', function() {
                var tracks = new Tracks({
                    collection: collection
                });

                spyOn(Vent, 'trigger');
                tracks.filterByArtist(tracks.collection);

                expect(Vent.trigger).toHaveBeenCalledWith('collection:reset', tracks.collection.toJSON());
            });
        });
    });
});
