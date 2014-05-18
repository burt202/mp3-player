var requirejs = require('requirejs');
require('../../../../init');

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
});