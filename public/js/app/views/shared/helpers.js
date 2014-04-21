define([], function () {

    return {
        round: function (num, length) {
            if (length === undefined) {
                length = 0;
            }

            return parseFloat(Math.round(num * Math.pow(10, length)) / Math.pow(10, length));
        },

        formatSeconds: function (time) {
            var mins = Math.floor(time / 60),
                seconds = time % 60;

            if (seconds < 10) {
                seconds = '0' + seconds.toString();
            }

            return mins + ':' + seconds;
        }
    };
});