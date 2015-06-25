'use strict';

var requirejs = require('../../../../specrunner-requirejs');
require('../../../../specrunner-jquery');

var Helpers = requirejs('app/views/shared/helpers');

describe('Helpers', function () {
	describe('Round Number', function () {
		it('should round a number to the precision passed', function () {
			var result = Helpers.round(2.129, 2);

			expect(result).toEqual(2.13);
		});

		it('should treat length as 0 if it is not passed', function () {
			var result = Helpers.round(2.129);

			expect(result).toEqual(2);
		});
	});

	describe('Format Minutes And Seconds', function () {
		it('should concatenate minutes and seconds', function () {
			var result = Helpers.formatMinutesAndSeconds(11, 59);

			expect(result).toEqual('11:59');
		});

		it('should add a zero if seconds is under 10', function () {
			var result = Helpers.formatMinutesAndSeconds(5, 5);

			expect(result).toEqual('5:05');
		});
	});

	describe('Seconds To Time', function () {
		it('should convert seconds to time object', function () {
			var result = Helpers.secondsToTime(691800);

			expect(result).toEqual({
				weeks: 1,
				days: 8,
				hours: 0,
				minutes: 10,
				seconds: 0
			});
		});
	});

	describe('Format Size', function () {
		it('should format bytes', function () {
			var result = Helpers.formatSize(823);

			expect(result).toEqual('823b');
		});

		it('should format kilobytes', function () {
			var result = Helpers.formatSize(2048);

			expect(result).toEqual('2kb');
		});

		it('should format megabytes', function () {
			var result = Helpers.formatSize(2621440, 1);

			expect(result).toEqual('2.5mb');
		});

		it('should format gigabytes', function () {
			var result = Helpers.formatSize(6174015488, 2);

			expect(result).toEqual('5.75gb');
		});
	});
});